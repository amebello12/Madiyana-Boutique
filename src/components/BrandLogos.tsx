import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  monochrome?: boolean;
}

/**
 * Official Samsung Vector Logo
 */
export const SamsungLogo: React.FC<BrandLogoProps> = ({ className = '', size = 'md' }) => {
  const height = size === 'sm' ? 'h-4' : size === 'md' ? 'h-5' : 'h-7';
  return (
    <svg
      viewBox="0 0 160 40"
      className={`${height} w-auto fill-current ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.8 17.5c-4.4-.7-6.5-1.7-6.5-4 0-2.4 2.3-3.8 6.4-3.8 4.2 0 6.6 1.6 7.4 4.8l4.4-.9c-1.3-4.8-5.3-7.5-11.8-7.5-6.8 0-11.2 3.1-11.2 7.7 0 4.6 3.6 6.7 9.8 7.6 4.7.7 6.8 2 6.8 4.5 0 2.7-2.6 4.2-7 4.2-4.9 0-7.7-1.8-8.5-5.3L8 33.4c1.3 5.4 5.9 8.3 12.8 8.3 7.2 0 11.8-3.3 11.8-8.1.1-4.7-3.8-7.1-9.8-7.9zM39.6 6.3l-9.8 35.1h4.9l2.7-10.2h10.4l2.8 10.2h5L45.7 6.3h-6.1zm-1 21.1l4-15.1 4.1 15.1h-8.1zM60.1 6.3v35.1h4.7v-25l8.6 25h3.6l8.6-25v25h4.7V6.3h-6.5l-8.5 24.8-8.5-24.8h-6.7zM97.8 17.5c-4.4-.7-6.5-1.7-6.5-4 0-2.4 2.3-3.8 6.4-3.8 4.2 0 6.6 1.6 7.4 4.8l4.4-.9c-1.3-4.8-5.3-7.5-11.8-7.5-6.8 0-11.2 3.1-11.2 7.7 0 4.6 3.6 6.7 9.8 7.6 4.7.7 6.8 2 6.8 4.5 0 2.7-2.6 4.2-7 4.2-4.9 0-7.7-1.8-8.5-5.3L93 33.4c1.3 5.4 5.9 8.3 12.8 8.3 7.2 0 11.8-3.3 11.8-8.1 0-4.7-3.9-7.1-9.8-7.9zM116.8 6.3v24.6c0 6.7 4.3 10.8 11.1 10.8 6.8 0 11.1-4.1 11.1-10.8V6.3h-4.7v24.6c0 4.2-2.5 6.7-6.4 6.7-3.9 0-6.4-2.5-6.4-6.7V6.3h-4.7zM146.4 6.3v35.1h4.6l12.7-23.7v23.7h4.7V6.3h-4.6l-12.7 23.7V6.3h-4.7z" />
    </svg>
  );
};

/**
 * Official Apple Vector Logo
 */
export const AppleLogo: React.FC<BrandLogoProps> = ({ className = '', size = 'md' }) => {
  const height = size === 'sm' ? 'h-4' : size === 'md' ? 'h-5' : 'h-7';
  return (
    <svg
      viewBox="0 0 170 170"
      className={`${height} w-auto fill-current ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.7-7.85-12-14.42-6.19-9.5-10.9-20.44-14.15-32.8-3.25-12.36-4.88-23.95-4.88-34.78 0-14.77 3.73-27.17 11.2-37.2 7.46-10.02 17.06-15.15 28.8-15.38 5.64 0 11.66 1.48 18.06 4.43 6.4 2.95 10.37 4.5 11.9 4.63 2.12-.4 6.37-2.03 12.75-4.88 6.38-2.85 12.43-4.14 18.15-3.87 13.59.63 24.36 5.58 32.31 14.85-11.87 7.21-17.7 16.99-17.48 29.35.21 10.14 4.09 18.72 11.63 25.75 7.54 7.02 16.54 11.13 27 12.31-2.23 6.88-4.99 13.88-8.28 21.03zm-27.9-106.84c.14 3.65-.9 7.39-3.11 11.23-2.22 3.84-5.22 7.09-9.01 9.76-3.37 2.37-7.05 3.97-11.03 4.8-1.02-3.66-.4-7.44 1.86-11.34 2.27-3.9 5.37-7.22 9.31-9.97 3.51-2.45 7.47-4.08 11.88-4.9.06.14.1.28.1.42z" />
    </svg>
  );
};

/**
 * Official LG Vector Logo
 */
export const LgLogo: React.FC<BrandLogoProps> = ({ className = '', size = 'md' }) => {
  const height = size === 'sm' ? 'h-4' : size === 'md' ? 'h-5' : 'h-7';
  return (
    <svg
      viewBox="0 0 120 50"
      className={`${height} w-auto fill-current ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="#A50034">
        <circle cx="25" cy="25" r="22" />
        <circle cx="16" cy="18" r="3" fill="#FFFFFF" />
        <path d="M 25 12 V 28 H 36" stroke="#FFFFFF" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M 40 25 A 15 15 0 1 0 25 40" stroke="#FFFFFF" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      </g>
      <text x="56" y="34" fill="#686868" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="26">
        LG
      </text>
    </svg>
  );
};

/**
 * Official TCL Vector Logo
 */
export const TclLogo: React.FC<BrandLogoProps> = ({ className = '', size = 'md' }) => {
  const height = size === 'sm' ? 'h-4' : size === 'md' ? 'h-5' : 'h-7';
  return (
    <svg
      viewBox="0 0 120 40"
      className={`${height} w-auto fill-current ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5 8 H35 V16 H24 V34 H16 V16 H5 Z" fill="#E2001A" />
      <path d="M65 8 H43 C39 8 36 11 36 15 V27 C36 31 39 34 43 34 H65 V26 H46 C44.5 26 44 25.5 44 24 V18 C44 16.5 44.5 16 46 16 H65 Z" fill="#E2001A" />
      <path d="M72 8 H80 V26 H105 V34 H72 Z" fill="#E2001A" />
    </svg>
  );
};

/**
 * Official Sony Vector Logo
 */
export const SonyLogo: React.FC<BrandLogoProps> = ({ className = '', size = 'md' }) => {
  const height = size === 'sm' ? 'h-4' : size === 'md' ? 'h-5' : 'h-7';
  return (
    <svg
      viewBox="0 0 140 30"
      className={`${height} w-auto fill-current ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <text x="0" y="24" fontFamily="Georgia, serif" fontWeight="bold" fontSize="28" letterSpacing="4">
        SONY
      </text>
    </svg>
  );
};

/**
 * Official Gree Air Conditioners Logo
 */
export const GreeLogo: React.FC<BrandLogoProps> = ({ className = '', size = 'md' }) => {
  const height = size === 'sm' ? 'h-4' : size === 'md' ? 'h-5' : 'h-7';
  return (
    <svg
      viewBox="0 0 130 35"
      className={`${height} w-auto fill-current ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="130" height="35" rx="6" fill="#005bac" />
      <text x="14" y="26" fill="#FFFFFF" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="22" letterSpacing="2">
        GREE
      </text>
    </svg>
  );
};

/**
 * Official Midea Logo
 */
export const MideaLogo: React.FC<BrandLogoProps> = ({ className = '', size = 'md' }) => {
  const height = size === 'sm' ? 'h-4' : size === 'md' ? 'h-5' : 'h-7';
  return (
    <svg
      viewBox="0 0 130 35"
      className={`${height} w-auto fill-current ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <text x="5" y="26" fill="#0093d0" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="24" letterSpacing="1">
        Midea
      </text>
    </svg>
  );
};

/**
 * Official HP Logo
 */
export const HpLogo: React.FC<BrandLogoProps> = ({ className = '', size = 'md' }) => {
  const height = size === 'sm' ? 'h-4' : size === 'md' ? 'h-5' : 'h-7';
  return (
    <svg
      viewBox="0 0 40 40"
      className={`${height} w-auto fill-current ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="20" cy="20" r="19" fill="#0096D6" />
      <text x="9" y="27" fill="#FFFFFF" fontFamily="system-ui, sans-serif" fontStyle="italic" fontWeight="900" fontSize="20">
        hp
      </text>
    </svg>
  );
};

/**
 * Official Dell Logo
 */
export const DellLogo: React.FC<BrandLogoProps> = ({ className = '', size = 'md' }) => {
  const height = size === 'sm' ? 'h-4' : size === 'md' ? 'h-5' : 'h-7';
  return (
    <svg
      viewBox="0 0 100 35"
      className={`${height} w-auto fill-current ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <text x="5" y="26" fill="#007DB8" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="24" letterSpacing="1">
        DELL
      </text>
    </svg>
  );
};

/**
 * Official JBL Logo
 */
export const JblLogo: React.FC<BrandLogoProps> = ({ className = '', size = 'md' }) => {
  const height = size === 'sm' ? 'h-4' : size === 'md' ? 'h-5' : 'h-7';
  return (
    <svg
      viewBox="0 0 90 35"
      className={`${height} w-auto fill-current ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="90" height="35" rx="6" fill="#FF5E00" />
      <text x="14" y="26" fill="#FFFFFF" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="22" letterSpacing="1">
        JBL
      </text>
    </svg>
  );
};

/**
 * Official Xiaomi Logo
 */
export const XiaomiLogo: React.FC<BrandLogoProps> = ({ className = '', size = 'md' }) => {
  const height = size === 'sm' ? 'h-4' : size === 'md' ? 'h-5' : 'h-7';
  return (
    <svg
      viewBox="0 0 40 40"
      className={`${height} w-auto fill-current ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="40" rx="10" fill="#FF6700" />
      <text x="10" y="27" fill="#FFFFFF" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="18">
        mi
      </text>
    </svg>
  );
};

/**
 * Official Partner Brands Grid / Carousel Showcase
 */
export const OfficialBrandsShowcase: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`py-8 bg-slate-50 border-y border-slate-200/80 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-4">
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">
            Marques Officielles 100% Originales & Garanties
          </span>
          <span className="text-[11px] font-bold text-blue-700 hidden sm:inline">
            Garantie Constructeur Sénégal
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 items-center">
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-center h-14 hover:border-blue-400 hover:shadow-sm transition-all text-slate-800">
            <SamsungLogo size="sm" />
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-center h-14 hover:border-blue-400 hover:shadow-sm transition-all text-slate-900">
            <AppleLogo size="sm" />
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-center h-14 hover:border-blue-400 hover:shadow-sm transition-all">
            <LgLogo size="sm" />
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-center h-14 hover:border-blue-400 hover:shadow-sm transition-all text-slate-900">
            <SonyLogo size="sm" />
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-center h-14 hover:border-blue-400 hover:shadow-sm transition-all">
            <TclLogo size="sm" />
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-center h-14 hover:border-blue-400 hover:shadow-sm transition-all">
            <GreeLogo size="sm" />
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-center h-14 hover:border-blue-400 hover:shadow-sm transition-all">
            <MideaLogo size="sm" />
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-center h-14 hover:border-blue-400 hover:shadow-sm transition-all">
            <JblLogo size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
};
