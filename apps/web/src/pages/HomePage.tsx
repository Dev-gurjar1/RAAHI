import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LeafletRadarMap } from '../components/LeafletRadarMap';
import { useBookingStore } from '../store/useBookingStore';
import { JAIPUR_GUIDES_DATA } from '../constants/guides';
import { GuideProfile } from '@raahi/shared-types';

export const HomePage: React.FC = () => {
  // Hero Search State
  const [destination, setDestination] = useState('Jaipur');
  const [selectedDate, setSelectedDate] = useState('Today');
  const [experienceType, setExperienceType] = useState('All Experiences');

  // Fair Price Calculator Preview State
  const [fareDistance, setFareDistance] = useState(4.2);
  const [driverQuote, setDriverQuote] = useState(180);
  const [transportMode, setTransportMode] = useState<'auto' | 'eRickshaw' | 'guide'>('auto');

  // Guide Filter State
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // AI Planner Quick Preview State
  const [plannerDays, setPlannerDays] = useState(1);
  const [plannerStyle, setPlannerStyle] = useState('Heritage');

  // Safety Demo State
  const [sosSimulated, setSosSimulated] = useState(false);

  const openBookingModal = useBookingStore((state) => state.openBookingModal);
  const navigate = useNavigate();

  // Fare calculations for Fair Price Shield preview
  const perKmRate = transportMode === 'auto' ? 14 : transportMode === 'eRickshaw' ? 10 : 50;
  const baseRate = transportMode === 'auto' ? 30 : transportMode === 'eRickshaw' ? 20 : 150;
  
  const benchmarkMin = Math.round(baseRate + fareDistance * perKmRate * 0.9);
  const benchmarkMax = Math.round(baseRate + fareDistance * perKmRate * 1.15);
  const benchmarkRec = Math.round(baseRate + fareDistance * perKmRate);
  const potentialOvercharge = driverQuote > benchmarkMax ? driverQuote - benchmarkRec : 0;

  // Filtered guides for showcase
  const filteredGuides = activeCategory === 'All'
    ? JAIPUR_GUIDES_DATA.slice(0, 3)
    : JAIPUR_GUIDES_DATA.filter(g => g.specialties.some(s => s.toLowerCase().includes(activeCategory.toLowerCase()))).slice(0, 3);

  return (
    <div className="space-y-24 text-left font-sans">
      
      {/* 1. HERO SECTION (Asymmetric Editorial Travel-Tech Layout) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center pt-2 sm:pt-4">
        
        {/* Left Column: Headline, Description & 3 Primary CTAs */}
        <div className="lg:col-span-6 space-y-7 text-left z-10">
          
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-extrabold border border-orange-200/80 dark:border-orange-500/20 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span>Verified Local Guide Marketplace & Safety Net</span>
          </div>

          <h1 className="text-4xl sm:text-6xl xl:text-[62px] font-extrabold text-slate-900 dark:text-white font-heading leading-[1.08] tracking-tight">
            Explore India Like a Local. <br />
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
              Travel Without the Tourist Trap.
            </span>
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed font-normal">
            Connect with Aadhaar & police-verified local hosts, discover authentic hidden experiences, calculate government-fair tariffs, and travel with 24/7 SOS safety protection.
          </p>

          {/* 3 PRIMARY CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {/* CTA 1: Find a Local Guide */}
            <NavLink
              to="/guides"
              className="px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-full text-xs uppercase tracking-wider transition shadow-lg shadow-orange-500/25 flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <i className="fa-solid fa-user-check text-sm"></i>
              <span>Find a Local Guide</span>
            </NavLink>

            {/* CTA 2: Explore Experiences */}
            <NavLink
              to="/tours"
              className="px-6 py-3.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white dark:text-slate-100 font-extrabold rounded-full text-xs uppercase tracking-wider transition shadow-md flex items-center gap-2 transform hover:-translate-y-0.5 border border-slate-700/50"
            >
              <i className="fa-solid fa-compass text-sm text-amber-400"></i>
              <span>Explore Experiences</span>
            </NavLink>

            {/* CTA 3: Check Fair Price */}
            <NavLink
              to="/fair-price"
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-full text-xs uppercase tracking-wider transition shadow-md shadow-emerald-500/20 flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <i className="fa-solid fa-shield-halved text-sm"></i>
              <span>Check Fair Price</span>
            </NavLink>
          </div>

          {/* Interactive Search Bar Panel */}
          <div className="bg-white dark:bg-slate-800 p-3 rounded-3xl sm:rounded-full shadow-floating border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-2 max-w-xl">
            
            {/* Destination Input */}
            <div className="w-full sm:w-auto flex-1 flex items-center gap-3 px-4 py-2 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-700">
              <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-slate-700 flex items-center justify-center text-orange-500 text-xs flex-shrink-0">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div className="text-left w-full">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block leading-none mb-0.5">Destination</span>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Jaipur, Amer Fort..."
                  className="bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none w-full"
                />
              </div>
            </div>

            {/* Date Input */}
            <div className="w-full sm:w-auto flex-1 flex items-center gap-3 px-4 py-2 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-700">
              <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-slate-700 flex items-center justify-center text-amber-500 text-xs flex-shrink-0">
                <i className="fa-solid fa-calendar-day"></i>
              </div>
              <div className="text-left w-full">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block leading-none mb-0.5">When</span>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer w-full"
                >
                  <option value="Today">Today (Instant)</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="This Weekend">This Weekend</option>
                </select>
              </div>
            </div>

            {/* Experience Type */}
            <div className="w-full sm:w-auto flex-1 flex items-center gap-3 px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-slate-700 flex items-center justify-center text-emerald-600 text-xs flex-shrink-0">
                <i className="fa-solid fa-camera-retro"></i>
              </div>
              <div className="text-left w-full">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block leading-none mb-0.5">Experience</span>
                <select
                  value={experienceType}
                  onChange={(e) => setExperienceType(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer w-full"
                >
                  <option value="All Experiences">All Types</option>
                  <option value="Heritage">Heritage & Forts</option>
                  <option value="Street Food">Street Food Crawl</option>
                  <option value="Photography">Photography Walk</option>
                  <option value="Crafts">Textile & Bazaars</option>
                </select>
              </div>
            </div>

            {/* Search CTA */}
            <button
              onClick={() => navigate('/guides')}
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-extrabold px-6 py-3.5 rounded-full transition shadow-md flex items-center justify-center gap-2 text-xs uppercase tracking-wider flex-shrink-0"
            >
              <i className="fa-solid fa-magnifying-glass text-xs"></i>
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>

        {/* Right Column: Editorial Visual Mask & Glassmorphism Floating Trust Badges */}
        <div className="lg:col-span-6 relative flex items-center justify-center min-h-[480px] sm:min-h-[560px]">
          
          {/* Ambient Warm Gradient Glows */}
          <div className="absolute w-80 h-80 sm:w-[480px] sm:h-[480px] rounded-full bg-gradient-to-tr from-[#FF7A45]/30 via-[#F59E0B]/20 to-emerald-400/10 blur-2xl pointer-events-none"></div>
          <div className="absolute w-72 h-72 sm:w-[400px] sm:h-[400px] rounded-full bg-gradient-to-br from-orange-400/20 to-amber-300/20 border border-orange-500/20 pointer-events-none"></div>

          {/* Editorial Main Visual Card */}
          <div className="relative z-10 w-72 sm:w-[380px] h-[400px] sm:h-[500px] rounded-[44px] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 transform hover:scale-[1.01] transition duration-500">
            <img
              src="https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=85"
              alt="Jaipur Heritage Traveler with Verified Local Host"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent"></div>
            
            <div className="absolute bottom-5 left-5 right-5 text-white text-left">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full border border-amber-300/30 inline-block mb-1.5">
                Hawa Mahal • Jaipur
              </span>
              <h3 className="text-base font-extrabold text-white leading-tight font-heading">
                Authentic Heritage & Cultural Exploration
              </h3>
              <p className="text-xs text-slate-200/90 font-medium mt-0.5">
                Led by Vikram Singh Rathore (Aadhaar & Police Verified)
              </p>
            </div>
          </div>

          {/* FLOATING GLASSMORPHISM TRUST CARD 1: Verified Guide */}
          <div className="absolute top-4 -left-2 sm:left-2 z-20 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-floating border border-slate-100 dark:border-slate-700 flex items-center gap-3 animate-float">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm flex-shrink-0">
              <i className="fa-solid fa-shield-check"></i>
            </div>
            <div className="text-left">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Aadhaar & Police Vetted</div>
              <div className="text-xs font-extrabold text-slate-900 dark:text-white">Vikram Rathore • 4.95 ★</div>
            </div>
          </div>

          {/* FLOATING GLASSMORPHISM TRUST CARD 2: Fair Fare Benchmark */}
          <div className="absolute top-24 -right-2 sm:right-2 z-20 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-floating border border-slate-100 dark:border-slate-700 flex items-center gap-3 animate-float-delayed">
            <div className="w-9 h-9 rounded-xl bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center text-sm flex-shrink-0">
              <i className="fa-solid fa-indian-rupee-sign"></i>
            </div>
            <div className="text-left">
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Fair Fare Shield</div>
              <div className="text-xs font-extrabold text-slate-900 dark:text-white">₹95 – ₹120 (Govt Rate)</div>
            </div>
          </div>

          {/* FLOATING GLASSMORPHISM TRUST CARD 3: Start-Tour OTP Protection */}
          <div className="absolute bottom-20 -left-4 sm:left-0 z-20 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-floating border border-slate-100 dark:border-slate-700 flex items-center gap-3 animate-float-slow">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center text-sm flex-shrink-0">
              <i className="fa-solid fa-key"></i>
            </div>
            <div className="text-left">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Anti-Fraud Lock</div>
              <div className="text-xs font-extrabold text-slate-900 dark:text-white">4-Digit Start-Tour OTP</div>
            </div>
          </div>

          {/* FLOATING GLASSMORPHISM TRUST CARD 4: Live 24/7 Safety Dispatch */}
          <div className="absolute bottom-4 -right-2 sm:right-4 z-20 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-floating border border-slate-100 dark:border-slate-700 flex items-center gap-3 animate-float">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div className="text-left">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">24/7 Safety Dispatch</div>
              <div className="text-xs font-extrabold text-slate-900 dark:text-white">GPS Radar Active</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. USER JOURNEY ROADMAP (Discover → Compare → Check Fair Price → Book → Explore → Stay Safe) */}
      <section className="bg-slate-50/80 dark:bg-slate-800/40 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 space-y-8 shadow-xs">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600 dark:text-orange-400 bg-orange-100/60 dark:bg-orange-500/10 px-3 py-1 rounded-full">
            TRUSTED USER WORKFLOW
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
            How RAAHI Works for Every Traveler
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
            From initial search to safe return, RAAHI provides total transparency and security at every step.
          </p>
        </div>

        {/* 6-Step Workflow Journey Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Step 1: Discover */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-xs hover:shadow-card transition duration-300 space-y-3 relative group">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center text-base font-bold">
                <i className="fa-solid fa-magnifying-glass-location"></i>
              </div>
              <span className="text-2xl font-black text-slate-200 dark:text-slate-700 font-heading">01</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading group-hover:text-orange-500 transition">
              1. Discover
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Explore verified local hosts and handcrafted authentic itineraries tailored to your destination, style, and language.
            </p>
            <div className="pt-1 text-[11px] font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1">
              <span>Filter by Interests & Languages</span>
              <i className="fa-solid fa-chevron-right text-[9px]"></i>
            </div>
          </div>

          {/* Step 2: Compare */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-xs hover:shadow-card transition duration-300 space-y-3 relative group">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center text-base font-bold">
                <i className="fa-solid fa-sliders"></i>
              </div>
              <span className="text-2xl font-black text-slate-200 dark:text-slate-700 font-heading">02</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading group-hover:text-amber-500 transition">
              2. Compare
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Review government credentials, background clearance status, hourly tariffs, ratings, and authentic traveler feedback.
            </p>
            <div className="pt-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <span>Transparent Host Profiles</span>
              <i className="fa-solid fa-chevron-right text-[9px]"></i>
            </div>
          </div>

          {/* Step 3: Check Fair Price */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-xs hover:shadow-card transition duration-300 space-y-3 relative group">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-base font-bold">
                <i className="fa-solid fa-calculator"></i>
              </div>
              <span className="text-2xl font-black text-slate-200 dark:text-slate-700 font-heading">03</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading group-hover:text-emerald-500 transition">
              3. Check Fair Price
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Use our Anti-Scam Fare Shield to calculate government-benchmarked tariffs for Auto-Rickshaws, E-Rickshaws, and Guides.
            </p>
            <div className="pt-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span>Zero Tourist Tax Overcharge</span>
              <i className="fa-solid fa-chevron-right text-[9px]"></i>
            </div>
          </div>

          {/* Step 4: Book */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-xs hover:shadow-card transition duration-300 space-y-3 relative group">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center text-base font-bold">
                <i className="fa-solid fa-key"></i>
              </div>
              <span className="text-2xl font-black text-slate-200 dark:text-slate-700 font-heading">04</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading group-hover:text-orange-500 transition">
              4. Book & Lock OTP
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Instantly match with nearby hosts. Receive a 4-digit Start-Tour OTP to verify your host in person before the tour begins.
            </p>
            <div className="pt-1 text-[11px] font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1">
              <span>Secure Start-Tour OTP Protection</span>
              <i className="fa-solid fa-chevron-right text-[9px]"></i>
            </div>
          </div>

          {/* Step 5: Explore */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-xs hover:shadow-card transition duration-300 space-y-3 relative group">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center text-base font-bold">
                <i className="fa-solid fa-map-location-dot"></i>
              </div>
              <span className="text-2xl font-black text-slate-200 dark:text-slate-700 font-heading">05</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading group-hover:text-amber-500 transition">
              5. Explore Like a Local
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Walk secret palace corridors, taste 90-year-old street food delicacies, and shop artisan bazaars without commission pressure.
            </p>
            <div className="pt-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <span>No Pushy Shop Scams</span>
              <i className="fa-solid fa-chevron-right text-[9px]"></i>
            </div>
          </div>

          {/* Step 6: Stay Safe */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-xs hover:shadow-card transition duration-300 space-y-3 relative group">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-base font-bold">
                <i className="fa-solid fa-shield-heart"></i>
              </div>
              <span className="text-2xl font-black text-slate-200 dark:text-slate-700 font-heading">06</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading group-hover:text-emerald-500 transition">
              6. Stay Safe & Supported
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Share real-time GPS trip tracking with family, and access our 24/7 emergency dispatch helpline with a single tap.
            </p>
            <div className="pt-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span>24/7 Human Emergency Response</span>
              <i className="fa-solid fa-chevron-right text-[9px]"></i>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW RAAHI WORKS (CORE PILLARS STRIP) */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        {/* Background Accent Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-10">
          <div className="max-w-xl space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
              WHY TRAVELERS TRUST RAAHI
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
              Built to Eliminate Tourist Exploitation
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              We combine government credential verification with technology to protect travelers across India.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-3 hover:bg-white/10 transition">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-lg">
                <i className="fa-solid fa-id-card"></i>
              </div>
              <h3 className="font-bold text-sm font-heading text-white">Aadhaar & Police Vetted</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every guide undergoes identity verification, local address check, and police record validation.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-3 hover:bg-white/10 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg">
                <i className="fa-solid fa-scale-balanced"></i>
              </div>
              <h3 className="font-bold text-sm font-heading text-white">Government Rate Matrices</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Clear fare calculation formulas derived from regional transport authorities to prevent overcharging.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-3 hover:bg-white/10 transition">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg">
                <i className="fa-solid fa-lock"></i>
              </div>
              <h3 className="font-bold text-sm font-heading text-white">4-Digit Start-Tour Lock</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your booking is protected until you meet your verified host face-to-face and share your start OTP.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-3 hover:bg-white/10 transition">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center text-lg">
                <i className="fa-solid fa-radar"></i>
              </div>
              <h3 className="font-bold text-sm font-heading text-white">24/7 Live GPS & SOS</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Real-time trip location monitoring with 1-tap SOS panic dispatch connected to local safety units.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VERIFIED LOCAL GUIDES SHOWCASE */}
      <section id="guides" className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-500">VERIFIED HOSTS NEAR YOU</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
              Meet Jaipur's Top Local Guides
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
              Certified companions who know history, secret alleys, and local food spots.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {['All', 'Heritage', 'Food', 'Photography', 'Shopping'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Guide Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <div
              key={guide.id}
              className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-100 dark:border-slate-700/80 shadow-card hover:shadow-floating transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3.5">
                <div className="flex items-center gap-3.5">
                  <div className="relative flex-shrink-0">
                    <img
                      src={guide.avatar}
                      alt={guide.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[9px] border-2 border-white">
                      ✓
                    </span>
                  </div>
                  <div>
                    <NavLink to={`/guides/${guide.id}`} className="font-bold text-slate-900 dark:text-white text-base font-heading hover:text-orange-500 transition flex items-center gap-1.5">
                      <span>{guide.name}</span>
                    </NavLink>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="text-amber-500 font-bold flex items-center gap-1">
                        <i className="fa-solid fa-star text-[11px]"></i> {guide.rating}
                      </span>
                      <span>({guide.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {guide.specialties.map((s, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-50 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 text-[10px] px-2.5 py-1 rounded-lg font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Details */}
                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 pt-1">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-language text-slate-400 w-4"></i>
                    <span>{guide.languages.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-location-arrow text-slate-400 w-4"></i>
                    <span>{guide.distanceKm} km away in Jaipur</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-clock text-slate-400 w-4"></i>
                    <span>Response time {guide.responseTime}</span>
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block leading-none">Hourly Tariff</span>
                  <span className="text-lg font-extrabold text-orange-600 dark:text-orange-400">₹{guide.hourlyRate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <NavLink
                    to={`/guides/${guide.id}`}
                    className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold rounded-full text-xs transition"
                  >
                    Profile
                  </NavLink>
                  <button
                    onClick={() => openBookingModal(guide)}
                    className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-full text-xs transition shadow-md shadow-orange-500/20"
                  >
                    Book Guide
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <NavLink
            to="/guides"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-full text-xs transition"
          >
            <span>Browse All Verified Local Guides</span>
            <i className="fa-solid fa-arrow-right text-[10px]"></i>
          </NavLink>
        </div>
      </section>

      {/* 5. FAIR PRICE PROTECTION CALCULATOR PREVIEW */}
      <section id="fair-price" className="bg-gradient-to-br from-orange-50/80 via-white to-amber-50/70 dark:from-slate-800/90 dark:via-slate-800 dark:to-slate-900 rounded-3xl p-6 sm:p-10 border border-orange-200/60 dark:border-slate-700 shadow-card">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column Description */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-500/10 px-3 py-1 rounded-full">
              ANTI-SCAM PROTECTION
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading leading-tight">
              Don't Guess the Fare. Pay What's Fair.
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Calculate government-verified benchmark tariffs for Auto-Rickshaws, E-Rickshaws, and Guides in Jaipur before negotiating. Never pay tourist-tax overcharging again.
            </p>

            <div className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-emerald-500"></i>
                <span>Official Jaipur RTO benchmark formulas</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-emerald-500"></i>
                <span>Instant overcharge risk indicator</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-emerald-500"></i>
                <span>Bilingual English / Hindi rate cards</span>
              </div>
            </div>

            <div className="pt-2">
              <NavLink
                to="/fair-price"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold px-6 py-3 rounded-full text-xs transition shadow-md shadow-orange-500/20"
              >
                <span>Open Full Tariff Calculator</span>
                <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </NavLink>
            </div>
          </div>

          {/* Right Column Interactive Fare Card */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-floating space-y-5">
            
            {/* Mode Switcher */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">TRANSPORT / GUIDE TARIFF</span>
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setTransportMode('auto')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    transportMode === 'auto'
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  Auto Rickshaw
                </button>
                <button
                  onClick={() => setTransportMode('eRickshaw')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    transportMode === 'eRickshaw'
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  E-Rickshaw
                </button>
                <button
                  onClick={() => setTransportMode('guide')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    transportMode === 'guide'
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  Guide
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] text-slate-400 uppercase font-semibold">
                  {transportMode === 'guide' ? 'Hours Needed' : 'Distance (km)'}
                </label>
                <div className="flex items-center justify-between text-sm font-bold text-slate-900 dark:text-white">
                  <span>{fareDistance} {transportMode === 'guide' ? 'hrs' : 'km'}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.5"
                  value={fareDistance}
                  onChange={(e) => setFareDistance(parseFloat(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[11px] text-slate-400 uppercase font-semibold">Driver / Host Quote (₹)</label>
                <input
                  type="number"
                  value={driverQuote}
                  onChange={(e) => setDriverQuote(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Benchmark Result Box */}
            <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 block">RAAHI FAIR BENCHMARK</span>
                <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-heading">
                  ₹{benchmarkMin} — ₹{benchmarkMax}
                </span>
              </div>

              {potentialOvercharge > 0 ? (
                <div className="bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border border-rose-300 dark:border-rose-500/40">
                  <i className="fa-solid fa-triangle-exclamation text-sm"></i>
                  <span>Overcharge Risk: +₹{potentialOvercharge}</span>
                </div>
              ) : (
                <div className="bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                  <i className="fa-solid fa-circle-check text-sm"></i>
                  <span>Fair Quote</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 6. LOCAL EXPERIENCES SHOWCASE */}
      <section id="tours" className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-500">AUTHENTIC LOCAL TOURS</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
              Immersive Jaipur Experiences
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
              Handcrafted itineraries led by certified local hosts with transparent fixed pricing.
            </p>
          </div>
          <NavLink
            to="/tours"
            className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 flex items-center gap-1.5 group"
          >
            <span>Explore All Packages</span>
            <i className="fa-solid fa-chevron-right text-[10px] transform group-hover:translate-x-1 transition"></i>
          </NavLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-card hover:shadow-floating transition-all duration-300 flex flex-col justify-between group">
            <div className="h-52 relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop&q=80"
                alt="Amer Fort Secret Passages"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-3.5 left-3.5 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md text-orange-600 dark:text-orange-400 text-[10px] font-bold px-3 py-1 rounded-full shadow-xs">
                Heritage & Forts
              </span>
            </div>
            <div className="p-5 space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-heading group-hover:text-orange-500 transition">
                Amer Fort Secret Passages & Royal History
              </h3>
              <div className="text-xs text-slate-500 flex items-center gap-3">
                <span><i className="fa-solid fa-clock mr-1"></i> 3.5 Hours</span>
                <span className="text-amber-500 font-bold">★ 4.96 (88 reviews)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Explore underground tunnels, Sheesh Mahal acoustics, and royal cannon foundries with Vikram.
              </p>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block leading-none">Fixed Price</span>
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">₹899 / person</span>
                </div>
                <NavLink
                  to="/tours"
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-orange-500 hover:text-white font-bold text-slate-700 dark:text-slate-200 rounded-full text-xs transition"
                >
                  View Package
                </NavLink>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-card hover:shadow-floating transition-all duration-300 flex flex-col justify-between group">
            <div className="h-52 relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80"
                alt="Old Jaipur Street Food Trail"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-3.5 left-3.5 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md text-orange-600 dark:text-orange-400 text-[10px] font-bold px-3 py-1 rounded-full shadow-xs">
                Street Food Crawl
              </span>
            </div>
            <div className="p-5 space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-heading group-hover:text-orange-500 transition">
                Old Jaipur Street Food & Bazaar Crawl
              </h3>
              <div className="text-xs text-slate-500 flex items-center gap-3">
                <span><i className="fa-solid fa-clock mr-1"></i> 2.5 Hours</span>
                <span className="text-amber-500 font-bold">★ 4.98 (124 reviews)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Taste authentic Pyaz Kachori, Lassiwala clay cups, and 90-year-old Ghewar sweets with Priya.
              </p>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block leading-none">Fixed Price</span>
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">₹650 / person</span>
                </div>
                <NavLink
                  to="/tours"
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-orange-500 hover:text-white font-bold text-slate-700 dark:text-slate-200 rounded-full text-xs transition"
                >
                  View Package
                </NavLink>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-card hover:shadow-floating transition-all duration-300 flex flex-col justify-between group">
            <div className="h-52 relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80"
                alt="Pink City Sunrise Photography"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-3.5 left-3.5 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md text-orange-600 dark:text-orange-400 text-[10px] font-bold px-3 py-1 rounded-full shadow-xs">
                Photography Walk
              </span>
            </div>
            <div className="p-5 space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-heading group-hover:text-orange-500 transition">
                Pink City Sunrise & Architectural Walk
              </h3>
              <div className="text-xs text-slate-500 flex items-center gap-3">
                <span><i className="fa-solid fa-clock mr-1"></i> 3.0 Hours</span>
                <span className="text-amber-500 font-bold">★ 4.92 (76 reviews)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Golden hour photography spots across Jal Mahal, Patrika Gate, and City Palace with Sunita.
              </p>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block leading-none">Fixed Price</span>
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">₹799 / person</span>
                </div>
                <NavLink
                  to="/tours"
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-orange-500 hover:text-white font-bold text-slate-700 dark:text-slate-200 rounded-full text-xs transition"
                >
                  View Package
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SAFETY SUPPORT & PROTECTION SECTION */}
      <section className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-10 border border-emerald-800 shadow-xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-900/80 px-3.5 py-1 rounded-full border border-emerald-700/50">
              SAFETY FIRST PLATFORM
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white leading-tight">
              Your Protection is Built Into Every Trip
            </h2>
            <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed max-w-xl">
              Whether you're exploring alone or with family, RAAHI provides real-time security layers to ensure your trip is zero-stress.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-emerald-900/40 p-3.5 rounded-2xl border border-emerald-700/40 space-y-1">
                <div className="font-bold text-xs text-emerald-300 flex items-center gap-2">
                  <i className="fa-solid fa-key text-emerald-400"></i>
                  <span>4-Digit Start-Tour OTP</span>
                </div>
                <p className="text-[11px] text-emerald-200/70">
                  Payment is only activated when you share your secret pin with your verified host upon arrival.
                </p>
              </div>

              <div className="bg-emerald-900/40 p-3.5 rounded-2xl border border-emerald-700/40 space-y-1">
                <div className="font-bold text-xs text-emerald-300 flex items-center gap-2">
                  <i className="fa-solid fa-user-shield text-emerald-400"></i>
                  <span>Background Checked Hosts</span>
                </div>
                <p className="text-[11px] text-emerald-200/70">
                  Govt ID, Aadhaar verification, and police clearance status logged for every guide.
                </p>
              </div>

              <div className="bg-emerald-900/40 p-3.5 rounded-2xl border border-emerald-700/40 space-y-1">
                <div className="font-bold text-xs text-emerald-300 flex items-center gap-2">
                  <i className="fa-solid fa-location-crosshairs text-emerald-400"></i>
                  <span>Live Location Broadcast</span>
                </div>
                <p className="text-[11px] text-emerald-200/70">
                  Share your active trip GPS link with trusted friends or family with one tap.
                </p>
              </div>

              <div className="bg-emerald-900/40 p-3.5 rounded-2xl border border-emerald-700/40 space-y-1">
                <div className="font-bold text-xs text-emerald-300 flex items-center gap-2">
                  <i className="fa-solid fa-headset text-emerald-400"></i>
                  <span>24/7 Human Dispatch Line</span>
                </div>
                <p className="text-[11px] text-emerald-200/70">
                  Dedicated safety response team on call around the clock to assist you instantly.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Emergency Simulator Card */}
          <div className="lg:col-span-5 bg-emerald-900/60 backdrop-blur-md p-6 rounded-3xl border border-emerald-700/60 shadow-floating text-left space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-extrabold uppercase text-emerald-200 tracking-wider">RAAHI SAFETY HELPLINE</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-700/50">
                ACTIVE
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-emerald-200">Jaipur Tourist Support Hotline</div>
              <div className="text-2xl font-extrabold text-white tracking-wider font-heading">
                +91 1800-RAAHI-SAFE
              </div>
              <p className="text-[11px] text-emerald-300/80">
                Available in English & Hindi for urgent fare disputes, guide assistance, or safety support.
              </p>
            </div>

            <button
              onClick={() => {
                setSosSimulated(true);
                setTimeout(() => setSosSimulated(false), 4000);
              }}
              className={`w-full py-3.5 rounded-full font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-lg ${
                sosSimulated
                  ? 'bg-emerald-400 text-emerald-950'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
              }`}
            >
              <i className="fa-solid fa-phone-volume"></i>
              <span>{sosSimulated ? 'Emergency Dispatch Connected! Line Active' : 'Test 1-Tap SOS Dispatch Demo'}</span>
            </button>
          </div>

        </div>
      </section>

      {/* 8. TESTIMONIALS & REVIEWS SECTION */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-orange-500">VOICES OF TRAVELERS</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            Trusted by 15,000+ Smart Travelers
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            Read real stories from tourists who explored India without stress or scam traps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Review 1 */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-card flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-500 text-xs">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fa-solid fa-star"></i>
                ))}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                "Having a verified local host in Jaipur made all the difference! Vikram showed us secret passages in Amer Fort that weren't on any blog, and protected us from aggressive street vendor prices."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200">
                SJ
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Sarah Jenkins</div>
                <div className="text-[10px] text-slate-400">London, UK • Matched with Vikram</div>
              </div>
            </div>
          </div>

          {/* Review 2 */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-card flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-500 text-xs">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fa-solid fa-star"></i>
                ))}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                "The Fair Price Shield saved us at least ₹800 on auto fares between City Palace and Nahargarh. Drivers stopped quoting crazy tourist prices once they saw we knew the official rate!"
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200">
                RA
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Rahul & Ananya</div>
                <div className="text-[10px] text-slate-400">New Delhi • Fair Price Shield User</div>
              </div>
            </div>
          </div>

          {/* Review 3 */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-card flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-500 text-xs">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fa-solid fa-star"></i>
                ))}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                "As a solo female traveler, the 4-digit start-tour OTP and police-verified guide badge gave me complete confidence. Priya was an incredible host and food expert!"
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200">
                ER
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Elena Rostova</div>
                <div className="text-[10px] text-slate-400">Berlin, Germany • Matched with Priya</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. STRONG FINAL CTA BANNER */}
      <section className="bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden text-center sm:text-left">
        <div className="max-w-3xl space-y-6 relative z-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-orange-950 bg-white/30 backdrop-blur-xs px-3.5 py-1.5 rounded-full inline-block">
            START YOUR JOURNEY TODAY
          </span>
          
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white leading-tight">
            Ready to Experience India Without the Tourist Traps?
          </h2>
          
          <p className="text-orange-50 text-sm sm:text-base leading-relaxed">
            Join thousands of smart travelers. Connect with verified local guides, get transparent prices, and explore hidden heritage with complete safety.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <NavLink
              to="/guides"
              className="px-7 py-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-full text-xs uppercase tracking-wider transition shadow-xl flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <i className="fa-solid fa-user-check text-orange-400"></i>
              <span>Find Your Local Guide Now</span>
            </NavLink>

            <NavLink
              to="/planner"
              className="px-7 py-4 bg-white/20 hover:bg-white/30 text-white font-extrabold rounded-full text-xs uppercase tracking-wider transition backdrop-blur-md border border-white/40 flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <i className="fa-solid fa-wand-magic-sparkles text-amber-200"></i>
              <span>Plan Itinerary with AI</span>
            </NavLink>
          </div>

          <div className="pt-2 text-xs text-orange-100 font-semibold flex items-center justify-center sm:justify-start gap-4">
            <span>✓ No upfront booking fee</span>
            <span>✓ Free cancellation</span>
            <NavLink to="/guide" className="underline hover:text-white font-bold">
              Are you a local? Join as a Guide →
            </NavLink>
          </div>
        </div>
      </section>

      {/* 10. GPS PROXIMITY RADAR MAP SECTION */}
      <section className="space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-orange-500">LIVE GPS PROXIMITY</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading flex items-center gap-2">
            <i className="fa-solid fa-radar text-orange-500 animate-pulse"></i> Active Guides Near Jaipur Attractions
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            Interactive map displaying real-time active verified hosts across Jaipur landmarks.
          </p>
        </div>

        <div className="h-[420px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-card">
          <LeafletRadarMap guides={JAIPUR_GUIDES_DATA} />
        </div>
      </section>

    </div>
  );
};

export default HomePage;

