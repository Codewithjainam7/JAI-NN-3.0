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
];

const MOCK_PROMPTS = [
  "A futuristic neural network visualization, glowing blue circuits, cyberpunk aesthetic, 8k",
  "Abstract AI consciousness flowing liquid metal, purple pink gradients, ethereal 3D render",
];

// Animated words that scroll through "Evolution"
const EVOLUTION_WORDS = [
  '🧠 Intelligence',
  '⚡ Speed', 
  '🎨 Creativity',
  '💡 Innovation',
  '🚀 Power',
  '🔮 Future'
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
      
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-600/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <JAINNLogo size={32} />
            <span className="font-bold text-lg">JAI-NN 3.0</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => onNavigate('creator')} 
              className="text-sm font-medium text-white/70 hover:text-white transition-colors hidden sm:block"
            >
              Creator
            </button>
            <button 
              onClick={() => onNavigate('pricing')} 
              className="text-sm font-medium text-white/70 hover:text-white transition-colors hidden sm:block"
            >
              Pricing
            </button>
            <button 
              onClick={onEnter} 
              className="px-6 py-2.5 rounded-full bg-white text-black text-xs font-bold tracking-wide hover:bg-indigo-50 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95"
            >
              Launch App
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-20">
        <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 mb-8">
          <span className="px-3 py-1 rounded border border-indigo-500/30 bg-indigo-500/10 text-[10px] tracking-wider text-indigo-400">
            NEURAL SYSTEM ONLINE
          </span>
        </div>
        
        <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-100 mb-6">
          <JAINNLogo size={120} animated />
        </div>
        
        {/* Animated Title */}
        <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-200 mb-6 overflow-hidden">
          <h1 className="text-5xl md:text-8xl font-bold text-center leading-tight mb-4">
            Artificial Intelligence
          </h1>
          
          {/* Scrolling Animation Container */}
          <div className="relative h-[80px] md:h-[120px] overflow-hidden">
            <div className="absolute whitespace-nowrap animate-scroll-infinite flex gap-8">
              {[...EVOLUTION_WORDS, ...EVOLUTION_WORDS, ...EVOLUTION_WORDS].map((word, i) => (
                <span 
                  key={i}
                  className="text-5xl md:text-8xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent inline-block"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <p className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-300 max-w-2xl text-center text-white/60 text-base leading-relaxed mb-12">
          Experience the next generation of AI-powered conversations. Create, learn, and innovate with advanced neural intelligence at your fingertips.
        </p>

        <button 
          onClick={onEnter}
          className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-400 group relative px-10 py-5 bg-transparent overflow-hidden rounded-full active:scale-95"
        >
          <div className="absolute inset-0 w-full h-full bg-indigo-600/20 group-hover:bg-indigo-600/40 transition-colors border border-indigo-500/50 rounded-full"></div>
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity"></div>
          <span className="relative flex items-center gap-3 text-sm font-bold tracking-wider">
            Start Creating <Icon name="arrow-right" size={16} />
          </span>
        </button>
      </section>

      {/* Features */}
      <section className="relative z-10 pb-32 px-6 max-w-7xl mx-auto">
        <div className="mb-12 flex items-end justify-between border-b border-white/10 pb-6 animate-on-scroll opacity-0 translate-y-10 transition-all">
          <div>
            <h2 className="text-3xl font-bold mb-2">Core Capabilities</h2>
            <p className="text-white/40 text-xs">MODULES ACTIVE: 5/5</p>
          </div>
          <JAINNLogo size={32} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURE_CARDS.map((feature, i) => (
            <TiltCard 
              key={i} 
              className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 hover:border-white/30`} 
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-${feature.color}-500/10 border border-${feature.color}-500/20 flex items-center justify-center mb-6 text-${feature.color}-400`}>
                <Icon name={feature.icon as any} size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{feature.desc}</p>
            </TiltCard>
          ))}
          
          <TiltCard className="md:col-span-2 md:row-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-1.5 overflow-hidden group animate-on-scroll opacity-0 translate-y-10">
            <div className="relative h-full bg-black/40 rounded-[1.5rem] overflow-hidden min-h-[400px]">
              <div className="absolute top-6 left-6 z-20 px-4 py-1.5 bg-black/60 backdrop-blur border border-white/10 rounded-full text-[10px] tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                IMAGE SYNTHESIS
              </div>
              <div className="grid grid-cols-2 h-full gap-1">
                {randomImages.map((img, idx) => (
                  <div key={idx} className="relative h-full overflow-hidden group/img">
                    <img 
                      src={img.url} 
                      alt="AI Generated" 
                      className="w-full h-full object-cover opacity-80 group-hover/img:opacity-100 transition-opacity duration-500 scale-100 group-hover/img:scale-105" 
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent translate-y-full group-hover/img:translate-y-0 transition-transform duration-300">
                      <p className="text-xs text-white/90 border-l-2 border-indigo-500 pl-3">"{img.prompt}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-white/40 text-sm">
        <p>JAI-NN 3.0 • Powered by Gemini 2.5 • Built with ❤️</p>
      </footer>

      <style jsx>{`
        @keyframes scroll-infinite {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        .animate-scroll-infinite {
          animation: scroll-infinite 20s linear infinite;
        }
      `}</style>
    </div>
  );
};
