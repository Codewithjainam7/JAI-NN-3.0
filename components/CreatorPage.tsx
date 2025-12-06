
import React from 'react';
import { Icon } from './Icon';
import { CREATOR_INFO } from '../constants';

interface CreatorPageProps {
  onBack: () => void;
}

export const CreatorPage: React.FC<CreatorPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen w-full bg-black text-white font-sans overflow-y-auto selection:bg-blue-500/30 relative">
      
      {/* Background Ambience - Aurora Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <nav className="relative z-20 max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
         <button 
            onClick={onBack} 
            className="group px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center gap-2 transition-all hover:-translate-x-1"
         >
             <Icon name="home" size={16} />
             <span className="text-sm font-medium">Back to Home</span>
         </button>
         <div className="flex items-center gap-2 text-xl font-bold tracking-tight animate-fade-in">
             <span className="text-blue-500"><Icon name="logo" size={24} /></span>
             JAI-NN
         </div>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-20 pt-10">
         <div className="liquid-glass p-8 md:p-16 rounded-[48px] border border-white/10 shadow-2xl shadow-blue-900/10 animate-slide-up">
            
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 mb-12">
                {/* Profile Image with Glow Effect */}
                <div className="relative shrink-0 group">
                   <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                   <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full p-1.5 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-sm">
                       <img 
                          src={CREATOR_INFO.avatar} 
                          alt={CREATOR_INFO.name}
                          className="w-full h-full rounded-full object-cover border-2 border-black shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                       />
                   </div>
                   <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center border-4 border-black text-white shadow-lg animate-bounce delay-1000">
                      <Icon name="code" size={16} />
                   </div>
                </div>

                <div className="text-center md:text-left flex-1">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight text-white animate-slide-up" style={{ animationDelay: '0.1s' }}>
                      {CREATOR_INFO.name}
                    </h1>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm font-mono border border-blue-500/20 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
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
                          className="px-8 py-3 bg-white text-black rounded-full text-sm font-bold hover:bg-blue-500 hover:text-white transition-all hover:scale-105 duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            View Portfolio
                        </a>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16 pt-16 border-t border-white/5">
                <div className="prose prose-invert animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                           <Icon name="users" size={18} />
                        </span>
                        About the Creator
                    </h3>
                    <p className="text-white/60 text-lg leading-relaxed">
                        {CREATOR_INFO.description}
                    </p>
                </div>
                
                <div className="prose prose-invert animate-slide-up" style={{ animationDelay: '0.5s' }}>
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                           <Icon name="zap" size={18} />
                        </span>
                        The Vision
                    </h3>
                    <p className="text-white/60 text-lg leading-relaxed">
                        JAI-NN represents the intersection of clean design and powerful logic. It was architected to demonstrate how modern AI interfaces should feel—fluid, responsive, and aesthetically invisible, allowing the intelligence to take center stage.
                    </p>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};
