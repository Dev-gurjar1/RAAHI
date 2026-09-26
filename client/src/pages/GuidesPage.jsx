import React, { useState, useEffect } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import { PAN_INDIA_GUIDES_DATA } from '../constants/guides.js';
import { calculateDistance } from '../utils/geo.js';
import { useBookingStore } from '../store/useBookingStore.js';
import api from '../services/api.js';
import { CustomSelect } from '../components/ui/CustomSelect.jsx';
import { VerifiedBadge } from '../components/ui/VerifiedBadge.jsx';
import { StarRating } from '../components/ui/StarRating.jsx';
import { getGuideDisplayPricing } from '../utils/pricing.js';
import { UberGuideBooking } from '../components/UberGuideBooking.jsx';

export const GuidesPage = () => {
  const [searchParams] = useSearchParams();
  const urlCity = searchParams.get('city');
  const urlSearch = searchParams.get('search');
  const urlMode = searchParams.get('mode');

  const [guidesList, setGuidesList] = useState(PAN_INDIA_GUIDES_DATA);
  const [activeMode, setActiveMode] = useState(urlMode || 'uber'); // 'uber' | 'directory'
  const [search, setSearch] = useState(urlSearch || '');
  const [locationFilter, setLocationFilter] = useState(urlCity || 'All');
  const [specialty, setSpecialty] = useState('all');
  const [guideTypeFilter, setGuideTypeFilter] = useState('ALL');
  const [pricingTypeFilter, setPricingTypeFilter] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState(3000);
  const [onlyOnline, setOnlyOnline] = useState(false);
  const [sortBy, setSortBy] = useState('rating');

  const openBookingModal = useBookingStore((state) => state.openBookingModal);

  useEffect(() => {
    let active = true;
    api.guides.getAll().then((res) => {
      if (res && res.data && res.data.length > 0 && active) {
        setGuidesList(res.data);
      }
    }).catch((err) => {
      console.warn('Backend guides fetch notice:', err.message);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (urlCity) setLocationFilter(urlCity);
    if (urlSearch) setSearch(urlSearch);
    if (urlMode) setActiveMode(urlMode);
  }, [urlCity, urlSearch, urlMode]);

  // Tourist default location in Jaipur
  const touristLat = 26.9855;
  const touristLng = 75.8513;

  const filteredGuides = guidesList.map((g) => {
    const pricing = getGuideDisplayPricing(g, 4, 1);
    return {
      ...g,
      computedPricing: pricing,
      liveDistance: calculateDistance(touristLat, touristLng, g.lat || 26.9124, g.lng || 75.7873)
    };
  })
    .filter((g) => {
      const matchesSearch =
        !search.trim() ||
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        (g.city && g.city.toLowerCase().includes(search.toLowerCase())) ||
        g.languages.some((l) => l.toLowerCase().includes(search.toLowerCase())) ||
        g.specialties.some((s) => s.toLowerCase().includes(search.toLowerCase()));

      const matchesLocation =
        locationFilter === 'All' ||
        (g.city && g.city.toLowerCase().includes(locationFilter.toLowerCase()));

      const matchesSpecialty =
        specialty === 'all' ||
        g.specialties.some((s) => s.toLowerCase().includes(specialty.toLowerCase()));

      const matchesGuideType =
        guideTypeFilter === 'ALL' ||
        (g.guideType || 'PROFESSIONAL_GUIDE').toUpperCase() === guideTypeFilter;

      const matchesPricingType =
        pricingTypeFilter === 'ALL' ||
        (g.pricingType || 'HOURLY').toUpperCase() === pricingTypeFilter;

      const matchesPrice = g.computedPricing.primaryAmount <= maxPrice;
      const matchesOnline = !onlyOnline || g.online;

      return matchesSearch && matchesLocation && matchesSpecialty && matchesGuideType && matchesPricingType && matchesPrice && matchesOnline;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return a.computedPricing.primaryAmount - b.computedPricing.primaryAmount;
      if (sortBy === 'distance') return a.liveDistance - b.liveDistance;
      return b.rating - a.rating;
    });

  return (
    <div className="bg-[#F8F7F3] dark:bg-[#0D1710] min-h-screen text-[#152238] dark:text-[#E8F0EC]">

      {/* ══════════════════════════════════════════════════
          PAGE HEADER — Editorial Marketplace Header
          ══════════════════════════════════════════════════ */}
      <section className="bg-white dark:bg-[#111C15] border-b border-[#E0E8E4] dark:border-[#243028] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F7F1] dark:bg-[#07543F]/30 text-[#07543F] dark:text-[#4ADE80] text-xs font-bold border border-[#0B9B6E]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0B9B6E] animate-pulse"></span>
            <span>VERIFIED LOCAL DIRECTORY</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-[#152238] dark:text-white font-heading tracking-tight">
            Find & Book Your Local Guide
          </h1>

          <p className="text-base sm:text-lg text-[#4A5C6E] dark:text-[#9AB0A4] max-w-2xl leading-relaxed">
            Instant on-demand escort or curated directory across Jaipur, Delhi, Varanasi, Agra, Udaipur, Goa & beyond.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => setActiveMode('uber')}
              className={`px-5 py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeMode === 'uber'
                  ? 'bg-[#0B9B6E] text-white shadow-md ring-2 ring-[#0B9B6E]/30'
                  : 'bg-[#F8F7F3] dark:bg-[#162019] text-[#4A5C6E] dark:text-[#9AB0A4] border border-[#E0E8E4] dark:border-[#243028] hover:border-[#0B9B6E]'
              }`}
            >
              <i className="fa-solid fa-bolt text-amber-400"></i>
              <span>⚡ Instant Guide Radar (Uber Mode)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('directory')}
              className={`px-5 py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeMode === 'directory'
                  ? 'bg-[#152238] text-white dark:bg-white dark:text-[#152238] shadow-md ring-2 ring-black/20'
                  : 'bg-[#F8F7F3] dark:bg-[#162019] text-[#4A5C6E] dark:text-[#9AB0A4] border border-[#E0E8E4] dark:border-[#243028] hover:border-[#0B9B6E]'
              }`}
            >
              <i className="fa-solid fa-list-ul"></i>
              <span>📋 Browse Directory ({filteredGuides.length} Guides)</span>
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          VIEW 1: UBER MODE (INSTANT ON-DEMAND HIRE)
          ══════════════════════════════════════════════════ */}
      {activeMode === 'uber' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-scale-in">
          <UberGuideBooking defaultCity={locationFilter !== 'All' ? locationFilter : 'Jaipur'} />
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          VIEW 2: DIRECTORY MODE (SEARCH & FILTER CATALOG)
          ══════════════════════════════════════════════════ */}
      {activeMode === 'directory' && (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-scale-in">
        <div className="bg-white dark:bg-[#162019] p-5 sm:p-6 rounded-3xl border border-[#E0E8E4] dark:border-[#243028] shadow-sm space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Search Input */}
            <div className="relative">
              <label className="block text-xs font-bold text-[#152238] dark:text-[#E8F0EC] uppercase tracking-wider mb-1.5">
                Search
              </label>
              <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9BAD] text-xs"></i>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, city, specialty..."
                  className="w-full bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] rounded-xl pl-9 pr-3.5 py-3 text-sm text-[#152238] dark:text-white placeholder-[#8A9BAD] focus:outline-none focus:border-[#0B9B6E] transition-colors"
                />
              </div>
            </div>

            {/* Location Selector (CustomSelect) */}
            <CustomSelect
              label="Location"
              icon="fa-solid fa-location-dot"
              value={locationFilter}
              onChange={setLocationFilter}
              options={[
                { value: 'All', label: 'All Cities' },
                { value: 'Jaipur', label: 'Jaipur, Rajasthan' },
                { value: 'Delhi', label: 'Delhi NCR' },
                { value: 'Varanasi', label: 'Varanasi, UP' },
                { value: 'Agra', label: 'Agra, UP' },
                { value: 'Udaipur', label: 'Udaipur, Rajasthan' },
                { value: 'Goa', label: 'Goa Coast' },
                { value: 'Mumbai', label: 'Mumbai, Maharashtra' },
                { value: 'Amritsar', label: 'Amritsar, Punjab' },
                { value: 'Kochi', label: 'Kochi, Kerala' },
              ]}
            />

            {/* Specialty Filter (CustomSelect) */}
            <CustomSelect
              label="Specialty"
              icon="fa-solid fa-compass"
              value={specialty}
              onChange={setSpecialty}
              options={[
                { value: 'all', label: 'All Specialties' },
                { value: 'Heritage', label: 'Heritage & History' },
                { value: 'Food', label: 'Culinary & Bazaars' },
                { value: 'Photography', label: 'Photography' },
                { value: 'Artisan', label: 'Artisan Crafts' },
                { value: 'Nature', label: 'Nature & Walks' },
              ]}
            />

            {/* Sort Order (CustomSelect) */}
            <CustomSelect
              label="Sort By"
              icon="fa-solid fa-arrow-down-wide-short"
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: 'rating', label: 'Highest Rating' },
                { value: 'distance', label: 'Nearest to Me' },
                { value: 'price', label: 'Lowest Tariff' },
              ]}
            />
          </div>

          {/* Secondary filter chips & toggle */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-3 border-t border-[#F1F5F3] dark:border-[#243028]">
            <div className="flex flex-wrap items-center gap-2">
              {/* Guide Type Filter Chips */}
              {[
                { id: 'ALL', label: 'All Guides' },
                { id: 'PROFESSIONAL_GUIDE', label: '🎖️ Professional Guides' },
                { id: 'LOCAL_HOST', label: '🏡 Local Hosts' },
                { id: 'STUDENT_LOCAL', label: '🎓 Student Locals' },
              ].map((gt) => (
                <button
                  key={gt.id}
                  type="button"
                  onClick={() => setGuideTypeFilter(gt.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                    guideTypeFilter === gt.id
                      ? 'bg-[#0B9B6E] text-white border-[#0B9B6E] shadow-sm'
                      : 'bg-[#F8F7F3] dark:bg-[#111C15] text-[#4A5C6E] dark:text-[#9AB0A4] border-[#E0E8E4] dark:border-[#243028] hover:border-[#0B9B6E]/40'
                  }`}
                >
                  {gt.label}
                </button>
              ))}

              <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block mx-1"></div>

              {/* Pricing Model Filter Chips */}
              {[
                { id: 'ALL', label: 'All Pricing' },
                { id: 'HOURLY', label: 'Hourly' },
                { id: 'FIXED_TRIP', label: 'Fixed Trip' },
                { id: 'PER_PERSON', label: 'Per Person' },
                { id: 'PER_GROUP', label: 'Group Rate' },
              ].map((pm) => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setPricingTypeFilter(pm.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                    pricingTypeFilter === pm.id
                      ? 'bg-[#152238] text-white dark:bg-white dark:text-[#152238] border-transparent shadow-sm'
                      : 'bg-[#F8F7F3] dark:bg-[#111C15] text-[#4A5C6E] dark:text-[#9AB0A4] border-[#E0E8E4] dark:border-[#243028]'
                  }`}
                >
                  {pm.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOnlyOnline(!onlyOnline)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                  onlyOnline
                    ? 'bg-[#0B9B6E] text-white border-[#0B9B6E] shadow-sm'
                    : 'bg-[#F8F7F3] dark:bg-[#111C15] text-[#4A5C6E] dark:text-[#9AB0A4] border-[#E0E8E4] dark:border-[#243028]'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${onlyOnline ? 'bg-white' : 'bg-[#0B9B6E]'}`}></span>
                <span>Available Today</span>
              </button>

              {(search || specialty !== 'all' || locationFilter !== 'All' || guideTypeFilter !== 'ALL' || pricingTypeFilter !== 'ALL' || onlyOnline) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setSpecialty('all');
                    setLocationFilter('All');
                    setGuideTypeFilter('ALL');
                    setPricingTypeFilter('ALL');
                    setOnlyOnline(false);
                  }}
                  className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline px-1 cursor-pointer"
                >
                  Reset
                </button>
              )}

              <div className="text-xs text-[#8A9BAD] font-medium pl-2">
                <span className="font-extrabold text-[#152238] dark:text-white">{filteredGuides.length}</span> guides
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            GUIDE GRID
            ══════════════════════════════════════════════════ */}
        {filteredGuides.length === 0 ? (
          <div className="bg-white dark:bg-[#162019] rounded-3xl p-12 text-center border border-[#E0E8E4] dark:border-[#243028] space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#E8F7F1] dark:bg-[#07543F]/30 text-[#0B9B6E] flex items-center justify-center mx-auto text-2xl">
              <i className="fa-solid fa-user-xmark"></i>
            </div>
            <h3 className="text-lg font-bold font-heading text-[#152238] dark:text-white">
              No verified guides match your filter
            </h3>
            <p className="text-xs sm:text-sm text-[#8A9BAD] max-w-md mx-auto">
              Try broadening your search term or resetting the location filter.
            </p>
            <button
              onClick={() => { setSearch(''); setSpecialty('all'); setLocationFilter('All'); setOnlyOnline(false); }}
              className="btn-primary text-xs px-5 py-2.5 inline-flex"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => (
              <div
                key={guide.id}
                className="group bg-white dark:bg-[#162019] rounded-3xl border border-[#E0E8E4] dark:border-[#243028] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Large Cover Image with Subtle Zoom on Hover */}
                  <div className="relative h-44 sm:h-48 overflow-hidden bg-neutral-900">
                    <img
                      src={
                        guide.coverImage ||
                        'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={guide.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Badges top-right */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs border border-white/20">
                        {guide.guideType === 'STUDENT_LOCAL' ? '🎓 Student' : guide.guideType === 'LOCAL_HOST' ? '🏡 Local Host' : '🎖️ Pro Guide'}
                      </span>
                      <VerifiedBadge text="Aadhaar Vetted" size="sm" />
                    </div>

                    {/* Availability Status Badge top-left */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-black/60 text-white backdrop-blur-xs">
                        <span className={`w-1.5 h-1.5 rounded-full ${guide.online ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                        <span>{guide.online ? 'Available Today' : 'Advance Booking'}</span>
                      </span>
                    </div>

                    {/* Profile Photo Overlap */}
                    <div className="absolute -bottom-5 left-5 flex items-end gap-3">
                      <div className="relative">
                        <img
                          src={guide.avatar}
                          alt={guide.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-white dark:border-[#162019] shadow-lg"
                        />
                        {guide.online && (
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0B9B6E] border-2 border-white rounded-full"></span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Guide Info Body */}
                  <div className="pt-8 px-6 pb-4 space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <NavLink
                          to={`/guides/${guide.id}`}
                          className="font-black text-lg text-[#152238] dark:text-white font-heading hover:text-[#0B9B6E] transition-colors leading-tight"
                        >
                          {guide.name}
                        </NavLink>
                        <span className="text-xs font-semibold text-[#8A9BAD]">
                          {guide.experienceYears || 5}+ yrs exp
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-[#8A9BAD] mt-1">
                        <i className="fa-solid fa-location-dot text-[#0B9B6E] text-[11px]"></i>
                        <span>{guide.city || 'Jaipur, Rajasthan'}</span>
                        <span>•</span>
                        <span>{guide.liveDistance} km away</span>
                      </div>
                    </div>

                    {/* Star Rating & Reviews */}
                    <div className="flex items-center justify-between text-xs">
                      <StarRating rating={guide.rating} reviewsCount={guide.reviewCount || 38} />
                      <span className="text-[11px] text-[#07543F] dark:text-[#4ADE80] font-bold">
                        <i className="fa-solid fa-bolt text-[#F4A340] mr-1"></i>
                        Fast responder
                      </span>
                    </div>

                    <p className="text-xs text-[#4A5C6E] dark:text-[#9AB0A4] line-clamp-2 leading-relaxed">
                      {guide.bio}
                    </p>

                    {/* Specialties Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {guide.specialties.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F8F7F3] dark:bg-[#111C15] text-[#4A5C6E] dark:text-[#9AB0A4] border border-[#E0E8E4] dark:border-[#243028]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Tariff & CTAs — Total Price Prioritized First */}
                <div className="p-6 pt-3 border-t border-[#F1F5F3] dark:border-[#243028] flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base sm:text-lg font-black text-[#152238] dark:text-white font-heading">
                        {guide.computedPricing?.primaryPrice || `₹${guide.hourlyRate}/hr`}
                      </span>
                      {guide.computedPricing?.badge && (
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-[#07543F] dark:text-[#4ADE80] border border-[#0B9B6E]/30">
                          {guide.computedPricing.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#8A9BAD] font-medium block">
                      {guide.computedPricing?.subtext || `${guide.experience} Exp`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <NavLink
                      to={`/guides/${guide.id}`}
                      className="px-3.5 py-2 text-xs font-bold text-[#152238] dark:text-white hover:bg-[#F8F7F3] dark:hover:bg-[#111C15] rounded-xl transition-colors"
                    >
                      Profile
                    </NavLink>
                    <button
                      onClick={() => openBookingModal(guide)}
                      className="btn-primary text-xs px-4 py-2 group-hover:shadow-primary transition-all cursor-pointer"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      )}

    </div>
  );
};
