import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { POPULAR_DESTINATIONS } from '../constants/destinations.js';
import { PAN_INDIA_GUIDES_DATA } from '../constants/guides.js';
import { EXPERIENCES_DATA } from './ExperiencesPage.jsx';
import { useBookingStore } from '../store/useBookingStore.js';
import { useToastStore } from '../store/useToastStore.js';
import { VerifiedBadge } from '../components/ui/VerifiedBadge.jsx';
import { StarRating } from '../components/ui/StarRating.jsx';

export const ExplorePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlSearch = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category') || 'All';

  const openBookingModal = useBookingStore((state) => state.openBookingModal);
  const createBooking = useBookingStore((state) => state.createBooking);
  const showToast = useToastStore((state) => state.showToast);

  const [destinationSearch, setDestinationSearch] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  useEffect(() => {
    if (urlSearch) setDestinationSearch(urlSearch);
    if (urlCategory) setSelectedCategory(urlCategory);
  }, [urlSearch, urlCategory]);

  const categories = [
    { name: 'All', icon: 'fa-layer-group' },
    { name: 'Heritage', icon: 'fa-landmark' },
    { name: 'Culinary', icon: 'fa-utensils' },
    { name: 'Spiritual', icon: 'fa-om' },
    { name: 'Adventure', icon: 'fa-mountain' },
    { name: 'Photography', icon: 'fa-camera' },
    { name: 'Artisan Crafts', icon: 'fa-palette' },
    { name: 'Nature', icon: 'fa-tree' },
  ];

  const filteredDestinations = POPULAR_DESTINATIONS.filter((d) => {
    const matchesSearch =
      !destinationSearch.trim() ||
      d.name.toLowerCase().includes(destinationSearch.toLowerCase().trim()) ||
      d.tagline.toLowerCase().includes(destinationSearch.toLowerCase().trim()) ||
      d.description.toLowerCase().includes(destinationSearch.toLowerCase().trim());

    const matchesCategory =
      selectedCategory === 'All' ||
      (d.categories && d.categories.some((c) => c.toLowerCase() === selectedCategory.toLowerCase())) ||
      (d.badge && d.badge.toLowerCase() === selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const el = document.getElementById('destinations-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (catName) => {
    setSelectedCategory(catName);
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      if (catName === 'All') updated.delete('category');
      else updated.set('category', catName);
      return updated;
    });
  };

  const handleBookExperience = (exp) => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const bookingId = `EXP-BK-${Math.floor(10000 + Math.random() * 90000)}`;

    const newBooking = {
      bookingId,
      id: bookingId,
      bookingType: 'EXPERIENCE_BOOKING',
      experienceId: exp.id,
      title: exp.title,
      guideName: exp.hostName,
      guideAvatar: exp.hostAvatar,
      location: `${exp.city}, ${exp.state}`,
      city: exp.city,
      totalAmount: exp.price,
      pricingType: 'PER_PERSON',
      durationHours: 3,
      status: 'CONFIRMED',
      serviceOtp: otp,
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      createdAt: new Date().toISOString()
    };

    createBooking(newBooking);
    showToast(`Instant Booking Confirmed! Your OTP is ${otp}. Check Trips page.`, 'success');
  };

  // Dynamic Guides: filter by city if user searched, else show diverse Pan-India guides
  const activeCityMatch = destinationSearch.trim()
    ? PAN_INDIA_GUIDES_DATA.filter((g) => g.city.toLowerCase().includes(destinationSearch.toLowerCase().trim()))
    : [];

  const displayedGuides = activeCityMatch.length > 0
    ? activeCityMatch.slice(0, 3)
    : PAN_INDIA_GUIDES_DATA.slice(0, 6);

  return (
    <div className="bg-[#F8F7F3] dark:bg-[#0D1710] min-h-screen text-[#152238] dark:text-[#E8F0EC]">

      {/* ══════════════════════════════════════════════════
          1. HERO DISCOVERY SECTION
          ══════════════════════════════════════════════════ */}
      <section className="relative bg-white dark:bg-[#111C15] border-b border-[#E0E8E4] dark:border-[#243028] py-16 sm:py-20 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0B9B6E]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#F4A340]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F7F1] dark:bg-[#07543F]/30 text-[#07543F] dark:text-[#4ADE80] text-xs font-bold border border-[#0B9B6E]/30">
            <i className="fa-solid fa-compass text-[#0B9B6E]"></i>
            <span>PAN-INDIA EXPLORER</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-[#152238] dark:text-white font-heading tracking-tight">
            Explore India <span className="text-[#0B9B6E]">Like a Local</span>
          </h1>

          <p className="text-sm sm:text-lg text-[#4A5C6E] dark:text-[#9AB0A4] max-w-2xl mx-auto leading-relaxed">
            Step beyond typical commercial tourism. Discover living heritage, authentic food trails, and cultural workshops guided by background-verified resident locals.
          </p>

          {/* Quick Nav Anchors */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
            <a
              href="#destinations-grid"
              className="px-3 py-1.5 rounded-full bg-[#F8F7F3] dark:bg-[#162019] text-[#152238] dark:text-white font-bold border border-[#E0E8E4] dark:border-[#243028] hover:border-[#0B9B6E] transition"
            >
              <i className="fa-solid fa-city text-[#0B9B6E] mr-1.5"></i>
              Popular Cities
            </a>
            <NavLink
              to="/tours"
              className="px-3 py-1.5 rounded-full bg-[#F8F7F3] dark:bg-[#162019] text-[#152238] dark:text-white font-bold border border-[#E0E8E4] dark:border-[#243028] hover:border-[#0B9B6E] transition"
            >
              <i className="fa-solid fa-map-location-dot text-[#0B9B6E] mr-1.5"></i>
              Curated Tours
            </NavLink>
            <NavLink
              to="/experiences"
              className="px-3 py-1.5 rounded-full bg-[#F8F7F3] dark:bg-[#162019] text-[#152238] dark:text-white font-bold border border-[#E0E8E4] dark:border-[#243028] hover:border-[#0B9B6E] transition"
            >
              <i className="fa-solid fa-palette text-[#F4A340] mr-1.5"></i>
              Workshops & Activities
            </NavLink>
            <NavLink
              to="/guides?mode=uber"
              className="px-3 py-1.5 rounded-full bg-[#E8F7F1] dark:bg-[#07543F]/25 text-[#07543F] dark:text-[#4ADE80] font-bold border border-[#0B9B6E]/30 hover:bg-[#D4EFE5] transition"
            >
              <i className="fa-solid fa-bolt text-[#0B9B6E] mr-1.5"></i>
              Instant Guide Radar
            </NavLink>
          </div>

          {/* Destination Search Bar */}
          <div className="max-w-2xl mx-auto pt-3">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white dark:bg-[#162019] p-2.5 rounded-2xl border border-[#E0E8E4] dark:border-[#243028] shadow-lg flex flex-col sm:flex-row items-stretch gap-2"
            >
              <div className="flex-1 flex items-center gap-3 px-3.5 py-2">
                <i className="fa-solid fa-magnifying-glass text-[#0B9B6E] text-base"></i>
                <input
                  type="text"
                  value={destinationSearch}
                  onChange={(e) => setDestinationSearch(e.target.value)}
                  placeholder="Where in India would you like to explore? (e.g. Jaipur, Varanasi, Goa, Delhi...)"
                  className="bg-transparent text-sm font-semibold text-[#152238] dark:text-white placeholder-[#8A9BAD] focus:outline-none w-full"
                />
              </div>
              <button
                type="submit"
                className="btn-primary text-xs px-6 py-3 rounded-xl cursor-pointer"
              >
                <span>Find Locals</span>
                <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </button>
            </form>
          </div>

          {/* Category Chips Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleCategorySelect(cat.name)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                  selectedCategory === cat.name
                    ? 'bg-[#152238] text-white border-[#152238] shadow-sm'
                    : 'bg-[#F8F7F3] dark:bg-[#162019] text-[#4A5C6E] dark:text-[#9AB0A4] border-[#E0E8E4] dark:border-[#243028] hover:border-[#0B9B6E]/50'
                }`}
              >
                <i className={`fa-solid ${cat.icon} text-[10px] ${selectedCategory === cat.name ? 'text-[#F4A340]' : 'text-[#8A9BAD]'}`}></i>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════
          2. FEATURED DESTINATIONS — Large Editorial Cards
          ══════════════════════════════════════════════════ */}
      <section id="destinations-grid" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0B9B6E]">
              FEATURED CITIES
            </span>
            <h2 className="text-3xl font-black text-[#152238] dark:text-white font-heading mt-1">
              Popular Local Destinations
            </h2>
          </div>
          <span className="text-xs font-bold text-[#8A9BAD]">
            {filteredDestinations.length} destinations available
          </span>
        </div>

        {filteredDestinations.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-[#162019] rounded-3xl border border-[#E0E8E4] dark:border-[#243028] space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#E8F7F1] dark:bg-[#07543F]/30 text-[#0B9B6E] flex items-center justify-center text-2xl mx-auto">
              <i className="fa-solid fa-compass"></i>
            </div>
            <h3 className="text-xl font-bold text-[#152238] dark:text-white font-heading">
              No destinations match your search
            </h3>
            <p className="text-xs text-[#8A9BAD]">
              Try searching for "Jaipur", "Varanasi", "Goa", "Delhi", or select "All" categories.
            </p>
            <button
              type="button"
              onClick={() => { setDestinationSearch(''); setSelectedCategory('All'); }}
              className="btn-primary text-xs px-5 py-2.5 rounded-xl cursor-pointer"
            >
              Reset Filters & Show All Cities
            </button>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id}
              className="group bg-white dark:bg-[#162019] rounded-3xl border border-[#E0E8E4] dark:border-[#243028] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image Container with Editorial Zoom */}
              <div className="relative aspect-[16/11] overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-xs border border-white/20">
                    {dest.badge}
                  </span>
                </div>

                <div className="absolute top-4 right-4">
                  <NavLink
                    to={`/guides?city=${encodeURIComponent(dest.name)}&mode=uber`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0B9B6E] text-white text-[10px] font-black shadow-md hover:bg-[#07543F] transition"
                    title={`Launch instant guide radar in ${dest.name}`}
                  >
                    <i className="fa-solid fa-bolt text-[9px] animate-pulse"></i>
                    <span>Radar</span>
                  </NavLink>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[11px] font-bold text-[#F4A340] uppercase tracking-wider block">
                    {dest.tagline}
                  </span>
                  <h3 className="text-2xl font-black font-heading leading-tight">
                    {dest.name}
                  </h3>
                </div>
              </div>

              {/* Destination Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <p className="text-xs sm:text-sm text-[#4A5C6E] dark:text-[#9AB0A4] leading-relaxed">
                    {dest.description}
                  </p>

                  {/* Category Tags */}
                  {dest.categories && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {dest.categories.map((cat) => (
                        <span
                          key={cat}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F8F7F3] dark:bg-[#111C15] text-[#4A5C6E] dark:text-[#9AB0A4] border border-[#E0E8E4] dark:border-[#243028]"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[#F1F5F3] dark:border-[#243028] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] text-[#8A9BAD] uppercase font-bold">
                      Available in {dest.name}
                    </span>
                    <span className="font-extrabold text-[#152238] dark:text-white">
                      {dest.guidesCount} Guides • {dest.experiencesCount} Tours
                    </span>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <NavLink
                      to={`/guides?city=${encodeURIComponent(dest.name)}&mode=directory`}
                      className="btn-primary text-xs py-2 px-3 justify-center text-center font-bold"
                    >
                      <i className="fa-solid fa-users text-[10px]"></i>
                      <span>Find Guides</span>
                    </NavLink>

                    <NavLink
                      to={`/tours?destination=${encodeURIComponent(dest.name)}`}
                      className="btn-secondary text-xs py-2 px-3 justify-center text-center font-bold bg-white dark:bg-[#162019]"
                    >
                      <i className="fa-solid fa-map-location-dot text-[#0B9B6E] text-[10px]"></i>
                      <span>View Tours</span>
                    </NavLink>
                  </div>

                  {/* Extra direct links */}
                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <NavLink
                      to={`/experiences?city=${encodeURIComponent(dest.name)}`}
                      className="text-[#F4A340] hover:underline font-bold flex items-center gap-1"
                    >
                      <i className="fa-solid fa-palette text-[10px]"></i>
                      <span>Experiences &rarr;</span>
                    </NavLink>

                    <NavLink
                      to={`/guides?city=${encodeURIComponent(dest.name)}&mode=uber`}
                      className="text-[#0B9B6E] hover:underline font-bold flex items-center gap-1"
                    >
                      <i className="fa-solid fa-bolt text-[10px]"></i>
                      <span>Instant Radar</span>
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </section>


      {/* ══════════════════════════════════════════════════
          3. TRENDING EXPERIENCES
          ══════════════════════════════════════════════════ */}
      <section id="experiences" className="py-16 sm:py-20 bg-white dark:bg-[#111C15] border-y border-[#E0E8E4] dark:border-[#243028]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-3">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#0B9B6E]">
                CULTURAL WORKSHOPS & ACTIVITIES
              </span>
              <h2 className="text-3xl font-black text-[#152238] dark:text-white font-heading mt-1">
                Trending Local Experiences
              </h2>
            </div>
            <NavLink
              to="/experiences"
              className="text-xs font-bold text-[#07543F] dark:text-[#4ADE80] hover:underline flex items-center gap-1"
            >
              <span>See all {EXPERIENCES_DATA.length} experiences</span>
              <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </NavLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EXPERIENCES_DATA.slice(0, 3).map((exp) => (
              <div
                key={exp.id}
                className="bg-[#F8F7F3] dark:bg-[#162019] rounded-2xl border border-[#E0E8E4] dark:border-[#243028] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/70 text-white">
                      {exp.city}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <VerifiedBadge text="Verified" size="sm" />
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-sm text-[#152238] dark:text-white font-heading leading-snug">
                      {exp.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs pt-2">
                      <StarRating rating={exp.rating} />
                      <span className="text-[#8A9BAD] font-medium">{exp.duration}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E0E8E4] dark:border-[#243028] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#8A9BAD] uppercase font-bold block">From</span>
                      <span className="text-base font-extrabold text-[#152238] dark:text-white font-heading">
                        ₹{exp.price}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleBookExperience(exp)}
                      className="btn-primary text-xs px-4 py-2 cursor-pointer"
                    >
                      Book Experience
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════
          4. VERIFIED GUIDES ACROSS INDIA
          ══════════════════════════════════════════════════ */}
      <section id="verified-hosts" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-3">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0B9B6E]">
              VERIFIED HOSTS ACROSS INDIA
            </span>
            <h2 className="text-3xl font-black text-[#152238] dark:text-white font-heading mt-1">
              Meet Highly Rated Local Guides
            </h2>
          </div>
          <NavLink
            to="/guides"
            className="text-xs font-bold text-[#07543F] dark:text-[#4ADE80] hover:underline flex items-center gap-1"
          >
            <span>See all {PAN_INDIA_GUIDES_DATA.length} verified guides</span>
            <i className="fa-solid fa-arrow-right text-[10px]"></i>
          </NavLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayedGuides.map((guide) => (
            <div
              key={guide.id}
              className="bg-white dark:bg-[#162019] rounded-2xl border border-[#E0E8E4] dark:border-[#243028] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start gap-4">
                <img
                  src={guide.avatar}
                  alt={guide.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#0B9B6E]"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-base text-[#152238] dark:text-white truncate font-heading">
                      {guide.name}
                    </h3>
                  </div>
                  <div className="text-xs font-semibold text-[#0B9B6E]">{guide.city}, {guide.state}</div>
                  <div className="pt-1">
                    <VerifiedBadge text="Govt Vetted" size="sm" />
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#4A5C6E] dark:text-[#9AB0A4] line-clamp-2">
                {guide.bio}
              </p>

              <div className="pt-3 border-t border-[#F1F5F3] dark:border-[#243028] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#8A9BAD] uppercase font-bold block">Rate</span>
                  <span className="text-base font-extrabold text-[#152238] dark:text-white font-heading">
                    ₹{guide.hourlyRate}/hr
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <NavLink
                    to={`/guides/${guide.id}`}
                    className="px-3 py-1.5 text-xs font-bold text-[#152238] dark:text-white hover:bg-[#F8F7F3] rounded-lg transition-colors border border-[#E0E8E4] dark:border-[#243028]"
                  >
                    View
                  </NavLink>
                  <button
                    onClick={() => openBookingModal(guide)}
                    className="btn-primary text-xs px-3.5 py-1.5"
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
