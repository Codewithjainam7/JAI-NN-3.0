import React, { useEffect, useRef, useMemo } from 'react';
import { Icon } from './Icon';
import { TiltCard } from './TiltCard';

interface LandingPageProps {
  onEnter: () => void;
  onNavigate: (page: 'landing' | 'creator' | 'pricing') => void;
}

const FEATURE_CARDS = [
    { icon: "users", color: "indigo", title: "Team Nexus", desc: "Collaborative neural sessions with real-time state sync across devices." },
    { icon: "cpu", color: "purple", title: "Quantum Logic", desc: "Advanced reasoning capabilities using the latest Pro 2.5 architecture." },
    { icon: "globe", color: "emerald", title: "Deep Insights", desc: "Ingest datasets for instant pattern recognition and analytics." },
    { icon: "shield", color: "blue", title: "Secure Sandbox", desc: "Isolated execution environments for running sensitive code safely." },
    { icon: "zap", color: "pink", title: "Multi-Format", desc: "Export intelligence directly to PDF, Markdown, or Codebases." },
];

const MOCK_PROMPTS = [
    "A futuristic glass city in the clouds, cyberpunk style, blue and purple lighting, 8k render",
    "Detailed schematic of a quantum processor chip, glowing circuits, blueprint style",
    "Abstract liquid metal sculpture, iridescent colors, floating in void, 3d render"
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
    <div className="min-h-screen w-full text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      <nav className="fixed top-0 left-0 right-0 z-50 liquid-glass-nav">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="text-indigo-500 animate-pulse-slow"><Icon name="logo" size={28} /></div>
               <span className="font-bold text-lg tracking-tight">JAI-NN 3.0</span>
            </div>
            
            <div className="flex items-center gap-6">
                 <button onClick={() => onNavigate('creator')} className="text-sm font-medium text-white/70 hover:text-white transition-colors tracking-wide hidden sm:block">CREATOR</button>
                 <button onClick={() => onNavigate('pricing')} className="text-sm font-medium text-white/70 hover:text-white transition-colors tracking-wide hidden sm:block">PRICING</button>
                 <button onClick={onEnter} className="px-6 py-2.5 rounded-full bg-white text-black text-xs font-bold font-mono tracking-widest hover:bg-indigo-50 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    TERMINAL_ACCESS
                 </button>
            </div>
        </div>
      </nav>

      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-20">
         <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 mb-8">
             <span className="px-3 py-1 rounded border border-indigo-500/30 bg-indigo-500/10 text-[10px] font-mono tracking-[0.3em] text-indigo-400">
                 SYSTEM_STATUS: ONLINE
             </span>
         </div>
         
         <h1 className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-100 text-5xl md:text-8xl font-bold tracking-tighter mb-6 text-center leading-[1.1]">
             Artificial Intelligence<br/>
             <span className="text-cyber-evolution inline-block mt-2 pb-2">Evolution</span>
         </h1>
         
         <p className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-200 max-w-2xl text-center text-white/60 font-medium text-base leading-relaxed mb-12">
             &gt; INITIATING NEURAL HANDSHAKE...<br/>
             &gt; ACCESSING QUANTUM LOGIC CORE.<br/>
             &gt; WELCOME TO THE NEXT GENERATION OF INTELLIGENCE.
         </p>

         <button 
            onClick={onEnter}
            className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-300 group relative px-10 py-5 bg-transparent overflow-hidden rounded-full"
         >
             <div className="absolute inset-0 w-full h-full bg-indigo-600/20 group-hover:bg-indigo-600/40 transition-colors border border-indigo-500/50 rounded-full"></div>
             <div className="absolute inset-0 bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity"></div>
             <span className="relative flex items-center gap-3 font-mono text-sm font-bold tracking-widest">
                 INITIALIZE_SESSION <Icon name="arrow-right" size={16} />
             </span>
         </button>
      </section>

      <section className="relative z-10 pb-32 px-6 max-w-7xl mx-auto">
          <div className="mb-12 flex items-end justify-between border-b border-white/10 pb-6 animate-on-scroll opacity-0 translate-y-10 transition-all">
              <div>
                  <h2 className="text-3xl font-bold mb-2">System Capabilities</h2>
                  <p className="text-white/40 font-mono text-xs">MODULES_LOADED: 5/5</p>
              </div>
              <Icon name="cpu" size={32} className="text-white/20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FEATURE_CARDS.map((feature, i) => (
                  <TiltCard key={i} className={`smoked-glass rounded-[2rem] p-8 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 hover:border-white/30`} style={{ transitionDelay: `${i * 100}ms` }}>
                      <div className={`w-12 h-12 rounded-xl bg-${feature.color}-500/10 border border-${feature.color}-500/20 flex items-center justify-center mb-6 text-${feature.color}-400`}>
                          <Icon name={feature.icon as any} size={24} />
                      </div>
                      <h3 className="text-xl font-bold mb-2 font-sans tracking-tight">{feature.title}</h3>
                      <p className="text-white/60 text-sm leading-relaxed font-medium">{feature.desc}</p>
                  </TiltCard>
              ))}
              
              <TiltCard className="md:col-span-2 md:row-span-2 smoked-glass rounded-[2rem] p-1.5 overflow-hidden group animate-on-scroll opacity-0 translate-y-10">
                  <div className="relative h-full bg-black/40 rounded-[1.8rem] overflow-hidden min-h-[400px]">
                      <div className="absolute top-6 left-6 z-20 px-4 py-1.5 bg-black/60 backdrop-blur border border-white/10 rounded-full text-[10px] font-mono tracking-widest flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                          VISUAL_SYNTHESIS
                      </div>
                      <div className="grid grid-cols-2 h-full gap-1">
                          {randomImages.map((img, idx) => (
                              <div key={idx} className="relative h-full overflow-hidden group/img">
                                  <img 
                                    src={img.url} 
                                    alt="Gen" 
                                    className="w-full h-full object-cover opacity-80 group-hover/img:opacity-100 transition-opacity duration-500 scale-100 group-hover/img:scale-105" 
                                  />
                                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent translate-y-full group-hover/img:translate-y-0 transition-transform duration-300">
                                      <p className="text-xs text-white/90 font-mono border-l-2 border-indigo-500 pl-3">"{img.prompt}"</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </TiltCard>
          </div>
      </section>
    </div>
  );
};
