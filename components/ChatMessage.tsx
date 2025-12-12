import React, { useState, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../types';
import { CodeBlock } from './CodeBlock';
import { Icon } from './Icon';
import { JAINNLogo } from './JAINNLogo';

interface ChatMessageProps {
  message: Message;
  onRegenerate: () => void;
  accentColor?: string;
}

const ImageRenderer = memo(({ src, alt }: { src?: string; alt?: string }) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <div className="my-3 rounded-3xl overflow-hidden ios-glass relative min-h-[220px] flex items-center justify-center w-full animate-scale-in" style={{ maxWidth: '100%' }}>
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="w-8 h-8 loading-spinner"></div>
        </div>
      )}
      <img 
        src={src} 
        alt={alt || 'Generated image'} 
        className={`w-full h-auto object-contain rounded-3xl transition-all duration-500 ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
        style={{ maxWidth: '100%', maxHeight: '500px' }}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        loading="lazy" 
      />
    </div>
  );
});

ImageRenderer.displayName = 'ImageRenderer';

export const ChatMessage: React.FC<ChatMessageProps> = memo(({ message, onRegenerate, accentColor = '#007AFF' }) => {
  const isUser = message.role === 'user';
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyAll = () => {
    navigator.clipboard.writeText(message.text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    // Container aligns messages; use w-full but bubble itself uses inline/w-fit so it shrinks to content
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-slide-up mb-4 px-2 sm:px-0`}>
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[92%]`}>
        
        {/* Avatar & Name */}
        <div className="flex items-center gap-2 mb-2 px-1">
          {!isUser && (
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 p-0.5">
              <JAINNLogo size={18} />
            </div>
          )}
          <span className="text-[11px] text-white/50 font-medium font-mono tracking-wide">
            {isUser ? 'YOU' : 'JAI-NN'}
          </span>
          {isUser && (
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold">Y</span>
            </div>
          )}
        </div>

        {/* Message Bubble */}
        <div 
          className={`
            relative px-4 py-3 transition-all chat-message inline-block w-fit
            ${isUser 
              ? 'rounded-[22px] rounded-br-md shadow-lg shadow-blue-500/10' 
              : 'rounded-[22px] rounded-bl-md shadow-xl smoked-glass'
            }
          `}
          style={{
            background: isUser ? `linear-gradient(135deg, ${accentColor}20 0%, ${accentColor}08 100%)` : undefined,
            borderLeft: isUser ? `2px solid ${accentColor}` : undefined,
            maxWidth: '85vw',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            display: 'inline-block'
          }}
        >
          <div className="prose prose-invert prose-sm max-w-none" style={{ maxWidth: '100%' }}>
            {message.isThinking ? (
              <div className="flex items-center gap-2 py-1">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-xs text-white/40 font-mono">Processing...</span>
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
                      <code 
                        className="px-2 py-0.5 rounded-lg bg-white/10 font-mono text-xs text-blue-300" 
                        style={{ wordBreak: 'break-all', overflowWrap: 'break-word' }}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  img: ({ src, alt }) => <ImageRenderer src={src} alt={alt} />,
                  p: ({ children }) => (
                    <p 
                      className="mb-2 last:mb-0 text-sm text-white/90 leading-relaxed" 
                      style={{ wordWrap: 'break-word', overflowWrap: 'break-word', maxWidth: '100%' }}
                    >
                      {children}
                    </p>
                  ),
                  a: ({ href, children }) => (
                    <a 
                      href={href} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-400 hover:text-blue-300 underline"
                      style={{ wordBreak: 'break-all' }}
                    >
                      {children}
                    </a>
                  ),
                  h1: ({ children }) => <h1 className="text-xl font-bold mb-2 mt-3">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-semibold mb-2">{children}</h3>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1 ml-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1 ml-2">{children}</ol>,
                  li: ({ children }) => <li className="text-sm text-white/85">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="pl-4 border-l-2 border-white/10 italic text-white/70">{children}</blockquote>
                  )
                }}
              >
                {message.text}
              </ReactMarkdown>
            )}
          </div>

          {/* Actions */}
          <div className="absolute -bottom-5 right-3 flex items-center gap-2">
            <button onClick={handleCopyAll} className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-white/60 text-xs">
              {isCopied ? <Icon name="check" size={12} /> : <Icon name="copy" size={12} />}
            </button>
            {!isUser && (
              <button onClick={onRegenerate} className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-white/60 text-xs">
                <Icon name="refresh" size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ChatMessage;
