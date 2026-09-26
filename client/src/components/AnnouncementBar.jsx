import React, { useState, useEffect } from 'react';

const SLOGANS = [
  "Verified Locals · Fair Prices · Zero Worries",
  "Sahi Raah. Sahi Daam. Har Safar RAAHI Ke Naam.",
  "Jaipur City Guides · Transparent Tariff Benchmarks",
  "Explore Like a Local · Pay Like a Smart Traveler"
];

export const AnnouncementBar = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLOGANS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#0B9B6E] text-white text-xs py-2.5 px-5 transition-colors">
      <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="bg-white/20 text-white border border-white/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
            LIVE DEMO
          </span>
          <span className="text-white/30">·</span>
          <span className="text-white/80 font-medium text-[11px] tracking-wide transition-opacity">
            {SLOGANS[index]}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-white/70 bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
            <i className="fa-solid fa-location-dot text-white/60"></i>
            <span className="font-semibold text-white">Jaipur, Rajasthan</span>
          </div>
        </div>
      </div>
    </div>
  );
};
