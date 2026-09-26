import React from 'react';

/**
 * Premium numeric stepper for passenger/day counts
 */
export const Stepper = ({
  value,
  onChange,
  min = 1,
  max = 20,
  step = 1,
  label,
  unit = '',
  className = '',
}) => {
  const handleDecrement = () => {
    if (value > min) onChange(Math.max(min, value - step));
  };

  const handleIncrement = () => {
    if (value < max) onChange(Math.min(max, value + step));
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-[#152238] dark:text-[#E8F0EC] uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="flex items-center justify-between p-1.5 rounded-xl bg-white dark:bg-[#162019] border border-[#E0E8E4] dark:border-[#243028]">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-[#152238] dark:text-white hover:bg-[#F8F7F3] dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer font-bold text-base"
        >
          <i className="fa-solid fa-minus text-xs"></i>
        </button>

        <div className="text-center px-3">
          <span className="text-base font-extrabold text-[#152238] dark:text-white font-heading">
            {value}
          </span>
          {unit && <span className="text-xs text-[#8A9BAD] ml-1">{unit}</span>}
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#E8F7F1] dark:bg-[#0B9B6E]/20 text-[#07543F] dark:text-[#4ADE80] hover:bg-[#0B9B6E] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer font-bold text-base"
        >
          <i className="fa-solid fa-plus text-xs"></i>
        </button>
      </div>
    </div>
  );
};
