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
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={animated ? 'animate-spin-slow' : ''}
      >
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#1d4ed8', stopOpacity: 1 }} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <path 
          d="M12 2.25C6.61522 2.25 2.25 6.61522 2.25 12C2.25 17.3848 6.61522 21.75 12 21.75C17.3848 21.75 21.75 17.3848 21.75 12C21.75 9.25164 20.6696 6.73357 18.8891 4.88909" 
          stroke="url(#logo-gradient)" 
          strokeWidth="2.5" 
          strokeLinecap="round"
          filter="url(#glow)"
        />
      </svg>
    </div>
  );
};
