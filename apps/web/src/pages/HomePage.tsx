import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LeafletRadarMap } from '../components/LeafletRadarMap';
import { useBookingStore } from '../store/useBookingStore';
import { GuideProfile } from '@raahi/shared-types';

const FEATURED_LOCAL_GUIDES: GuideProfile[] = [
  {
    id: "g1",
    userId: "u1",
    name: "Vikram Singh Rathore",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    rating: 4.95,
    reviewCount: 142,
    languages: ["Hindi", "English"],
    experience: "8 Years",
    hourlyRate: 450,
    specialties: ["Amer Fort", "Royal Architecture", "Secret Passages"],
    distanceKm: 1.2,
    lat: 26.9855,
    lng: 75.8513,
    verified: true,
    online: true,
    responseTime: "< 5 mins",
    completedTrips: 260
  },
  {
    id: "g2",
    userId: "u2",
    name: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    rating: 4.98,
    reviewCount: 198,
    languages: ["Hindi", "English", "French"],
    experience: "6 Years",
    hourlyRate: 500,
    specialties: ["Old City Bazaars", "Street Food Crawl", "Culture"],
    distanceKm: 2.4,
    lat: 26.9239,
    lng: 75.8267,
    verified: true,
    online: true,
    responseTime: "< 3 mins",
    completedTrips: 310
  },
  {
    id: "g4",
    userId: "u4",
    name: "Sunita Kanwar",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
    rating: 4.89,
    reviewCount: 115,
    languages: ["Hindi", "English", "German"],
    experience: "7 Years",
    hourlyRate: 480,
    specialties: ["Pink City Heritage", "Photography", "Stepwells"],
    distanceKm: 0.8,
    lat: 26.9534,
    lng: 75.8462,
    verified: true,
    online: true,
    responseTime: "< 4 mins",
    completedTrips: 210
  }
];

export const HomePage: React.FC = () => {
  const [destination, setDestination] = useState('Jaipur');
  const [selectedDate, setSelectedDate] = useState('Today');
  const [fareDistance, setFareDistance] = useState(4.2);
  const [driverQuote, setDriverQuote] = useState(180);
  const [plannerDays, setPlannerDays] = useState(1);
  const [plannerStyle, setPlannerStyle] = useState('Heritage');

  const openBookingModal = useBookingStore((state) => state.openBookingModal);
  const navigate = useNavigate();

  // Fare calculations for Don't Guess the Fare section
  const benchmarkMin = Math.round(30 + fareDistance * 14 * 0.9);
  const benchmarkMax = Math.round(30 + fareDistance * 14 * 1.15);
  const benchmarkRec = Math.round(30 + fareDistance * 14);
  const potentialOvercharge = driverQuote > benchmarkMax ? driverQuote - benchmarkRec : 0;

  return (
    <div className="space-y-20">
      
      {/* 1. HERO SECTION (Asymmetric 2-Column Editorial Layout) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center pt-2 sm:pt-4">
        
        {/* Left Column: Bold Typography & Search Panel */}
        <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-200 dark:border-orange-500/20">
            <i className="fa-solid fa-sparkles text-[11px]"></i> Premium Tourist Safety Platform
          </div>

          <h1 className="text-4xl sm:text-6xl xl:text-[68px] font-extrabold text-slate-900 dark:text-white font-heading leading-[1.08] tracking-tight">
            EXPLORE LIKE <br />
            <span className="text-orange-500">A LOCAL.</span> <br />
            PAY LIKE A <br />
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
              SMART TRAVELER.
            </span>
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-lg leading-relaxed font-normal">
            Discover verified locals, transparent prices and unforgettable experiences.
          </p>

          {/* Floating Search Panel */}
          <div className="bg-white dark:bg-slate-800 p-2.5 sm:p-3 rounded-2xl sm:rounded-full shadow-floating border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-2 max-w-xl">
            
            {/* Destination Input */}
            <div className="w-full sm:w-auto flex-1 flex items-center gap-3 px-4 py-2.5 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-700">
              <div className="w-7 h-7 rounded-full bg-orange-50 dark:bg-slate-700 flex items-center justify-center text-orange-500 text-xs flex-shrink-0">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block leading-none">Destination</span>
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
            <div className="w-full sm:w-auto flex-1 flex items-center gap-3 px-4 py-2.5">
              <div className="w-7 h-7 rounded-full bg-amber-50 dark:bg-slate-700 flex items-center justify-center text-amber-500 text-xs flex-shrink-0">
                <i className="fa-solid fa-calendar-day"></i>
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block leading-none">Date</span>
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

            {/* Search CTA */}
            <button
              onClick={() => navigate('/guides')}
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-extrabold px-6 py-3.5 rounded-full transition shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 text-xs uppercase tracking-wider flex-shrink-0"
            >
              <span>Find a Guide</span>
              <i className="fa-solid fa-arrow-right text-[11px]"></i>
            </button>
          </div>
        </div>

        {/* Right Column: Editorial Travel Visual Composition with Floating Cards */}
        <div className="lg:col-span-6 relative flex items-center justify-center min-h-[460px] sm:min-h-[540px]">
          
          {/* Large Warm Circular Background Backdrop */}
          <div className="absolute w-72 h-72 sm:w-[440px] sm:h-[440px] rounded-full bg-gradient-to-tr from-[#FF7A45]/30 via-[#F59E0B]/25 to-transparent blur-xl pointer-events-none"></div>
          <div className="absolute w-64 h-64 sm:w-[380px] sm:h-[380px] rounded-full bg-gradient-to-br from-orange-400/20 to-amber-300/20 border border-orange-500/20"></div>

          {/* Main Traveler Hero Image (Curved Editorial Mask) */}
          <div className="relative z-10 w-64 sm:w-[360px] h-[380px] sm:h-[480px] rounded-[40px] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 transform hover:scale-[1.02] transition duration-500">
            <img
              src="https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=85"
              alt="Jaipur Heritage Traveler with Local Guide"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 text-white text-left">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">Hawa Mahal • Jaipur</span>
              <p className="text-xs font-semibold text-white/90">Curated Heritage Exploration</p>
            </div>
          </div>

          {/* FLOATING CARD 1: Verified Guide */}
          <div className="absolute top-6 -left-2 sm:left-4 z-20 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-floating border border-slate-100 dark:border-slate-700 flex items-center gap-3 animate-float">
            <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center text-xs">
              <i className="fa-solid fa-shield-check"></i>
            </div>
            <div className="text-left">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Verified Guide</div>
              <div className="text-xs font-extrabold text-slate-900 dark:text-white">Vikram • 4.95 ★</div>
            </div>
          </div>

          {/* FLOATING CARD 2: Amer Fort Distance */}
          <div className="absolute top-20 -right-2 sm:right-4 z-20 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-floating border border-slate-100 dark:border-slate-700 flex items-center gap-3 animate-float-delayed">
            <div className="w-8 h-8 rounded-full bg-orange-500/15 text-orange-500 flex items-center justify-center text-xs">
              <i className="fa-solid fa-location-dot"></i>
            </div>
            <div className="text-left">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Destination</div>
              <div className="text-xs font-extrabold text-slate-900 dark:text-white">Amer Fort • 2.4 km</div>
            </div>
          </div>

          {/* FLOATING CARD 3: Fair Price Range */}
          <div className="absolute bottom-16 -left-4 sm:left-2 z-20 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-floating border border-slate-100 dark:border-slate-700 flex items-center gap-3 animate-float-slow">
            <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center text-xs">
              <i className="fa-solid fa-indian-rupee-sign"></i>
            </div>
            <div className="text-left">
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">Fair Price Range</div>
              <div className="text-xs font-extrabold text-slate-900 dark:text-white">₹95 – ₹120 Auto</div>
            </div>
          </div>

          {/* FLOATING CARD 4: Guide Online ETA */}
          <div className="absolute bottom-6 -right-2 sm:right-6 z-20 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-floating border border-slate-100 dark:border-slate-700 flex items-center gap-3 animate-float">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <div className="text-left">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Host Online</div>
              <div className="text-xs font-extrabold text-slate-900 dark:text-white">ETA 4 mins</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST STRIP */}
      <section className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center text-sm flex-shrink-0">
              <i className="fa-solid fa-user-check"></i>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Verified Locals</div>
              <div className="text-[11px] text-slate-500">Aadhaar & Police Vetted</div>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-9 h-9 rounded-full bg-orange-500/15 text-orange-600 flex items-center justify-center text-sm flex-shrink-0">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Transparent Prices</div>
              <div className="text-[11px] text-slate-500">Zero Hidden Surcharges</div>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center text-sm flex-shrink-0">
              <i className="fa-solid fa-key"></i>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Secure Booking</div>
              <div className="text-[11px] text-slate-500">Start-Tour OTP System</div>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center text-sm flex-shrink-0">
              <i className="fa-solid fa-headset"></i>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Human Support</div>
              <div className="text-[11px] text-slate-500">24/7 Safety Dispatch</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. GUIDE DISCOVERY SECTION: Meet Your Local */}
      <section id="guides" className="space-y-6 text-left">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-500">AUTHENTIC HOSTS</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
              Meet Your Local
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
              People who know the city beyond the tourist map.
            </p>
          </div>
          <NavLink
            to="/guides"
            className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 flex items-center gap-1.5 group"
          >
            <span>View All Guides</span>
            <i className="fa-solid fa-chevron-right text-[10px] transform group-hover:translate-x-1 transition"></i>
          </NavLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_LOCAL_GUIDES.map((guide) => (
            <div
              key={guide.id}
              className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-100 dark:border-slate-700 shadow-card hover:shadow-floating transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3.5">
                  <div className="relative">
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
                    <h3 className="font-bold text-slate-900 dark:text-white text-base font-heading group-hover:text-orange-500 transition">
                      {guide.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span className="text-amber-500 font-bold">★ {guide.rating}</span>
                      <span>({guide.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

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

                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                  <div><i className="fa-solid fa-language text-slate-400 mr-1.5"></i> {guide.languages.join(", ")}</div>
                  <div><i className="fa-solid fa-location-arrow text-slate-400 mr-1.5"></i> {guide.distanceKm} km away in Jaipur</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Hourly Tariff</span>
                  <span className="text-lg font-extrabold text-orange-600 dark:text-orange-400">₹{guide.hourlyRate}</span>
                </div>
                <button
                  onClick={() => openBookingModal(guide)}
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full text-xs transition shadow-md shadow-orange-500/20"
                >
                  Book Guide
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FAIR PRICE SHIELD SECTION: Don't Guess the Fare */}
      <section id="fair-price" className="bg-gradient-to-br from-orange-50/70 via-white to-amber-50/60 dark:from-slate-800/80 dark:via-slate-800 dark:to-slate-900 rounded-3xl p-6 sm:p-10 border border-orange-200/60 dark:border-slate-700 shadow-card text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column Description */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              ANTI-SCAM PROTECTION
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading leading-tight">
              Don't Guess the Fare.
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Calculate government-verified benchmark tariffs for Auto-Rickshaws, E-Rickshaws, and Guides in Jaipur before negotiating. Never pay tourist-tax overcharging again.
            </p>
            <div className="pt-2">
              <NavLink
                to="/fair-price"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-full text-xs transition shadow-md shadow-orange-500/20"
              >
                <span>Open Full Tariff Calculator</span>
                <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </NavLink>
            </div>
          </div>

          {/* Right Column Interactive Fare Card */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-floating space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">AUTO RICKSHAW TARIFF</span>
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-2.5 py-1 rounded-full">
                Jaipur Standard
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 uppercase font-semibold">Distance (km)</label>
                <div className="flex items-center justify-between text-sm font-bold text-slate-900 dark:text-white">
                  <span>{fareDistance} km</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.2"
                  value={fareDistance}
                  onChange={(e) => setFareDistance(parseFloat(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 uppercase font-semibold">Driver Quote (₹)</label>
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
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 block">RAAHI FAIR RANGE</span>
                <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-heading">
                  ₹{benchmarkMin} — ₹{benchmarkMax}
                </span>
              </div>

              {potentialOvercharge > 0 ? (
                <div className="bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-rose-300 dark:border-rose-500/40">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  <span>Overcharge Risk: +₹{potentialOvercharge}</span>
                </div>
              ) : (
                <div className="bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Fair Quote</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. TOUR EXPERIENCE SECTION */}
      <section id="tours" className="space-y-6 text-left">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-500">CURATED EXPERIENCES</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
              Immersive Jaipur Tours
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
              Handcrafted itineraries led by certified local hosts.
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
              <span className="absolute top-3.5 left-3.5 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md text-orange-600 dark:text-orange-400 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                Heritage & Forts
              </span>
            </div>
            <div className="p-5 space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-heading">
                Amer Fort Secret Passages & Royal History
              </h3>
              <div className="text-xs text-slate-500 flex items-center gap-3">
                <span><i className="fa-solid fa-clock mr-1"></i> 3.5 Hours</span>
                <span className="text-amber-500 font-bold">★ 4.96 (88)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Explore underground tunnels, Sheesh Mahal acoustics, and royal cannon foundries.
              </p>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Fixed Price</span>
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">₹899 / person</span>
                </div>
                <button
                  onClick={() => alert("Amer Fort tour experience package selected!")}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-orange-500 hover:text-white font-bold text-slate-700 dark:text-slate-200 rounded-full text-xs transition"
                >
                  View Details
                </button>
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
              <span className="absolute top-3.5 left-3.5 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md text-orange-600 dark:text-orange-400 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                Street Food Crawl
              </span>
            </div>
            <div className="p-5 space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-heading">
                Old Jaipur Street Food & Bazaar Crawl
              </h3>
              <div className="text-xs text-slate-500 flex items-center gap-3">
                <span><i className="fa-solid fa-clock mr-1"></i> 2.5 Hours</span>
                <span className="text-amber-500 font-bold">★ 4.98 (124)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Taste authentic Pyaz Kachori, Lassiwala clay cups, and 90-year-old Ghewar sweets.
              </p>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Fixed Price</span>
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">₹650 / person</span>
                </div>
                <button
                  onClick={() => alert("Street Food Crawl package selected!")}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-orange-500 hover:text-white font-bold text-slate-700 dark:text-slate-200 rounded-full text-xs transition"
                >
                  View Details
                </button>
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
              <span className="absolute top-3.5 left-3.5 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md text-orange-600 dark:text-orange-400 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                Photography Walk
              </span>
            </div>
            <div className="p-5 space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-heading">
                Pink City Sunrise & Architectural Walk
              </h3>
              <div className="text-xs text-slate-500 flex items-center gap-3">
                <span><i className="fa-solid fa-clock mr-1"></i> 3.0 Hours</span>
                <span className="text-amber-500 font-bold">★ 4.92 (76)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Golden hour photography spots across Jal Mahal, Patrika Gate, and City Palace.
              </p>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Fixed Price</span>
                  <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">₹799 / person</span>
                </div>
                <button
                  onClick={() => alert("Photography Walk package selected!")}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-orange-500 hover:text-white font-bold text-slate-700 dark:text-slate-200 rounded-full text-xs transition"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. AI TRAVEL PLANNER SECTION */}
      <section id="planner" className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-700 text-left space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-orange-500">SMART ITINERARY GENERATOR</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            Plan Your Perfect Jaipur Day
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            Curate a custom timeline with realistic travel estimates and guide recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-2">How many days?</label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((d) => (
                  <button
                    key={d}
                    onClick={() => setPlannerDays(d)}
                    className={`py-2.5 rounded-xl text-xs font-bold transition ${
                      plannerDays === d
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                        : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {d} Day{d > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-2">What do you love?</label>
              <div className="grid grid-cols-3 gap-2">
                {['Heritage', 'Food', 'Markets'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setPlannerStyle(cat)}
                    className={`py-2 rounded-xl text-xs font-bold transition ${
                      plannerStyle === cat
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                        : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <NavLink
              to="/planner"
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-full text-xs flex items-center justify-center gap-2 transition shadow-md shadow-orange-500/20 uppercase tracking-wider"
            >
              <span>Build My Journey</span>
              <i className="fa-solid fa-arrow-right text-[11px]"></i>
            </NavLink>
          </div>

          {/* Visual Timeline Result */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
              Sample {plannerDays}-Day {plannerStyle} Journey
            </h3>
            
            <div className="space-y-3 relative before:content-[''] before:absolute before:top-3 before:bottom-3 before:left-3 before:w-0.5 before:bg-orange-200 dark:before:bg-slate-700 pl-8">
              <div className="relative space-y-0.5">
                <span className="absolute -left-8 top-1.5 w-3 h-3 rounded-full bg-orange-500 border-2 border-white"></span>
                <span className="text-[11px] font-bold text-orange-600">08:00 AM</span>
                <div className="font-bold text-xs text-slate-900 dark:text-white">Amer Fort & Sheesh Mahal Secret Passage</div>
                <div className="text-[11px] text-slate-500">Explore before morning tour crowds arrive.</div>
              </div>

              <div className="relative space-y-0.5">
                <span className="absolute -left-8 top-1.5 w-3 h-3 rounded-full bg-amber-500 border-2 border-white"></span>
                <span className="text-[11px] font-bold text-amber-600">10:45 AM</span>
                <div className="font-bold text-xs text-slate-900 dark:text-white">Jal Mahal Lake View & Photography</div>
                <div className="text-[11px] text-slate-500">Scenic lake breeze and authentic camel craft stalls.</div>
              </div>

              <div className="relative space-y-0.5">
                <span className="absolute -left-8 top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
                <span className="text-[11px] font-bold text-emerald-600">01:00 PM</span>
                <div className="font-bold text-xs text-slate-900 dark:text-white">Traditional Rajasthani Thali Lunch</div>
                <div className="text-[11px] text-slate-500">Authentic Dal Baati Churma in Old Pink City.</div>
              </div>

              <div className="relative space-y-0.5">
                <span className="absolute -left-8 top-1.5 w-3 h-3 rounded-full bg-orange-500 border-2 border-white"></span>
                <span className="text-[11px] font-bold text-orange-600">03:30 PM</span>
                <div className="font-bold text-xs text-slate-900 dark:text-white">City Palace & Jantar Mantar Observatory</div>
                <div className="text-[11px] text-slate-500">Historical sundial demonstration by verified guide.</div>
              </div>

              <div className="relative space-y-0.5">
                <span className="absolute -left-8 top-1.5 w-3 h-3 rounded-full bg-amber-500 border-2 border-white"></span>
                <span className="text-[11px] font-bold text-amber-600">06:00 PM</span>
                <div className="font-bold text-xs text-slate-900 dark:text-white">Johari Bazaar & Heritage Walk</div>
                <div className="text-[11px] text-slate-500">Gems, artisan block printing, and sunset chai.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LIVE GUIDE RADAR MAP SECTION */}
      <section className="space-y-4 text-left">
        <div className="space-y-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-orange-500">GPS PROXIMITY</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading flex items-center gap-2">
            <i className="fa-solid fa-radar text-orange-500 animate-pulse"></i> Local Guides Near You
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            Verified companions currently active near Jaipur attractions.
          </p>
        </div>

        <div className="h-[420px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-card">
          <LeafletRadarMap guides={FEATURED_LOCAL_GUIDES} />
        </div>
      </section>
    </div>
  );
};
