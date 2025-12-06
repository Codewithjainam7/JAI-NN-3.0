
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

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onRegenerate, accentColor = '#007AFF' }) => {
  const isUser = message.role === 'user';
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyAll = () => {
    navigator.clipboard.writeText(message.text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
      const blob = new Blob([message.text], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `response-${message.id}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  return (
    <div className={`group flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex flex-col w-full max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
          <div 
            className={`
              relative px-5 py-4 overflow-hidden
              ${isUser 
                ? 'text-white rounded-[24px] rounded-br-md shadow-lg custom-scrollbar border border-white/5' 
                : 'glass-panel text-gray-100 rounded-[24px] rounded-bl-md border border-white/5'
              }
              animate-fade-in
            `}
            style={{
               backgroundColor: isUser ? accentColor : undefined,
               boxShadow: isUser ? `0 8px 32px -8px ${accentColor}60` : undefined,
               maxHeight: isUser ? '300px' : undefined, // STRICT LIMIT on user messages
               overflowY: isUser ? 'auto' : undefined
            }}
          >
            {/* Model Icon for AI messages */}
            {!isUser && (
               <div className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center border border-white/10 backdrop-blur-sm hidden md:flex">
                  <Icon name="logo" size={18} />
               </div>
            )}

            <div className="prose prose-invert prose-sm max-w-none leading-relaxed break-words">
              {message.isThinking ? (
                 <div className="flex space-x-1.5 py-2">
                    <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                    <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                 </div>
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <CodeBlock
                          language={match[1]}
                          value={String(children).replace(/\n$/, '')}
                        />
                      ) : (
                        <code className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-sm text-white/90 break-all" {...props}>
                          {children}
                        </code>
                      );
                    },
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-4 rounded-lg border border-white/10 max-w-full bg-white/5">
                        <table className="min-w-full divide-y divide-white/10">{children}</table>
                      </div>
                    ),
                    thead: ({ children }) => <thead className="bg-white/5">{children}</thead>,
                    th: ({ children }) => <th className="px-4 py-3 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">{children}</th>,
                    td: ({ children }) => <td className="px-4 py-3 whitespace-nowrap text-sm text-white/80 border-t border-white/5">{children}</td>,
                    p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                    a: ({ children, href }) => <a href={href} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline cursor-pointer break-all">{children}</a>,
                    img: ({ src, alt }) => (
                      <div className="my-4 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/30 relative min-h-[200px] flex items-center justify-center group/img">
                        <div className="absolute inset-0 flex items-center justify-center text-white/20">
                            <Icon name="image" size={32} />
                        </div>
                        <img 
                            src={src} 
                            alt={alt} 
                            className="relative z-10 w-full h-auto object-cover max-h-[500px] transition-transform duration-500 group-hover/img:scale-105" 
                            loading="lazy" 
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).parentElement!.innerHTML = `<div class="p-8 text-center text-white/40 text-sm flex flex-col items-center gap-2"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>Image generation failed or expired.</div>`;
                            }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity z-20">
                            <p className="text-xs text-white/80 truncate">{alt}</p>
                        </div>
                      </div>
                    )
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              )}
            </div>
          </div>
          
          {/* Action Bar (AI Only) */}
          {!isUser && !message.isThinking && (
              <div className="flex items-center gap-2 mt-2 ml-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                  <button onClick={handleCopyAll} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors" title="Copy">
                      {isCopied ? <Icon name="check" size={14} /> : <Icon name="copy" size={14} />}
                  </button>
                  <button onClick={onRegenerate} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors" title="Regenerate">
                      <Icon name="refresh" size={14} />
                  </button>
                   <button onClick={handleDownload} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors" title="Download">
                      <Icon name="download" size={14} />
                  </button>
                  <div className="w-px h-3 bg-white/10 mx-1"></div>
                  <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                      <Icon name="thumbs-up" size={14} />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                      <Icon name="thumbs-down" size={14} />
                  </button>
              </div>
          )}
      </div>
    </div>
  );
};
