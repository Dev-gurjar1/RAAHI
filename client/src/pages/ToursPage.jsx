import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useTourStore } from '../store/useTourStore.js';
import { getTourDisplayPricing } from '../utils/pricing.js';

export const ToursPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { tours = [], fetchToursFromBackend, isLoading } = useTourStore();

  // Search & Filter State from URL or Defaults
  const initialDestination = searchParams.get('destination') || searchParams.get('city') || '';
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [destination, setDestination] = useState(initialDestination);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDate, setSelectedDate] = useState('');
  const [maxDuration, setMaxDuration] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [selectedGroupSize, setSelectedGroupSize] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedGuideType, setSelectedGuideType] = useState('All');
  const [minRating, setMinRating] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');

  const [showFiltersModal, setShowFiltersModal] = useState(false);

  const categories = [
    { name: 'All', icon: 'fa-layer-group' },
    { name: 'Heritage', icon: 'fa-landmark-dome' },
    { name: 'Food', icon: 'fa-utensils' },
    { name: 'Culture', icon: 'fa-masks-theater' },
    { name: 'Photography', icon: 'fa-camera' },
    { name: 'Adventure', icon: 'fa-mountain' },
    { name: 'Nature', icon: 'fa-tree' },
    { name: 'Night Tours', icon: 'fa-moon' },
    { name: 'Markets', icon: 'fa-shop' },
    { name: 'Spiritual', icon: 'fa-om' },
    { name: 'Hidden Gems', icon: 'fa-gem' },
    { name: 'Family', icon: 'fa-people-roof' },
    { name: 'Budget Tours', icon: 'fa-tag' }
  ];

  // Fetch from backend whenever primary query parameters change
  const triggerFetch = useCallback(() => {
    const params = {};
    if (destination.trim()) params.destination = destination.trim();
    if (selectedCategory !== 'All') params.category = selectedCategory;
    if (searchTerm.trim()) params.search = searchTerm.trim();
    if (selectedDate) params.date = selectedDate;
    if (maxDuration !== 'All') params.duration = maxDuration;
    if (selectedLanguage !== 'All') params.language = selectedLanguage;
    if (selectedGuideType !== 'All') params.guideType = selectedGuideType;
    if (selectedGroupSize !== 'All') params.groupSize = selectedGroupSize;
    if (minRating !== 'All') params.rating = minRating;
    if (sortBy) params.sort = sortBy;

    if (priceRange !== 'All') {
      const [min, max] = priceRange.split('-');
      if (min) params.minPrice = min;
      if (max) params.maxPrice = max;
    }

    fetchToursFromBackend(params);
  }, [
    destination,
    selectedCategory,
    searchTerm,
    selectedDate,
    maxDuration,
    priceRange,
    selectedLanguage,
    selectedGuideType,
    selectedGroupSize,
    minRating,
    sortBy,
    fetchToursFromBackend
  ]);

  useEffect(() => {
    triggerFetch();
  }, [triggerFetch]);

  // Synchronize category change with URL
  const handleCategorySelect = (catName) => {
    setSelectedCategory(catName);
    const newParams = new URLSearchParams(searchParams);
    if (catName === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', catName);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    triggerFetch();
  };

  const handleClearFilters = () => {
    setDestination('');
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedDate('');
    setMaxDuration('All');
    setPriceRange('All');
    setSelectedGroupSize('All');
    setSelectedLanguage('All');
    setSelectedGuideType('All');
    setMinRating('All');
    setSortBy('relevance');
    setSearchParams({});
  };

  // Client-side safety filter over currently loaded backend tours
  const displayedTours = (tours || []).filter((tour) => {
    if (!tour) return false;
    // ensure draft/paused are filtered out of public view unless specified
    if (tour.status && tour.status !== 'PUBLISHED') return false;

    if (destination.trim()) {
      const d = destination.toLowerCase().trim();
      const matchDest = tour.destination && tour.destination.toLowerCase().includes(d);
      if (!matchDest) return false;
    }

    if (selectedCategory !== 'All') {
      const matchCat = tour.category && tour.category.toLowerCase() === selectedCategory.toLowerCase();
      if (!matchCat) return false;
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      const matchQ =
        (tour.title && tour.title.toLowerCase().includes(q)) ||
        (tour.summary && tour.summary.toLowerCase().includes(q)) ||
        (tour.guideName && tour.guideName.toLowerCase().includes(q)) ||
        (tour.meetingPoint && tour.meetingPoint.toLowerCase().includes(q));
      if (!matchQ) return false;
    }

    if (maxDuration !== 'All') {
      const isMultiDay = tour.durationUnit === 'DAYS' || (tour.durationDays && tour.durationDays > 1) || (tour.duration && tour.duration.toLowerCase().includes('day'));
      const hours = tour.durationHours || (isMultiDay ? (tour.durationDays || 2) * 8 : 3);

      if (maxDuration === 'hourly' && (isMultiDay || hours > 3.5)) return false;
      if (maxDuration === 'half-day' && (isMultiDay || hours < 3.5 || hours > 6)) return false;
      if (maxDuration === 'full-day' && (!tour.duration?.toLowerCase().includes('full day') && (hours < 6.5 || (isMultiDay && tour.durationDays > 1)))) return false;
      if (maxDuration === 'multi-day' && (!isMultiDay || (tour.durationDays && tour.durationDays < 2))) return false;
    }

    return true;
  });

  return (
    <div className="bg-[#F8F7F3] dark:bg-[#0D1710] min-h-screen text-[#152238] dark:text-[#E8F0EC]">

      {/* ══════════════════════════════════════════════════
          1. HERO HEADER: EXPLORE TOURS ACROSS INDIA
          ══════════════════════════════════════════════════ */}
      <section className="relative bg-white dark:bg-[#111C15] border-b border-[#E0E8E4] dark:border-[#243028] pt-14 pb-16 overflow-hidden">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0B9B6E]/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#F4A340]/6 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F7F1] dark:bg-[#07543F]/30 text-[#07543F] dark:text-[#4ADE80] text-xs font-bold border border-[#0B9B6E]/30 shadow-2xs">
            <i className="fa-solid fa-map-location-dot text-[#0B9B6E]"></i>
            <span>BOOKABLE LOCAL TOURS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#152238] dark:text-white font-heading tracking-tight leading-[1.1]">
            EXPLORE TOURS <span className="text-[#0B9B6E]">ACROSS INDIA</span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-[#4A5C6E] dark:text-[#9AB0A4] max-w-2xl mx-auto leading-relaxed">
            Find curated local tours, compare prices, and explore India with people who know it best.
          </p>

          {/* Premium Search & Destination Bar */}
          <div className="max-w-3xl mx-auto pt-3">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white dark:bg-[#162019] p-2 rounded-2xl border border-[#E0E8E4] dark:border-[#243028] shadow-lg flex flex-col sm:flex-row items-stretch gap-2"
            >
              {/* Destination Search Field */}
              <div className="flex-1 flex items-center gap-3 px-3.5 py-2.5 border-b sm:border-b-0 sm:border-r border-[#E0E8E4] dark:border-[#243028]">
                <i className="fa-solid fa-location-dot text-[#0B9B6E] text-base"></i>
                <div className="flex-1 text-left">
                  <label className="block text-[10px] font-extrabold uppercase text-[#8A9BAD] tracking-wider">
                    Where do you want to explore?
                  </label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Jaipur, Varanasi, Agra, Delhi..."
                    className="bg-transparent text-sm font-bold text-[#152238] dark:text-white placeholder-[#8A9BAD] focus:outline-none w-full"
                  />
                </div>
              </div>

              {/* Keyword Search Field */}
              <div className="flex-1 flex items-center gap-3 px-3.5 py-2.5">
                <i className="fa-solid fa-magnifying-glass text-[#F4A340] text-sm"></i>
                <div className="flex-1 text-left">
                  <label className="block text-[10px] font-extrabold uppercase text-[#8A9BAD] tracking-wider">
                    Keywords or Route
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Heritage walk, street food, sunset..."
                    className="bg-transparent text-sm font-bold text-[#152238] dark:text-white placeholder-[#8A9BAD] focus:outline-none w-full"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="btn-primary text-xs px-6 py-3 rounded-xl cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Search Tours</span>
                <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </button>
            </form>
          </div>

          {/* Quick Destination Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-semibold text-[#4A5C6E] dark:text-[#9AB0A4]">
            <span className="text-[#8A9BAD] text-[11px] font-bold uppercase tracking-wider">Popular Cities:</span>
            {['Jaipur', 'Varanasi', 'Agra', 'Delhi', 'Mumbai', 'Udaipur', 'Goa', 'Kochi'].map((city) => (
              <button
                key={city}
                onClick={() => {
                  setDestination(city);
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition border cursor-pointer ${
                  destination.toLowerCase() === city.toLowerCase()
                    ? 'bg-[#0B9B6E] text-white border-[#0B9B6E]'
                    : 'bg-[#F8F7F3] dark:bg-[#162019] text-[#152238] dark:text-white border-[#E0E8E4] dark:border-[#243028] hover:border-[#0B9B6E]'
                }`}
              >
                {city}
              </button>
            ))}
            {destination && (
              <button
                onClick={() => setDestination('')}
                className="text-[11px] text-rose-500 font-bold hover:underline ml-1 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          2. CATEGORY HORIZONTAL CAROUSEL / CHIPS
          ══════════════════════════════════════════════════ */}
      <section className="bg-white dark:bg-[#111C15] border-b border-[#E0E8E4] dark:border-[#243028] py-4 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            {categories.map((cat) => {
              const isActive = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategorySelect(cat.name)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer border ${
                    isActive
                      ? 'bg-[#07543F] dark:bg-[#4ADE80] text-white dark:text-[#0D1710] border-[#07543F] dark:border-[#4ADE80] shadow-sm'
                      : 'bg-[#F8F7F3] dark:bg-[#162019] text-[#4A5C6E] dark:text-[#9AB0A4] border-[#E0E8E4] dark:border-[#243028] hover:text-[#152238] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <i className={`fa-solid ${cat.icon} text-[11px]`}></i>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          3. MAIN TOURS DISCOVERY FEED + FILTERS
          ══════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Controls Bar: Count, Active Filters & Sorting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E0E8E4] dark:border-[#243028]">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-[#152238] dark:text-white font-heading">
              {destination ? `Tours in ${destination}` : 'All Curated Tours in India'}
            </h2>
            <p className="text-xs text-[#8A9BAD]">
              Showing <span className="font-bold text-[#152238] dark:text-white">{displayedTours.length}</span> verified tours with defined itineraries and transparent pricing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFiltersModal(!showFiltersModal)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-[#162019] text-[#152238] dark:text-white border border-[#E0E8E4] dark:border-[#243028] hover:border-[#0B9B6E] transition shadow-xs cursor-pointer"
            >
              <i className="fa-solid fa-sliders text-[#0B9B6E]"></i>
              <span>Filters</span>
              {(maxDuration !== 'All' || priceRange !== 'All' || selectedGroupSize !== 'All' || selectedLanguage !== 'All' || selectedGuideType !== 'All' || minRating !== 'All') && (
                <span className="w-2 h-2 rounded-full bg-[#0B9B6E]"></span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-white dark:bg-[#162019] px-3 py-1.5 rounded-xl border border-[#E0E8E4] dark:border-[#243028] shadow-xs">
              <span className="text-[10px] font-bold uppercase text-[#8A9BAD]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-bold text-[#152238] dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="relevance" className="dark:bg-[#162019]">Most Popular</option>
                <option value="rating" className="dark:bg-[#162019]">Highest Rated</option>
                <option value="price-low" className="dark:bg-[#162019]">Price: Low to High</option>
                <option value="price-high" className="dark:bg-[#162019]">Price: High to Low</option>
                <option value="duration" className="dark:bg-[#162019]">Duration: Shortest</option>
              </select>
            </div>
          </div>
        </div>

        {/* EXPANDABLE FILTERS TRAY */}
        {showFiltersModal && (
          <div className="my-6 p-5 sm:p-6 bg-white dark:bg-[#162019] rounded-2xl border border-[#0B9B6E]/30 shadow-md space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-[#F1F5F3] dark:border-[#243028] pb-3">
              <div className="font-extrabold text-sm text-[#152238] dark:text-white flex items-center gap-2">
                <i className="fa-solid fa-filter text-[#0B9B6E]"></i>
                <span>Filter Tours by Traveler Criteria</span>
              </div>
              <button
                onClick={handleClearFilters}
                className="text-xs font-bold text-rose-500 hover:underline cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-left">
              {/* Duration Filter */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#8A9BAD] mb-1">Duration</label>
                <select
                  value={maxDuration}
                  onChange={(e) => setMaxDuration(e.target.value)}
                  className="w-full bg-[#F8F7F3] dark:bg-[#111C15] text-xs font-bold p-2.5 rounded-xl border border-[#E0E8E4] dark:border-[#243028] focus:outline-none"
                >
                  <option value="All">Any Duration</option>
                  <option value="hourly">Hourly (1–3 Hours)</option>
                  <option value="half-day">Half Day (4–6 Hours)</option>
                  <option value="full-day">Full Day (1 Day / 8 Hours)</option>
                  <option value="multi-day">Multi-Day (2–5 Days)</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#8A9BAD] mb-1">Price Range</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full bg-[#F8F7F3] dark:bg-[#111C15] text-xs font-bold p-2.5 rounded-xl border border-[#E0E8E4] dark:border-[#243028] focus:outline-none"
                >
                  <option value="All">All Prices</option>
                  <option value="0-500">Under ₹500</option>
                  <option value="500-800">₹500 – ₹800</option>
                  <option value="800-1200">₹800 – ₹1,200</option>
                  <option value="1200-5000">₹1,200+</option>
                </select>
              </div>

              {/* Group Size Filter */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#8A9BAD] mb-1">Max Group Size</label>
                <select
                  value={selectedGroupSize}
                  onChange={(e) => setSelectedGroupSize(e.target.value)}
                  className="w-full bg-[#F8F7F3] dark:bg-[#111C15] text-xs font-bold p-2.5 rounded-xl border border-[#E0E8E4] dark:border-[#243028] focus:outline-none"
                >
                  <option value="All">Any Group Size</option>
                  <option value="4">Private / Small (Up to 4)</option>
                  <option value="6">Up to 6 People</option>
                  <option value="10">Up to 10 People</option>
                </select>
              </div>

              {/* Language Filter */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#8A9BAD] mb-1">Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full bg-[#F8F7F3] dark:bg-[#111C15] text-xs font-bold p-2.5 rounded-xl border border-[#E0E8E4] dark:border-[#243028] focus:outline-none"
                >
                  <option value="All">All Languages</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Gujarati">Gujarati</option>
                </select>
              </div>

              {/* Guide Type Filter */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#8A9BAD] mb-1">Guide Type</label>
                <select
                  value={selectedGuideType}
                  onChange={(e) => setSelectedGuideType(e.target.value)}
                  className="w-full bg-[#F8F7F3] dark:bg-[#111C15] text-xs font-bold p-2.5 rounded-xl border border-[#E0E8E4] dark:border-[#243028] focus:outline-none"
                >
                  <option value="All">All Provider Types</option>
                  <option value="PROFESSIONAL_GUIDE">Professional Guide</option>
                  <option value="LOCAL_HOST">Local Host</option>
                  <option value="STUDENT_LOCAL">Student Local</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-[#8A9BAD] mb-1">Minimum Rating</label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className="w-full bg-[#F8F7F3] dark:bg-[#111C15] text-xs font-bold p-2.5 rounded-xl border border-[#E0E8E4] dark:border-[#243028] focus:outline-none"
                >
                  <option value="All">Any Rating</option>
                  <option value="4.8">4.8+ Stars</option>
                  <option value="4.9">4.9+ Stars</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TOURS GRID */}
        {isLoading ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-[#0B9B6E] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-bold text-[#8A9BAD]">Loading authentic tours...</p>
          </div>
        ) : displayedTours.length === 0 ? (
          <div className="my-12 p-12 text-center bg-white dark:bg-[#162019] rounded-3xl border border-[#E0E8E4] dark:border-[#243028] space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#E8F7F1] dark:bg-[#07543F]/30 text-[#0B9B6E] flex items-center justify-center text-2xl mx-auto">
              <i className="fa-solid fa-map-location-dot"></i>
            </div>
            <h3 className="text-xl font-bold text-[#152238] dark:text-white font-heading">
              No tours found matching your search
            </h3>
            <p className="text-sm text-[#4A5C6E] dark:text-[#9AB0A4] max-w-md mx-auto">
              Try adjusting your destination, category, or clear your filters to explore more options across India.
            </p>
            <button
              onClick={handleClearFilters}
              className="btn-primary text-xs px-5 py-2.5 rounded-xl cursor-pointer"
            >
              Reset Filters & Show All Tours
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
            {displayedTours.map((tour) => {
              const pricing = getTourDisplayPricing(tour);
              const tourId = tour.tourId || tour.id;

              return (
                <div
                  key={tourId}
                  className="group bg-white dark:bg-[#162019] rounded-3xl border border-[#E0E8E4] dark:border-[#243028] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Top Image & Floating Badges */}
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={tour.coverImage || tour.image || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80'}
                        alt={tour.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-white/95 dark:bg-[#111C15]/95 text-[#07543F] dark:text-[#4ADE80] shadow-sm backdrop-blur-xs">
                          {tour.category || 'Heritage'}
                        </span>

                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/60 text-white backdrop-blur-xs">
                          <i className="fa-solid fa-star text-[#F4A340] text-[10px]"></i>
                          <span>{tour.rating || '4.9'}</span>
                          <span className="text-white/60">({tour.reviewCount || 0})</span>
                        </span>
                      </div>

                      {/* Location Badge on Bottom of Image */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-bold text-white drop-shadow-md">
                        <i className="fa-solid fa-location-dot text-[#4ADE80]"></i>
                        <span>{tour.destination || 'Jaipur'}</span>
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-5 sm:p-6 space-y-3.5">
                      {/* Tour Title */}
                      <h3 className="font-extrabold text-[#152238] dark:text-white text-base sm:text-lg font-heading leading-snug line-clamp-2 group-hover:text-[#0B9B6E] transition-colors">
                        {tour.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-xs text-[#4A5C6E] dark:text-[#9AB0A4] line-clamp-2 leading-relaxed">
                        {tour.summary || tour.description || 'Guided tour with background-cleared local host.'}
                      </p>

                      {/* Duration & Capacity Meta */}
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-semibold text-[#4A5C6E] dark:text-[#9AB0A4] border-t border-[#F1F5F3] dark:border-[#243028]">
                        <div className="flex items-center gap-1.5">
                          <i className="fa-regular fa-clock text-[#0B9B6E]"></i>
                          <span>{tour.duration || '3 Hours'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <i className="fa-solid fa-users text-[#F4A340]"></i>
                          <span>Up to {tour.maxParticipants || tour.maxCapacity || 6} people</span>
                        </div>
                      </div>

                      {/* Host Trust Info */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2">
                          <img
                            src={tour.guideAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}
                            alt={tour.guideName}
                            className="w-6 h-6 rounded-full object-cover border border-[#0B9B6E]"
                          />
                          <div className="text-[11px] font-bold text-[#152238] dark:text-white truncate max-w-[130px]">
                            {tour.guideName || 'Verified Guide'}
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#0B9B6E] bg-[#E8F7F1] dark:bg-[#07543F]/25 px-2 py-0.5 rounded-full border border-[#0B9B6E]/30">
                          <i className="fa-solid fa-circle-check text-[9px]"></i>
                          <span>Verified</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Pricing & View Tour Button */}
                  <div className="p-5 sm:p-6 pt-0 border-t border-[#F1F5F3] dark:border-[#243028] mt-2 flex items-end justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-extrabold uppercase text-[#8A9BAD] tracking-wider">
                        Starting from
                      </div>
                      <div className="text-lg sm:text-xl font-black text-[#07543F] dark:text-[#4ADE80] font-heading">
                        {pricing.primaryPrice}
                      </div>
                      <div className="text-[10px] text-[#8A9BAD]">
                        {pricing.subtext}
                      </div>
                    </div>

                    <NavLink
                      to={`/tours/${tourId}`}
                      className="px-4 py-2.5 rounded-xl bg-[#07543F] hover:bg-[#053D2E] text-white font-bold text-xs shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                    >
                      <span>View Tour</span>
                      <i className="fa-solid fa-arrow-right text-[10px]"></i>
                    </NavLink>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            4. MARKETPLACE BRIDGE: "Want something more personalized?"
            ══════════════════════════════════════════════════ */}
        <section className="mt-16 bg-gradient-to-br from-[#07543F] to-[#0D1F17] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#0B9B6E]/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#4ADE80] text-xs font-bold border border-white/20">
              <i className="fa-solid fa-wand-magic-sparkles text-[#4ADE80]"></i>
              <span>CUSTOM TRAVEL PATHS</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-black font-heading tracking-tight">
              Want something more personalized?
            </h3>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              If our scheduled tours don’t match your exact dates, group size, or interests, hire a dedicated local guide for a private custom walk, or post your trip requirements and get direct offers.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <NavLink
                to="/guides"
                className="px-6 py-3 rounded-full bg-[#0B9B6E] hover:bg-[#09825C] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <i className="fa-solid fa-users"></i>
                <span>FIND A PRIVATE GUIDE</span>
              </NavLink>

              <NavLink
                to="/planner"
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2"
              >
                <i className="fa-solid fa-paper-plane text-[#F4A340]"></i>
                <span>POST YOUR OWN TRIP</span>
              </NavLink>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
