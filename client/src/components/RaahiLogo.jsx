import React from 'react';

export const RaahiLogo = ({
  variant = 'compact',
  size = 40,
  showTagline = true,
  className = ''
}) => {
  const iconOnly = variant === 'icon';

  return (
    <div className={`inline-flex items-center gap-3 font-sans group select-none ${className}`}>
      {/* ══════════════════════════════════════════════════
          ULTRA-PREMIUM VECTOR EMBLEM
          Mughal/Rajput Royal Arch + Compass Guide Star + Radiant Gradients
          ══════════════════════════════════════════════════ */}
      <div
        style={{ width: size, height: size }}
        className="relative flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          <defs>
            {/* Rich Emerald Background Gradient */}
            <linearGradient id="raahiEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B9B6E" />
              <stop offset="50%" stopColor="#07543F" />
              <stop offset="100%" stopColor="#043326" />
            </linearGradient>

            {/* Regal Gold Accent Gradient */}
            <linearGradient id="raahiGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            {/* Shimmer Arch Gradient */}
            <linearGradient id="raahiArchGrad" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
            </linearGradient>

            {/* Filter glow */}
            <filter id="raahiGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Squircle Outer Base */}
          <rect
            x="2"
            y="2"
            width="60"
            height="60"
            rx="18"
            fill="url(#raahiEmeraldGrad)"
            stroke="url(#raahiGoldGrad)"
            strokeWidth="1.5"
            strokeOpacity="0.8"
          />

          {/* Delicate Outer Geometric Inset Ring */}
          <rect
            x="5.5"
            y="5.5"
            width="53"
            height="53"
            rx="14.5"
            fill="none"
            stroke="url(#raahiGoldGrad)"
            strokeWidth="0.75"
            strokeDasharray="2 2"
            strokeOpacity="0.45"
          />

          {/* Royal Indian Arch (Jharokha/Mihrab Silhouette) */}
          <path
            d="M 19 47 L 19 32 Q 19 23 32 15 Q 45 23 45 32 L 45 47 Z"
            fill="url(#raahiArchGrad)"
            stroke="url(#raahiGoldGrad)"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />

          {/* Inner Keystone Arch Point */}
          <path
            d="M 32 15 C 31 18 30 20 28 22 C 30 22 31 23 32 25 C 33 23 34 22 36 22 C 34 20 33 18 32 15 Z"
            fill="url(#raahiGoldGrad)"
          />

          {/* Pathfinder / Raahi Golden 8-Point Compass Star */}
          <g filter="url(#raahiGlow)">
            {/* Compass Diamond Star Center */}
            <polygon
              points="32,23 34.5,30 42,32 34.5,34 32,41 29.5,34 22,32 29.5,30"
              fill="url(#raahiGoldGrad)"
            />
            {/* Central Pure White Diamond Spark */}
            <polygon
              points="32,28.5 33.5,32 32,35.5 30.5,32"
              fill="#FFFFFF"
            />
          </g>

          {/* Travel Path Horizon Ribbon (The Way / राह) */}
          <path
            d="M 23 47 Q 32 44 41 47"
            stroke="url(#raahiGoldGrad)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Subtle Corner Star Accent Dots */}
          <circle cx="12" cy="12" r="1.2" fill="#FCD34D" fillOpacity="0.8" />
          <circle cx="52" cy="12" r="1.2" fill="#FCD34D" fillOpacity="0.8" />
          <circle cx="12" cy="52" r="1.2" fill="#FCD34D" fillOpacity="0.8" />
          <circle cx="52" cy="52" r="1.2" fill="#FCD34D" fillOpacity="0.8" />
        </svg>
      </div>

      {/* ══════════════════════════════════════════════════
          TYPOGRAPHIC WORDMARK
          ══════════════════════════════════════════════════ */}
      {!iconOnly && (
        <div className="flex flex-col text-left leading-none">
          <div className="flex items-center gap-1.5">
            <span className="font-heading font-black text-2xl sm:text-[26px] tracking-tight text-[#152238] dark:text-white flex items-center">
              RAAHI
            </span>
            <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-[#0B9B6E] to-[#F59E0B] shadow-sm animate-pulse"></span>
          </div>

          {showTagline && (
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[8.5px] font-extrabold uppercase tracking-[0.2em] text-[#07543F] dark:text-[#4ADE80]">
                CULTURAL TOURS
              </span>
              <span className="text-[8.5px] text-[#F59E0B] font-black">•</span>
              <span className="text-[8.5px] font-extrabold uppercase tracking-[0.2em] text-[#8A9BAD]">
                PAN-INDIA
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RaahiLogo;
