import React, { useEffect, useRef, useMemo } from 'react';
import { Icon } from './Icon';
import { JAINNLogo } from './JAINNLogo';
import { TiltCard } from './TiltCard';

interface LandingPageProps {
  onEnter: () => void;
  onNavigate: (page: 'landing' | 'creator' | 'pricing') => void;
}

const FEATURE_CARDS = [
  { 
    icon: "brain", 
    color: "from-blue-500 to-cyan-500", 
    title: "Multi-Model Intelligence", 
    desc: "Switch seamlessly between Gemini Flash 2.5 and Pro 2.5 for optimal performance across different tasks." 
  },
  { 
    icon: "sparkles", 
    color: "from-purple-500 to-pink-500", 
    title: "AI Image Generation", 
    desc: "Create stunning visuals from text descriptions with Flux model. Unlimited daily generations on Pro tier." 
  },
  { 
    icon: "code", 
    color: "from-pink-500 to-rose-500", 
    title: "Advanced Code Assistant", 
    desc: "Write, debug, and optimize code with syntax highlighting and intelligent suggestions across multiple languages." 
  },
  { 
    icon: "mic", 
    color: "from-emerald-500 to-teal-500", 
    title: "Voice Input", 
    desc: "Speak naturally with real-time voice transcription for hands-free interaction and accessibility." 
  },
  { 
    icon: "zap", 
    color: "from-indigo-500 to-purple-500", 
    title: "Real-Time Streaming", 
    desc: "Experience lightning-fast responses with token-by-token streaming for fluid conversations." 
  },
  { 
    icon: "palette", 
    color: "from-cyan-500 to-blue-500", 
    title: "Personalized Themes", 
    desc: "Customize with multiple accent colors and glassmorphism UI that adapts to your preferences." 
  },
  { 
    icon: "paperclip", 
    color: "from-orange-500 to-amber-500", 
    title: "Multi-File Support", 
    desc: "Upload and analyze images, PDFs, and documents with intelligent context extraction." 
  },
  { 
    icon: "shield", 
    color: "from-rose-500 to-red-500", 
    title: "Persistent History", 
    desc: "Your conversations are securely saved and synced across devices with Google OAuth." 
  },
  { 
    icon: "cpu", 
    color: "from-violet-500 to-purple-500", 
    title: "Context Awareness", 
    desc: "Maintains conversation context across sessions for coherent, meaningful discussions." 
  },
];

const MOCK_PROMPTS = [
  "A futuristic neural network visualization, glowing blue circuits, cyberpunk aesthetic, 8k",
  "Abstract AI consciousness flowing liquid metal, purple pink gradients, ethereal 3D render",
  "Digital brain made of light particles, neural connections, sci-fi illustration",
];

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter, onNavigate }) => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  const randomImages = useMemo(() => {
    const shuffled = [...MOCK_PROMPTS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2).map((p, idx) => ({
      prompt: p,
      url: `https://image.pollinations.ai/prompt/${encodeURIComponent(p)}?width=800&height=800&nologo=true&model=flux&seed=${Math.floor(Math.random() * 10000)}`
    }));
  }, []);

  return (
    <div className="min-h-screen w-full text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden overflow-y-auto bg-black relative">
      
      {/* iOS 26 Inspired Background */}
      <div className="fixed inset-0 z-0 pointer-events-none ios26-gradient">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] animate-pulse-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <JAINNLogo size={32} />
            <span className="font-bold text-lg">JAI-NN 3.0</span>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-6">
            <button 
              onClick={() => onNavigate('creator')} 
              className="text-xs sm:text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Creator
            </button>
            <button 
              onClick={() => onNavigate('pricing')} 
              className="text-xs sm:text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Pricing
            </button>
            <button 
              onClick={onEnter} 
              className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white text-black text-xs font-bold tracking-wide hover:bg-indigo-50 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95"
            >
              Launch App
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-20">
        <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 mb-8">
          <span className="px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-[10px] tracking-wider text-indigo-400">
            NEURAL SYSTEM ONLINE
          </span>
        </div>
        
        <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-100 mb-6">
          <JAINNLogo size={120} />
        </div>
        
        {/* Fixed Title and Evolution Animation */}
        <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-200 mb-6 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-4">
            Artificial Intelligence
          </h1>
          
          {/* Fixed Evolution with Proper Image Cycling */}
          <div className="relative inline-flex items-center justify-center gap-2 text-4xl sm:text-5xl md:text-7xl font-bold">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Ev</span>
            
            {/* Image Container - FIXED VERSION */}
            <div className="inline-block relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 overflow-hidden rounded-xl border-2 border-white/20 mx-1" style={{ verticalAlign: 'middle' }}>
              <div className="evolution-slider">
                <img src="https://image.pollinations.ai/prompt/futuristic%20AI%20neural%20network%20glowing%20connections?width=400&height=400&nologo=true&model=flux&seed=12345" alt="" className="evolution-img" />
                <img src="https://image.pollinations.ai/prompt/abstract%20digital%20evolution%20concept%20blue%20purple?width=400&height=400&nologo=true&model=flux&seed=67890" alt="" className="evolution-img" />
                <img src="https://image.pollinations.ai/prompt/digital%20brain%20neural%20pathways%20cyberpunk?width=400&height=400&nologo=true&model=flux&seed=54321" alt="" className="evolution-img" />
              </div>
            </div>
            
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">lution</span>
          </div>
        </div>
        
        <p className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-300 max-w-2xl text-center text-white/60 text-sm sm:text-base leading-relaxed mb-12 px-4">
          Experience the next generation of AI-powered conversations. Create, learn, and innovate with advanced neural intelligence at your fingertips.
        </p>

        <button 
          onClick={onEnter}
          className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-400 group relative px-8 sm:px-10 py-4 sm:py-5 bg-transparent overflow-hidden rounded-full active:scale-95"
        >
          <div className="absolute inset-0 w-full h-full bg-indigo-600/20 group-hover:bg-indigo-600/40 transition-colors border border-indigo-500/50 rounded-full"></div>
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity"></div>
          <span className="relative flex items-center gap-3 text-sm font-bold tracking-wider">
            Start Creating <Icon name="arrow-right" size={16} />
          </span>
        </button>
      </section>

      {/* Features Section */}
      <section className="relative z-10 pb-20 sm:pb-32 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="mb-16 text-center animate-on-scroll opacity-0 translate-y-10 transition-all">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-[10px] tracking-wider text-purple-400 mb-6">
            <Icon name="sparkles" size={12} />
            POWERFUL CAPABILITIES
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Everything You Need</h2>
          <p className="text-white/40 text-sm sm:text-base max-w-2xl mx-auto">Advanced AI features designed for creators, developers, and innovators</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {FEATURE_CARDS.map((feature, i) => (
            <TiltCard 
              key={i} 
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 hover:border-white/30 h-full flex flex-col group" 
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} bg-opacity-10 flex items-center justify-center mb-5 relative overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                <Icon name={feature.icon as any} size={24} className="relative z-10" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed flex-1">{feature.desc}</p>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* Image Generation Showcase */}
      <section className="relative z-10 pb-20 sm:pb-32 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="mb-16 text-center animate-on-scroll opacity-0 translate-y-10 transition-all">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 text-[10px] tracking-wider text-pink-400 mb-6">
            <Icon name="image" size={12} />
            AI IMAGE GENERATION
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Create Visual Magic</h2>
          <p className="text-white/40 text-sm sm:text-base max-w-2xl mx-auto">Powered by Flux Model - Transform text into stunning visuals instantly</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-on-scroll opacity-0 translate-y-10 transition-all">
          {randomImages.map((img, idx) => (
            <TiltCard key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-3 overflow-hidden group">
              <div className="relative h-64 sm:h-80 overflow-hidden rounded-2xl">
                <img 
                  src={img.url} 
                  alt="AI Generated" 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 scale-100 group-hover:scale-105" 
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black via-black/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-xs text-white/90 border-l-2 border-indigo-500 pl-3">"{img.prompt}"</p>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-white/40 text-xs sm:text-sm px-4">
        <p>JAI-NN 3.0 • Powered by Gemini 2.5 • Built with ❤️</p>
      </footer>
      
      {/* Custom Keyframe for Evolution Animation */}
      <style>{`
        .evolution-slider {
          display: flex;
          width: 300%;
          animation: evolutionScroll 9s linear infinite;
        }
        
        .evolution-img {
          width: 33.333%;
          height: 100%;
          object-fit: cover;
          flex-shrink: 0;
        }
        
        @keyframes evolutionScroll {
          0% {
            transform: translateX(0);
          }
          33.333% {
            transform: translateX(0);
          }
          36.666% {
            transform: translateX(-33.333%);
          }
          66.666% {
            transform: translateX(-33.333%);
          }
          70% {
            transform: translateX(-66.666%);
          }
          100% {
            transform: translateX(-66.666%);
          }
        }
      `}</style>
    </div>
  );
};
