import React, { useState, useRef, useEffect } from 'react';
import { Message, ModelId, Tier, UserSettings, ChatSession, User, Page } from './types';
import { ChatMessage } from './components/ChatMessage';
import { InputArea } from './components/InputArea';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { CreatorPage } from './components/CreatorPage';
import { PricingPage } from './components/PricingPage';
import { PricingModal, ModelSelector, LoginModal } from './components/Modals';
import { SettingsModal } from './components/SettingsModal';
import { Icon } from './components/Icon';
import { MODELS } from './constants';
import { streamChatResponse } from './services/geminiService';
import { signInWithGoogle, supabase, signOut } from './services/supabaseService';

// Cinematic Boot Sequence Component
const BootSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  
  useEffect(() => {
    const timers = [
        setTimeout(() => setStep(1), 500),
        setTimeout(() => setStep(2), 1200),
        setTimeout(() => setStep(3), 2000),
        setTimeout(onComplete, 3500)
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center font-mono">
        {step < 3 && (
            <div className="w-64">
                <div className="text-xs text-indigo-500 mb-2 flex justify-between">
                    <span>BOOT_SEQUENCE_INIT</span>
                    <span>v3.0.0</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-indigo-500 animate-[width_2s_ease-in-out_forwards]" style={{ width: step > 0 ? '100%' : '0%' }}></div>
                </div>
                <div className="space-y-1 text-[10px] text-white/40 h-20">
                    {step >= 1 && <div>> MOUNTING_NEURAL_FRAMEWORK... OK</div>}
                    {step >= 1 && <div>> CONNECTING_TO_OLED_DISPLAY... OK</div>}
                    {step >= 2 && <div>> LOADING_CORE_MODULES... OK</div>}
                    {step >= 2 && <div className="animate-pulse">> INITIALIZING_CHATBOT_ENGINE...</div>}
                </div>
            </div>
        )}

        {step >= 3 && (
            <div className="animate-fade-in flex flex-col items-center">
                 <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-900 to-black border border-indigo-500/30 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(99,102,241,0.3)] animate-slide-up">
                    <Icon name="logo" size={40} className="text-indigo-400" />
                 </div>
                 <h1 className="text-2xl font-bold tracking-widest text-white mb-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>JAI-NN 3.0</h1>
                 <p className="text-[10px] text-white/40 tracking-[0.5em] animate-slide-up" style={{ animationDelay: '0.2s' }}>ADVANCED AI CHATBOT</p>
            </div>
        )}
    </div>
  );
};

const App: React.FC = () => {
  const [showBoot, setShowBoot] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isPricingOpen, setPricingOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isModelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [settings, setSettings] = useState<UserSettings>({
    tier: Tier.Free,
    currentModel: ModelId.Flash,
    accentColor: '#6366f1',
    dailyImageCount: 0,
    dailyImageLimit: 5,
    dailyTokenUsage: 0,
    dailyTokenLimit: 2000,
    systemInstruction: '',
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Supabase Auth Listener
  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            avatar: session.user.user_metadata.avatar_url || ''
          });
          loadUserData(session.user.id);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            avatar: session.user.user_metadata.avatar_url || ''
          });
          loadUserData(session.user.id);
        } else {
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // Load user data from Supabase
  const loadUserData = async (userId: string) => {
    if (!supabase) return;
    
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data && !error) {
        setSettings(prev => ({
          ...prev,
          dailyImageCount: data.daily_image_count || 0,
          dailyTokenUsage: data.daily_token_usage || 0,
          tier: data.tier || Tier.Free,
        }));
      }

      // Load sessions
      const { data: sessionsData } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (sessionsData) {
        setSessions(sessionsData.map(s => ({
          id: s.id,
          title: s.title,
          messages: s.messages || [],
          updatedAt: new Date(s.updated_at).getTime()
        })));
      }
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  };

  // Save user settings to Supabase
  const saveUserSettings = async () => {
    if (!supabase || !user) return;

    try {
      await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          daily_image_count: settings.dailyImageCount,
          daily_token_usage: settings.dailyTokenUsage,
          tier: settings.tier,
          updated_at: new Date().toISOString()
        });
    } catch (err) {
      console.error('Error saving settings:', err);
    }
  };

  // Save session to Supabase
  const saveSession = async (session: ChatSession) => {
    if (!supabase || !user) return;

    try {
      await supabase
        .from('chat_sessions')
        .upsert({
          id: session.id,
          user_id: user.id,
          title: session.title,
          messages: session.messages,
          updated_at: new Date(session.updatedAt).toISOString()
        });
    } catch (err) {
      console.error('Error saving session:', err);
    }
  };

  useEffect(() => { 
      if(messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' }); 
  }, [messages, isGenerating]);

  useEffect(() => {
    if (currentSessionId && messages.length > 0) {
      const updatedSession = {
        id: currentSessionId,
        title: messages[0].text.slice(0, 40) + (messages[0].text.length > 40 ? '...' : ''),
        messages,
        updatedAt: Date.now()
      };
      
      setSessions(prev => prev.map(s => s.id === currentSessionId ? updatedSession : s));
      
      if (user) {
        saveSession(updatedSession);
      }
    }
  }, [messages, currentSessionId, user]);

  useEffect(() => {
    if (user) {
      saveUserSettings();
    }
  }, [settings.dailyImageCount, settings.dailyTokenUsage, user]);

  const handleAuth = async () => {
      if (supabase) {
        await signInWithGoogle();
      } else { 
          setUser({ id: 'guest', name: 'Guest', email: 'guest@ai.com', avatar: '' }); 
          setLoginOpen(false); 
          if(currentPage === 'landing') {
             setCurrentPage('chat');
             createNewChat();
          }
      }
  };
  
  const createNewChat = () => {
    const newId = Date.now().toString();
    const newSession = { id: newId, title: 'New Sequence', messages: [], updatedAt: Date.now() };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newId);
    setMessages([]);
    if (window.innerWidth < 768) setSidebarOpen(false);
    
    if (user) {
      saveSession(newSession);
    }
  };

  const handleSend = async (text: string) => {
    // FREE TIER LIMITS CHECK
    if (settings.tier === Tier.Free) {
        if (text.startsWith('/imagine')) {
            if (settings.dailyImageCount >= settings.dailyImageLimit) {
                setMessages(p => [...p, { 
                  id: Date.now().toString(), 
                  role: 'model', 
                  text: '⚠️ **LIMIT REACHED:** You have reached your daily image generation limit (5/day) on the Free plan. Upgrade to Pro for unlimited images.', 
                  timestamp: Date.now() 
                }]);
                setPricingOpen(true);
                return;
            }
        } else {
            if (settings.dailyTokenUsage >= settings.dailyTokenLimit) {
                 setMessages(p => [...p, { 
                   id: Date.now().toString(), 
                   role: 'model', 
                   text: '⚠️ **LIMIT REACHED:** You have reached your daily token limit (2,000/day) on the Free plan. Upgrade to Pro for 100k/month.', 
                   timestamp: Date.now() 
                 }]);
                 setPricingOpen(true);
                 return;
            }
        }
    }

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsGenerating(true);
    
    const estimatedTokens = Math.ceil(text.length * 0.25);
    setSettings(prev => ({ ...prev, dailyTokenUsage: prev.dailyTokenUsage + estimatedTokens }));

    if (text.startsWith('/imagine')) {
        setTimeout(() => {
            const prompt = text.replace('/imagine', '').trim();
            const seed = Math.floor(Math.random() * 1000000);
            const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&model=flux&nologo=true&seed=${seed}`;
            setMessages(p => [...p, { id: Date.now().toString(), role: 'model', text: `![Image](${url})`, timestamp: Date.now() }]);
            setIsGenerating(false);
            setSettings(prev => ({ ...prev, dailyImageCount: prev.dailyImageCount + 1 }));
        }, 1000);
        return;
    }

    const aiId = (Date.now() + 1).toString();
    setMessages(p => [...p, { id: aiId, role: 'model', text: '', timestamp: Date.now(), isThinking: true }]);

    try {
        await streamChatResponse([...messages, userMsg], settings.currentModel, (chunk) => {
            setMessages(p => p.map(m => m.id === aiId ? { ...m, text: chunk, isThinking: false } : m));
        });
        const responseTokens = Math.ceil(50 * 0.25);
        setSettings(prev => ({ ...prev, dailyTokenUsage: prev.dailyTokenUsage + responseTokens })); 
    } catch {
        setMessages(p => p.map(m => m.id === aiId ? { ...m, text: 'ERR: CONNECTION_LOST', isThinking: false } : m));
    } finally { setIsGenerating(false); }
  };

  if (showBoot) return <BootSequence onComplete={() => setShowBoot(false)} />;

  if (currentPage === 'landing') return (
    <>
        <LandingPage 
            onEnter={() => { 
                if(!user) setLoginOpen(true); 
                else { setCurrentPage('chat'); createNewChat(); }
            }} 
            onNavigate={setCurrentPage} 
        />
        <LoginModal 
            isOpen={isLoginOpen} 
            onClose={() => setLoginOpen(false)}
            onLogin={handleAuth} 
        />
    </>
  );

  if (currentPage === 'creator') return <CreatorPage onBack={() => setCurrentPage('landing')} />;
  if (currentPage === 'pricing') return <PricingPage onBack={() => setCurrentPage('landing')} onSelectTier={() => setCurrentPage('landing')} />;

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-oled text-white font-sans flex overflow-hidden">
      
      <Sidebar 
        isOpen={isSidebarOpen} sessions={sessions} currentSessionId={currentSessionId}
        onNewChat={createNewChat} onSelectSession={(id) => { setCurrentSessionId(id); setMessages(sessions.find(s=>s.id===id)?.messages || []); }}
        onPricingOpen={() => setPricingOpen(true)} onSettingsOpen={() => setSettingsOpen(true)}
        currentTier={settings.tier} onCloseMobile={() => setSidebarOpen(false)} onHome={() => setCurrentPage('landing')}
        onDeleteSession={async (id) => {
          setSessions(p => p.filter(s => s.id !== id));
          if (supabase && user) {
            await supabase.from('chat_sessions').delete().eq('id', id);
          }
        }} 
        onRenameSession={async (id, newTitle) => {
          setSessions(p => p.map(s => s.id === id ? { ...s, title: newTitle } : s));
          if (supabase && user) {
            await supabase.from('chat_sessions').update({ title: newTitle }).eq('id', id);
          }
        }}
        user={user}
        onSignOut={async () => {
          if (supabase) await signOut();
          setUser(null);
          setCurrentPage('landing');
        }}
      />

      <div className="flex-1 bg-black relative h-full flex flex-col min-w-0">
          <div className="w-full max-w-5xl mx-auto h-full flex flex-col relative z-10 border-x border-white/5">
            
            <header className="flex-none h-16 flex items-center justify-between px-6">
                <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-white/50 hover:text-white">
                    <Icon name="panel-left" size={24} />
                </button>
                <div className="flex gap-4">
                    <button onClick={() => setModelSelectorOpen(true)} className="liquid-glass-nav rounded-full px-4 py-1.5 flex items-center gap-2 hover:bg-white/10 transition-colors border border-white/10">
                        <span className="text-sm">{MODELS.find(m=>m.id===settings.currentModel)?.icon}</span>
                        <span className="text-xs font-mono tracking-wider">{MODELS.find(m=>m.id===settings.currentModel)?.name}</span>
                    </button>
                    <button onClick={() => setSettingsOpen(true)} className="liquid-glass-nav rounded-full w-9 h-9 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10">
                        {user?.avatar ? <img src={user.avatar} className="w-full h-full rounded-full object-cover" /> : <span className="font-bold text-xs">{user?.name[0]}</span>}
                    </button>
                </div>
            </header>

            <div className="flex-1 min-h-0 w-full overflow-y-auto px-6 py-6 scroll-smooth">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-40">
                        <Icon name="logo" size={48} className="mb-4 text-indigo-500 animate-pulse-slow" />
                        <div className="font-mono text-sm tracking-[0.3em]">SYSTEM_READY_3.0</div>
                        <div className="text-xs text-white/30 mt-2 font-mono">{user?.name} DETECTED</div>
                    </div>
                ) : (
                    messages.map((msg, i) => <ChatMessage key={msg.id} message={msg} onRegenerate={() => {}} accentColor={settings.accentColor} />)
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex-none w-full p-4 pb-6 bg-black">
                <InputArea onSend={handleSend} isLoading={isGenerating} onStop={() => setIsGenerating(false)} dailyImageCount={settings.dailyImageCount} userTier={settings.tier} onUpgradeTrigger={() => setPricingOpen(true)} />
            </div>

          </div>
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} settings={settings} onUpdateSettings={s => setSettings(p => ({...p, ...s}))} user={user} />
      <ModelSelector isOpen={isModelSelectorOpen} onClose={() => setModelSelectorOpen(false)} currentModel={settings.currentModel} userTier={settings.tier} onSelect={id => setSettings(p => ({...p, currentModel: id}))} onUpgrade={() => setPricingOpen(true)} />
      <PricingModal isOpen={isPricingOpen} onClose={() => setPricingOpen(false)} currentTier={settings.tier} />
    </div>
  );
};

export default App;
