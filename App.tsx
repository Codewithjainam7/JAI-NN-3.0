import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, ModelId, Tier, UserSettings, ChatSession, User, Page } from './types';
import { ChatMessage } from './components/ChatMessage';
import { InputArea } from './components/InputArea';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { CreatorPage } from './components/CreatorPage';
import { PricingPage } from './components/PricingPage';
import { PricingModal, ModelSelector, LoginModal } from './components/Modals';
import { SettingsModal } from './components/SettingsModal';
import { JAINNLogo } from './components/JAINNLogo';
import { Icon } from './components/Icon';
import { CursorGlow } from './components/CursorGlow';
import { MODELS } from './constants';
import { streamChatResponse } from './services/geminiService';
import { signInWithGoogle, supabase, signOut } from './services/supabaseService';

const BootSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [opacity, setOpacity] = useState(0);
  
  useEffect(() => {
    setTimeout(() => setOpacity(1), 100);
    setTimeout(onComplete, 2500);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center transition-opacity duration-500" style={{ opacity }}>
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-60 animate-pulse"></div>
        <div className="relative animate-float">
          <JAINNLogo size={120} />
        </div>
      </div>
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse mb-2">
        JAI-NN 3.0
      </h1>
      <div className="flex items-center gap-2 text-white/40 text-sm">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
        <span>Initializing Neural Network...</span>
      </div>
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
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isPricingOpen, setPricingOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isModelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  const [settings, setSettings] = useState<UserSettings>({
    tier: Tier.Free,
    currentModel: ModelId.Flash,
    theme: 'dark',
    accentColor: '#0A84FF',
    dailyImageCount: 0,
    dailyImageLimit: 5,
    dailyTokenUsage: 0,
    dailyTokenLimit: 2000,
    systemInstruction: '',
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isGuest = user?.id === 'guest';

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

  const saveUserSettings = useCallback(async () => {
    if (!supabase || !user || isGuest) return;
    try {
      await supabase.from('user_settings').upsert({
        user_id: user.id,
        daily_image_count: settings.dailyImageCount,
        daily_token_usage: settings.dailyTokenUsage,
        tier: settings.tier,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error saving settings:', err);
    }
  }, [supabase, user, isGuest, settings.dailyImageCount, settings.dailyTokenUsage, settings.tier]);

  const saveSession = useCallback(async (session: ChatSession) => {
    if (!supabase || !user || isGuest) return;
    try {
      await supabase.from('chat_sessions').upsert({
        id: session.id,
        user_id: user.id,
        title: session.title,
        messages: session.messages,
        updated_at: new Date(session.updatedAt).toISOString()
      });
    } catch (err) {
      console.error('Error saving session:', err);
    }
  }, [supabase, user, isGuest]);

  useEffect(() => { 
    if(messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' }); 
    }
  }, [messages, isGenerating]);

  useEffect(() => {
    if (currentSessionId && messages.length > 0 && !isGuest) {
      const updatedSession = {
        id: currentSessionId,
        title: messages[0].text.slice(0, 40) + (messages[0].text.length > 40 ? '...' : ''),
        messages,
        updatedAt: Date.now()
      };
      setSessions(prev => prev.map(s => s.id === currentSessionId ? updatedSession : s));
      saveSession(updatedSession);
    }
  }, [messages, currentSessionId, isGuest, saveSession]);

  useEffect(() => {
    if (user && !isGuest) saveUserSettings();
  }, [settings.dailyImageCount, settings.dailyTokenUsage, user, isGuest, saveUserSettings]);

  const handleAuth = async () => {
    if (supabase) {
      await signInWithGoogle();
      setLoginOpen(false);
    } else { 
      handleGuestMode();
    }
  };

  const handleGuestMode = () => {
    setUser({ id: 'guest', name: 'Guest', email: 'guest@ai.com', avatar: '' }); 
    setLoginOpen(false); 
    setCurrentPage('chat');
    createNewChat();
  };
  
  const createNewChat = () => {
    const newId = Date.now().toString();
    const newSession = { id: newId, title: 'New Chat', messages: [], updatedAt: Date.now() };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newId);
    setMessages([]);
    setSidebarOpen(false);
    setUploadedFiles([]);
    if (!isGuest) saveSession(newSession);
  };

  const handleSend = async (text: string) => {
    const isImageRequest = text.startsWith('/imagine');
    
    if (isImageRequest) {
      if (settings.tier === Tier.Free && settings.dailyImageCount >= settings.dailyImageLimit) {
        setMessages(p => [...p, { 
          id: Date.now().toString(), 
          role: 'model', 
          text: '⚠️ Daily image limit reached (5/day). Upgrade to Pro for unlimited access.', 
          timestamp: Date.now() 
        }]);
        setPricingOpen(true);
        return;
      }
    } else {
      if (settings.tier === Tier.Free && settings.dailyTokenUsage >= settings.dailyTokenLimit) {
        setMessages(p => [...p, { 
          id: Date.now().toString(), 
          role: 'model', 
          text: '⚠️ Daily token limit reached (2,000/day). Upgrade to Pro for 100k/month.', 
          timestamp: Date.now() 
        }]);
        setPricingOpen(true);
        return;
      }
    }

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsGenerating(true);
    
    const estimatedTokens = Math.ceil(text.length * 0.25);
    setSettings(prev => ({ ...prev, dailyTokenUsage: prev.dailyTokenUsage + estimatedTokens }));

    if (isImageRequest) {
      setTimeout(() => {
        const prompt = text.replace('/imagine', '').trim();
        const seed = Math.floor(Math.random() * 1000000);
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&model=flux&nologo=true&seed=${seed}`;
        setMessages(p => [...p, { 
          id: Date.now().toString(), 
          role: 'model', 
          text: `![Image](${url})`, 
          timestamp: Date.now() 
        }]);
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
      setMessages(p => p.map(m => m.id === aiId ? { ...m, text: 'Connection error. Please try again.', isThinking: false } : m));
    } finally { 
      setIsGenerating(false); 
    }
  };

  if (showBoot) return <BootSequence onComplete={() => setShowBoot(false)} />;

  if (currentPage === 'landing') return (
    <>
      <CursorGlow />
      <LandingPage 
        onEnter={() => { 
          if(!user) setLoginOpen(true); 
          else { setCurrentPage('chat'); createNewChat(); }
        }} 
        onNavigate={setCurrentPage} 
      />
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={handleGuestMode}
        onLogin={handleAuth}
        onGuestMode={handleGuestMode}
      />
    </>
  );

  if (currentPage === 'creator') return (
    <>
      <CursorGlow />
      <CreatorPage onBack={() => setCurrentPage('landing')} />
    </>
  );
  
  if (currentPage === 'pricing') return (
    <>
      <CursorGlow />
      <PricingPage onBack={() => setCurrentPage('landing')} onSelectTier={() => setCurrentPage('landing')} />
    </>
  );

  return (
    <>
      <CursorGlow />
      <div className="fixed inset-0 w-full h-[100dvh] bg-black text-white flex overflow-hidden">
        
        <Sidebar 
          isOpen={isSidebarOpen} 
          sessions={isGuest ? [] : sessions}
          currentSessionId={currentSessionId}
          onNewChat={createNewChat} 
          onSelectSession={(id) => { 
            setCurrentSessionId(id); 
            setMessages(sessions.find(s=>s.id===id)?.messages || []); 
            setSidebarOpen(false);
          }}
          onPricingOpen={() => setPricingOpen(true)} 
          onSettingsOpen={() => {
            if (isGuest) {
              setLoginOpen(true);
            } else {
              setSettingsOpen(true);
            }
          }}
          currentTier={settings.tier} 
          onCloseMobile={() => setSidebarOpen(false)} 
          onHome={() => setCurrentPage('landing')}
          onDeleteSession={async (id) => {
            setSessions(p => p.filter(s => s.id !== id));
            if (supabase && !isGuest) {
              await supabase.from('chat_sessions').delete().eq('id', id);
            }
          }} 
          onRenameSession={async (id, newTitle) => {
            setSessions(p => p.map(s => s.id === id ? { ...s, title: newTitle } : s));
            if (supabase && !isGuest) {
              await supabase.from('chat_sessions').update({ title: newTitle }).eq('id', id);
            }
          }}
          user={user}
          onSignOut={async () => {
            if (supabase && !isGuest) await signOut();
            setUser(null);
            setCurrentPage('landing');
          }}
          isGuest={isGuest}
        />

        <div className="flex-1 bg-black relative h-full flex flex-col min-w-0 overflow-hidden">
          <div className="w-full h-full flex flex-col relative z-10">
            
            <header className="flex-none bg-black/60 backdrop-blur-2xl border-b border-white/10">
              <div className="flex items-center justify-between px-4 h-16 max-w-4xl mx-auto">
                <button 
                  onClick={() => setSidebarOpen(!isSidebarOpen)} 
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors active:scale-95"
                >
                  <Icon name="menu" size={22} />
                </button>
                
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                  <JAINNLogo size={28} />
                  <span className="text-sm font-semibold hidden sm:inline">JAI-NN 3.0</span>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => setModelSelectorOpen(true)} 
                    className="bg-white/5 backdrop-blur-xl rounded-2xl px-3 py-2 flex items-center gap-2 hover:bg-white/10 transition-all border border-white/10 active:scale-95"
                  >
                    <Icon name={MODELS.find(m=>m.id===settings.currentModel)?.iconName as any} size={18} />
                    <span className="text-xs font-medium hidden sm:inline">{MODELS.find(m=>m.id===settings.currentModel)?.name.split(' ')[1]}</span>
                  </button>
                  <button 
                    onClick={() => {
                      if (isGuest) {
                        setLoginOpen(true);
                      } else {
                        setSettingsOpen(true);
                      }
                    }}
                    className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all border border-white/10 active:scale-95"
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                    ) : (
                      <span className="font-semibold text-sm">{user?.name[0] || 'G'}</span>
                    )}
                  </button>
                </div>
              </div>
            </header>

            <div className="flex-1 min-h-0 w-full overflow-y-auto px-4 py-4 max-w-4xl mx-auto">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-40"></div>
                    <div className="relative">
                      <JAINNLogo size={80} />
                    </div>
                  </div>
                  <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Ready to assist
                  </h2>
                  <p className="text-white/40 text-sm">Start a conversation with JAI-NN</p>
                </div>
              ) : (
                messages.map(msg => <ChatMessage key={msg.id} message={msg} onRegenerate={() => {}} accentColor={settings.accentColor} />)
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex-none w-full p-3 pb-safe">
              <InputArea 
                onSend={handleSend} 
                isLoading={isGenerating} 
                onStop={() => setIsGenerating(false)} 
                dailyImageCount={settings.dailyImageCount} 
                userTier={settings.tier} 
                onUpgradeTrigger={() => setPricingOpen(true)}
                uploadedFiles={uploadedFiles}
                onFilesChange={setUploadedFiles}
              />
            </div>

          </div>
        </div>

        {!isGuest && (
          <SettingsModal 
            isOpen={isSettingsOpen} 
            onClose={() => setSettingsOpen(false)} 
            settings={settings} 
            onUpdateSettings={s => setSettings(p => ({...p, ...s}))} 
            user={user} 
          />
        )}
        <ModelSelector 
          isOpen={isModelSelectorOpen} 
          onClose={() => setModelSelectorOpen(false)} 
          currentModel={settings.currentModel} 
          userTier={settings.tier} 
          onSelect={id => setSettings(p => ({...p, currentModel: id}))} 
          onUpgrade={() => setPricingOpen(true)} 
        />
        <PricingModal 
          isOpen={isPricingOpen} 
          onClose={() => setPricingOpen(false)} 
          currentTier={settings.tier} 
        />
        <LoginModal 
          isOpen={isLoginOpen && currentPage === 'chat'} 
          onClose={() => setLoginOpen(false)}
          onLogin={handleAuth}
          onGuestMode={() => setLoginOpen(false)}
        />
      </div>
    </>
  );
};

export default App;
