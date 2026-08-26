import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { JAIPUR_GUIDES_DATA } from '../constants/guides';
import { calculateDistance } from '../utils/geo';
import { useBookingStore } from '../store/useBookingStore';
import { GuideProfile } from '@raahi/shared-types';

export const GuidesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('all');
  const [maxPrice, setMaxPrice] = useState(600);
  const [onlyOnline, setOnlyOnline] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'distance'>('rating');

  const openBookingModal = useBookingStore((state) => state.openBookingModal);

  // Tourist default location in Jaipur (e.g. Amer Road)
  const touristLat = 26.9855;
  const touristLng = 75.8513;

  const filteredGuides = JAIPUR_GUIDES_DATA.map((g) => ({
    ...g,
    liveDistance: calculateDistance(touristLat, touristLng, g.lat, g.lng)
  }))
    .filter((g) => {
      const matchesSearch =
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.languages.some((l) => l.toLowerCase().includes(search.toLowerCase())) ||
        g.specialties.some((s) => s.toLowerCase().includes(search.toLowerCase()));

      const matchesSpecialty = specialty === 'all' || g.specialties.includes(specialty);
      const matchesPrice = g.hourlyRate <= maxPrice;
      const matchesOnline = !onlyOnline || g.online;

      return matchesSearch && matchesSpecialty && matchesPrice && matchesOnline;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return a.hourlyRate - b.hourlyRate;
      if (sortBy === 'distance') return a.liveDistance - b.liveDistance;
      return b.rating - a.rating;
    });

  return (
    <div className="space-y-8 text-left">
      {/* Header & Filter Card */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-orange-500">
            VERIFIED DIRECTORY
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            Jaipur Local Guides & Hosts
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Browse {JAIPUR_GUIDES_DATA.length} background-verified local companions authenticated by police & tourism departments.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Search Box */}
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, language, fort..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Specialty Dropdown */}
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white rounded-2xl px-3.5 py-2.5 focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Specialties</option>
            <option value="Heritage">Heritage & Forts</option>
            <option value="Food">Food & Bazaars</option>
            <option value="Photography">Photography</option>
            <option value="Shopping">Artisan Crafts & Shopping</option>
          </select>

          {/* Sort By Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white rounded-2xl px-3.5 py-2.5 focus:outline-none focus:border-orange-500"
          >
            <option value="rating">Sort by: Highest Rating</option>
            <option value="distance">Sort by: Nearest GPS Distance</option>
            <option value="price">Sort by: Lowest Hourly Tariff</option>
          </select>

          {/* Online Toggle */}
          <button
            onClick={() => setOnlyOnline(!onlyOnline)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 border ${
              onlyOnline
                ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${onlyOnline ? 'bg-white animate-ping' : 'bg-emerald-500'}`}></span>
            <span>{onlyOnline ? 'Online Hosts Only (Active)' : 'Show Online Only'}</span>
          </button>
        </div>
      </div>

      {/* Guide Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.map((g) => (
          <div
            key={g.id}
            className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-100 dark:border-slate-700 shadow-card hover:shadow-floating transition-all duration-300 flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3.5">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <img
                    src={g.avatar}
                    alt={g.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500"
                  />
                  {g.online && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div>
                  <NavLink to={`/guides/${g.id}`} className="font-bold text-slate-900 dark:text-white text-base font-heading hover:text-orange-500 transition block">
                    {g.name}
                  </NavLink>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <span className="text-amber-500 font-bold">★ {g.rating}</span>
                    <span>({g.reviewCount} reviews)</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                    <i className="fa-solid fa-circle-check text-[10px] mr-1"></i> Verified Local Host
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {g.specialties.map((s, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-50 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300 text-[10px] px-2.5 py-1 rounded-lg font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <div><i className="fa-solid fa-language text-slate-400 mr-1.5"></i> {g.languages.join(", ")}</div>
                <div><i className="fa-solid fa-location-arrow text-slate-400 mr-1.5"></i> {g.liveDistance} km away (GPS verified)</div>
                <div><i className="fa-solid fa-bolt text-amber-500 mr-1.5"></i> Responds in {g.responseTime}</div>
              </div>
            </div>

            <div className="pt-3.5 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Hourly Tariff</span>
                <span className="text-lg font-extrabold text-orange-600 dark:text-orange-400">₹{g.hourlyRate}</span>
              </div>
              <div className="flex items-center gap-2">
                <NavLink
                  to={`/guides/${g.id}`}
                  className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold rounded-full text-xs transition"
                >
                  Profile
                </NavLink>
                <button
                  onClick={() => openBookingModal(g as GuideProfile)}
                  className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full text-xs transition shadow-md shadow-orange-500/20"
                >
                  Book Guide
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
