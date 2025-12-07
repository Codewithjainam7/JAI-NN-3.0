import React from 'react';

interface JAINNLogoProps {
  size?: number;
  animated?: boolean;
  className?: string;
}

export const JAINNLogo: React.FC<JAINNLogoProps> = ({ 
  size = 40, 
  animated = false,
  className = "" 
}) => {
  return (
    <div 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 200 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={animated ? 'animate-spin-slow' : ''}
      >
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#EC4899', stopOpacity: 1 }} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Outer Ring */}
        <circle 
          cx="100" 
          cy="100" 
          r="85" 
          stroke="url(#logo-gradient)" 
          strokeWidth="8" 
          fill="none"
          opacity="0.8"
          filter="url(#glow)"
        />
        
        {/* Neural Network Nodes */}
        <circle cx="100" cy="50" r="12" fill="url(#logo-gradient)" />
        <circle cx="140" cy="80" r="10" fill="url(#logo-gradient)" />
        <circle cx="140" cy="120" r="10" fill="url(#logo-gradient)" />
        <circle cx="100" cy="150" r="12" fill="url(#logo-gradient)" />
        <circle cx="60" cy="120" r="10" fill="url(#logo-gradient)" />
        <circle cx="60" cy="80" r="10" fill="url(#logo-gradient)" />
        
        {/* Center Core */}
        <circle cx="100" cy="100" r="20" fill="url(#logo-gradient)" opacity="0.3" />
        <circle cx="100" cy="100" r="8" fill="url(#logo-gradient)" />
      </svg>
    </div>
  );
};
