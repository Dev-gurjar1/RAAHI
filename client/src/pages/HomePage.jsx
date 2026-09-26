import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useBookingStore } from '../store/useBookingStore.js';
import { useTourStore } from '../store/useTourStore.js';
import { JAIPUR_GUIDES_DATA } from '../constants/guides.js';
import { POPULAR_DESTINATIONS } from '../constants/destinations.js';
import { VerifiedBadge } from '../components/ui/VerifiedBadge.jsx';
import { StarRating } from '../components/ui/StarRating.jsx';
import { PriceGauge } from '../components/ui/PriceGauge.jsx';
import { getGuideDisplayPricing, getTourDisplayPricing } from '../utils/pricing.js';

export const HomePage = () => {
  const navigate = useNavigate();
  const openBookingModal = useBookingStore((state) => state.openBookingModal);
  const { tours = [], fetchToursFromBackend } = useTourStore();

  useEffect(() => {
    if (fetchToursFromBackend) {
      fetchToursFromBackend();
    }
  }, [fetchToursFromBackend]);

  // Quick search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('Jaipur');

  // Interactive Fair Price state for Section 5
  const [fpDistance, setFpDistance] = useState(5.5);
  const [fpQuote, setFpQuote] = useState(220);
  const [fpVehicle, setFpVehicle] = useState('auto'); // 'auto' | 'eRickshaw' | 'taxi'

  // Calculations for Fair Price section
  const perKmRate = fpVehicle === 'auto' ? 14 : fpVehicle === 'eRickshaw' ? 10 : 38;
  const baseRate = fpVehicle === 'auto' ? 35 : fpVehicle === 'eRickshaw' ? 25 : 120;
  const fpBenchmarkMin = Math.round(baseRate + fpDistance * perKmRate * 0.9);
  const fpBenchmarkMax = Math.round(baseRate + fpDistance * perKmRate * 1.18);

  // AI Planner quick state for Section 6
  const [plannerDestination, setPlannerDestination] = useState('Jaipur');
  const [plannerDays, setPlannerDays] = useState(3);
  const [plannerStyle, setPlannerStyle] = useState('Cultural & Heritage');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/guides?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/guides');
    }
  };

  return (
    <div className="text-left font-sans bg-[#F8F7F3] dark:bg-[#0D1710] min-h-screen text-[#152238] dark:text-[#E8F0EC]">

      {/* ══════════════════════════════════════════════════
          HERO SECTION — Editorial Travel Marketplace
          ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-white dark:bg-[#111C15] border-b border-[#E0E8E4] dark:border-[#243028] pt-10 pb-16 lg:py-20">
        {/* Subtle warm ambient background glow */}
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#0B9B6E]/6 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#F4A340]/6 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* LEFT COLUMN: Editorial Typography & Value Props */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8">

              {/* Small Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F7F1] dark:bg-[#07543F]/30 text-[#07543F] dark:text-[#4ADE80] text-xs font-extrabold border border-[#0B9B6E]/30 tracking-tight">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B9B6E] animate-pulse"></span>
                <i className="fa-solid fa-shield-check text-[11px] text-[#0B9B6E]"></i>
                <span>VERIFIED LOCAL GUIDES</span>
              </div>

              {/* Large Headline */}
              <h1 className="text-4xl sm:text-6xl xl:text-[64px] font-black text-[#152238] dark:text-white font-heading leading-[1.05] tracking-tight">
                TRAVEL INDIA
                <br />
                <span className="text-[#0B9B6E]">LIKE A LOCAL.</span>
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-[#4A5C6E] dark:text-[#9AB0A4] max-w-xl leading-relaxed">
                Discover verified local guides, authentic experiences and fair prices — without the tourist traps.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-wrap items-center gap-3">
                <NavLink
                  to="/guides"
                  className="btn-primary text-xs sm:text-sm px-6 py-3.5 shadow-primary"
                >
                  <i className="fa-solid fa-users"></i>
                  <span>Find a Guide</span>
                </NavLink>

                <NavLink
                  to="/tours"
                  className="btn-secondary text-xs sm:text-sm px-6 py-3.5 bg-white dark:bg-[#162019]"
                >
                  <i className="fa-solid fa-map-location-dot text-[#0B9B6E]"></i>
                  <span>Explore Tours</span>
                </NavLink>

                <NavLink
                  to="/experiences"
                  className="px-5 py-3 rounded-full text-xs font-bold text-[#152238] dark:text-white bg-white/80 dark:bg-[#162019]/80 border border-[#E0E8E4] dark:border-[#243028] hover:border-[#0B9B6E] transition"
                >
                  <i className="fa-solid fa-palette text-[#F4A340] mr-1.5"></i>
                  <span>Experiences</span>
                </NavLink>

                <NavLink
                  to="/planner"
                  className="px-5 py-3 rounded-full text-xs font-bold text-[#07543F] dark:text-[#4ADE80] bg-[#E8F7F1] dark:bg-[#07543F]/25 border border-[#0B9B6E]/30 hover:bg-[#D4EFE5] transition"
                >
                  <i className="fa-solid fa-paper-plane mr-1.5"></i>
                  <span>Post Your Trip</span>
                </NavLink>
              </div>

              {/* Trust Indicators */}
              <div className="pt-2 flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-bold text-[#152238] dark:text-[#E8F0EC]">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-circle-check text-[#0B9B6E]"></i>
                  <span>Verified Guides</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-scale-balanced text-[#0B9B6E]"></i>
                  <span>Fair Pricing</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-lock text-[#0B9B6E]"></i>
                  <span>Secure Booking</span>
                </div>
              </div>

              {/* Search Bar Input */}
              <form
                onSubmit={handleSearchSubmit}
                className="bg-[#F8F7F3] dark:bg-[#162019] p-2 rounded-2xl border border-[#E0E8E4] dark:border-[#243028] shadow-sm flex flex-col sm:flex-row items-stretch gap-2 max-w-xl"
              >
                <div className="flex-1 flex items-center gap-3 px-3 py-2">
                  <i className="fa-solid fa-magnifying-glass text-[#0B9B6E] text-sm"></i>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search city, heritage site, or guide specialty..."
                    className="bg-transparent text-xs sm:text-sm font-medium text-[#152238] dark:text-white placeholder-[#8A9BAD] focus:outline-none w-full"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary text-xs px-5 py-3 rounded-xl cursor-pointer"
                >
                  Search
                </button>
              </form>
            </div>

            {/* RIGHT COLUMN: Cinematic India Travel Image Composition + Floating UI */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none">

                {/* Dominant Hero Image */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-[#162019] aspect-[4/3] sm:aspect-[16/11]">
                  <img
                    src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80"
                    alt="Jaipur Royal Heritage Rajasthan"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  {/* Destination Tag */}
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#F4A340]">
                      Jaipur, Rajasthan
                    </span>
                    <div className="font-extrabold text-base font-heading">
                      Hawa Mahal & The Old Bazaars
                    </div>
                  </div>
                </div>

                {/* Supporting Layered Card 1: Floating Verified Local Guide Badge */}
                <div className="absolute -top-4 -left-4 sm:-left-6 bg-white dark:bg-[#162019] p-3 sm:p-4 rounded-2xl shadow-xl border border-[#E0E8E4] dark:border-[#243028] flex items-center gap-3 animate-float">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
                      alt="Verified Guide Rajesh"
                      className="w-11 h-11 rounded-full object-cover border-2 border-[#0B9B6E]"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0B9B6E] rounded-full border-2 border-white flex items-center justify-center text-white text-[8px]">
                      <i className="fa-solid fa-check"></i>
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-[#152238] dark:text-white font-heading">
                        Rajesh Sharma
                      </span>
                      <i className="fa-solid fa-shield-check text-[#0B9B6E] text-xs" title="Aadhaar Vetted"></i>
                    </div>
                    <div className="text-[11px] text-[#07543F] dark:text-[#4ADE80] font-extrabold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0B9B6E] inline-block"></span>
                      ✓ Verified Local
                    </div>
                  </div>
                </div>

                {/* Supporting Layered Card 2: Floating 4.9 Rating Card */}
                <div className="absolute -bottom-5 left-8 sm:left-12 bg-white dark:bg-[#162019] px-4 py-3 rounded-2xl shadow-xl border border-[#E0E8E4] dark:border-[#243028] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FEF6E4] dark:bg-[#F4A340]/20 flex items-center justify-center text-[#F4A340]">
                    <i className="fa-solid fa-star text-base"></i>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-black text-sm text-[#152238] dark:text-white font-heading">4.9</span>
                      <span className="text-[10px] text-[#8A9BAD]">/ 5.0</span>
                    </div>
                    <div className="text-[10px] text-[#8A9BAD] font-medium">Over 2,400+ real reviews</div>
                  </div>
                </div>

                {/* Supporting Layered Card 3: Floating Fair Price Card */}
                <div className="absolute -bottom-6 -right-2 sm:-right-4 bg-white dark:bg-[#162019] px-4 py-3 rounded-2xl shadow-xl border border-[#E0E8E4] dark:border-[#243028] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E8F7F1] dark:bg-[#07543F]/30 flex items-center justify-center text-[#07543F] dark:text-[#4ADE80]">
                    <span className="font-extrabold text-sm">₹</span>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#8A9BAD] uppercase font-bold">Standard Tariff</div>
                    <div className="font-extrabold text-xs text-[#07543F] dark:text-[#4ADE80] flex items-center gap-1">
                      <i className="fa-solid fa-check text-[10px]"></i>
                      ₹ Fair Price Shield
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════
          SECTION 1: "Why travel with RAAHI?"
          ══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-[#F8F7F3] dark:bg-[#0D1710]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0B9B6E]">
              THE RAAHI STANDARD
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#152238] dark:text-white font-heading tracking-tight">
              Why travel with RAAHI?
            </h2>
            <p className="text-sm sm:text-base text-[#4A5C6E] dark:text-[#9AB0A4] leading-relaxed">
              We eliminated the middlemen, commissioned touts, and tourist traps to build India’s cleanest travel platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: 'fa-shield-halved',
                color: 'text-[#0B9B6E]',
                bg: 'bg-[#E8F7F1] dark:bg-[#07543F]/30',
                title: 'Verified Locals',
                desc: 'Every host undergoes national Aadhaar validation, criminal background checks, and cultural knowledge vetting.',
              },
              {
                icon: 'fa-scale-balanced',
                color: 'text-[#07543F] dark:text-[#4ADE80]',
                bg: 'bg-[#E8F7F1] dark:bg-[#07543F]/30',
                title: 'Fair Prices',
                desc: 'Government tariff benchmarking protects you from 4x taxi extortion, inflated gem shops, and rigged kickbacks.',
              },
              {
                icon: 'fa-compass',
                color: 'text-[#F4A340]',
                bg: 'bg-[#FEF6E4] dark:bg-[#F4A340]/20',
                title: 'Authentic Experiences',
                desc: 'Wander secret haveli rooftops, hidden artisan workshops, and morning river rituals known only to residents.',
              },
              {
                icon: 'fa-phone-volume',
                color: 'text-rose-600 dark:text-rose-400',
                bg: 'bg-rose-50 dark:bg-rose-950/30',
                title: 'Safe & Trusted',
                desc: 'One-tap 24/7 emergency SOS, live GPS sharing with your loved ones, and immediate local dispute intervention.',
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#162019] p-7 rounded-2xl border border-[#E0E8E4] dark:border-[#243028] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 space-y-4"
              >
                <div className={`w-12 h-12 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center text-xl`}>
                  <i className={`fa-solid ${card.icon}`}></i>
                </div>
                <h3 className="text-lg font-bold text-[#152238] dark:text-white font-heading">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#4A5C6E] dark:text-[#9AB0A4] leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════
          SECTION: "TRAVEL YOUR WAY" (The 4 RAAHI Paths)
          ══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-[#F8F7F3] to-white dark:from-[#0D1710] dark:to-[#111C15] border-t border-[#E0E8E4] dark:border-[#243028]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F7F1] dark:bg-[#07543F]/30 text-[#07543F] dark:text-[#4ADE80] text-xs font-bold border border-[#0B9B6E]/30">
            <i className="fa-solid fa-compass text-[#0B9B6E]"></i>
            <span>FOUR WAYS TO EXPLORE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-[#152238] dark:text-white font-heading tracking-tight">
            Travel Your Way.
          </h2>

          <p className="text-sm sm:text-base text-[#4A5C6E] dark:text-[#9AB0A4] max-w-2xl mx-auto">
            Whether you want a private certified historian, a ready-made heritage walk, an authentic cooking workshop, or custom bids for your budget — RAAHI gives you full control.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 text-left">
            {/* Path 1: Find Guides */}
            <div className="bg-white dark:bg-[#162019] p-6 rounded-3xl border border-[#E0E8E4] dark:border-[#243028] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F7F1] dark:bg-[#07543F]/30 text-[#07543F] dark:text-[#4ADE80] flex items-center justify-center text-xl">
                  <i className="fa-solid fa-user-tie"></i>
                </div>
                <div className="text-[10px] font-extrabold uppercase text-[#0B9B6E] tracking-wider">
                  If you know what you want
                </div>
                <h3 className="text-lg font-black text-[#152238] dark:text-white font-heading group-hover:text-[#0B9B6E] transition-colors">
                  Find a Guide
                </h3>
                <p className="text-xs text-[#4A5C6E] dark:text-[#9AB0A4] leading-relaxed">
                  Directly choose a licensed professional guide, local storyteller, or student host with transparent pricing.
                </p>
              </div>
              <NavLink
                to="/guides"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-black text-[#07543F] dark:text-[#4ADE80] group-hover:underline"
              >
                <span>Browse Guides</span>
                <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </NavLink>
            </div>

            {/* Path 2: Post Your Trip */}
            <div className="bg-white dark:bg-[#162019] p-6 rounded-3xl border border-[#E0E8E4] dark:border-[#243028] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FEF6E4] dark:bg-[#F4A340]/20 text-[#F4A340] flex items-center justify-center text-xl">
                  <i className="fa-solid fa-paper-plane"></i>
                </div>
                <div className="text-[10px] font-extrabold uppercase text-[#F4A340] tracking-wider">
                  If you have a budget
                </div>
                <h3 className="text-lg font-black text-[#152238] dark:text-white font-heading group-hover:text-[#F4A340] transition-colors">
                  Post Your Trip
                </h3>
                <p className="text-xs text-[#4A5C6E] dark:text-[#9AB0A4] leading-relaxed">
                  Post your schedule and budget. Verified local guides review your requirements and send tailored offers directly.
                </p>
              </div>
              <NavLink
                to="/planner"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-black text-[#F4A340] group-hover:underline"
              >
                <span>Post Trip Requirements</span>
                <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </NavLink>
            </div>

            {/* Path 3: Explore Tours */}
            <div className="bg-white dark:bg-[#162019] p-6 rounded-3xl border-2 border-[#0B9B6E]/40 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#0B9B6E] text-white">
                New
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F7F1] dark:bg-[#07543F]/30 text-[#0B9B6E] flex items-center justify-center text-xl">
                  <i className="fa-solid fa-map-location-dot"></i>
                </div>
                <div className="text-[10px] font-extrabold uppercase text-[#0B9B6E] tracking-wider">
                  If you want a ready itinerary
                </div>
                <h3 className="text-lg font-black text-[#152238] dark:text-white font-heading group-hover:text-[#0B9B6E] transition-colors">
                  Explore Tours
                </h3>
                <p className="text-xs text-[#4A5C6E] dark:text-[#9AB0A4] leading-relaxed">
                  Book predefined walking tours with timeline itineraries, guaranteed group limits, and fixed prices per person or group.
                </p>
              </div>
              <NavLink
                to="/tours"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-black text-[#0B9B6E] group-hover:underline"
              >
                <span>Explore Tours</span>
                <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </NavLink>
            </div>

            {/* Path 4: Explore Experiences */}
            <div className="bg-white dark:bg-[#162019] p-6 rounded-3xl border border-[#E0E8E4] dark:border-[#243028] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl">
                  <i className="fa-solid fa-palette"></i>
                </div>
                <div className="text-[10px] font-extrabold uppercase text-purple-600 dark:text-purple-400 tracking-wider">
                  If you want something unique
                </div>
                <h3 className="text-lg font-black text-[#152238] dark:text-white font-heading group-hover:text-purple-600 transition-colors">
                  Explore Experiences
                </h3>
                <p className="text-xs text-[#4A5C6E] dark:text-[#9AB0A4] leading-relaxed">
                  Hands-on artisan block printing, culinary cooking masters, rooftop dawn photography, and secret folk music soirees.
                </p>
              </div>
              <NavLink
                to="/experiences"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-black text-purple-600 dark:text-purple-400 group-hover:underline"
              >
                <span>View Experiences</span>
                <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </NavLink>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════
          SECTION 2: "Explore India differently"
          Editorial Destination Cards
          ══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-white dark:bg-[#111C15] border-y border-[#E0E8E4] dark:border-[#243028]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#0B9B6E]">
                FEATURED DESTINATIONS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#152238] dark:text-white font-heading tracking-tight">
                Explore India differently
              </h2>
              <p className="text-sm text-[#4A5C6E] dark:text-[#9AB0A4] max-w-xl">
                Bypassing standard tour buses for intimate, local-led journeys across our most storied cities.
              </p>
            </div>

            <NavLink
              to="/explore"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#07543F] dark:text-[#4ADE80] hover:underline"
            >
              <span>View all 8 destinations</span>
              <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </NavLink>
          </div>

          {/* Large Editorial Destination Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {POPULAR_DESTINATIONS.map((dest) => (
              <NavLink
                key={dest.id}
                to={`/guides?city=${encodeURIComponent(dest.name)}`}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-neutral-900 border border-black/10 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 block"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

                {/* Badge top-right */}
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-white/90 dark:bg-black/80 text-[#152238] dark:text-white backdrop-blur-xs">
                    {dest.badge}
                  </span>
                </div>

                {/* Content bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white space-y-1">
                  <div className="text-[11px] font-semibold text-[#F4A340] uppercase tracking-wider">
                    {dest.tagline}
                  </div>
                  <h3 className="text-2xl font-black font-heading leading-tight">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-2 pt-0.5 leading-snug">
                    {dest.description}
                  </p>
                  <div className="pt-2 flex items-center justify-between text-[11px] text-white/70 border-t border-white/15">
                    <span>{dest.guidesCount} Local Guides</span>
                    <span className="font-bold text-white">From {dest.startingPrice}</span>
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════
          SECTION 3: "Meet your local"
          Showcase Top Verified Guides
          ══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-[#F8F7F3] dark:bg-[#0D1710]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#0B9B6E]">
                HIGH-TRUST HOSTS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#152238] dark:text-white font-heading tracking-tight">
                Meet your local
              </h2>
              <p className="text-sm text-[#4A5C6E] dark:text-[#9AB0A4] max-w-xl">
                Background-checked historians, culinary storytellers, and neighborhood insiders who love their city.
              </p>
            </div>

            <NavLink
              to="/guides"
              className="btn-secondary text-xs px-5 py-2.5 bg-white dark:bg-[#162019]"
            >
              <span>Explore all guides</span>
              <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </NavLink>
          </div>

          {/* Guide Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {JAIPUR_GUIDES_DATA.slice(0, 3).map((guide) => (
              <div
                key={guide.id}
                className="bg-white dark:bg-[#162019] rounded-2xl border border-[#E0E8E4] dark:border-[#243028] overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col"
              >
                {/* Guide Cover Photo */}
                <div className="relative h-48 bg-neutral-800 overflow-hidden">
                  <img
                    src={guide.coverImage || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'}
                    alt={guide.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Profile photo overlapping */}
                  <div className="absolute bottom-3 left-4 flex items-center gap-3">
                    <img
                      src={guide.avatar}
                      alt={guide.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                    />
                    <div className="text-white">
                      <div className="font-extrabold text-base font-heading leading-tight">{guide.name}</div>
                      <div className="text-xs text-white/80">{guide.city || 'Jaipur, Rajasthan'}</div>
                    </div>
                  </div>

                  <div className="absolute top-3 right-3">
                    <VerifiedBadge text="Verified Local" size="sm" />
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <StarRating rating={guide.rating} reviewsCount={guide.reviewCount || 48} />
                      <span className="text-xs text-[#8A9BAD] font-medium">{guide.experienceYears || 6} yrs experience</span>
                    </div>

                    <p className="text-xs text-[#4A5C6E] dark:text-[#9AB0A4] line-clamp-2 leading-relaxed">
                      {guide.bio}
                    </p>

                    {/* Specialties tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {guide.specialties.slice(0, 3).map((spec, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F8F7F3] dark:bg-[#1A2720] text-[#4A5C6E] dark:text-[#9AB0A4] border border-[#E0E8E4] dark:border-[#243028]"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom CTA & Price */}
                  <div className="pt-3 border-t border-[#F1F5F3] dark:border-[#243028] flex items-center justify-between">
                    <div>
                      {(() => {
                        const pricing = getGuideDisplayPricing(guide);
                        return (
                          <div>
                            <span className="text-[10px] text-[#8A9BAD] uppercase font-extrabold block">Total Tariff</span>
                            <span className="font-black text-base text-[#07543F] dark:text-[#4ADE80] font-heading">
                              {pricing.primaryPrice}
                            </span>
                            <span className="text-[10px] text-[#8A9BAD] block">
                              {pricing.subtext}
                            </span>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="flex items-center gap-2">
                      <NavLink
                        to={`/guides/${guide.id}`}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#152238] dark:text-white hover:bg-[#F8F7F3] dark:hover:bg-[#1A2720] transition-colors"
                      >
                        Profile
                      </NavLink>
                      <button
                        onClick={() => openBookingModal(guide)}
                        className="btn-primary text-xs px-4 py-2"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════
          SECTION 4: "EXPLORE TOURS"
          "See the city through a local's eyes."
          4–6 Real Tours from Backend
          ══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-white dark:bg-[#111C15] border-y border-[#E0E8E4] dark:border-[#243028]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 text-left">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#0B9B6E]">
                EXPLORE TOURS
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#152238] dark:text-white font-heading tracking-tight">
                See the city through a local's eyes.
              </h2>
              <p className="text-sm text-[#4A5C6E] dark:text-[#9AB0A4] max-w-xl">
                Ready-made bookable tours with structured timeline itineraries, guaranteed group limits, and fixed transparent tariffs.
              </p>
            </div>

            <NavLink
              to="/tours"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#07543F] dark:bg-[#4ADE80] text-white dark:text-[#0D1710] font-black text-xs shadow-sm hover:shadow-md transition"
            >
              <span>EXPLORE ALL TOURS</span>
              <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </NavLink>
          </div>

          {/* Real Backend Tours Grid (4–6 Tours) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {(tours.length > 0 ? tours.slice(0, 6) : []).map((tour) => {
              const pricing = getTourDisplayPricing(tour);
              const tourId = tour.tourId || tour.id;

              return (
                <div
                  key={tourId}
                  className="group bg-[#F8F7F3] dark:bg-[#162019] rounded-3xl border border-[#E0E8E4] dark:border-[#243028] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Cover Image & Badges */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={tour.coverImage || tour.image || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80'}
                        alt={tour.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-white/95 text-[#07543F] shadow-xs">
                        {tour.category || 'Heritage'}
                      </div>
                      <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                        <i className="fa-solid fa-star text-[#F4A340] text-[9px]"></i>
                        <span>{tour.rating || '4.95'}</span>
                      </div>
                      <div className="absolute bottom-3 left-3 text-xs font-bold text-white flex items-center gap-1.5 drop-shadow">
                        <i className="fa-solid fa-location-dot text-[#4ADE80]"></i>
                        <span>{tour.destination || 'Jaipur'}</span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-5 sm:p-6 space-y-3">
                      <h3 className="font-extrabold text-base text-[#152238] dark:text-white font-heading line-clamp-2 group-hover:text-[#0B9B6E] transition-colors">
                        {tour.title}
                      </h3>

                      <p className="text-xs text-[#4A5C6E] dark:text-[#9AB0A4] line-clamp-2 leading-relaxed">
                        {tour.summary || tour.description}
                      </p>

                      <div className="flex items-center gap-3 pt-1 text-xs text-[#8A9BAD] font-semibold border-t border-[#E0E8E4] dark:border-[#243028]">
                        <span>⏱ {tour.duration || '3 Hours'}</span>
                        <span>•</span>
                        <span>👥 Max {tour.maxParticipants || tour.maxCapacity || 6} people</span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="text-[11px] font-bold text-[#152238] dark:text-white flex items-center gap-1.5">
                          <img
                            src={tour.guideAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}
                            alt={tour.guideName}
                            className="w-5 h-5 rounded-full object-cover border border-[#0B9B6E]"
                          />
                          <span className="truncate max-w-[130px]">{tour.guideName}</span>
                        </div>
                        <span className="text-[10px] font-extrabold text-[#0B9B6E] bg-[#E8F7F1] dark:bg-[#07543F]/25 px-2 py-0.5 rounded-full border border-[#0B9B6E]/30">
                          ✓ Verified Host
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA & Price */}
                  <div className="p-5 sm:p-6 pt-0 border-t border-[#E0E8E4] dark:border-[#243028] mt-2 flex items-end justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-[#8A9BAD] uppercase font-bold block">Starting from</span>
                      <span className="text-lg font-black text-[#07543F] dark:text-[#4ADE80] font-heading">
                        {pricing.primaryPrice}
                      </span>
                    </div>

                    <NavLink
                      to={`/tours/${tourId}`}
                      className="px-4 py-2 rounded-xl bg-[#07543F] hover:bg-[#053D2E] text-white font-bold text-xs shadow-xs transition"
                    >
                      View Tour
                    </NavLink>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════
          SECTION 4B: "EXPLORE EXPERIENCES"
          Curated Workshops & Cultural Activities
          ══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-[#F8F7F3] dark:bg-[#0D1710] border-b border-[#E0E8E4] dark:border-[#243028]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 text-left">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#F4A340]">
                LOCAL EXPERIENCES & WORKSHOPS
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#152238] dark:text-white font-heading tracking-tight">
                Hands-on cultural experiences.
              </h2>
              <p className="text-sm text-[#4A5C6E] dark:text-[#9AB0A4] max-w-xl">
                Block-printing workshops, home cooking masterclasses, and rooftop sunrise photography with independent artisans.
              </p>
            </div>

            <NavLink
              to="/experiences"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#07543F] dark:text-[#4ADE80] hover:underline"
            >
              <span>See all experiences</span>
              <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </NavLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              {
                id: 'exp-1',
                title: 'Old City Morning Food Trail & Chai Ateliers',
                location: 'Jaipur, Rajasthan',
                image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
                duration: '3.5 Hours',
                category: 'Culinary Heritage',
                price: '₹1,250 total',
                rating: 4.96,
                reviews: 84,
                guide: 'Priya S.',
              },
              {
                id: 'exp-2',
                title: 'Secret Stepwells & Sunrise Rooftop Photography',
                location: 'Amer & Jaipur',
                image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
                duration: '4 Hours',
                category: 'Photography Workshop',
                price: '₹1,600 total',
                rating: 4.98,
                reviews: 62,
                guide: 'Sunita K.',
              },
              {
                id: 'exp-3',
                title: 'Sanganer Block-Printing & Natural Indigo Workshop',
                location: 'Sanganer, Jaipur',
                image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
                duration: '4.5 Hours',
                category: 'Artisan Workshop',
                price: '₹1,500 total',
                rating: 4.92,
                reviews: 41,
                guide: 'Rajesh S.',
              },
            ].map((exp) => (
              <div
                key={exp.id}
                className="group bg-white dark:bg-[#162019] rounded-3xl border border-[#E0E8E4] dark:border-[#243028] overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-black/75 text-white backdrop-blur-xs">
                        {exp.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#8A9BAD]">
                      <span>📍 {exp.location}</span>
                      <span>⏱ {exp.duration}</span>
                    </div>
                    <h3 className="font-extrabold text-base text-[#152238] dark:text-white font-heading group-hover:text-[#0B9B6E] transition-colors leading-snug">
                      {exp.title}
                    </h3>
                    <div className="flex items-center justify-between pt-1">
                      <StarRating rating={exp.rating} reviewsCount={exp.reviews} />
                      <span className="text-xs text-[#8A9BAD]">Host: {exp.guide}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-[#F1F5F3] dark:border-[#243028] mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#8A9BAD] uppercase font-bold block">Fee</span>
                    <span className="text-base font-extrabold text-[#07543F] dark:text-[#4ADE80] font-heading">
                      {exp.price}
                    </span>
                  </div>
                  <NavLink
                    to="/experiences"
                    className="btn-primary text-xs px-4 py-2"
                  >
                    <span>View Workshop</span>
                    <i className="fa-solid fa-arrow-right text-[10px]"></i>
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════
          SECTION 5: "Know the fair price before you book"
          Interactive Flagship Fair Price Preview
          ══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-[#F8F7F3] dark:bg-[#0D1710]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left: Product Explanation */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#0B9B6E]">
                ANTI-EXTORTION SHIELD
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#152238] dark:text-white font-heading tracking-tight leading-tight">
                Know the fair price before you book
              </h2>
              <p className="text-sm sm:text-base text-[#4A5C6E] dark:text-[#9AB0A4] leading-relaxed">
                Touts and tourist drivers often demand 3x to 5x standard city tariffs. Our algorithmic Fair Price Engine checks official regional transport authority mandates so you always know the exact fair rate.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'Statutory regional rates for auto, e-rickshaw, and sedan',
                  'Instant visual gauge showing fair vs. inflated quote',
                  'One-tap counter-offer script in Hindi and English',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-[#152238] dark:text-[#E8F0EC]">
                    <i className="fa-solid fa-circle-check text-[#0B9B6E] mt-0.5"></i>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <NavLink
                  to="/fair-price"
                  className="btn-primary text-xs px-6 py-3.5 inline-flex items-center gap-2"
                >
                  <span>Open Full Fair Price Shield</span>
                  <i className="fa-solid fa-arrow-right text-xs"></i>
                </NavLink>
              </div>
            </div>

            {/* Right: Live Interactive Price Checker Widget */}
            <div className="lg:col-span-7 bg-white dark:bg-[#111C15] p-6 sm:p-8 rounded-3xl border border-[#E0E8E4] dark:border-[#243028] shadow-lg space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F3] dark:border-[#243028]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#E8F7F1] dark:bg-[#07543F]/30 flex items-center justify-center text-[#0B9B6E] text-sm">
                    <i className="fa-solid fa-shield-halved"></i>
                  </div>
                  <div>
                    <span className="font-extrabold text-sm text-[#152238] dark:text-white font-heading">
                      Fair Price Simulator
                    </span>
                    <span className="text-[11px] text-[#8A9BAD] block">Jaipur Metropolitan Region</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#0B9B6E] bg-[#E8F7F1] dark:bg-[#07543F]/30 px-2.5 py-1 rounded-full">
                  Live Calculator
                </span>
              </div>

              {/* Vehicle Mode Tabs */}
              <div>
                <label className="block text-[11px] font-bold text-[#8A9BAD] uppercase tracking-wider mb-2">
                  Transport Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'auto', label: 'Auto Rickshaw', icon: 'fa-taxi' },
                    { id: 'eRickshaw', label: 'E-Rickshaw', icon: 'fa-bolt' },
                    { id: 'taxi', label: 'AC Sedan Taxi', icon: 'fa-car' },
                  ].map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setFpVehicle(v.id)}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        fpVehicle === v.id
                          ? 'border-[#0B9B6E] bg-[#E8F7F1] dark:bg-[#07543F]/30 text-[#07543F] dark:text-[#4ADE80]'
                          : 'border-[#E0E8E4] dark:border-[#243028] text-[#4A5C6E] dark:text-[#9AB0A4] hover:bg-[#F8F7F3]'
                      }`}
                    >
                      <i className={`fa-solid ${v.icon} text-sm`}></i>
                      <span>{v.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider for Distance */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#152238] dark:text-[#E8F0EC]">Estimated Distance:</span>
                  <span className="font-extrabold text-sm text-[#0B9B6E]">{fpDistance} km</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  step="0.5"
                  value={fpDistance}
                  onChange={(e) => setFpDistance(Number(e.target.value))}
                  className="w-full accent-[#0B9B6E] cursor-pointer"
                />
              </div>

              {/* Input for Quoted Fare */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#152238] dark:text-[#E8F0EC]">
                  What did the driver quote you? (₹)
                </label>
                <input
                  type="number"
                  value={fpQuote}
                  onChange={(e) => setFpQuote(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F7F3] dark:bg-[#162019] border border-[#E0E8E4] dark:border-[#243028] font-bold text-sm text-[#152238] dark:text-white focus:outline-none focus:border-[#0B9B6E]"
                />
              </div>

              {/* Live Gauge */}
              <PriceGauge
                minPrice={fpBenchmarkMin}
                typicalMin={fpBenchmarkMin}
                typicalMax={fpBenchmarkMax}
                userQuote={fpQuote}
                maxCeiling={Math.max(fpBenchmarkMax * 1.8, fpQuote + 50)}
              />
            </div>

          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════
          SECTION 6: "Plan your trip with RAAHI AI"
          Modern AI Travel Concierge Showcase
          ══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-white dark:bg-[#111C15] border-y border-[#E0E8E4] dark:border-[#243028]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#07543F] to-[#152238] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
            {/* Background sparkle accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#0B9B6E]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">

              {/* Left Column */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold border border-white/15">
                  <i className="fa-solid fa-wand-magic-sparkles text-[#F4A340]"></i>
                  <span>AI TRAVEL CONCIERGE</span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-black font-heading leading-tight tracking-tight">
                  Plan your trip with RAAHI AI
                </h2>

                <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-lg">
                  Generate customized, scam-free itineraries crafted around real local guides, authentic artisan stops, and verified timings in under 30 seconds.
                </p>

                {/* Quick Interactive Selector */}
                <div className="space-y-4 pt-2">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-white/60 block mb-2">
                      Select Destination
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {['Jaipur', 'Varanasi', 'Udaipur', 'Goa', 'Delhi'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setPlannerDestination(c)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            plannerDestination === c
                              ? 'bg-white text-[#07543F] shadow-sm'
                              : 'bg-white/10 text-white/80 hover:bg-white/20'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-white/60 block mb-2">
                      Travel Style
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {['Cultural & Heritage', 'Street Food & Art', 'Relaxed Photography'].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setPlannerStyle(st)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            plannerStyle === st
                              ? 'bg-[#F4A340] text-[#152238] shadow-sm'
                              : 'bg-white/10 text-white/80 hover:bg-white/20'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => navigate(`/planner?city=${encodeURIComponent(plannerDestination)}&style=${encodeURIComponent(plannerStyle)}`)}
                    className="btn-accent px-7 py-3.5 text-xs font-extrabold uppercase tracking-wider"
                  >
                    <span>Create My Itinerary</span>
                    <i className="fa-solid fa-arrow-right text-xs"></i>
                  </button>
                </div>
              </div>

              {/* Right Column: Visual Timeline Card Preview */}
              <div className="lg:col-span-6 bg-white/95 dark:bg-[#162019]/95 text-[#152238] dark:text-white p-6 sm:p-7 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E0E8E4] dark:border-[#243028]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0B9B6E]"></span>
                    <span className="font-extrabold text-sm font-heading">
                      {plannerDestination} • 3-Day Curated Route
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#0B9B6E] bg-[#E8F7F1] dark:bg-[#07543F]/30 px-2 py-0.5 rounded-full">
                    {plannerStyle}
                  </span>
                </div>

                {/* Timeline Days */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase text-[#0B9B6E] tracking-wider">
                        Day 01 • Morning
                      </span>
                      <span className="text-[10px] text-[#8A9BAD]">07:30 AM — 11:00 AM</span>
                    </div>
                    <div className="font-bold text-xs text-[#152238] dark:text-white">
                      Amer Fort Secret Ridge Walk & Ancient Stepwell Panna Meena
                    </div>
                    <div className="text-[11px] text-[#4A5C6E] dark:text-[#9AB0A4]">
                      Avoid tourist bus crowds with certified resident historian Rajesh S.
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase text-[#F4A340] tracking-wider">
                        Day 01 • Afternoon
                      </span>
                      <span className="text-[10px] text-[#8A9BAD]">01:30 PM — 04:30 PM</span>
                    </div>
                    <div className="font-bold text-xs text-[#152238] dark:text-white">
                      Private Sanganer Handloom Block-Printing Workshop
                    </div>
                    <div className="text-[11px] text-[#4A5C6E] dark:text-[#9AB0A4]">
                      Direct artisan atelier (zero commission retail showrooms).
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase text-purple-600 dark:text-purple-400 tracking-wider">
                        Day 01 • Sunset
                      </span>
                      <span className="text-[10px] text-[#8A9BAD]">05:30 PM — 08:00 PM</span>
                    </div>
                    <div className="font-bold text-xs text-[#152238] dark:text-white">
                      Nahargarh Fort Sunset Viewpoint & Heritage Culinary Dinner
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════
          CAMPUS AMBASSADOR SECTION (Requirement 23)
          ══════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-white dark:bg-[#111C15] border-t border-b border-[#E0E8E4] dark:border-[#243028] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0B9B6E]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F7F1] dark:bg-[#07543F]/30 text-[#07543F] dark:text-[#4ADE80] text-xs font-extrabold border border-[#0B9B6E]/30">
                <span className="text-sm">🎓</span>
                <span>STUDENT LEADERSHIP NETWORK</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-[#152238] dark:text-white font-heading tracking-tight leading-tight">
                BRING RAAHI TO YOUR CAMPUS
              </h2>

              <p className="text-base sm:text-lg font-bold text-[#152238] dark:text-white">
                Are you a student who loves travel, technology and community?
              </p>

              <p className="text-sm text-[#4A5C6E] dark:text-[#9AB0A4] leading-relaxed max-w-xl">
                Become a RAAHI Campus Ambassador and help students discover guides, tours, experiences and local opportunities. Represent our verified cultural mission, organize student travel activities, and build your campus network.
              </p>

              {/* Compliance note */}
              <p className="text-[11px] text-[#8A9BAD] italic">
                * Benefits and rewards may be available based on the active RAAHI ambassador program.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <NavLink
                  to="/campus-ambassador/apply"
                  className="btn-primary text-xs sm:text-sm px-6 py-3.5 shadow-primary font-extrabold uppercase tracking-wider flex items-center gap-2"
                >
                  <i className="fa-solid fa-graduation-cap"></i>
                  <span>BECOME A CAMPUS AMBASSADOR</span>
                </NavLink>

                <NavLink
                  to="/campus-ambassador/apply"
                  className="btn-secondary text-xs sm:text-sm px-6 py-3.5 bg-[#F8F7F3] dark:bg-[#162019] font-bold"
                >
                  <span>LEARN MORE</span>
                  <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </NavLink>
              </div>
            </div>

            {/* Right Card / Visual */}
            <div className="lg:col-span-5">
              <div className="bg-[#F8F7F3] dark:bg-[#162019] rounded-3xl p-6 sm:p-8 border-2 border-[#0B9B6E]/20 shadow-xl space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#0B9B6E] text-white flex items-center justify-center text-xl shadow-xs">
                    🎓
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#E8F7F1] dark:bg-[#07543F]/40 text-[#0B9B6E] text-xs font-black uppercase">
                    Active Across India
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-black text-lg text-[#152238] dark:text-white">
                    Lead Travel Culture at Your University
                  </h3>
                  <p className="text-xs text-[#4A5C6E] dark:text-[#9AB0A4] leading-relaxed">
                    Connect college peers to authentic cultural guides, verify student status, and host regional campus meetups.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#E0E8E4] dark:border-[#243028] text-xs font-semibold text-[#152238] dark:text-white">
                  <div className="flex items-center gap-2.5">
                    <i className="fa-solid fa-check-circle text-[#0B9B6E]"></i>
                    <span>Unique Student Referral Code & Tracking</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <i className="fa-solid fa-check-circle text-[#0B9B6E]"></i>
                    <span>Official Brand Toolkit & Social Assets</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <i className="fa-solid fa-check-circle text-[#0B9B6E]"></i>
                    <span>Separately Apply to Become Local Host</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 7: Strong Final CTA
          ══════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-[#F8F7F3] dark:bg-[#0D1710] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <span className="text-xs font-black uppercase tracking-widest text-[#0B9B6E]">
            START YOUR JOURNEY TODAY
          </span>

          <h2 className="text-3xl sm:text-5xl font-black text-[#152238] dark:text-white font-heading tracking-tight leading-tight">
            READY TO EXPERIENCE INDIA DIFFERENTLY?
          </h2>

          <p className="text-sm sm:text-base text-[#4A5C6E] dark:text-[#9AB0A4] max-w-xl mx-auto leading-relaxed">
            Join thousands of smart travelers who explore with verified local hosts, fair guaranteed tariffs, and zero worries.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <NavLink
              to="/guides"
              className="btn-primary text-sm px-8 py-4 shadow-primary font-bold"
            >
              <span>Find Your Local Guide</span>
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </NavLink>

            <NavLink
              to="/explore"
              className="btn-secondary text-sm px-7 py-4 bg-white dark:bg-[#162019]"
            >
              <i className="fa-solid fa-compass text-[#F4A340]"></i>
              <span>Explore Destinations</span>
            </NavLink>
          </div>
        </div>
      </section>

    </div>
  );
};
