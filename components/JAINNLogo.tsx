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
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="JAI-NN logo"
    >
      <defs>
        <linearGradient id="jaiGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0A84FF" />
          <stop offset="100%" stopColor="#5E5CE6" />
        </linearGradient>

        <filter id="logoGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* faint halo behind the ring to avoid 'square' artifacts */}
      <circle cx="50" cy="50" r="36" fill="url(#jaiGrad)" opacity="0.06" />

      {/* half-ring (open crescent) */}
      <path
        d="M78 36 A28 28 0 1 0 46 74"
        stroke="url(#jaiGrad)"
        strokeWidth="8.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* subtle inner contour for depth */}
      <path
        d="M78 36 A28 28 0 1 0 46 74"
        stroke="rgba(0,0,0,0.06)"
        strokeWidth="0.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* small centre core */}
      <circle cx="50" cy="50" r="2.5" fill="#0A84FF" opacity="0.95" />
    </svg>
  );
};

export default JAINNLogo;
