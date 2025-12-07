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
        <div className="my-4 rounded-3xl overflow-hidden ios-card relative min-h-[200px] sm:min-h-[280px] flex items-center justify-center w-full max-w-full animate-scale-in">
            {status === 'loading' && (
                <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-8 h-8 border-3 border-white/20 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            )}
            <img 
                src={src} alt={alt} 
                className={`w-full h-auto object-contain rounded-3xl transition-all duration-500 ${status === 'loaded' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                onLoad={() => setStatus('loaded')}
                onError={() => setStatus('error')}
                loading="lazy" 
            />
        </div>
    );
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onRegenerate, accentColor = '#007AFF' }) => {
  const isUser = message.role === 'user';
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyAll = () => {
    navigator.clipboard.writeText(message.text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4 sm:mb-6 animate-slide-up`}>
      <div className={`flex flex-col w-full max-w-[88%] sm:max-w-[75%] md:max-w-[65%] ${isUser ? 'items-end' : 'items-start'}`}>
          
          <div className="flex items-center gap-2 mb-2 px-1">
              <div className={`w-2 h-2 rounded-full ${isUser ? 'bg-blue-500' : 'bg-purple-500'} ${!isUser && message.isThinking ? 'animate-pulse' : ''}`}></div>
              <span className="text-[10px] text-white/40 font-medium">
                {isUser ? 'You' : 'JAI-NN'}
              </span>
              <span className="text-[10px] text-white/20 hidden sm:inline">
                {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
          </div>

          <div 
            className={`
              relative px-4 sm:px-5 py-3 sm:py-4 transition-all w-full
              ${isUser 
                ? 'rounded-[20px] rounded-br-md ios-glass-light shadow-lg' 
                : 'rounded-[20px] rounded-bl-md ios-card shadow-2xl'
              }
            `}
            style={{
               background: isUser ? `linear-gradient(135deg, ${accentColor}25 0%, ${accentColor}10 100%)` : undefined,
               borderLeft: isUser ? `3px solid ${accentColor}` : undefined,
            }}
          >
            <div className="prose prose-invert prose-sm max-w-none leading-relaxed break-words">
              {message.isThinking ? (
                 <div className="flex items-center gap-2 py-1">
                    <div className="flex gap-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-xs text-white/50 font-medium">Thinking...</span>
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
                        <code className="px-2 py-1 rounded-lg bg-white/10 font-mono text-xs text-blue-300 break-all" {...props}>
                          {children}
                        </code>
                      );
                    },
                    img: ({ src, alt }) => <ImageRenderer src={src} alt={alt} />,
                    p: ({ children }) => <p className="mb-3 last:mb-0 break-words text-[15px] leading-relaxed">{children}</p>,
                    a: ({ href, children }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline break-all">
                        {children}
                      </a>
                    ),
                    h1: ({ children }) => <h1 className="text-xl font-bold mb-3 mt-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-base font-semibold mb-2 mt-2">{children}</h3>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-3 border-white/30 pl-4 italic text-white/70 my-3">
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              )}
            </div>
          </div>
          
          {!isUser && !message.isThinking && (
              <div className="flex items-center gap-2 mt-2 px-1 opacity-0 hover:opacity-100 transition-opacity">
                  <button 
                    onClick={handleCopyAll} 
                    className="ios-button p-2 rounded-xl ios-glass-light hover:bg-white/15 transition-all" 
                    title="Copy"
                  >
                      <Icon name={isCopied ? "check" : "copy"} size={14} />
                  </button>
                  <button 
                    onClick={onRegenerate} 
                    className="ios-button p-2 rounded-xl ios-glass-light hover:bg-white/15 transition-all" 
                    title="Regenerate"
                  >
                      <Icon name="refresh" size={14} />
                  </button>
              </div>
          )}
      </div>
    </div>
  );
};
