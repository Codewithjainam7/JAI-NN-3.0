
import React from 'react';
import { Icon } from './Icon';
import { CREATOR_INFO } from '../constants';

interface CreatorPageProps {
  onBack: () => void;
}

export const CreatorPage: React.FC<CreatorPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 overflow-y-auto">
      <nav className="max-w-4xl mx-auto mb-12 flex items-center justify-between">
         <button onClick={onBack} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
             <Icon name="home" size={20} />
             <span>Back to Home</span>
         </button>
         <div className="flex items-center gap-2 text-xl font-bold">
             <Icon name="logo" size={24} />
             JAI-NN
         </div>
      </nav>

      <div className="max-w-3xl mx-auto">
         <div className="glass-panel p-8 md:p-12 rounded-[40px] border border-white/10 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 p-1 shrink-0">
                   <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                       <span className="text-3xl font-bold text-white/40">JJ</span>
                   </div>
                </div>
                <div className="text-center md:text-left">
                    <h1 className="text-4xl font-bold mb-2">{CREATOR_INFO.name}</h1>
                    <div className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-mono border border-blue-500/30 mb-4">
                        {CREATOR_INFO.title}
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-4">
                        <a href={CREATOR_INFO.github} target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white transition-colors">
                            <Icon name="github" size={20} />
                        </a>
                        <a href={CREATOR_INFO.website} target="_blank" rel="noreferrer" className="px-4 py-1.5 bg-white text-black rounded-full text-sm font-bold hover:bg-white/90 transition-colors">
                            Portfolio
                        </a>
                    </div>
                </div>
            </div>
            
            <div className="prose prose-invert max-w-none">
                <h3 className="text-xl font-bold mb-4">About the Creator</h3>
                <p className="text-white/70 text-lg leading-relaxed mb-6">
                    {CREATOR_INFO.description}
                </p>
                
                <h3 className="text-xl font-bold mb-4">The Vision for JAI-NN</h3>
                <p className="text-white/70 text-lg leading-relaxed mb-6">
                    JAI-NN was conceived as an experiment to bridge the gap between rigid command-line interfaces and organic human conversation. By leveraging the latest in Generative AI, specifically the Gemini 2.5 architecture, JAI-NN aims to be more than just a chatbot—it's a reasoning engine designed to assist with complex tasks ranging from creative writing to full-stack development.
                </p>
            </div>
         </div>
      </div>
    </div>
  );
};
