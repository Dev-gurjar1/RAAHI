import React, { useState, useRef, useEffect } from 'react';

/**
 * Premium CustomSelect component replacing native browser <select>
 * Props:
 * - value: currently selected value
 * - onChange: callback(value)
 * - options: array of { value, label, icon?, subtitle? } or strings
 * - placeholder: fallback string
 * - label: optional top label
 * - icon: optional leading icon (FontAwesome class name)
 * - className: optional wrapper class
 */
export const CustomSelect = ({
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  label,
  icon,
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Normalize options to object { value, label, icon, subtitle }
  const normalizedOptions = options.map((opt) =>
    typeof opt === 'object' ? opt : { value: opt, label: opt }
  );

  const selectedOption = normalizedOptions.find((opt) => String(opt.value) === String(value));

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold text-[#152238] dark:text-[#E8F0EC] uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white dark:bg-[#162019] border transition-all text-left text-sm ${
          isOpen
            ? 'border-[#0B9B6E] ring-2 ring-[#0B9B6E]/20 shadow-sm'
            : 'border-[#E0E8E4] dark:border-[#243028] hover:border-[#0B9B6E]/60'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {(icon || selectedOption?.icon) && (
            <i
              className={`${selectedOption?.icon || icon} text-[#0B9B6E] text-sm flex-shrink-0`}
            ></i>
          )}
          <span
            className={`truncate font-medium ${
              selectedOption
                ? 'text-[#152238] dark:text-white'
                : 'text-[#8A9BAD]'
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <i
          className={`fa-solid fa-chevron-down text-xs text-[#8A9BAD] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#0B9B6E]' : ''
          }`}
        ></i>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white dark:bg-[#162019] rounded-xl border border-[#E0E8E4] dark:border-[#243028] shadow-xl py-1.5 max-h-60 overflow-y-auto animate-scale-in">
          {normalizedOptions.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#E8F7F1] dark:bg-[#0B9B6E]/15 text-[#07543F] dark:text-[#4ADE80] font-semibold'
                    : 'text-[#152238] dark:text-[#E8F0EC] hover:bg-[#F8F7F3] dark:hover:bg-[#1A2720]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {opt.icon && <i className={`${opt.icon} text-sm text-[#0B9B6E]`}></i>}
                  <div className="min-w-0">
                    <div className="truncate">{opt.label}</div>
                    {opt.subtitle && (
                      <div className="text-[11px] text-[#8A9BAD] truncate">{opt.subtitle}</div>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <i className="fa-solid fa-check text-xs text-[#0B9B6E]"></i>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
