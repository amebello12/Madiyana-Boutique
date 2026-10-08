import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'badge' | 'icon' | 'full';
  theme?: 'light' | 'dark';
}

/**
 * Official Wave Senegal Logo (Cyan #1DC4FF + Iconic Penguin Mascot + wave lowercase)
 */
export const WaveLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'badge',
  theme = 'light'
}) => {
  if (variant === 'icon') {
    const dim = size === 'xs' ? 'w-4 h-4' : size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-10 h-10';
    return (
      <svg
        viewBox="0 0 100 100"
        className={`${dim} shrink-0 ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="50" fill="#1DC4FF" />
        {/* Wave Penguin / Bird Iconic Silhouette */}
        <path
          d="M50 18 C38 18 30 28 30 42 C30 52 35 60 38 67 L34 82 L48 76 C49 76 50 76 51 76 C65 76 72 63 72 45 C72 29 63 18 50 18 Z"
          fill="#001833"
        />
        {/* Penguin White Belly */}
        <path
          d="M48 35 C42 35 38 42 38 52 C38 61 42 68 49 68 C55 68 59 61 59 52 C59 42 55 35 48 35 Z"
          fill="#FFFFFF"
        />
        {/* Penguin Beak */}
        <path d="M36 34 L25 38 L36 41 Z" fill="#FFA500" />
        {/* Penguin Eye */}
        <circle cx="44" cy="30" r="3" fill="#FFFFFF" />
        <circle cx="43.5" cy="30" r="1.5" fill="#001833" />
        {/* Penguin Feet */}
        <path d="M42 74 L37 80 H47 Z" fill="#FFA500" />
        <path d="M54 74 L50 80 H60 Z" fill="#FFA500" />
      </svg>
    );
  }

  if (variant === 'full') {
    const height = size === 'xs' ? 'h-4' : size === 'sm' ? 'h-5' : size === 'md' ? 'h-7' : 'h-9';
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <svg
          viewBox="0 0 240 70"
          className={`${height} w-auto`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cyan Badge Background */}
          <rect width="240" height="70" rx="35" fill="#1DC4FF" />
          
          {/* Wave Penguin Icon inside circle */}
          <g transform="translate(14, 5) scale(0.6)">
            <circle cx="50" cy="50" r="46" fill="#00A9E8" />
            <path
              d="M50 18 C38 18 30 28 30 42 C30 52 35 60 38 67 L34 82 L48 76 C49 76 50 76 51 76 C65 76 72 63 72 45 C72 29 63 18 50 18 Z"
              fill="#001833"
            />
            <path
              d="M48 35 C42 35 38 42 38 52 C38 61 42 68 49 68 C55 68 59 61 59 52 C59 42 55 35 48 35 Z"
              fill="#FFFFFF"
            />
            <path d="M36 34 L25 38 L36 41 Z" fill="#FFA500" />
            <circle cx="44" cy="30" r="3" fill="#FFFFFF" />
            <circle cx="43.5" cy="30" r="1.5" fill="#001833" />
            <path d="M42 74 L37 80 H47 Z" fill="#FFA500" />
            <path d="M54 74 L50 80 H60 Z" fill="#FFA500" />
          </g>

          {/* Official 'wave' Typography */}
          <text
            x="84"
            y="48"
            fill="#001833"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fontSize="36"
            letterSpacing="-0.5"
          >
            wave
          </text>
        </svg>
      </div>
    );
  }

  // Default: 'badge' (Compact pill with crisp official Wave branding)
  const paddingClass = size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : size === 'sm' ? 'px-2 py-0.5 text-[11px]' : size === 'md' ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-black tracking-tight select-none shadow-sm ${paddingClass} ${
        theme === 'dark'
          ? 'bg-[#1DC4FF] text-[#001833] border border-[#1DC4FF]/60'
          : 'bg-[#1DC4FF] text-[#001833] border border-[#0FB5F0]'
      } ${className}`}
    >
      {/* Mini Penguin Silhouette */}
      <svg viewBox="0 0 100 100" className="w-3.5 h-3.5 shrink-0" fill="none">
        <circle cx="50" cy="50" r="50" fill="#00A9E8" />
        <path
          d="M50 18 C38 18 30 28 30 42 C30 52 35 60 38 67 L34 82 L48 76 C49 76 50 76 51 76 C65 76 72 63 72 45 C72 29 63 18 50 18 Z"
          fill="#001833"
        />
        <path
          d="M48 35 C42 35 38 42 38 52 C38 61 42 68 49 68 C55 68 59 61 59 52 C59 42 55 35 48 35 Z"
          fill="#FFFFFF"
        />
        <path d="M36 34 L25 38 L36 41 Z" fill="#FFA500" />
      </svg>
      <span>Wave</span>
    </span>
  );
};

/**
 * Official Orange Money Senegal Logo (Orange #FF6600 + Black + Official OM Symbol)
 */
export const OrangeMoneyLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'badge',
  theme = 'light'
}) => {
  if (variant === 'icon') {
    const dim = size === 'xs' ? 'w-4 h-4' : size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-10 h-10';
    return (
      <svg
        viewBox="0 0 100 100"
        className={`${dim} shrink-0 ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Orange Square */}
        <rect width="100" height="100" rx="20" fill="#FF6600" />
        {/* OM Monogram Circles */}
        <circle cx="38" cy="50" r="18" stroke="#FFFFFF" strokeWidth="9" />
        <path
          d="M 58 32 L 68 50 L 78 32 V 68 H 68 V 46 L 68 56 L 68 46 L 58 68 Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  if (variant === 'full') {
    const height = size === 'xs' ? 'h-4' : size === 'sm' ? 'h-5' : size === 'md' ? 'h-7' : 'h-9';
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <svg
          viewBox="0 0 260 70"
          className={`${height} w-auto`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Black & Orange Pill Container */}
          <rect width="260" height="70" rx="14" fill="#000000" />
          
          {/* Orange Brand Square */}
          <rect x="10" y="10" width="50" height="50" rx="8" fill="#FF6600" />
          {/* Minimal OM symbol */}
          <circle cx="28" cy="35" r="10" stroke="#FFFFFF" strokeWidth="5" />
          <path d="M 40 26 L 46 36 L 52 26 V 44 H 46 V 34 L 46 38 L 40 44 Z" fill="#FFFFFF" />

          {/* Typography */}
          <text
            x="72"
            y="35"
            fill="#FF6600"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fontSize="18"
            letterSpacing="0.5"
          >
            orange
          </text>
          <text
            x="72"
            y="54"
            fill="#FFFFFF"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fontSize="17"
            letterSpacing="1"
          >
            MONEY
          </text>
        </svg>
      </div>
    );
  }

  // Default: 'badge' (Compact pill with official Orange Money branding)
  const paddingClass = size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : size === 'sm' ? 'px-2 py-0.5 text-[11px]' : size === 'md' ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-black tracking-tight select-none shadow-sm ${paddingClass} ${
        theme === 'dark'
          ? 'bg-[#FF6600] text-white border border-[#FF6600]/80'
          : 'bg-[#FF6600] text-white border border-[#E05A00]'
      } ${className}`}
    >
      {/* Orange Icon */}
      <span className="w-3.5 h-3.5 rounded bg-black flex items-center justify-center text-[8px] font-black text-[#FF6600] leading-none shrink-0">
        OM
      </span>
      <span>Orange Money</span>
    </span>
  );
};

/**
 * Official Free Money Senegal Logo (Red #E2001A + White)
 */
export const FreeMoneyLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'badge',
}) => {
  const paddingClass = size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : size === 'sm' ? 'px-2 py-0.5 text-[11px]' : size === 'md' ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-black tracking-tight select-none shadow-sm bg-[#E2001A] text-white border border-[#B80015] ${paddingClass} ${className}`}
    >
      <span className="w-3.5 h-3.5 rounded-full bg-white text-[#E2001A] flex items-center justify-center text-[8px] font-black leading-none shrink-0">
        f
      </span>
      <span>Free Money</span>
    </span>
  );
};

/**
 * Official Cash on Delivery / Paiement à la livraison Badge
 */
export const CashDeliveryBadge: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  theme = 'light'
}) => {
  const paddingClass = size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : size === 'sm' ? 'px-2 py-0.5 text-[11px]' : size === 'md' ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-black tracking-tight select-none shadow-sm ${paddingClass} ${
        theme === 'dark'
          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
          : 'bg-emerald-600 text-white border border-emerald-700'
      } ${className}`}
    >
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="2" />
        <path d="M6 12h.01M18 12h.01" />
      </svg>
      <span>Paiement à la livraison</span>
    </span>
  );
};

/**
 * Composite Official Payment Badges Row
 */
export const SenegalPaymentBadges: React.FC<{
  size?: 'xs' | 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
  className?: string;
  showCod?: boolean;
}> = ({ size = 'sm', theme = 'light', className = '', showCod = true }) => {
  return (
    <div className={`inline-flex items-center gap-2 flex-wrap ${className}`}>
      <WaveLogo size={size} theme={theme} />
      <OrangeMoneyLogo size={size} theme={theme} />
      <FreeMoneyLogo size={size} theme={theme} />
      {showCod && <CashDeliveryBadge size={size} theme={theme} />}
    </div>
  );
};
