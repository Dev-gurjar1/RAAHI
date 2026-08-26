import React, { useState } from 'react';

export interface RaahiLogoProps {
  variant?: 'full' | 'compact' | 'icon';
  size?: number;
  showTagline?: boolean;
  className?: string;
  imageSrc?: string; // Optional custom JPEG / PNG path e.g. "/raahi-logo.jpg"
}

export const RaahiLogo: React.FC<RaahiLogoProps> = ({
  variant = 'compact',
  size = 38,
  showTagline = true,
  className = '',
  imageSrc = '/raahi.jpeg' // Points to uploaded raahi.jpeg
}) => {
  const [useImageFallback, setUseImageFallback] = useState(true);
  const iconOnly = variant === 'icon';
  const isFull = variant === 'full';

  return (
    <div className={`inline-flex items-center gap-3 font-sans group cursor-pointer ${className}`}>
      
      {/* IF JPEG IMAGE IS AVAILABLE IN PUBLIC FOLDER */}
      {useImageFallback ? (
        <img
          src={imageSrc}
          alt="RAAHI Brand Logo"
          onError={() => setUseImageFallback(false)} // Fallback to SVG if image not found
          style={{ height: size, width: 'auto' }}
          className="max-h-12 object-contain transform group-hover:scale-105 transition duration-300 rounded-xl shadow-xs"
        />
      ) : (
        /* RAAHI BRAND SVG VECTOR LOGO */
        <svg
          width={size}
          height={size}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transform group-hover:scale-105 transition duration-300 flex-shrink-0 drop-shadow-md"
        >
          <defs>
            <linearGradient id="sunsetBg" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#FFF5ED" />
            </linearGradient>
            <linearGradient id="rGrad" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF7A00" />
              <stop offset="50%" stopColor="#FF5500" />
              <stop offset="100%" stopColor="#E63900" />
            </linearGradient>
            <linearGradient id="sunGrad" x1="100" y1="30" x2="100" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFD000" />
              <stop offset="100%" stopColor="#FF7A00" />
            </linearGradient>
          </defs>

          <rect width="200" height="200" rx="44" fill="url(#sunsetBg)" />
          <rect width="192" height="192" x="4" y="4" rx="40" stroke="#FF7A00" strokeWidth="2" strokeOpacity="0.3" />

          <path d="M4 150 Q 50 130, 100 155 T 196 150 L 196 160 Q 196 196, 160 196 L 40 196 Q 4 196, 4 160 Z" fill="#FF6A00" opacity="0.85" />
          <path d="M4 165 Q 60 145, 120 170 T 196 160 L 196 160 Q 196 196, 160 196 L 40 196 Q 4 196, 4 160 Z" fill="#FF4500" />

          <g id="R-Graphic">
            <path d="M 60 30 H 130 C 158 30, 158 90, 130 90 H 105 L 148 145 H 108 L 74 90 H 60 V 145 H 32 V 30 H 60 Z" fill="url(#rGrad)" />
            <circle cx="102" cy="58" r="26" fill="url(#sunGrad)" />
            <path d="M 108 42 Q 112 39 116 42 Q 120 39 124 42" stroke="#4A1D00" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M 122 49 Q 125 46 128 49 Q 131 46 134 49" stroke="#4A1D00" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <polygon points="62,90 82,65 96,90" fill="#FFFFFF" />
            <polygon points="82,65 88,72 80,72" fill="#FFEFE5" />
            <polygon points="90,90 110,60 130,90" fill="#FFFFFF" />
            <polygon points="110,60 116,68 106,68" fill="#FFEFE5" />
            <polygon points="120,90 136,68 152,90" fill="#FFFFFF" />
            <polygon points="136,68 142,75 132,75" fill="#FFEFE5" />
            <path d="M 40 145 C 50 110, 85 105, 118 95 C 105 105, 80 120, 68 145 Z" fill="#FFFFFF" />
            <path d="M 48 145 C 56 120, 80 112, 110 98" stroke="#6B2E00" strokeWidth="3" strokeDasharray="5,5" fill="none" />
            <g transform="translate(92, 72) scale(0.65)">
              <path d="M16 2 C9.37 2 4 7.37 4 14 C4 23 16 32 16 32 C16 32 28 23 28 14 C28 7.37 22.63 2 16 2 Z" fill="#FFFFFF" />
              <circle cx="16" cy="13" r="5" fill="#FF5500" />
            </g>
          </g>
        </svg>
      )}

      {/* RAAHI WORDMARK & TAGLINE */}
      {!iconOnly && !useImageFallback && (
        <div className="flex flex-col text-left">
          <div className="flex items-center">
            <span className="font-heading font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white flex items-baseline">
              raah
              <span className="relative text-slate-900 dark:text-white inline-block">
                i
                <span className="absolute -top-[0.1em] left-[0.22em] w-[0.25em] h-[0.25em] bg-gradient-to-tr from-amber-500 to-orange-500 rounded-full shadow-xs"></span>
              </span>
            </span>
          </div>

          {(isFull || showTagline) && (
            <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-orange-600 dark:text-orange-400 mt-0.5 whitespace-nowrap">
              — EXPLORE. EXPERIENCE. CONNECT. —
            </span>
          )}
        </div>
      )}

    </div>
  );
};

export default RaahiLogo;
