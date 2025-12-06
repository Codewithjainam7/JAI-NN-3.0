
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
import { signInWithGoogle, signOut, supabase } from './services/supabaseService';

// Complex Preloader with Logo Animation
const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000); 
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute inset-0 bg-blue-600/20 blur-[80px] rounded-full animate-pulse-slow"></div>
        <div className="relative z-10 animate-bounce">
           <Icon name="logo" size={100} />
        </div>
      </div>
      <div className="flex gap-2">
         <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-75"></div>
         <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></div>
         <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-300"></div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  // --- View State ---
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<User | null>(null);

  // --- App State ---
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Sidebar State
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  
  // Modal States
  const [isPricingOpen, setPricingOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isModelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Settings
  const [settings, setSettings] = useState<UserSettings>({
    tier: Tier.Free,
    currentModel: ModelId.Flash,
    theme: 'dark',
    accentColor: '#007AFF',
    dailyImageCount: 0,
    dailyImageLimit: 5
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Effects ---
  
  // Auth Check
  useEffect(() => {
    if (supabase) {
      supabase.auth.getUser().then(({ data: { user: sbUser } }) => {
        if (sbUser) {
          setUser({
            id: sbUser.id,
            name: sbUser.user_metadata.full_name || sbUser.email || 'User',
            email: sbUser.email || '',
            avatar: sbUser.user_metadata.avatar_url || ''
          });
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata.full_name || session.user.email || 'User',
            email: session.user.email || '',
            avatar: session.user.user_metadata.avatar_url || ''
          });
        } else {
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  // Sync messages
  useEffect(() => {
    if (currentSessionId && messages.length > 0) {
      setSessions(prev => prev.map(session => {
        if (session.id === currentSessionId) {
          let title = session.title;
          if (title === 'New Chat' && messages.length > 0) {
             const firstUserMsg = messages.find(m => m.role === 'user');
             if (firstUserMsg) {
               title = firstUserMsg.text.slice(0, 25) + (firstUserMsg.text.length > 25 ? '...' : '');
             }
          }
          return { ...session, messages, title, updatedAt: Date.now() };
        }
        return session;
      }));
    }
  }, [messages, currentSessionId]);

  // --- Handlers ---
  const handleAuth = async () => {
      if (supabase) {
        const { error } = await signInWithGoogle();
        if (error) {
            console.error("Supabase Login Error:", error);
            alert("Could not connect to authentication server.");
        }
      } else {
         // Fallback for demo without Supabase configured
         console.warn("Supabase not configured. Logging in as guest.");
         setUser({
            id: 'guest',
            name: 'Guest User',
            email: 'guest@example.com',
            avatar: ''
        });
        setLoginOpen(false);
      }
  };
  
  const handleLogout = async () => {
      if (supabase) await signOut();
      setUser(null);
      setCurrentPage('landing');
  };

  const createNewChat = () => {
    const newId = Date.now().toString();
    const newSession: ChatSession = {
      id: newId,
      title: 'New Chat',
      messages: [],
      updatedAt: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newId);
    setMessages([]);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleDeleteSession = (id: string) => {
      const newSessions = sessions.filter(s => s.id !== id);
      setSessions(newSessions);
      if (currentSessionId === id) {
          if (newSessions.length > 0) {
              setCurrentSessionId(newSessions[0].id);
              setMessages(newSessions[0].messages);
          } else {
              setCurrentSessionId(null);
              setMessages([]);
              createNewChat();
          }
      }
  };

  const handleRenameSession = (id: string, newTitle: string) => {
      setSessions(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
  };

  const handleEnterChat = () => {
    if (!user) {
        setLoginOpen(true);
    } else {
        setCurrentPage('chat');
        if (sessions.length === 0) createNewChat();
    }
  };

  const handleGuestEnter = () => {
      setLoginOpen(false);
      setCurrentPage('chat');
      if (sessions.length === 0) createNewChat();
  };

  const handleSelectSession = (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (session) {
      setCurrentSessionId(id);
      setMessages(session.messages);
      if (window.innerWidth < 768) setSidebarOpen(false);
    }
  };

  const handleRegenerate = (msgIndex: number) => {
      const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
      if (lastUserMsg) {
          handleSend(lastUserMsg.text);
      }
  };

  const handleSend = async (text: string) => {
    if (text.startsWith('/imagine')) {
        const newMessage: Message = { id: Date.now().toString(), role: 'user', text, timestamp: Date.now() };
        setMessages(prev => [...prev, newMessage]);
        setIsGenerating(true);
        setSettings(prev => ({...prev, dailyImageCount: prev.dailyImageCount + 1}));

        setTimeout(() => {
            const prompt = text.replace('/imagine ', '');
            const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`;
            const aiMsg: Message = { 
                id: (Date.now() + 1).toString(), 
                role: 'model', 
                text: `Generated image for: **${prompt}**\n\n![${prompt}](${imageUrl})`, 
                timestamp: Date.now() 
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsGenerating(false);
        }, 2000);
        return;
    }

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsGenerating(true);

    const aiMsgId = (Date.now() + 1).toString();
    const aiMsgPlaceholder: Message = { id: aiMsgId, role: 'model', text: '', timestamp: Date.now(), isThinking: true };
    setMessages(prev => [...prev, aiMsgPlaceholder]);

    try {
        await streamChatResponse(
            [...messages, userMsg],
            settings.currentModel,
            (chunk) => {
                setMessages(prev => prev.map(m => 
                    m.id === aiMsgId ? { ...m, text: chunk, isThinking: false } : m
                ));
            }
        );
    } catch (error) {
        setMessages(prev => prev.map(m => 
            m.id === aiMsgId ? { ...m, text: 'Connection error. Please try again.', isThinking: false } : m
        ));
    } finally {
        setIsGenerating(false);
    }
  };

  const handleStop = () => {
    setIsGenerating(false);
    setMessages(prev => prev.map(m => m.isThinking ? { ...m, isThinking: false, text: m.text + ' [Stopped]' } : m));
  };

  const currentModelInfo = MODELS.find(m => m.id === settings.currentModel);

  // --- Render ---

  if (loading) return <Preloader onComplete={() => setLoading(false)} />;

  if (currentPage === 'landing') {
    return (
        <>
            <LandingPage onEnter={handleEnterChat} onNavigate={setCurrentPage} />
            <LoginModal isOpen={isLoginOpen} onClose={handleGuestEnter} onLogin={handleAuth} />
        </>
    );
  }

  if (currentPage === 'creator') {
      return <CreatorPage onBack={() => setCurrentPage('landing')} />;
  }

  if (currentPage === 'pricing') {
    return <PricingPage onBack={() => setCurrentPage('landing')} onSelectTier={() => setCurrentPage('landing')} />;
  }

  // --- CHAT LAYOUT: STRICT FLEXBOX SANDWICH ---
  // The outer container must be fixed height 100dvh (dynamic viewport height) to allow inner scrolling
  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-black text-white font-sans flex overflow-hidden">
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onNewChat={createNewChat}
        onSelectSession={handleSelectSession}
        onPricingOpen={() => setCurrentPage('pricing')}
        onSettingsOpen={() => setSettingsOpen(true)}
        currentTier={settings.tier}
        onCloseMobile={() => setSidebarOpen(false)}
        onHome={() => setCurrentPage('landing')}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
      />

      {/* Main Content Area - Strict Vertical Stack */}
      <div className="flex-1 bg-black relative h-full flex flex-col min-w-0">
          
          {/* Centered Max-Width Wrapper for Alignment */}
          <div className="w-full max-w-4xl mx-auto h-full flex flex-col border-x border-white/5 bg-black shadow-2xl shadow-black relative">

            {/* 1. HEADER (Fixed Height) - Applied Liquid Glass */}
            <header className="flex-none h-14 md:h-16 flex items-center justify-between px-4 bg-black/80 backdrop-blur-md border-b border-white/5 z-20">
                <div className="flex items-center gap-3">
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 -ml-2 text-white/70 hover:text-white rounded-lg active:bg-white/10 transition-colors">
                        <Icon name="panel-left" size={24} />
                    </button>
                    
                    {/* Model Selector Button - Liquid Glass */}
                    <button 
                    onClick={() => setModelSelectorOpen(true)}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass hover:bg-white/10 transition-all active:scale-95 group shadow-lg"
                    >
                        <span className="text-sm group-hover:scale-110 transition-transform">{currentModelInfo?.icon}</span>
                        <span className="text-sm font-medium text-white/90 truncate max-w-[120px]">{currentModelInfo?.name}</span>
                        <Icon name="chevron-down" size={12} className="text-white/50" />
                    </button>
                </div>
                
                <div className="flex items-center gap-3">
                    {/* User Profile Button - Liquid Glass */}
                    {user ? (
                        <button onClick={() => setSettingsOpen(true)} className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold border border-white/20 liquid-glass shadow-lg transition-transform hover:scale-105">
                            {user.name.charAt(0)}
                        </button>
                    ) : (
                        <button onClick={() => setLoginOpen(true)} className="liquid-glass rounded-full text-xs font-bold text-white/90 hover:text-white px-5 py-2 hover:bg-white/10 transition-colors shadow-lg">
                            Log In
                        </button>
                    )}
                </div>
            </header>

            {/* 2. MESSAGES AREA (Flex-1, min-h-0 for scrolling) */}
            <div className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden scroll-smooth custom-scrollbar relative">
                <div className="min-h-full w-full px-4 py-6 flex flex-col">
                    {messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60 min-h-[50vh]">
                        <div className="w-20 h-20 mb-6 rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 shadow-2xl animate-fade-in">
                            <Icon name="logo" size={40} />
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-white animate-slide-up">JAI-NN</h2>
                        <p className="text-white/40 max-w-xs mx-auto text-sm leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            Advanced AI Assistant.<br/>
                            Try <code className="bg-white/10 px-1 py-0.5 rounded text-white/70">/imagine</code> for art.
                        </p>
                    </div>
                    ) : (
                    <div className="space-y-6 pb-4 w-full">
                        {messages.map((msg, index) => (
                            <ChatMessage 
                                    key={msg.id} 
                                    message={msg} 
                                    onRegenerate={() => handleRegenerate(index)}
                                    accentColor={settings.accentColor}
                                />
                        ))}
                        <div ref={messagesEndRef} className="h-px w-full" />
                    </div>
                    )}
                </div>
            </div>

            {/* 3. INPUT AREA (Fixed Height Content) */}
            <div className="flex-none w-full bg-black z-20 pb-safe px-4 border-t border-white/5 pt-4">
                <InputArea 
                    onSend={handleSend} 
                    isLoading={isGenerating} 
                    onStop={handleStop}
                    dailyImageCount={settings.dailyImageCount}
                    userTier={settings.tier}
                    onUpgradeTrigger={() => setCurrentPage('pricing')}
                />
            </div>
        </div>
      </div>

      {/* --- Modals --- */}
      <PricingModal 
         isOpen={isPricingOpen} 
         onClose={() => setPricingOpen(false)} 
         currentTier={settings.tier}
      />
      <SettingsModal
         isOpen={isSettingsOpen}
         onClose={() => setSettingsOpen(false)}
         settings={settings}
         onUpdateSettings={(newSettings) => setSettings(prev => ({ ...prev, ...newSettings }))}
      />
      <ModelSelector
         isOpen={isModelSelectorOpen}
         onClose={() => setModelSelectorOpen(false)}
         currentModel={settings.currentModel}
         userTier={settings.tier}
         onSelect={(id) => setSettings(prev => ({ ...prev, currentModel: id }))}
         onUpgrade={() => {
             setModelSelectorOpen(false);
             setCurrentPage('pricing');
         }}
      />
      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={handleAuth}
      />
    </div>
  );
};

export default App;
