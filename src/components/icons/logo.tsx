import type { SVGProps } from 'react';

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 240 40"
    width="180"
    height="30"
    role="img"
    {...props}
  >
    <title>AI Jasa Edit Logo</title>
    <style>
      {
        `.logo-text { font-family: "Poppins", sans-serif; font-size: 28px; font-weight: 700; }`
      }
    </style>
    <text
      x="0"
      y="28"
      className="logo-text"
      fill="hsl(var(--accent))"
    >
      AI
    </text>
    <text
      x="40"
      y="28"
      className="logo-text"
      fill="hsl(var(--primary-foreground))"
    >
      Jasa Edit
    </text>
  </svg>
);

export default Logo;
