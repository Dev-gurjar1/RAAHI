import React from 'react';

/**
 * Editorial Fair Price Gauge
 * Visualizes Market Minimum, Fair Typical Range, User Quote, and Upper Ceilings
 */
export const PriceGauge = ({
  minPrice = 120,
  typicalMin = 150,
  typicalMax = 220,
  userQuote = 180,
  maxCeiling = 350,
  unit = '₹',
}) => {
  // Determine status
  const isFair = userQuote <= typicalMax && userQuote >= typicalMin * 0.9;
  const isBargain = userQuote < typicalMin * 0.9;
  const isOvercharge = userQuote > typicalMax;

  // Percentage on a 0-100 scale
  const rangeSpan = Math.max(maxCeiling - minPrice, 100);
  const getPercent = (val) => {
    const clamped = Math.max(minPrice, Math.min(maxCeiling, val));
    return Math.round(((clamped - minPrice) / rangeSpan) * 100);
  };

  const userPercent = getPercent(userQuote);
  const fairStart = getPercent(typicalMin);
  const fairWidth = Math.max(12, getPercent(typicalMax) - fairStart);

  return (
    <div className="p-6 rounded-2xl bg-[#F8F7F3] dark:bg-[#162019] border border-[#E0E8E4] dark:border-[#243028] space-y-5">
      {/* Header status */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A9BAD] block">
            Analysis Result
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            {isFair ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F7F1] dark:bg-[#07543F]/40 text-[#07543F] dark:text-[#4ADE80] font-extrabold text-xs">
                <i className="fa-solid fa-circle-check text-[#0B9B6E]"></i>
                FAIR MARKET PRICE
              </span>
            ) : isBargain ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-extrabold text-xs">
                <i className="fa-solid fa-tag text-blue-500"></i>
                BELOW TYPICAL (GREAT VALUE)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-[#D45D0E] dark:text-amber-400 font-extrabold text-xs">
                <i className="fa-solid fa-triangle-exclamation text-[#F4A340]"></i>
                CAUTION: QUOTE HIGHER THAN BENCHMARK
              </span>
            )}
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-[#8A9BAD] uppercase font-bold block">Your Quote</span>
          <div className="text-2xl font-extrabold text-[#152238] dark:text-white font-heading">
            {unit}{userQuote}
          </div>
        </div>
      </div>

      {/* Visual Bar Gauge */}
      <div className="space-y-2 pt-2">
        <div className="relative h-4 rounded-full bg-[#E0E8E4] dark:bg-[#243028] overflow-hidden">
          {/* Fair Zone highlighted */}
          <div
            className="absolute top-0 bottom-0 bg-[#0B9B6E]/30 dark:bg-[#0B9B6E]/40 border-l border-r border-[#0B9B6E]"
            style={{ left: `${fairStart}%`, width: `${fairWidth}%` }}
          />

          {/* User quote indicator */}
          <div
            className={`absolute top-0 bottom-0 w-2.5 rounded-full transition-all duration-300 shadow-md ${
              isFair
                ? 'bg-[#0B9B6E] ring-2 ring-white'
                : isBargain
                ? 'bg-blue-600 ring-2 ring-white'
                : 'bg-[#F4A340] ring-2 ring-white'
            }`}
            style={{ left: `calc(${userPercent}% - 5px)` }}
          />
        </div>

        {/* Legend / Range labels */}
        <div className="flex items-center justify-between text-xs text-[#8A9BAD] font-medium pt-1">
          <div>
            <span className="block text-[10px] text-[#8A9BAD]">Market Min</span>
            <span className="font-semibold text-[#152238] dark:text-[#E8F0EC]">{unit}{minPrice}</span>
          </div>
          <div className="text-center">
            <span className="block text-[10px] text-[#07543F] dark:text-[#4ADE80] font-bold">
              ✓ Typical Fair Range
            </span>
            <span className="font-bold text-[#07543F] dark:text-[#4ADE80]">
              {unit}{typicalMin} — {unit}{typicalMax}
            </span>
          </div>
          <div className="text-right">
            <span className="block text-[10px] text-[#8A9BAD]">Upper Ceiling</span>
            <span className="font-semibold text-[#152238] dark:text-[#E8F0EC]">{unit}{maxCeiling}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
