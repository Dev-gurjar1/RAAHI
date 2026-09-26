import React from 'react';

/**
 * Premium Verified Badge showing Aadhaar / Police / Govt verification
 */
export const VerifiedBadge = ({
  text = 'Verified Local',
  size = 'md', // 'sm' | 'md' | 'lg'
  variant = 'emerald', // 'emerald' | 'subtle'
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
  }[size] || 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full bg-[#E8F7F1] dark:bg-[#07543F]/30 text-[#07543F] dark:text-[#4ADE80] border border-[#0B9B6E]/30 tracking-tight transition-all shadow-2xs ${sizeClasses} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#0B9B6E] animate-pulse"></span>
      <i className="fa-solid fa-shield-check text-[11px] text-[#0B9B6E]"></i>
      <span>{text}</span>
    </span>
  );
};
