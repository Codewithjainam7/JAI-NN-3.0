import React from 'react';

interface JAINNLogoProps {
  size?: number;
  className?: string;
}

export const JAINNLogo: React.FC<JAINNLogoProps> = ({ size = 40, className = '' }) => {
  const s = size;
  // We'll draw an open circular arc (half/partial ring) using an SVG path (arc segment)
  // so the mark looks like a clean crescent/half-ring.
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
        <linearGradient id="jaiGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0A84FF" />
          <stop offset="100%" stopColor="#5E5CE6" />
        </linearGradient>

        <filter id="softBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" result="g" />
          <feMerge>
            <feMergeNode in="g" />
            <feMergeNode in="g" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* subtle halo behind the ring */}
      <circle cx="50" cy="50" r="34" fill="url(#jaiGradient)" opacity="0.06" filter="url(#softBlur)" />

      {/* Half-ring: use an arc path that leaves a small gap to emphasise the crescent */}
      {/* Path drawn from ~60deg to ~300deg to look like a semi-open ring */}
      <path
        d="M78 36
           A28 28 0 1 0 46 74"
        stroke="url(#jaiGradient)"
        strokeWidth="8.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeOpacity="0.98"
        filter="url(#glow)"
      />

      {/* Inner subtle ring shadow to add depth */}
      <path
        d="M78 36
           A28 28 0 1 0 46 74"
        stroke="black"
        strokeWidth="0.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.06"
      />

      {/* small accent dot that orbits subtly (slow rotation) */}
      <g transform="translate(50,50)">
        <circle cx="18" cy="-8" r="3.6" fill="#5E5CE6" opacity="0.95">
          <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0" to="360" dur="8s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* tiny center core */}
      <circle cx="50" cy="50" r="2.3" fill="#0A84FF" opacity="0.95" />
    </svg>
  );
};

export default JAINNLogo;
