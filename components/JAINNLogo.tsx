import React from 'react';

interface JAINNLogoProps {
  size?: number;
  className?: string;
}

export const JAINNLogo: React.FC<JAINNLogoProps> = ({ size = 40, className = '' }) => {
  const s = size;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="JAI-NN Logo"
    >
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0A84FF" />
          <stop offset="100%" stopColor="#5E5CE6" />
        </linearGradient>
        <filter id="blurGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background soft glow */}
      <circle cx="50" cy="50" r="40" fill="url(#g1)" opacity="0.06" filter="url(#blurGlow)" />

      {/* Stylized C ring */}
      <g transform="translate(0,0)">
        <path
          d="M70 30 A20 20 0 1 0 50 74"
          stroke="url(#g1)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeOpacity="0.95"
        />
        {/* small rotating accent */}
        <g transform="translate(50,50)">
          <circle cx="18" cy="-6" r="4" fill="#5E5CE6" opacity="0.9">
            <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0" to="360" dur="6s" repeatCount="indefinite" />
          </circle>
        </g>
      </g>

      {/* tiny inner dot */}
      <circle cx="50" cy="50" r="3.5" fill="#0A84FF" opacity="0.95" />
    </svg>
  );
};

export default JAINNLogo;
