import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTourStore } from '../store/useTourStore';

export const ToursPage: React.FC = () => {
  const { tours } = useTourStore();
  const [selectedCat, setSelectedCat] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const filteredTours = tours.filter((t) => {
    const matchesCat = selectedCat === 'all' || t.category === selectedCat;
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.guideName.toLowerCase().includes(search.toLowerCase()) ||
      t.summary.toLowerCase().includes(search.toLowerCase());
    const matchesDate = !selectedDate || t.availableDates.includes(selectedDate);
    return matchesCat && matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-8 text-left font-sans pb-16">
      
      {/* HEADER CARD */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-500">
              EXPERIENCE MARKETPLACE
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
              Curated Local Experiences & Heritage Tours
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
              Private, authentic itineraries crafted and escorted by background-verified local hosts.
            </p>
          </div>

          <NavLink
            to="/guide/create-tour"
            className="px-4 py-2.5 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-400 font-bold text-xs rounded-2xl border border-emerald-200 dark:border-emerald-500/20 transition flex items-center gap-2 whitespace-nowrap"
          >
            <i className="fa-solid fa-plus text-xs"></i>
            <span>Guide: Create Tour Package</span>
          </NavLink>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          
          {/* Search Box */}
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by tour title, host name..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 font-semibold"
            />
          </div>

          {/* Available Date Selector */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-semibold"
          />

          {/* Reset Filters */}
          <button
            onClick={() => { setSelectedCat('all'); setSearch(''); setSelectedDate(''); }}
            className="py-2.5 px-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-2xl hover:bg-slate-200 transition"
          >
            Reset Filters
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['all', 'Heritage', 'Food', 'Culture', 'Shopping', 'Photography'].map((cat) => (
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

      {/* EXPERIENCES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTours.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-2">
            <div className="text-slate-400 text-2xl"><i className="fa-solid fa-compass"></i></div>
            <div className="text-base font-bold text-slate-900 dark:text-white">No experiences match your criteria</div>
            <p className="text-xs text-slate-500">Try resetting your date or category filters.</p>
          </div>
        ) : (
          filteredTours.map((t) => (
            <div
              key={t.id}
              className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-card hover:shadow-floating transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="h-52 relative overflow-hidden">
                  <img
                    src={t.coverImage}
                    alt={t.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-3.5 left-3.5 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md text-orange-600 dark:text-orange-400 text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
                    {t.category}
                  </span>
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between">
                    <span className="bg-black/70 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1.5">
                      <img src={t.guideAvatar} alt={t.guideName} className="w-4 h-4 rounded-full object-cover" />
                      <span>Host: {t.guideName}</span>
                    </span>
                    <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">
                      ★ {t.rating} ({t.reviewCount})
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base font-heading group-hover:text-orange-500 transition line-clamp-2">
                    {t.title}
                  </h3>
                  
                  <div className="text-xs text-slate-500 flex items-center gap-3 font-semibold">
                    <span><i className="fa-solid fa-clock text-slate-400 mr-1"></i> {t.itinerary?.reduce((sum, d) => sum + d.durationHours, 0) || 4} Hours</span>
                    <span><i className="fa-solid fa-user-group text-slate-400 mr-1"></i> Max {t.maxCapacity || 8} Guests</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {t.summary}
                  </p>

                  <div className="space-y-1 pt-1">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Included Highlights:</div>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                      {t.highlights.slice(0, 2).map((h, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <i className="fa-solid fa-check text-emerald-500 text-[10px]"></i>
                          <span className="truncate">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tariff</span>
                  <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                    ₹{t.pricePerPerson} <span className="text-xs font-normal text-slate-400">/ person</span>
                  </span>
                </div>
                
                <NavLink
                  to={`/tours/${t.id}`}
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-full text-xs transition shadow-md shadow-orange-500/20"
                >
                  View Details &rarr;
                </NavLink>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
