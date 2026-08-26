import React, { useState, useEffect } from 'react';
import { RateCardModal } from '../components/modals/RateCardModal';
import { ScamReportModal } from '../components/modals/ScamReportModal';
import { TransportVehicleType } from '@raahi/shared-types';

export type ExtendedServiceType = TransportVehicleType | 'taxi';

export type RiskLevel = 'FAIR' | 'SLIGHTLY_HIGH' | 'OVERPRICED' | 'HIGH_OVERCHARGE_RISK';

export interface DetailedFareBreakdown {
  mode: ExtendedServiceType;
  baseFare: number;
  perKmRate: number;
  distanceKm: number;
  distanceFee: number;
  waitingMinutes: number;
  perMinRate: number;
  durationFee: number;
  travelersCount: number;
  extraTravelersFee: number;
  isNightRate: boolean;
  nightSurchargeFee: number;
  estimatedBaseSubtotal: number;
  recommendedFare: number;
  minFare: number;
  maxFare: number;
  askingPrice: number;
  potentialOvercharge: number;
  percentageOvercharge: number;
  riskLevel: RiskLevel;
}

export const FairPricePage: React.FC = () => {
  const [mode, setMode] = useState<ExtendedServiceType>('auto');
  const [dist, setDist] = useState(5.5);
  const [wait, setWait] = useState(15);
  const [travelers, setTravelers] = useState(2);
  const [night, setNight] = useState(false);
  const [askingPrice, setAskingPrice] = useState('220');

  const [isWhyExpanded, setIsWhyExpanded] = useState(true);
  const [isRateCardOpen, setIsRateCardOpen] = useState(false);
  const [isScamModalOpen, setIsScamModalOpen] = useState(false);

  // Fare Engine Calculation Function
  const computeFare = (): DetailedFareBreakdown => {
    let baseFare = 30;
    let perKmRate = 14;
    let perMinRate = 1;

    if (mode === 'eRickshaw') {
      baseFare = 20;
      perKmRate = 10;
      perMinRate = 0.5;
    } else if (mode === 'guide') {
      baseFare = 150;
      perKmRate = 40;
      perMinRate = 2;
    } else if (mode === 'taxi') {
      baseFare = 80;
      perKmRate = 22;
      perMinRate = 1.5;
    }

    const distanceFee = Math.round(dist * perKmRate);
    const durationFee = Math.round(wait * perMinRate);

    // Extra travelers surcharge (for guides/taxis > 2 travelers)
    let extraTravelersFee = 0;
    if (travelers > 2) {
      extraTravelersFee = (travelers - 2) * (mode === 'guide' ? 100 : 40);
    }

    const unadjustedTotal = baseFare + distanceFee + durationFee + extraTravelersFee;
    const nightSurchargeFee = night ? Math.round(unadjustedTotal * 0.25) : 0;
    const calculated = unadjustedTotal + nightSurchargeFee;

    const minFare = Math.round(calculated * 0.90);
    const recommendedFare = Math.round(calculated);
    const maxFare = Math.round(calculated * 1.15);

    const ask = parseFloat(askingPrice) || 0;
    let potentialOvercharge = 0;
    let percentageOvercharge = 0;
    let riskLevel: RiskLevel = 'FAIR';

    if (ask > maxFare) {
      potentialOvercharge = Math.round(ask - recommendedFare);
      percentageOvercharge = Math.round((potentialOvercharge / recommendedFare) * 100);

      const maxDifferenceRatio = ask / maxFare;
      if (maxDifferenceRatio <= 1.25) {
        riskLevel = 'SLIGHTLY_HIGH';
      } else if (maxDifferenceRatio <= 1.60) {
        riskLevel = 'OVERPRICED';
      } else {
        riskLevel = 'HIGH_OVERCHARGE_RISK';
      }
    } else {
      riskLevel = 'FAIR';
      potentialOvercharge = 0;
      percentageOvercharge = 0;
    }

    return {
      mode,
      baseFare,
      perKmRate,
      distanceKm: dist,
      distanceFee,
      waitingMinutes: wait,
      perMinRate,
      durationFee,
      travelersCount: travelers,
      extraTravelersFee,
      isNightRate: night,
      nightSurchargeFee,
      estimatedBaseSubtotal: unadjustedTotal,
      recommendedFare,
      minFare,
      maxFare,
      askingPrice: ask,
      potentialOvercharge,
      percentageOvercharge,
      riskLevel
    };
  };

  const fare = computeFare();

  return (
    <div className="space-y-8 text-left font-sans pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-orange-50/80 via-white to-amber-50/70 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 p-6 sm:p-8 rounded-3xl border border-orange-200/60 dark:border-slate-700 shadow-card">
        <div className="max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-500/10 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-500/20">
              <i className="fa-solid fa-shield-halved mr-1.5"></i> Jaipur RTO Tariff Shield
            </span>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
              Demo Regional Dataset 2026
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
            RAAHI Fair Price Calculator
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
            Transparently verify standard local tariffs for auto-rickshaws, e-rickshaws, taxis, and local hosts across Jaipur. Understand exactly why a price is fair or overpriced before you pay.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Input Parameters Form (Col 7) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
              <i className="fa-solid fa-calculator text-orange-500"></i> Trip Tariff Parameters
            </h2>
            <button
              onClick={() => setIsRateCardOpen(true)}
              className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
            >
              <i className="fa-solid fa-file-invoice"></i> View Jaipur RTO Tariff Rate Card
            </button>
          </div>

          <div className="space-y-6">
            
            {/* Service Type Selection */}
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
                Service / Transport Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={() => setMode('auto')}
                  className={`p-3 rounded-2xl border text-xs flex flex-col items-center justify-center gap-1.5 font-bold transition ${
                    mode === 'auto'
                      ? 'bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-500/20'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <i className="fa-solid fa-taxi text-base"></i> Auto Rickshaw
                </button>

                <button
                  type="button"
                  onClick={() => setMode('eRickshaw')}
                  className={`p-3 rounded-2xl border text-xs flex flex-col items-center justify-center gap-1.5 font-bold transition ${
                    mode === 'eRickshaw'
                      ? 'bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-500/20'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <i className="fa-solid fa-bolt text-base"></i> E-Rickshaw
                </button>

                <button
                  type="button"
                  onClick={() => setMode('taxi')}
                  className={`p-3 rounded-2xl border text-xs flex flex-col items-center justify-center gap-1.5 font-bold transition ${
                    mode === 'taxi'
                      ? 'bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-500/20'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <i className="fa-solid fa-car text-base"></i> Private Cab
                </button>

                <button
                  type="button"
                  onClick={() => setMode('guide')}
                  className={`p-3 rounded-2xl border text-xs flex flex-col items-center justify-center gap-1.5 font-bold transition ${
                    mode === 'guide'
                      ? 'bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-500/20'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <i className="fa-solid fa-user-graduate text-base"></i> Local Host
                </button>
              </div>
            </div>

            {/* Distance Slider */}
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

            {/* Waiting / Duration Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-300">
                  {mode === 'guide' ? 'Host Duration' : 'Monument Waiting Time'}
                </span>
                <span className="text-orange-600 dark:text-orange-400 font-extrabold">
                  {mode === 'guide' ? `${Math.round(wait / 15 * 0.5)} Hours (${wait} min)` : `${wait} minutes`}
                </span>
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

            {/* Passengers & Night Surcharge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Traveler Counter */}
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Number of Travelers
                </label>
                <div className="flex items-center bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-1.5 justify-between">
                  <button
                    type="button"
                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 transition text-sm"
                  >
                    -
                  </button>
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {travelers} Guest{travelers > 1 ? 's' : ''}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTravelers(Math.min(6, travelers + 1))}
                    className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 transition text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Driver Quoted Price Input */}
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Quoted Price / Demanded Fare (₹)
                </label>
                <input
                  type="number"
                  value={askingPrice}
                  onChange={(e) => setAskingPrice(e.target.value)}
                  placeholder="e.g. 220"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs font-extrabold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Night Time Surcharge Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Night Multiplier (10 PM – 5 AM)</div>
                <div className="text-[10px] text-slate-400">+25% standard late-night RTO tariff adjustment</div>
              </div>
              <input
                type="checkbox"
                checked={night}
                onChange={(e) => setNight(e.target.checked)}
                className="w-5 h-5 accent-orange-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Results & Overcharge Risk Card (Col 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
              Benchmark Assessment Results
            </h2>

            {/* RISK STATE BADGE */}
            <div
              className={`p-5 rounded-3xl border text-center space-y-2 transition duration-300 ${
                fare.riskLevel === 'FAIR'
                  ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300'
                  : fare.riskLevel === 'SLIGHTLY_HIGH'
                  ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-300'
                  : fare.riskLevel === 'OVERPRICED'
                  ? 'bg-orange-50/90 dark:bg-orange-950/40 border-orange-300 dark:border-orange-500/40 text-orange-800 dark:text-orange-300'
                  : 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-300 dark:border-rose-500/40 text-rose-800 dark:text-rose-300'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full bg-white/70 dark:bg-slate-900/70 border border-current">
                  {fare.riskLevel === 'FAIR' && '🟢 FAIR PRICE'}
                  {fare.riskLevel === 'SLIGHTLY_HIGH' && '🟡 SLIGHTLY HIGH'}
                  {fare.riskLevel === 'OVERPRICED' && '🟠 OVERPRICED'}
                  {fare.riskLevel === 'HIGH_OVERCHARGE_RISK' && '🔴 HIGH OVERCHARGE RISK'}
                </span>
              </div>

              <div className="pt-2">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                  RECOMMENDED FAIR TARGET
                </span>
                <div className="text-3xl sm:text-4xl font-black font-heading tracking-tight mt-0.5">
                  ₹{fare.recommendedFare}
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                  Fair Benchmark Range: <span className="font-extrabold text-slate-900 dark:text-white">₹{fare.minFare} – ₹{fare.maxFare}</span>
                </div>
              </div>
            </div>

            {/* QUOTED PRICE COMPARISON GRID */}
            <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Quoted Price</span>
                <span className="font-black text-slate-900 dark:text-white text-base">₹{fare.askingPrice}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Fair Price</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400 text-base">₹{fare.recommendedFare}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Overcharge</span>
                <span
                  className={`font-black text-base ${
                    fare.potentialOvercharge > 0
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {fare.potentialOvercharge > 0 ? `+₹${fare.potentialOvercharge}` : '₹0'}
                </span>
              </div>
            </div>

            {/* OVERCHARGE WARNING ALERT */}
            {fare.potentialOvercharge > 0 && (
              <div className="p-4 rounded-2xl border border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-950/30 space-y-1.5">
                <div className="text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  <span>Excessive Fare Warning (+{fare.percentageOvercharge}%)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  The quoted fare of <span className="font-bold text-slate-900 dark:text-white">₹{fare.askingPrice}</span> is <span className="font-bold text-rose-600 dark:text-rose-400">₹{fare.potentialOvercharge} higher</span> than the recommended Jaipur target of ₹{fare.recommendedFare}.
                </p>
              </div>
            )}

            {/* EXPANDABLE "WHY THIS PRICE?" SECTION */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => setIsWhyExpanded(!isWhyExpanded)}
                className="w-full p-4 bg-slate-50 dark:bg-slate-900 flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <span className="flex items-center gap-2">
                  <i className="fa-solid fa-circle-info text-orange-500"></i>
                  <span>Why this price? (Itemized Breakdown)</span>
                </span>
                <i className={`fa-solid fa-chevron-${isWhyExpanded ? 'up' : 'down'} text-slate-400`}></i>
              </button>

              {isWhyExpanded && (
                <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                  <div className="space-y-2">
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Base Flag Fall ({mode.toUpperCase()})</span>
                      <span className="font-bold text-slate-900 dark:text-white">₹{fare.baseFare}</span>
                    </div>

                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Distance ({fare.distanceKm} km × ₹{fare.perKmRate}/km)</span>
                      <span className="font-bold text-slate-900 dark:text-white">₹{fare.distanceFee}</span>
                    </div>

                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>Duration / Waiting ({fare.waitingMinutes} min × ₹{fare.perMinRate}/min)</span>
                      <span className="font-bold text-slate-900 dark:text-white">₹{fare.durationFee}</span>
                    </div>

                    {fare.extraTravelersFee > 0 && (
                      <div className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span>Extra Travelers Surcharge ({fare.travelersCount} guests)</span>
                        <span className="font-bold text-slate-900 dark:text-white">+₹{fare.extraTravelersFee}</span>
                      </div>
                    )}

                    {fare.nightSurchargeFee > 0 && (
                      <div className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span>Night Surcharge (+25%)</span>
                        <span className="font-bold text-slate-900 dark:text-white">+₹{fare.nightSurchargeFee}</span>
                      </div>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-700 pt-2 flex justify-between font-extrabold text-slate-900 dark:text-white">
                      <span>Recommended Target Total</span>
                      <span className="text-orange-600 dark:text-orange-400">₹{fare.recommendedFare}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 leading-relaxed border-t border-slate-100 dark:border-slate-700">
                    Tariffs are calculated using standard Jaipur city regional benchmarks. Real-world fares may vary slightly based on traffic and weather conditions.
                  </p>
                </div>
              )}
            </div>

            {/* REPORT OVERCHARGING ACTION */}
            <button
              onClick={() => setIsScamModalOpen(true)}
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-2xl transition shadow-md shadow-rose-600/20 uppercase tracking-wider text-xs flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-triangle-exclamation"></i>
              <span>Report Overcharging Incident</span>
            </button>

          </div>
        </div>

      </div>

      <RateCardModal isOpen={isRateCardOpen} onClose={() => setIsRateCardOpen(false)} />
      <ScamReportModal
        isOpen={isScamModalOpen}
        onClose={() => setIsScamModalOpen(false)}
        initialQuotedPrice={askingPrice}
        initialExpectedFare={fare.recommendedFare.toString()}
        initialService={mode}
      />
    </div>
  );
};

