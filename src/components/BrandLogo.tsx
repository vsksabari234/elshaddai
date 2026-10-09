import React from 'react';

interface BrandLogoProps {
  variant?: 'horizontal' | 'light' | 'emblem';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'responsive';
  height?: number;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'horizontal',
  className = '',
  size = 'responsive',
  height,
}) => {
  if (variant === 'emblem') {
    return (
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${
          size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-14 h-14' : 'w-9 h-9 sm:w-11 sm:h-11'
        } ${className}`}
        aria-label="El Shaddai Interior Works Emblem"
      >
        <defs>
          <linearGradient id="blGold" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9A6B2F" />
            <stop offset="45%" stopColor="#D4A373" />
            <stop offset="70%" stopColor="#EED5A5" />
            <stop offset="100%" stopColor="#C59B27" />
          </linearGradient>
          <linearGradient id="blDarkTeak" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#24140D" />
            <stop offset="100%" stopColor="#3E2013" />
          </linearGradient>
          <linearGradient id="blWood" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8A532B" />
            <stop offset="100%" stopColor="#D4A373" />
          </linearGradient>
        </defs>

        <circle cx="60" cy="60" r="56" fill="url(#blDarkTeak)" />
        <circle cx="60" cy="60" r="53" stroke="url(#blGold)" strokeWidth="2.5" />
        <circle cx="60" cy="60" r="47" stroke="url(#blWood)" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
        <path d="M60 22 L76 38 L70 38 L60 28 L50 38 L44 38 Z" fill="url(#blGold)" />
        <path d="M44 40 H74 V46 H54 V53 H70 V59 H54 V67 H74 V73 H44 Z" fill="#FAF7F2" />
        <path d="M50 54 C50 48 72 48 72 54 C72 60 50 60 50 70 C50 77 72 77 72 70" stroke="url(#blGold)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <rect x="46" y="80" width="28" height="3" rx="1.5" fill="url(#blGold)" />
        <circle cx="60" cy="90" r="3" fill="#D4A373" />
        <circle cx="48" cy="90" r="1.5" fill="#C59B27" opacity="0.6" />
        <circle cx="72" cy="90" r="1.5" fill="#C59B27" opacity="0.6" />
      </svg>
    );
  }

  const isLight = variant === 'light';
  const textColor = isLight ? 'text-[#FAF7F2]' : 'text-[#1C110B]';
  const subColor = isLight ? 'text-[#D4A373]' : 'text-[#8A532B]';
  const ruleBg = isLight ? 'bg-white/20' : 'bg-[#E8DECE]';

  return (
    <div className={`inline-flex items-center gap-2 sm:gap-2.5 select-none ${className}`}>
      {/* Brand Emblem */}
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 drop-shadow-xs ${
          size === 'sm'
            ? 'w-7 h-7'
            : size === 'lg'
            ? 'w-11 h-11'
            : 'w-7.5 h-7.5 sm:w-9.5 sm:h-9.5'
        }`}
      >
        <defs>
          <linearGradient id={`blGoldGrad-${variant}`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9A6B2F" />
            <stop offset="45%" stopColor="#D4A373" />
            <stop offset="70%" stopColor="#EED5A5" />
            <stop offset="100%" stopColor="#C59B27" />
          </linearGradient>
          <linearGradient id={`blTeakGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#24140D" />
            <stop offset="100%" stopColor="#4A2616" />
          </linearGradient>
          <linearGradient id={`blWoodGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8A532B" />
            <stop offset="100%" stopColor="#D4A373" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="64" height="64" rx="14" fill={`url(#blTeakGrad-${variant})`} />
        <rect x="1.5" y="1.5" width="61" height="61" rx="12.5" stroke={`url(#blGoldGrad-${variant})`} strokeWidth="1.5" />
        <rect x="5.5" y="5.5" width="53" height="53" rx="8.5" stroke={`url(#blWoodGrad-${variant})`} strokeWidth="0.75" strokeDasharray="2 2" opacity="0.6" />
        <path d="M32 9 L46 23 L41 23 L32 14 L23 23 L18 23 Z" fill={`url(#blGoldGrad-${variant})`} opacity="0.9" />
        <path d="M22 22 H39 V26 H27 V30 H36 V34 H27 V38 H39 V42 H22 Z" fill="#FAF7F2" />
        <path d="M26 31 C26 27 38 27 38 31 C38 34 26 34 26 40 C26 44 38 44 38 40" stroke={`url(#blGoldGrad-${variant})`} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <rect x="25" y="46" width="14" height="2" rx="1" fill={`url(#blGoldGrad-${variant})`} />
        <circle cx="32" cy="51" r="1.5" fill="#D4A373" />
      </svg>

      {/* Brand Typography Wordmark */}
      <div className="flex flex-col justify-center text-left leading-none min-w-0">
        <span
          className={`font-serif-wood font-bold tracking-[0.06em] sm:tracking-[0.08em] whitespace-nowrap ${textColor} ${
            size === 'sm'
              ? 'text-sm'
              : size === 'lg'
              ? 'text-xl sm:text-2xl'
              : 'text-[15px] sm:text-lg md:text-xl'
          }`}
        >
          EL SHADDAI
        </span>
        <span
          className={`font-sans font-semibold tracking-[0.18em] sm:tracking-[0.24em] uppercase whitespace-nowrap mt-0.5 ${subColor} ${
            size === 'sm'
              ? 'text-[8px]'
              : size === 'lg'
              ? 'text-[10px] sm:text-xs'
              : 'text-[7.5px] sm:text-[9.5px]'
          }`}
        >
          INTERIOR WORKS
        </span>
        <div className={`h-[1px] w-full mt-0.5 sm:mt-1 flex items-center justify-between ${ruleBg}`}>
          <span className="w-0.5 h-0.5 rounded-full bg-[#8A532B]" />
          <span className="w-0.5 h-0.5 rounded-full bg-[#D4A373]" />
        </div>
      </div>
    </div>
  );
};
