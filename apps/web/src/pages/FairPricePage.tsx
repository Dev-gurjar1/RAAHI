import React, { useState } from 'react';
import { RateCardModal } from '../components/modals/RateCardModal';
import { ScamReportModal } from '../components/modals/ScamReportModal';
import { TransportVehicleType, FairPriceEstimate } from '@raahi/shared-types';

export const FairPricePage: React.FC = () => {
  const [mode, setMode] = useState<TransportVehicleType>('auto');
  const [dist, setDist] = useState(5.5);
  const [wait, setWait] = useState(15);
  const [night, setNight] = useState(false);
  const [askingPrice, setAskingPrice] = useState('220');

  const [estimate, setEstimate] = useState<FairPriceEstimate>({
    minFare: 98,
    recommendedFare: 107,
    maxFare: 123,
    currency: '₹',
    warningLevel: 'severe',
    askingPrice: 220,
    potentialOvercharge: 113,
    percentageOvercharge: 105
  });

  const [isRateCardOpen, setIsRateCardOpen] = useState(false);
  const [isScamModalOpen, setIsScamModalOpen] = useState(false);

  const calculateFare = () => {
    let base = 30;
    let kmRate = 14;
    let wRate = 1;

    if (mode === 'eRickshaw') {
      base = 20;
      kmRate = 10;
      wRate = 0.5;
    } else if (mode === 'guide') {
      base = 150;
      kmRate = 40;
      wRate = 2;
    }

    let calculated = base + dist * kmRate + wait * wRate;
    if (night) calculated *= 1.25;

    const minFare = Math.round(calculated * 0.9);
    const recommendedFare = Math.round(calculated);
    const maxFare = Math.round(calculated * 1.15);

    const ask = parseFloat(askingPrice);
    let overcharge = 0;
    let pctOvercharge = 0;
    let warningLevel: 'none' | 'moderate' | 'severe' = 'none';

    if (ask && ask > maxFare) {
      overcharge = Math.round(ask - recommendedFare);
      pctOvercharge = Math.round((overcharge / recommendedFare) * 100);
      warningLevel = pctOvercharge > 50 ? 'severe' : 'moderate';
    }

    setEstimate({
      minFare,
      recommendedFare,
      maxFare,
      askingPrice: ask || undefined,
      potentialOvercharge: overcharge,
      percentageOvercharge: pctOvercharge,
      warningLevel,
      currency: '₹'
    });
  };

  return (
    <div className="space-y-8 text-left">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-orange-50/70 via-white to-amber-50/60 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 p-6 sm:p-8 rounded-3xl border border-orange-200/60 dark:border-slate-700 shadow-card">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-500/10 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-500/20">
            <i className="fa-solid fa-shield-halved mr-1.5"></i> Anti-Scam Tariff Shield
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            RAAHI Fair Price Calculator
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            Verify official Jaipur city benchmark tariffs before hiring an auto, e-rickshaw, or local guide. Know what a trip actually costs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Parameters Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
            <i className="fa-solid fa-calculator text-orange-500"></i> Trip Tariff Parameters
          </h2>

          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Transport Vehicle Type</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setMode('auto')}
                  className={`p-3.5 rounded-2xl border text-xs flex flex-col items-center gap-1.5 font-bold transition ${
                    mode === 'auto'
                      ? 'bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-500/20'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <i className="fa-solid fa-taxi text-lg"></i> Auto Rickshaw
                </button>
                <button
                  onClick={() => setMode('eRickshaw')}
                  className={`p-3.5 rounded-2xl border text-xs flex flex-col items-center gap-1.5 font-bold transition ${
                    mode === 'eRickshaw'
                      ? 'bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-500/20'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <i className="fa-solid fa-bolt text-lg"></i> E-Rickshaw
                </button>
                <button
                  onClick={() => setMode('guide')}
                  className={`p-3.5 rounded-2xl border text-xs flex flex-col items-center gap-1.5 font-bold transition ${
                    mode === 'guide'
                      ? 'bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-500/20'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <i className="fa-solid fa-user-graduate text-lg"></i> Local Guide
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-300">Travel Distance</span>
                <span className="text-orange-600 dark:text-orange-400 font-extrabold">{dist} km</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="0.5"
                value={dist}
                onChange={(e) => setDist(parseFloat(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-300">Waiting Time at Monuments</span>
                <span className="text-orange-600 dark:text-orange-400 font-extrabold">{wait} min</span>
              </div>
              <input
                type="range"
                min="0"
                max="120"
                step="15"
                value={wait}
                onChange={(e) => setWait(parseFloat(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Night Multiplier (10PM-5AM)</span>
                <input
                  type="checkbox"
                  checked={night}
                  onChange={(e) => setNight(e.target.checked)}
                  className="w-4 h-4 accent-orange-500 cursor-pointer"
                />
              </div>

              <div>
                <input
                  type="number"
                  value={askingPrice}
                  onChange={(e) => setAskingPrice(e.target.value)}
                  placeholder="Driver's Quote (₹) e.g. 180"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button
              onClick={calculateFare}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-3.5 rounded-full transition text-center shadow-md shadow-emerald-500/20 text-xs uppercase tracking-wider"
            >
              <i className="fa-solid fa-shield-halved mr-1.5"></i> Calculate Benchmark Price
            </button>
            <button
              onClick={() => setIsRateCardOpen(true)}
              className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold px-4 py-3.5 rounded-full transition text-xs flex items-center gap-1.5"
            >
              <i className="fa-solid fa-file-invoice"></i> Rate Card
            </button>
          </div>
        </div>

        {/* Results Box */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">Benchmark Assessment</h2>

            <div className="bg-emerald-50/80 dark:bg-emerald-950/40 p-6 rounded-3xl border border-emerald-200 dark:border-emerald-500/30 text-center space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-emerald-800 dark:text-emerald-300 font-bold block">
                FAIR BENCHMARK RANGE
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 font-heading">
                ₹{estimate.minFare} – ₹{estimate.maxFare}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 font-medium pt-1">
                Recommended Fair Target: <span className="text-slate-900 dark:text-white font-extrabold">₹{estimate.recommendedFare}</span>
              </div>
            </div>

            {estimate.warningLevel !== 'none' && (
              <div className="p-4 rounded-2xl border border-rose-300 dark:border-rose-500/40 bg-rose-50 dark:bg-rose-950/40 space-y-1.5">
                <div className="text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  <span>Overcharge Risk Detected!</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  Driver asked: <span className="font-bold text-slate-900 dark:text-white">₹{estimate.askingPrice}</span> | Overcharge: <span className="text-rose-600 dark:text-rose-400 font-bold">+₹{estimate.potentialOvercharge} (+{estimate.percentageOvercharge}%)</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 p-6 rounded-3xl space-y-3">
            <h3 className="text-base font-bold text-rose-800 dark:text-rose-300 font-heading flex items-center gap-2">
              <i className="fa-solid fa-triangle-exclamation"></i> Overcharged or Harassed?
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-xs">
              Log an instant incident report to alert our safety response dispatch team.
            </p>
            <button
              onClick={() => setIsScamModalOpen(true)}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full text-xs transition shadow-md shadow-rose-600/20 uppercase tracking-wider"
            >
              Report Scam / Overcharging Incident
            </button>
          </div>
        </div>
      </div>

      <RateCardModal isOpen={isRateCardOpen} onClose={() => setIsRateCardOpen(false)} />
      <ScamReportModal isOpen={isScamModalOpen} onClose={() => setIsScamModalOpen(false)} />
    </div>
  );
};
