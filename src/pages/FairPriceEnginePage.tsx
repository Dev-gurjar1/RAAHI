import React, { useState, useEffect } from 'react';
import { Tag, ShieldCheck, Search, Info, MapPin, CheckCircle2, TrendingUp, AlertCircle, Users } from 'lucide-react';
import { marketplaceStore } from '../services/store';
import { getFairPriceEstimates, FairPriceEstimate } from '../services/fairPriceService';
import { InteractivePriceChecker } from '../components/InteractivePriceChecker';

export const FairPriceEnginePage: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState('Jaipur');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const [estimates, setEstimates] = useState<FairPriceEstimate[]>([]);

  useEffect(() => {
    setEstimates(getFairPriceEstimates(selectedCity));
  }, [selectedCity]);

  const filtered = categoryFilter === 'ALL'
    ? estimates
    : estimates.filter(e => e.category === categoryFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl space-y-3 border border-slate-800">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-extrabold">
          <Tag className="w-4 h-4 text-amber-400" /> Transparent Pricing Hero Feature
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold">Know what a reasonable local price looks like before you pay.</h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          STHANIQ compares prepaid auto tariffs, verified guide standards, and ticket prices to display clear estimated fair ranges. Protect yourself from inflated tourist rates.
        </p>
      </div>

      {/* Interactive Price Checker Tool */}
      <InteractivePriceChecker />

      {/* Guide Fair Price Comparison Section (Requirement #13) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-brand-600" />
          <h3 className="text-xl font-extrabold text-slate-900">Fair Price for Certified Local Guides</h3>
        </div>
        <p className="text-xs text-slate-600">
          Compare union estimated standards against real verified guide bids on STHANIQ.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 space-y-2">
            <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider block">Jaipur Heritage Guide Standard</span>
            <span className="text-slate-700 text-xs font-semibold block">Typical Union Estimated Range:</span>
            <div className="text-2xl font-extrabold text-slate-900">₹2,000 – ₹3,000 / Day</div>
          </div>

          <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 space-y-2">
            <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">STHANIQ Verified Host Offers</span>
            <span className="text-slate-700 text-xs font-semibold block">Real Competitive Marketplace Bids:</span>
            <div className="text-2xl font-extrabold text-emerald-700">₹2,500 – ₹2,800 / Day</div>
          </div>
        </div>
      </div>

      {/* City Selector & Category Filter */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {['Jaipur', 'Delhi', 'Udaipur', 'Agra', 'Varanasi'].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  selectedCity === city
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="AUTO_TAXI">Auto / Taxi Tariffs</option>
            <option value="GUIDE_HERITAGE">Local Guide Benchmarks</option>
            <option value="STREET_FOOD">Street Food & Dining</option>
          </select>
        </div>
      </div>

      {/* Estimates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60 uppercase">
                  {item.category.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Updated: {item.lastUpdated}</span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-base leading-snug">{item.itemOrRoute}</h3>
              <p className="text-xs text-slate-500 font-medium">Unit / Terms: {item.unit}</p>

              {/* Price Range Card */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-1 text-center shadow-inner">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  Estimated Fair Range
                </span>
                <div className="text-2xl font-extrabold text-white">
                  {item.formattedRange}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1 font-medium text-slate-600">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Sourced from: {item.trustedSource}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
