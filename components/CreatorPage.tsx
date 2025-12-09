import React from 'react';
import { Icon } from './Icon';
import { CREATOR_INFO } from '../constants';
interface CreatorPageProps {
  onBack: () => void;
}

export const CreatorPage: React.FC<CreatorPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen w-full bg-black text-white font-sans overflow-y-auto selection:bg-indigo-500/30 relative">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none ios26-gradient">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <nav className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 py-8 flex items-center justify-between">
         <button 
            onClick={onBack} 
            className="group px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center gap-3 transition-all"
         >
             <Icon name="arrow-right" size={16} className="rotate-180 text-white/60 group-hover:text-white" />
             <span className="text-sm font-medium">Back</span>
         </button>
         <div className="flex items-center gap-2 text-xl font-bold tracking-tight animate-fade-in opacity-50">
             JAI-NN 3.0
         </div>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-20 pt-10">
         <div className="smoked-glass p-6 sm:p-8 md:p-16 rounded-[48px] border border-white/10 shadow-2xl shadow-indigo-900/10 animate-slide-up">
            
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 mb-12">
                {/* Profile Image with Glow Effect */}
                <div className="relative shrink-0 group">
                   <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                   <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full p-1.5 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-sm">
                       <img 
                          src={CREATOR_INFO.avatar} 
                          alt={CREATOR_INFO.name}
                          className="w-full h-full rounded-full object-cover border-2 border-black shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                       />
                   </div>
                   <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center border-4 border-black text-white shadow-lg animate-bounce delay-1000">
                      <Icon name="code" size={20} />
                   </div>
                </div>

                <div className="text-center md:text-left flex-1">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight text-white animate-slide-up" style={{ animationDelay: '0.1s' }}>
                      {CREATOR_INFO.name}
                    </h1>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-sm border border-indigo-500/20 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <Icon name="cpu" size={14} />
                        {CREATOR_INFO.title}
                    </div>
                    
                    <div className="flex items-center justify-center md:justify-start gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <a 
                          href={CREATOR_INFO.github} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="p-3 bg-white/5 rounded-full hover:bg-white text-white hover:text-black transition-all hover:scale-110 duration-300 border border-white/5"
                        >
                            <Icon name="github" size={24} />
                        </a>
                        <a 
                          href={CREATOR_INFO.website} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="px-6 sm:px-8 py-3 bg-white text-black rounded-full text-xs font-bold tracking-widest hover:bg-indigo-500 hover:text-white transition-all hover:scale-105 duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            VIEW PORTFOLIO
                        </a>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-16 pt-16 border-t border-white/5">
                <div className="prose prose-invert animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                           <Icon name="users" size={20} />
                        </span>
                        About the Creator
                    </h3>
                    <p className="text-white/60 leading-relaxed font-light text-sm sm:text-base">
                        {CREATOR_INFO.description}
                    </p>
                </div>
                
                <div className="prose prose-invert animate-slide-up" style={{ animationDelay: '0.5s' }}>
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/20 flex items-center justify-center text-purple-400">
                           <Icon name="zap" size={20} />
                        </span>
                        System Architecture
                    </h3>
                    <p className="text-white/60 leading-relaxed font-light text-sm sm:text-base">
                        JAI-NN represents the intersection of clean design and powerful logic. Architected to demonstrate how modern AI interfaces should feel—fluid, responsive, and aesthetically invisible.
                    </p>
                </div>
            </div>
         </div>
      </div>

      <footer className="relative z-10 border-t border-white/10 py-8 text-center text-white/40 text-xs sm:text-sm px-4">
        <p>JAI-NN 3.0 • Powered by Gemini 2.5 • Built with ❤️</p>
      </footer>
    </div>
  );
};
