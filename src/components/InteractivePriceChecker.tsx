import React, { useState } from 'react';
import { Tag, AlertTriangle, CheckCircle2, Search, ArrowRight, ShieldCheck } from 'lucide-react';

export const InteractivePriceChecker: React.FC = () => {
  const [service, setService] = useState<'AUTO' | 'GUIDE' | 'CAB'>('AUTO');
  const [from, setFrom] = useState('Jaipur Railway Station');
  const [to, setTo] = useState('Hawa Mahal / Pink City');
  const [quotedPrice, setQuotedPrice] = useState(500);

  const [checked, setChecked] = useState(true);

  // Range calculation logic based on service
  let minRange = 150;
  let maxRange = 250;

  if (service === 'GUIDE') {
    minRange = 2000;
    maxRange = 3000;
  } else if (service === 'CAB') {
    minRange = 400;
    maxRange = 650;
  }

  const isOverpriced = quotedPrice > maxRange;
  const isGoodPrice = quotedPrice >= minRange && quotedPrice <= maxRange;
  const isBargain = quotedPrice < minRange;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-700/80 space-y-6">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-extrabold">
          <Tag className="w-3.5 h-3.5 text-amber-400" /> Someone quoted you a price? Check if it's fair.
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-white">Interactive Fair Price Checker</h3>
        <p className="text-xs text-slate-300">
          Enter a quoted local price to compare against verified union rates & platform benchmarks.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        {/* Service Type */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Service Type</label>
          <select
            value={service}
            onChange={(e) => {
              const s = e.target.value as any;
              setService(s);
              setQuotedPrice(s === 'GUIDE' ? 3500 : s === 'CAB' ? 800 : 500);
            }}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 font-bold text-white focus:outline-none focus:border-amber-500"
          >
            <option value="AUTO">Auto / Taxi Ride</option>
            <option value="GUIDE">Certified Local Guide (6h)</option>
            <option value="CAB">Intercity AC Cab Ride</option>
          </select>
        </div>

        {/* From */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">From</label>
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 font-semibold text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* To */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">To</label>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 font-semibold text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Quoted Price */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Quoted Price (₹)</label>
          <input
            type="number"
            step="50"
            value={quotedPrice}
            onChange={(e) => setQuotedPrice(Number(e.target.value))}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 font-extrabold text-amber-400 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Result Card */}
      {checked && (
        <div className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700 pb-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Fair Range</span>
              <span className="text-2xl font-extrabold text-emerald-400">₹{minRange.toLocaleString('en-IN')} – ₹{maxRange.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Your Quoted Price</span>
              <span className={`text-xl font-extrabold ${isOverpriced ? 'text-rose-400' : 'text-emerald-400'}`}>
                ₹{quotedPrice.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Visual Alert */}
          {isOverpriced && (
            <div className="bg-rose-500/20 border border-rose-500/40 p-3 rounded-xl flex items-center gap-2 text-xs text-rose-300 font-semibold">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>
                ⚠️ The quoted ₹{quotedPrice.toLocaleString('en-IN')} is significantly above the estimated local range (₹{minRange}–₹{maxRange}).
              </span>
            </div>
          )}

          {isGoodPrice && (
            <div className="bg-emerald-500/20 border border-emerald-500/40 p-3 rounded-xl flex items-center gap-2 text-xs text-emerald-300 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                ✓ Fair Price! The quoted ₹{quotedPrice.toLocaleString('en-IN')} falls within the typical estimated local range.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
