import React, { useRef, useState, useEffect } from 'react';
import { Icon } from './Icon';
import { Tier } from '../types';

interface InputAreaProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  onStop: () => void;
  dailyImageCount: number;
  userTier: Tier;
  onUpgradeTrigger: () => void;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading, onStop, dailyImageCount, userTier }) => {
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
      if (e.key === 'Enter' && !e.shiftKey) { 
        e.preventDefault(); 
        handleSubmit(); 
      }
  };

  return (
    <div className="w-full flex flex-col items-center max-w-3xl mx-auto">
          {imageMode && (
            <div className="w-full mb-2 animate-slide-up">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl px-4 py-2 flex items-center gap-2 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                <span className="text-xs text-white/60 font-medium">Image Generation Mode</span>
                {userTier === Tier.Free && (
                  <span className="ml-auto text-[10px] text-white/40">{dailyImageCount}/5 used</span>
                )}
                <button 
                  onClick={() => setImageMode(false)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors active:scale-95"
                >
                  <Icon name="x" size={14} />
                </button>
              </div>
            </div>
          )}

          <div className="w-full bg-black/40 backdrop-blur-2xl border border-white/20 rounded-[28px] p-2 shadow-2xl">
              <div className="flex items-end gap-2">
                
                <button 
                    onClick={() => setImageMode(!imageMode)}
                    className={`shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center transition-all active:scale-95 ${
                      imageMode 
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30' 
                        : 'bg-white/10 hover:bg-white/15 text-white'
                    }`}
                >
                    <Icon name="image" size={20} />
                </button>

                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={imageMode ? "Describe what you want to create..." : "Message JAI-NN..."}
                  className="flex-1 bg-transparent border-0 focus:ring-0 text-white placeholder-white/30 resize-none py-3 px-2 max-h-[120px] text-[16px] font-normal leading-relaxed outline-none"
                  rows={1}
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                />

                <button
                      onClick={handleSubmit}
                      disabled={!input.trim() && !isLoading}
                      className={`shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center transition-all active:scale-95 ${
                            isLoading 
                              ? 'bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/30 animate-pulse' 
                              : input.trim() 
                                ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30' 
                                : 'bg-white/10 text-white/30 cursor-not-allowed'
                        }`}
                >
                      <Icon name={isLoading ? 'stop' : 'send'} size={20} />
                </button>
              </div>
          </div>
          
          <div className="flex items-center justify-center gap-3 mt-3 text-[10px] text-white/20 font-medium">
             <span>JAI-NN 3.0</span>
             <span className="w-1 h-1 rounded-full bg-white/20"></span>
             <span>Powered by Gemini</span>
          </div>
    </div>
  );
};
