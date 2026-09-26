import React from 'react';

/**
 * Filter / Category Chip
 */
export const Chip = ({
  label,
  active = false,
  onClick,
  icon,
  count,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
        active
          ? 'bg-[#152238] text-white border-[#152238] shadow-sm'
          : 'bg-white dark:bg-[#162019] text-[#4A5C6E] dark:text-[#9AB0A4] border-[#E0E8E4] dark:border-[#243028] hover:border-[#0B9B6E]/50 hover:text-[#152238] dark:hover:text-white'
      } ${className}`}
    >
      {icon && (
        <i
          className={`${icon} text-[11px] ${
            active ? 'text-[#F4A340]' : 'text-[#8A9BAD]'
          }`}
        ></i>
      )}
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded-full ${
            active
              ? 'bg-white/20 text-white'
              : 'bg-[#F8F7F3] dark:bg-white/10 text-[#8A9BAD]'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};
