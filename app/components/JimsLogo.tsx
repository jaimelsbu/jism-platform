// app/components/JimsLogo.tsx
import React from 'react';

interface JimsLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export const JimsLogo = ({ size = 32, showText = true, className = '' }: JimsLogoProps) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Icon mark: stylised "J" inside a hex-ish rounded square */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="JIMS logo mark"
      >
        <defs>
          <linearGradient id="jims-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6ea8fe" />
            <stop offset="100%" stopColor="#b98fff" />
          </linearGradient>
          <linearGradient id="jims-border" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4d8eff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#9b59ff" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Background square with rounded corners */}
        <rect x="1" y="1" width="38" height="38" rx="10" fill="#131a2e" />
        <rect x="1" y="1" width="38" height="38" rx="10" fill="none" stroke="url(#jims-border)" strokeWidth="1.5" />

        {/* Subtle inner glow */}
        <rect x="4" y="4" width="32" height="32" rx="8"
          fill="url(#jims-grad)" fillOpacity="0.06" />

        {/* "J" letterform — bold, geometric */}
        {/* Vertical stroke */}
        <rect x="22" y="10" width="5" height="16" rx="2.5" fill="url(#jims-grad)" />
        {/* Bottom curve of J — arc simulation with a rounded rect */}
        <rect x="13" y="22" width="14" height="5" rx="2.5" fill="url(#jims-grad)" />
        {/* Left foot */}
        <rect x="13" y="18" width="5" height="9" rx="2.5" fill="url(#jims-grad)" />

        {/* Top crossbar accent */}
        <rect x="14" y="10" width="13" height="3" rx="1.5" fill="url(#jims-grad)" fillOpacity="0.45" />
      </svg>

      {showText && (
        <span
          style={{
            fontSize: size * 0.55,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            background: 'linear-gradient(120deg, #e2ecff 0%, #c8b8ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          JIMS
        </span>
      )}
    </div>
  );
};
