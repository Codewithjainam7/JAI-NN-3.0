import React, { useEffect, useRef, useMemo } from 'react';
import { Icon } from './Icon';
import { JAINNLogo } from './JAINNLogo';
import { TiltCard } from './TiltCard';

interface LandingPageProps {
  onEnter: () => void;
  onNavigate: (page: 'landing' | 'creator' | 'pricing') => void;
}

const FEATURE_CARDS = [
  { icon: "cpu", color: "blue", title: "Neural Processing", desc: "Advanced reasoning with Gemini 2.5 architecture for complex problem solving and creative tasks." },
  { icon: "sparkles", color: "purple", title: "Image Synthesis", desc: "Generate stunning visuals from text descriptions using cutting-edge AI image generation." },
  { icon: "code", color: "pink", title: "Code Generation", desc: "Write, debug, and optimize code across multiple programming languages with AI assistance." },
  { icon: "globe", color: "emerald", title: "Multi-Modal AI", desc: "Process text, images, and code seamlessly in a unified conversational interface." },
  { icon: "zap", color: "indigo", title: "Lightning Fast", desc: "Optimized for speed with real-time streaming responses and instant contextual feedback." },
  { icon: "mic", color: "cyan", title: "Voice Input", desc: "Speak naturally and let AI transcribe and respond to your voice commands instantly." },
];

const MOCK_PROMPTS = [
  "A futuristic neural network visualization, glowing blue circuits, cyberpunk aesthetic, 8k",
  "Abstract AI consciousness flowing liquid metal, purple pink gradients, ethereal 3D render",
  "Digital brain made of light particles, neural connections, sci-fi illustration",
];

const EVOLUTION_IMAGES = [
  "https://image.pollinations.ai/prompt/futuristic%20AI%20neural%20network%20glowing%20connections?width=400&height=400&nologo=true&model=flux",
  "https://image.pollinations.ai/prompt/abstract%20digital%20evolution%20concept%20blue%20purple?width=400&height=400&nologo=true&model=flux",
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
    return shuffled.slice(0, 2).map(p => ({
      prompt: p,
      url: `https://image.pollinations.ai/prompt/${encodeURIComponent(p)}?width=800&height=800&nologo=true&model=flux&seed=${Math.random()}`
    }));
  }, []);

  return (
    <div className="min-h-screen w-full text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden bg-black relative">
      
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
        
        {/* Animated Title - Fixed */}
        <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-200 mb-6 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-2">
            Artificial Intelligence
          </h1>
          
          {/* Evolution Text with Image Animation */}
          <div className="relative inline-block">
            <div className="text-4xl sm:text-5xl md:text-7xl font-bold relative flex items-center justify-center gap-2">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Ev</span>
              <span className="inline-block relative w-16 h-16 md:w-20 md:h-20 align-middle overflow-hidden rounded-lg border-2 border-white/20">
                <div className="animate-scroll-infinite flex h-full" style={{ width: '300%' }}>
                  {[...EVOLUTION_IMAGES, ...EVOLUTION_IMAGES, ...EVOLUTION_IMAGES].map((url, i) => (
                    <img 
                      key={i}
                      src={url} 
                      alt="" 
                      className="w-full h-full object-cover"
                      style={{ minWidth: '33.333%' }}
                    />
                  ))}
                </div>
              </span>
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">lution</span>
            </div>
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
        <div className="mb-12 text-center animate-on-scroll opacity-0 translate-y-10 transition-all">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Core Capabilities</h2>
          <p className="text-white/40 text-xs sm:text-sm">MODULES ACTIVE: {FEATURE_CARDS.length}/{FEATURE_CARDS.length}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURE_CARDS.map((feature, i) => (
            <TiltCard 
              key={i} 
              className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 hover:border-white/30`} 
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-${feature.color}-500/10 border border-${feature.color}-500/20 flex items-center justify-center mb-6 text-${feature.color}-400`}>
                <Icon name={feature.icon as any} size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{feature.desc}</p>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* Image Generation Showcase */}
      <section className="relative z-10 pb-20 sm:pb-32 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="mb-12 text-center animate-on-scroll opacity-0 translate-y-10 transition-all">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">AI Image Generation</h2>
          <p className="text-white/40 text-xs sm:text-sm">Powered by Flux Model - Create stunning visuals from text</p>
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
    </div>
  );
};
