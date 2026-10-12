import React from 'react';
import logoImg from '../assets/images/tme_logo_official_1787233465313.jpg';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'icon-only' | 'image';
  theme?: 'light' | 'dark'; // 'light' means on light background (dark text), 'dark' means on dark background (white text)
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'full',
  theme = 'light',
  size = 'md'
}) => {
  const isDark = theme === 'dark';
  const navyColor = isDark ? '#FFFFFF' : '#0B2545';
  const subtextColor = isDark ? '#94A3B8' : '#0B2545';
  const greenAccent = '#10B981';

  // If explicit image rendering is requested
  if (variant === 'image') {
    const heightClass =
      size === 'sm' ? 'h-8' : size === 'md' ? 'h-10 sm:h-12' : size === 'lg' ? 'h-14 sm:h-16' : 'h-20';
    return (
      <div className={`inline-flex items-center ${className}`}>
        <img
          src={logoImg}
          alt="TOUBA MADIYINA ELECTRONICS SHOP"
          referrerPolicy="no-referrer"
          className={`${heightClass} w-auto object-contain rounded-lg`}
        />
      </div>
    );
  }

  // Icon only: The distinctive TME stylized emblem
  if (variant === 'icon-only') {
    const iconDim = size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-10 h-10' : size === 'lg' ? 'w-12 h-12' : 'w-16 h-16';
    return (
      <div className={`relative flex items-center justify-center ${iconDim} ${className}`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background badge rounded */}
          <rect width="100" height="100" rx="20" fill={isDark ? '#0F172A' : '#F1F5F9'} />
          <rect width="100" height="100" rx="20" stroke={isDark ? '#334155' : '#E2E8F0'} strokeWidth="2" />
          
          {/* T letter navy base */}
          <path
            d="M20 24 H52 V36 H42 V78 H28 V36 H20 V24 Z"
            fill={isDark ? '#38BDF8' : '#0B2545'}
          />
          {/* Green electric lightning bolt & circuit tracks inside T */}
          <path
            d="M38 18 L26 44 H35 L28 66 L46 38 H36 L44 18 Z"
            fill={greenAccent}
          />
          {/* Solder circuit nodes */}
          <circle cx="23" cy="52" r="3.5" fill={greenAccent} />
          <path d="M23 52 L31 46" stroke={greenAccent} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="43" cy="48" r="3.5" fill={greenAccent} />
          <path d="M43 48 L35 55" stroke={greenAccent} strokeWidth="2.5" strokeLinecap="round" />

          {/* ME Letters */}
          {/* M */}
          <path
            d="M52 32 H59 L66 54 L73 32 H80 V78 H73 V47 L67 67 H64 L58 47 V78 H52 V32 Z"
            fill={navyColor}
          />
        </svg>
      </div>
    );
  }

  // Full / Compact Brand Logo with Vector Precision
  const scale = size === 'sm' ? 0.75 : size === 'md' ? 0.95 : size === 'lg' ? 1.2 : 1.5;

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* High-definition Vector Logo SVG matching the user's provided asset */}
      <svg
        width={variant === 'compact' ? 140 * scale : 200 * scale}
        height={variant === 'compact' ? 44 * scale : 56 * scale}
        viewBox="0 0 320 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-auto h-9 sm:h-11 max-w-full"
      >
        {/* === TME MONOGRAM SECTION === */}
        {/* Letter 'T' in Navy with cutouts for circuit */}
        <g id="letter-T">
          {/* Top Bar of T */}
          <path
            d="M 12 12 H 68 V 26 H 50 V 78 H 30 V 26 H 12 V 12 Z"
            fill={navyColor}
          />
          
          {/* Green Electric Lightning Bolt cutting through T */}
          <path
            d="M 44 4 L 26 40 H 40 L 29 74 L 54 36 H 38 L 52 4 Z"
            fill={greenAccent}
          />
          
          {/* Electric Circuit Board Nodes & Traces */}
          <circle cx="22" cy="50" r="4.5" fill={greenAccent} />
          <path d="M 22 50 L 33 42" stroke={greenAccent} strokeWidth="3.5" strokeLinecap="round" />
          
          <circle cx="50" cy="46" r="4.5" fill={greenAccent} />
          <path d="M 50 46 L 41 56" stroke={greenAccent} strokeWidth="3.5" strokeLinecap="round" />
          
          {/* Diagonal PCB accents on bottom left */}
          <path d="M 24 64 L 32 74" stroke={greenAccent} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 24 72 L 29 78" stroke={greenAccent} strokeWidth="3.5" strokeLinecap="round" />
        </g>

        {/* Letter 'M' in Navy */}
        <path
          d="M 78 24 H 90 L 104 56 L 118 24 H 130 V 78 H 117 V 44 L 106 68 H 101 L 91 44 V 78 H 78 V 24 Z"
          fill={navyColor}
        />

        {/* Letter 'E' in Navy */}
        <path
          d="M 140 24 H 178 V 36 H 154 V 45 H 174 V 56 H 154 V 66 H 178 V 78 H 140 V 24 Z"
          fill={navyColor}
        />

        {/* === SUBTEXT LINES === */}
        {/* "TOUBA MADIYINA" */}
        <text
          x="190"
          y="42"
          fill={navyColor}
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="22"
          letterSpacing="2.5"
        >
          TOUBA MADIYINA
        </text>

        {/* "ELECTRONICS SHOP" */}
        <text
          x="192"
          y="68"
          fill={subtextColor}
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="17"
          letterSpacing="4"
        >
          ELECTRONICS SHOP
        </text>
      </svg>
    </div>
  );
};
