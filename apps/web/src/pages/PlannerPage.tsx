import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToastStore } from '../store/useToastStore';
import { ItineraryPlan } from '@raahi/shared-types';

export const PlannerPage: React.FC = () => {
  const [days, setDays] = useState(1);
  const [style, setStyle] = useState('heritage');
  const [plan, setPlan] = useState<ItineraryPlan | null>(null);

  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);

  const handleGenerate = () => {
    const activitiesMap: Record<string, Array<{ time: string; location: string; duration: string; ticketCost: string; transportCost: string; guideTip: string }>> = {
      heritage: [
        { time: "08:30 AM", location: "Amer Fort & Sheesh Mahal Secret Passage", duration: "3 hrs", ticketCost: "₹100", transportCost: "₹120", guideTip: "Guided underground passage and acoustic hall trail" },
        { time: "01:00 PM", location: "Jal Mahal Lakefront & Royal Lunch", duration: "1.5 hrs", ticketCost: "Free", transportCost: "₹60", guideTip: "Scenic lake reflections and camel photo spot" },
        { time: "03:30 PM", location: "City Palace & Jantar Mantar Observatory", duration: "2.5 hrs", ticketCost: "₹200", transportCost: "₹80", guideTip: "Astronomical instrument sundial demo by local host" }
      ],
      food: [
        { time: "09:00 AM", location: "Chaura Rasta Rawat Kachori & Tea", duration: "1.5 hrs", ticketCost: "Free", transportCost: "₹40", guideTip: "Hot Pyaz Kachori and saffron spiced chai" },
        { time: "12:30 PM", location: "MI Road Lassiwala & Street Food Alleys", duration: "2 hrs", ticketCost: "Free", transportCost: "₹50", guideTip: "Original clay-cup churned sweet lassi" },
        { time: "04:00 PM", location: "Johari Bazaar Ghewar Sweet Masterclass", duration: "2 hrs", ticketCost: "Free", transportCost: "₹60", guideTip: "90-year-old honeyed honeycomb dessert tasting" }
      ],
      shopping: [
        { time: "10:00 AM", location: "Johari Bazaar Gemstone & Jewelry Walk", duration: "2.5 hrs", ticketCost: "Free", transportCost: "₹60", guideTip: "Certified gem vetting and silver filigree crafts" },
        { time: "02:00 PM", location: "Bapu Bazaar Textile & Block Print Guilds", duration: "2.5 hrs", ticketCost: "Free", transportCost: "₹70", guideTip: "Direct-artisan pricing on pure cotton quilts" }
      ],
      photography: [
        { time: "06:00 AM", location: "Patrika Gate Sunrise Symmetry Shot", duration: "1.5 hrs", ticketCost: "Free", transportCost: "₹80", guideTip: "Best morning light through 9 hand-painted arches" },
        { time: "08:30 AM", location: "Panna Meena Kund Stepwell Geometry", duration: "2 hrs", ticketCost: "Free", transportCost: "₹100", guideTip: "Symmetrical zigzag staircases with no crowds" },
        { time: "05:00 PM", location: "Nahargarh Fort Sunset Skyline", duration: "2.5 hrs", ticketCost: "₹50", transportCost: "₹150", guideTip: "Panoramic views over entire glowing Pink City" }
      ]
    };

    const activities = activitiesMap[style] || activitiesMap.heritage;

    setPlan({
      days,
      style,
      activities,
      budget: {
        guide: days * 800,
        transport: days * 350,
        tickets: days * 300,
        total: days * 800 + days * 350 + days * 300
      }
    });

    showToast({
      type: 'success',
      title: 'Itinerary Generated!',
      message: `${days}-Day customized ${style} plan created with itemized budget.`
    });
  };

  return (
    <div className="space-y-8 text-left">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-orange-50/70 via-white to-amber-50/60 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 p-6 sm:p-8 rounded-3xl border border-orange-200/60 dark:border-slate-700 shadow-card">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-500/10 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-500/20">
            <i className="fa-solid fa-wand-magic-sparkles mr-1.5"></i> AI Travel Planner
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            Smart Jaipur Itinerary Engine
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            Generate an intelligent, time-optimized travel plan with estimated tickets, local transport costs, and certified guide recommendations.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Trip Duration</label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`py-3 rounded-2xl text-xs font-bold transition ${
                    days === d
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {d} Day{d > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Experience Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="heritage">Heritage & Royal Forts (Amer, Jaigarh, City Palace)</option>
              <option value="food">Old City Street Food & Bazaar Crawl (Kachori, Lassi, Ghewar)</option>
              <option value="shopping">Handicrafts, Gems & Block Printing (Johari, Sanganer)</option>
              <option value="photography">Sunrise & Architectural Photography Trail</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-3.5 rounded-full transition shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
        >
          <i className="fa-solid fa-wand-magic-sparkles"></i> Generate AI Itinerary & Budget
        </button>
      </div>

      {plan && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-5">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
              Generated Timeline ({plan.days} Day {plan.style} Journey)
            </h3>
            
            <div className="space-y-4 relative before:content-[''] before:absolute before:top-3 before:bottom-3 before:left-3 before:w-0.5 before:bg-orange-200 dark:before:bg-slate-700 pl-8">
              {plan.activities.map((a, idx) => (
                <div key={idx} className="relative space-y-1">
                  <span className="absolute -left-8 top-1.5 w-3.5 h-3.5 rounded-full bg-orange-500 border-2 border-white"></span>
                  <div className="flex items-center justify-between text-xs text-orange-600 dark:text-orange-400 font-bold">
                    <span>{a.time}</span>
                    <span>{a.duration}</span>
                  </div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white font-heading">{a.location}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{a.guideTip}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">Estimated Budget Breakdown</h3>
            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between"><span>Guide Budget:</span><span className="font-bold text-slate-900 dark:text-white">₹{plan.budget.guide}</span></div>
              <div className="flex justify-between"><span>Transport Budget:</span><span className="font-bold text-slate-900 dark:text-white">₹{plan.budget.transport}</span></div>
              <div className="flex justify-between"><span>Tickets Estimate:</span><span className="font-bold text-slate-900 dark:text-white">₹{plan.budget.tickets}</span></div>
              <div className="flex justify-between pt-3 border-t border-slate-100 dark:border-slate-700 text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                <span>Total Est:</span><span>₹{plan.budget.total}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/guides')}
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full text-xs uppercase tracking-wider transition shadow-md shadow-orange-500/20"
            >
              Book Guide for This Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
