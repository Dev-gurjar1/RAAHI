import React from 'react';

interface RaahiLogoProps {
  className?: string;
  size?: number;
  showTagline?: boolean;
}

export const RaahiLogo: React.FC<RaahiLogoProps> = ({ className = '', size = 36, showTagline = true }) => {
  return (
    <div className="flex items-center gap-2.5 group cursor-pointer">
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`transform group-hover:scale-105 transition duration-300 ${className}`}
      >
        <defs>
          <linearGradient id="raahiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="60%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#EA580C" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Location Pin Outer Shape */}
        <path
          d="M24 4C14.06 4 6 12.06 6 22C6 33.5 24 44 24 44C24 44 42 33.5 42 22C42 12.06 33.94 4 24 4Z"
          fill="url(#raahiGrad)"
          filter="url(#softGlow)"
        />

        {/* Inner Heart & Smile Cutout in Crisp White */}
        <path
          d="M24 13C20.5 13 17.5 15.5 17.5 19.2C17.5 23.8 24 29 24 29C24 29 30.5 23.8 30.5 19.2C30.5 15.5 27.5 13 24 13Z"
          fill="#FFFFFF"
        />

        {/* Friendly Eyes & Subtle Smile Inside */}
        <circle cx="21" cy="18" r="1.2" fill="#EA580C" />
        <circle cx="27" cy="18" r="1.2" fill="#EA580C" />
        <path
          d="M21.5 21C22.2 22.2 25.8 22.2 26.5 21"
          stroke="#EA580C"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Emerald Verified Companion Dot */}
        <circle cx="36" cy="11" r="4.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2.5" />
      </svg>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-heading font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
            RAAHI
          </span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 dark:bg-orange-500/10 px-1.5 py-0.5 rounded-full border border-orange-200 dark:border-orange-500/20">
            India
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wide mt-0.5">
            Verified Locals • Fair Prices
          </span>
        )}
      </div>
    </div>
  );
};
