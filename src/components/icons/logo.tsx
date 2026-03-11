import type { SVGProps } from 'react';

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 40"
    width="200"
    height="40"
    role="img"
    aria-label="AI Jasa Edit"
    {...props}
  >
    <defs>
      <linearGradient id="logo-word-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#22d3ee" />
      </linearGradient>
      <linearGradient id="logo-badge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9333ea" />
        <stop offset="50%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
      <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Badge background - hexagon-like rounded shape */}
    <path
      d="M18,2 L22,2 Q38,2 38,18 L38,22 Q38,38 22,38 L18,38 Q2,38 2,22 L2,18 Q2,2 18,2 Z"
      fill="url(#logo-badge-grad)"
    />

    {/* Inner highlight */}
    <path
      d="M18,3 L22,3 Q37,3 37,12 L3,12 Q3,3 18,3 Z"
      fill="white"
      fillOpacity="0.12"
    />

    {/* Sparkle top-right */}
    <g filter="url(#logo-glow)">
      <path d="M31,8 L32,6 L33,8 L35,9 L33,10 L32,12 L31,10 L29,9 Z" fill="white" fillOpacity="0.9" />
    </g>
    <circle cx="27" cy="10" r="1.2" fill="white" fillOpacity="0.5" />

    {/* AI text in badge */}
    <text
      x="20"
      y="26"
      textAnchor="middle"
      fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif"
      fontSize="17"
      fontWeight="800"
      fill="white"
      letterSpacing="-0.5"
    >
      AI
    </text>

    {/* Wordmark — "AI" with gradient */}
    <text
      x="48"
      y="27"
      fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif"
      fontSize="20"
      fontWeight="800"
      fill="url(#logo-word-grad)"
      letterSpacing="-0.3"
    >
      AI
    </text>

    {/* Wordmark — "Jasa Edit" */}
    <text
      x="74"
      y="27"
      fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif"
      fontSize="20"
      fontWeight="600"
      fill="currentColor"
      fillOpacity="0.92"
      letterSpacing="-0.2"
    >
      {' '}Jasa Edit
    </text>
  </svg>
);

export default Logo;
