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
import { signInWithGoogle, supabase } from './services/supabaseService';

// Cinematic Boot Sequence Component
const BootSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  
  useEffect(() => {
    // Timeline of boot events
    const timers = [
        setTimeout(() => setStep(1), 500),  // Start text
        setTimeout(() => setStep(2), 1200), // Loading Modules
        setTimeout(() => setStep(3), 2000), // Logo Reveal
        setTimeout(onComplete, 3500)      // Finish
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
                    {step >= 2 && <div className="animate-pulse">> WAITING_FOR_USER_HANDSHAKE...</div>}
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
    theme: 'dark',
    accentColor: '#6366f1',
    dailyImageCount: 0,
    dailyImageLimit: 5,
    dailyTokenUsage: 0,
    dailyTokenLimit: 2000,
    systemInstruction: '',
    customStarters: []
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (supabase) {
      supabase.auth.getUser().then(({ data: { user: sbUser } }) => {
        if (sbUser) setUser({ id: sbUser.id, name: sbUser.user_metadata.full_name || 'User', email: sbUser.email || '', avatar: sbUser.user_metadata.avatar_url || '' });
      });
    }
  }, []);

  useEffect(() => { 
      if(messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' }); 
  }, [messages, isGenerating]);

  // Sync Logic... (Simplified for brevity, same as before)
  useEffect(() => {
    if (currentSessionId && messages.length > 0) {
      setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, messages, title: messages[0].text.slice(0,25), updatedAt: Date.now() } : s));
    }
  }, [messages, currentSessionId]);

  const handleAuth = async () => {
      if (supabase) await signInWithGoogle();
      else { 
          // Guest Fallback
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
    setSessions(prev => [{ id: newId, title: 'New Sequence', messages: [], updatedAt: Date.now() }, ...prev]);
    setCurrentSessionId(newId);
    setMessages([]);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleSend = async (text: string) => {
    // FREE TIER LIMITS CHECK
    if (settings.tier === Tier.Free) {
        // Image Limit
        if (text.startsWith('/imagine')) {
            if (settings.dailyImageCount >= settings.dailyImageLimit) {
                setMessages(p => [...p, { id: Date.now().toString(), role: 'model', text: '⚠️ **LIMIT REACHED:** You have reached your daily image generation limit (5/day) on the Free plan. Upgrade to Pro for more.', timestamp: Date.now() }]);
                setPricingOpen(true);
                return;
            }
        } else {
            // Token/Message Check (Approx 1 word = 1.3 tokens, simplifying to msg count or length)
            if (settings.dailyTokenUsage >= settings.dailyTokenLimit) {
                 setMessages(p => [...p, { id: Date.now().toString(), role: 'model', text: '⚠️ **LIMIT REACHED:** You have reached your daily token limit (2,000) on the Free plan. Upgrade to Pro for 100k/month.', timestamp: Date.now() }]);
                 setPricingOpen(true);
                 return;
            }
        }
    }

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsGenerating(true);
    
    // Update Token Usage (Rough estimate: 1 char = 0.25 tokens)
    const estimatedTokens = text.length * 0.25;
    setSettings(prev => ({ ...prev, dailyTokenUsage: prev.dailyTokenUsage + estimatedTokens }));

    // Image Generation Check
    if (text.startsWith('/imagine')) {
        setTimeout(() => {
            const prompt = text.replace('/imagine', '').trim();
            const seed = Math.floor(Math.random() * 1000000); // Random seed
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
        // Update tokens for response (rough estimate)
        // In a real app, the API returns usage metadata
        setSettings(prev => ({ ...prev, dailyTokenUsage: prev.dailyTokenUsage + 50 })); 
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
            onClose={() => setLoginOpen(false)} // Can close without logging in on landing page
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
        onDeleteSession={(id) => setSessions(p => p.filter(s => s.id !== id))} onRenameSession={() => {}}
      />

      <div className="flex-1 bg-black relative h-full flex flex-col min-w-0">
          <div className="w-full max-w-5xl mx-auto h-full flex flex-col relative z-10 border-x border-white/5">
            
            {/* Header with Liquid Glass Buttons */}
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

            {/* Messages */}
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

            {/* Input Deck */}
            <div className="flex-none w-full p-4 pb-6 bg-black">
                <InputArea onSend={handleSend} isLoading={isGenerating} onStop={() => setIsGenerating(false)} dailyImageCount={settings.dailyImageCount} userTier={settings.tier} onUpgradeTrigger={() => setPricingOpen(true)} />
            </div>

          </div>
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} settings={settings} onUpdateSettings={s => setSettings(p => ({...p, ...s}))} user={user} />
      <ModelSelector isOpen={isModelSelectorOpen} onClose={() => setModelSelectorOpen(false)} currentModel={settings.currentModel} userTier={settings.tier} onSelect={id => setSettings(p => ({...p, currentModel: id}))} onUpgrade={() => setPricingOpen(true)} />
      <PricingModal isOpen={isPricingOpen} onClose={() => setPricingOpen(false)} currentTier={settings.tier} />
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => {
            // Force user to stay in modal if on Chat page, otherwise allow close to return to landing
            if(currentPage === 'chat') { /* Prevent Close */ }
            else setLoginOpen(false); 
        }} 
        onLogin={handleAuth} 
      />
    </div>
  );
};

export default App;