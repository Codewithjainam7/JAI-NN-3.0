import React, { useRef, useState, useEffect } from 'react';
import { Icon } from './Icon';
import { Tier } from '../types';
import { TiltCard } from './TiltCard';

interface InputAreaProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  onStop: () => void;
  dailyImageCount: number;
  userTier: Tier;
  onUpgradeTrigger: () => void;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading, onStop }) => {
  const [input, setInput] = useState('');
  const [imageMode, setImageMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    if (!input.trim() && !isLoading) return;
    if (isLoading) { onStop(); return; }
    onSend(imageMode ? `/imagine ${input}` : input);
    setInput('');
    setImageMode(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  return (
    <div className="w-full flex flex-col items-center pb-2 max-w-3xl mx-auto">
          {imageMode && (
            <div className="w-full flex items-center justify-between mb-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-t-lg animate-fade-in mx-2">
                <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                    VISUAL_SYNTHESIS_ACTIVE
                </span>
            </div>
          )}

          <TiltCard className="w-full rounded-[2rem]">
              <div className={`relative flex items-end gap-2 p-2 rounded-[2rem] bg-[#050505] border border-white/10 transition-all duration-300 focus-within:border-indigo-500/50 focus-within:shadow-[0_0_30px_rgba(99,102,241,0.15)] ${isLoading ? 'border-indigo-500/30' : ''}`}>
                
                {isLoading && (
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-scan opacity-50"></div>
                )}

                <button 
                    onClick={() => setImageMode(!imageMode)}
                    className={`p-3 rounded-full transition-colors shrink-0 ${imageMode ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'hover:bg-white/5 text-white/40 hover:text-white'}`}
                >
                    <Icon name="image" size={20} />
                </button>

                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={imageMode ? "Describe visual parameters..." : "Input command..."}
                  className="flex-1 bg-transparent border-0 focus:ring-0 text-white placeholder-white/20 resize-none py-3 px-2 max-h-[120px] custom-scrollbar text-[15px] font-medium leading-relaxed outline-none"
                  rows={1}
                />

                <button
                      onClick={handleSubmit}
                      disabled={!input.trim() && !isLoading}
                      className={`w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 shrink-0 ${
                            isLoading ? 'bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse' : 
                            input.trim() ? 'bg-white text-black hover:bg-indigo-50 hover:text-indigo-900 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 
                            'bg-white/5 text-white/20 cursor-not-allowed'
                        }`}
                >
                      <Icon name={isLoading ? 'stop' : 'send'} size={20} />
                </button>
              </div>
          </TiltCard>
          
          <div className="flex items-center justify-center gap-4 mt-3 text-[9px] font-mono text-white/20 tracking-[0.2em] uppercase">
             <span>JAI-NN_OS_V3.0</span>
             <span className="w-1 h-1 rounded-full bg-white/20"></span>
             <span>SECURE_CHANNEL</span>
          </div>
    </div>
  );
};