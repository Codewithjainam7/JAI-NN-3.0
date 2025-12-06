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
  
  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('jainn_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error loading user:', e);
      }
    }
  }, []);

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
  const handleAuth = () => {
      const userData = {
          id: '123',
          name: 'Jainam User',
          email: 'user@example.com',
          avatar: ''
      };
      setUser(userData);
      localStorage.setItem('jainn_user', JSON.stringify(userData));
      setLoginOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('jainn_user');
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

  // --- CHAT LAYOUT ---
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
        onLogout={handleLogout}
        user={user}
      />

      {/* Main Content Area - Strict Flexbox Containment */}
      <div className="flex-1 bg-black relative h-full flex flex-col min-w-0">
          
          {/* Centered Column Wrapper */}
          <div className="w-full max-w-4xl mx-auto h-full flex flex-col border-x border-white/5 bg-black shadow-2xl shadow-black">

            {/* Header */}
            <header className="flex-none h-14 md:h-16 flex items-center justify-between px-4 bg-black/80 backdrop-blur-md border-b border-white/5 z-20">
                <div className="flex items-center gap-3">
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 -ml-2 text-white/70 hover:text-white rounded-lg active:bg-white/10 transition-colors">
                        <Icon name="panel-left" size={24} />
                    </button>
                    
                    <button 
                    onClick={() => setModelSelectorOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full liquid-glass hover:bg-white/10 transition-all active:scale-95 group"
                    >
                        <span className="text-sm group-hover:scale-110 transition-transform">{currentModelInfo?.icon}</span>
                        <span className="text-sm font-medium text-white/90 truncate max-w-[120px]">{currentModelInfo?.name}</span>
                        <Icon name="chevron-down" size={12} className="text-white/50" />
                    </button>
                </div>
                
                <div className="flex items-center gap-3">
                    {user ? (
                        <div className="flex items-center gap-2">
                            <div className="hidden md:flex flex-col items-end mr-1">
                                <span className="text-xs font-medium text-white/90 leading-tight">{user.name}</span>
                                <span className="text-[9px] text-white/40 leading-tight">{user.email}</span>
                            </div>
                            <div className="relative group">
                                <button className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold border border-white/20 liquid-glass shadow-lg hover:scale-110 transition-transform">
                                    {user.name.charAt(0)}
                                </button>
                                <div className="absolute top-full right-0 mt-2 w-40 py-1 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-2xl z-50">
                                    <button 
                                        onClick={() => setSettingsOpen(true)}
                                        className="w-full px-4 py-2 text-left text-xs text-white/70 hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors"
                                    >
                                        <Icon name="settings" size={12} />
                                        Settings
                                    </button>
                                    <div className="h-px bg-white/10 my-1"></div>
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2 text-left text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                                    >
                                        <Icon name="x" size={12} />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => setLoginOpen(true)} className="liquid-glass rounded-full text-xs font-bold text-white/90 hover:text-white px-4 py-2 hover:bg-white/10 transition-colors">
                            Log In
                        </button>
                    )}
                </div>
            </header>

            {/* Messages Area - Flexible with scrolling */}
            <div className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden scroll-smooth custom-scrollbar relative">
                <div className="max-w-4xl mx-auto w-full px-4 py-6 flex flex-col min-h-full">
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

            {/* Input Area - Fixed height content */}
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
