
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

export const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading, onStop, dailyImageCount, userTier, onUpgradeTrigger }) => {
  const [input, setInput] = useState('');
  const [imageMode, setImageMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput((prev) => prev + (prev ? ' ' : '') + transcript);
            setIsListening(false);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
        alert("Voice recognition not supported in this browser.");
        return;
    }
    if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
    } else {
        recognitionRef.current.start();
        setIsListening(true);
    }
  };

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [input]);

  const toggleImageMode = () => {
    setImageMode(!imageMode);
  };

  const handleSubmit = () => {
    if (!input.trim() && !isLoading) return;
    if (isLoading) {
        onStop();
        return;
    }
    const textToSend = imageMode ? `/imagine ${input}` : input;
    onSend(textToSend);
    setInput('');
    setImageMode(false); 
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full flex flex-col items-center max-h-[200px]">
          
          {/* Image Mode Indicator */}
          {imageMode && (
            <div className="w-full flex items-center justify-between mb-2 px-3 py-1.5 bg-purple-500/20 backdrop-blur-md rounded-lg border border-purple-500/30 animate-fade-in">
                <div className="flex items-center gap-2">
                    <Icon name="image" className="text-purple-400" size={14} />
                    <span className="text-xs font-medium text-purple-200">Image Gen Active</span>
                </div>
                <span className="text-[10px] text-purple-300/60">{dailyImageCount}/5</span>
            </div>
          )}

          <div className="w-full relative flex items-end gap-2 p-1.5 md:p-2 rounded-[24px] bg-[#1c1c1e] border border-white/10 transition-all focus-within:ring-1 focus-within:ring-white/20">
            
            {/* Left Actions */}
            <div className="hidden sm:flex items-center gap-1 pl-1 mb-1">
              <button className="p-2 rounded-full hover:bg-white/10 text-white/60 transition-colors">
                <Icon name="plus" size={20} />
              </button>
              <button 
                onClick={toggleImageMode}
                className={`p-2 rounded-full transition-colors ${imageMode ? 'bg-purple-500 text-white' : 'hover:bg-white/10 text-white/60'}`}
              >
                <Icon name="image" size={20} />
              </button>
            </div>

            <button 
                onClick={toggleImageMode}
                className={`sm:hidden p-2 mb-1 rounded-full transition-colors ${imageMode ? 'bg-purple-500 text-white' : 'hover:bg-white/10 text-white/60'}`}
              >
                <Icon name="image" size={20} />
            </button>

            {/* Text Input */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={imageMode ? "Describe image..." : "Message..."}
              className="flex-1 bg-transparent border-0 focus:ring-0 text-white placeholder-white/40 resize-none py-3 px-2 max-h-[120px] custom-scrollbar text-[15px] md:text-[16px] leading-relaxed outline-none"
              rows={1}
              style={{ minHeight: '44px' }}
            />

            {/* Right Actions */}
            <div className="flex items-center gap-1 mb-1 pr-1">
                <button
                    onClick={toggleVoice}
                    className={`p-2 rounded-full transition-colors ${
                        isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'hover:bg-white/10 text-white/60'
                    }`}
                >
                    <Icon name="mic" size={20} />
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!input.trim() && !isLoading}
                  className={`w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full transition-all duration-300 
                    ${isLoading 
                        ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' 
                        : input.trim() 
                            ? 'bg-[#007AFF] text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600' 
                            : 'bg-white/10 text-white/30 cursor-not-allowed'
                    }`}
                >
                  <Icon name={isLoading ? 'stop' : 'send'} size={18} className={isLoading ? "" : "ml-0.5"} />
                </button>
            </div>
          </div>
          
          <div className="text-center mt-2 text-[10px] text-white/20 hidden md:block">
            JAI-NN 2.0 can make mistakes. Verify important info.
          </div>
    </div>
  );
};
