
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// Using Dracula theme for better coloring
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Icon } from './Icon';

interface CodeBlockProps {
  language: string;
  value: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl my-4 overflow-hidden shadow-lg border border-white/10 bg-[#1e1e1e] max-w-full w-full">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#2d2d2d] border-b border-white/5">
        <span className="text-xs font-mono uppercase tracking-wider text-white/50">{language || 'text'}</span>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 transition-colors text-[10px] font-medium text-white/80"
        >
          {copied ? <Icon name="check" size={12} /> : <Icon name="copy" size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Code Area */}
      <div className="relative overflow-x-auto max-h-[400px] overflow-y-auto ios-scrollbar">
        <SyntaxHighlighter
          language={language}
          style={dracula}
          showLineNumbers={true}
          lineNumberStyle={{ minWidth: '2em', paddingRight: '1em', color: 'rgba(255,255,255,0.2)', textAlign: 'right' }}
          wrapLines={false} // Prevents wrapping which breaks layout sometimes, scrolling is better for code
          customStyle={{ margin: 0, background: '#1e1e1e', padding: '1rem', fontSize: '0.85rem' }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
