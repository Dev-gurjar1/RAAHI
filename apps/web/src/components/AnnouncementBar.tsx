import React, { useState, useEffect } from 'react';

const SLOGANS = [
  "Verified Locals • Fair Prices • Zero Worries",
  "Sahi Raah. Sahi Daam. Har Safar RAAHI Ke Naam.",
  "Jaipur City Guides • Transparent Tariff Benchmarks",
  "Explore Like a Local • Pay Like a Smart Traveler"
];

export const AnnouncementBar: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLOGANS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-slate-900 text-white text-xs py-2 px-6 border-b border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
            LIVE DEMO
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300 font-medium text-[11px] tracking-wide animate-fade">
            {SLOGANS[index]}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
            <i className="fa-solid fa-location-dot text-orange-400"></i>
            <span className="font-semibold text-white">Jaipur, Rajasthan</span>
          </div>
        </div>
      </div>
    </div>
  );
};
