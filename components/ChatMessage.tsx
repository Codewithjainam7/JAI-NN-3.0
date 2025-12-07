import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../types';
import { CodeBlock } from './CodeBlock';
import { Icon } from './Icon';

interface ChatMessageProps {
  message: Message;
  onRegenerate: () => void;
  accentColor?: string;
}

const ImageRenderer = ({ src, alt }: { src?: string; alt?: string }) => {
    const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

    return (
        <div className="my-4 rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black/40 relative min-h-[200px] sm:min-h-[300px] flex items-center justify-center w-full max-w-full sm:max-w-[500px]">
            {status === 'loading' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20 z-0">
                     <div className="w-full h-px bg-indigo-500/50 absolute top-0 animate-scan"></div>
                     <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 bg-black px-2 z-10 border border-white/10">RENDERING_ASSETS</span>
                </div>
            )}
            <img 
                src={src} alt={alt} 
                className={`relative z-10 w-full h-auto object-contain transition-all duration-700 ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setStatus('loaded')}
                onError={() => setStatus('error')}
                loading="eager" 
            />
        </div>
    );
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onRegenerate, accentColor = '#6366f1' }) => {
  const isUser = message.role === 'user';
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyAll = () => {
    navigator.clipboard.writeText(message.text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={`group flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex flex-col w-full max-w-[95%] sm:max-w-[85%] md:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
          
          <div className={`text-[9px] font-mono text-white/30 mb-2 px-2 flex items-center gap-2 uppercase tracking-widest`}>
              {isUser ? 'INPUT_STREAM' : 'SYSTEM_OUTPUT'}
              <span className={`w-1.5 h-1.5 rounded-full ${isUser ? 'bg-white/20' : 'bg-indigo-500 animate-pulse'}`}></span>
              <span className="hidden sm:inline">{new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>

          <div 
            className={`
              relative px-4 sm:px-6 py-4 sm:py-5 transition-all backdrop-blur-md w-full
              ${isUser 
                ? 'rounded-[20px] rounded-tr-sm border border-white/10 bg-white/5' 
                : 'smoked-glass rounded-[20px] rounded-tl-sm shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
              }
            `}
            style={{
               borderColor: isUser ? `${accentColor}40` : undefined,
               boxShadow: isUser ? `0 0 20px ${accentColor}10` : undefined,
               maxHeight: isUser ? '400px' : undefined,
               overflowY: isUser ? 'auto' : undefined,
            }}
          >
            {/* Tech accents for AI */}
            {!isUser && (
                <>
                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/20 rounded-tl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/20 rounded-br-xl"></div>
                </>
            )}

            <div className="prose prose-invert prose-sm max-w-none leading-relaxed font-light break-words">
              {message.isThinking ? (
                 <div className="flex items-center gap-3 py-2">
                    <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                    <span className="text-xs font-mono text-indigo-400/70 tracking-widest">PROCESSING</span>
                 </div>
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />
                      ) : (
                        <code className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-xs text-indigo-300 border border-white/5 break-all" {...props}>
                          {children}
                        </code>
                      );
                    },
                    img: ({ src, alt }) => <ImageRenderer src={src} alt={alt} />,
                    p: ({ children }) => <p className="mb-3 last:mb-0 break-words">{children}</p>,
                    a: ({ href, children }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline break-all">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              )}
            </div>
          </div>
          
          {!isUser && !message.isThinking && (
              <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-2">
                  <button onClick={handleCopyAll} className="p-1.5 rounded hover:bg-white/10 text-white/30 hover:text-white transition-colors" title="Copy">
                      <Icon name="copy" size={14} />
                  </button>
                  <button onClick={onRegenerate} className="p-1.5 rounded hover:bg-white/10 text-white/30 hover:text-white transition-colors" title="Regenerate">
                      <Icon name="refresh" size={14} />
                  </button>
                  <div className="h-3 w-px bg-white/10 mx-1"></div>
                  <button className="text-[10px] font-mono text-white/30 hover:text-white transition-colors hidden sm:inline">REPORT_OUTLIER</button>
              </div>
          )}
      </div>
    </div>
  );
};
