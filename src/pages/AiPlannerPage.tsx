import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Compass,
  Calendar,
  Users,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { generateBudgetAwareItinerary } from '../services/aiPlannerService';
import { GeneratedItineraryPlan } from '../types';

export const AiPlannerPage: React.FC = () => {
  const [destination, setDestination] = useState('Jaipur');
  const [durationDays, setDurationDays] = useState(2);
  const [travelersCount, setTravelersCount] = useState(2);
  const [budget, setBudget] = useState(5000);
  const [enforceBudget, setEnforceBudget] = useState(true);
  const [interestsText, setInterestsText] = useState('Heritage, Local Food, Bazaars');

  const [plan, setPlan] = useState<GeneratedItineraryPlan | null>(null);

  const navigate = useNavigate();

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();

    const result = generateBudgetAwareItinerary({
      destination,
      durationDays,
      travelersCount,
      budget,
      interests: interestsText.split(',').map(s => s.trim()),
      enforceBudget
    });

    setPlan(result);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl space-y-3 border border-slate-800">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-extrabold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-400" /> Marketplace-Constrained AI Trip Planner
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold">Smart Budget-Aware Itinerary Engine</h1>

        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          AI plans your trip strictly using <strong>real STHANIQ marketplace guides, tours, and verified price benchmarks</strong>. No fabricated listings or fake prices.
        </p>

        {/* AI Rule Callout */}
        <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 text-xs text-slate-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span><strong>Strict Constraint Engine:</strong> AI never invents guide profiles or fake rates. All guide recommendations link directly to verified STHANIQ host profiles.</span>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Destination City</label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Trip Duration (Days)</label>
              <input
                type="number"
                min="1"
                max="7"
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Travelers Count</label>
              <input
                type="number"
                min="1"
                max="10"
                value={travelersCount}
                onChange={(e) => setTravelersCount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Budget (₹)</label>
              <input
                type="number"
                step="500"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-extrabold text-amber-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            {/* Hard Budget Toggle (Requirement #16) */}
            <div className="flex items-center gap-3 bg-amber-50 px-4 py-2.5 rounded-2xl border border-amber-200">
              <input
                type="checkbox"
                id="hard-budget-toggle"
                checked={enforceBudget}
                onChange={(e) => setEnforceBudget(e.target.checked)}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
              <label htmlFor="hard-budget-toggle" className="text-xs font-extrabold text-amber-900 cursor-pointer">
                Stay within my budget (Enforce Hard Constraint & Optimizer)
              </label>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-700 hover:to-amber-600 text-white font-extrabold px-8 py-3 rounded-2xl shadow-lg shadow-amber-500/25 transition transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Budget-Aware Itinerary</span>
            </button>
          </div>
        </form>
      </div>

      {/* Generated Itinerary Output */}
      {plan && (
        <div className="space-y-8 animate-fade-in">
          {/* Summary Banner */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 border border-slate-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Generated Plan for {plan.destination}</span>
                <h2 className="text-2xl font-extrabold text-white">{plan.durationDays} Days / {plan.travelersCount} Travelers</h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Total Cost</span>
                <span className="text-2xl font-extrabold text-emerald-400">₹{plan.totalEstimatedCost.toLocaleString('en-IN')}</span>
                <span className="text-xs text-slate-300 block">Remaining Budget: ₹{plan.budgetRemaining.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Warnings / Optimization Notice */}
            {plan.warnings.length > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-2xl text-xs text-amber-300 space-y-1">
                {plan.warnings.map((w, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Cost Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs bg-slate-800/90 p-4 rounded-2xl border border-slate-700">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Transport</span>
                <span className="font-bold text-white">₹{plan.costBreakdown.transport.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Verified Guide</span>
                <span className="font-bold text-white">₹{plan.costBreakdown.guide.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Local Food</span>
                <span className="font-bold text-white">₹{plan.costBreakdown.food.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Activities & Entry</span>
                <span className="font-bold text-white">₹{plan.costBreakdown.activities.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Stay (Est)</span>
                <span className="font-bold text-white">₹{plan.costBreakdown.stay.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Recommended Real STHANIQ Guides */}
          {plan.recommendedGuides.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Recommended Real STHANIQ Local Guides</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plan.recommendedGuides.map((guide) => (
                  <div key={guide.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={guide.avatar} alt={guide.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500/20" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{guide.name}</h4>
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Verified Marketplace Host
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/guides/${guide.id}`)}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs"
                    >
                      Book Host
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Day-by-day Activities Timeline */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Day-by-Day Schedule</h3>
            {plan.days.map((day) => (
              <div key={day.dayNumber} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="font-extrabold text-slate-900 text-base">Day {day.dayNumber}: {day.title}</h4>
                </div>

                <div className="space-y-3">
                  {day.activities.map((act, idx) => (
                    <div key={idx} className="flex items-start gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
                      <span className="font-bold text-amber-600 bg-amber-100 px-2.5 py-1 rounded-lg text-[10px] shrink-0">
                        {act.time}
                      </span>
                      <div className="flex-1">
                        <h5 className="font-bold text-slate-900">{act.title}</h5>
                        <p className="text-slate-600 text-[11px] mt-0.5">{act.description}</p>
                      </div>
                      <span className="font-bold text-slate-700 shrink-0">₹{act.cost}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
