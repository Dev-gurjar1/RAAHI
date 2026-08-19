import React, { useState } from 'react';
import { JAIPUR_TOURS_DATA } from '../constants/packages';
import { useToastStore } from '../store/useToastStore';

export const ToursPage: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState('all');
  const showToast = useToastStore((state) => state.showToast);

  const filteredPackages = JAIPUR_TOURS_DATA.filter(
    (t) => selectedCat === 'all' || t.category === selectedCat
  );

  const handleSelectTour = (title: string, price: number) => {
    showToast({
      type: 'success',
      title: 'Experience Selected',
      message: `${title} (₹${price}/person) - Proceed to assign guide!`
    });
  };

  return (
    <div className="space-y-8 text-left">
      {/* Header Card */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-orange-500">
            EXPERIENCE MARKETPLACE
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            Curated Jaipur Tour Packages
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Private, authentic itineraries crafted and escorted by certified local hosts with fixed transparent pricing.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['all', 'Heritage', 'Food', 'Culture', 'Photography'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition capitalize flex-shrink-0 ${
                selectedCat === cat
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {cat === 'all' ? 'All Experiences' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((t) => (
          <div
            key={t.id}
            className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-card hover:shadow-floating transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="h-52 relative overflow-hidden">
                <img
                  src={t.image}
                  alt={t.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3.5 left-3.5 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md text-orange-600 dark:text-orange-400 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                  {t.category}
                </span>
                <span className="absolute bottom-3.5 right-3.5 bg-black/60 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                  Host: {t.guideName}
                </span>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="font-bold text-slate-900 dark:text-white text-base font-heading group-hover:text-orange-500 transition">
                  {t.title}
                </h3>
                <div className="text-xs text-slate-500 flex items-center gap-3">
                  <span><i className="fa-solid fa-clock mr-1 text-slate-400"></i> {t.duration}</span>
                  <span className="text-amber-500 font-bold">★ {t.rating}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {t.description}
                </p>
                <div className="space-y-1 pt-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Highlights Included:</div>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    {t.highlights.map((h, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <i className="fa-solid fa-check text-emerald-500 text-[10px]"></i>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Fixed Price</span>
                <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">₹{t.price} <span className="text-xs font-normal text-slate-400">/ person</span></span>
              </div>
              <button
                onClick={() => handleSelectTour(t.title, t.price)}
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full text-xs transition shadow-md shadow-orange-500/20"
              >
                Book Package
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
