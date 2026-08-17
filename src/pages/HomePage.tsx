import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Users,
  Sparkles,
  Tag,
  Compass,
  ShieldCheck,
  Star,
  ArrowRight,
  Search,
  CheckCircle2,
  TrendingUp,
  Clock,
  Heart
} from 'lucide-react';
import { marketplaceStore } from '../services/store';
import { getFairPriceEstimates } from '../services/fairPriceService';

interface HomePageProps {
  onRequestOpen: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onRequestOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const state = marketplaceStore.getState();
  const popularDestinations = state.destinations.slice(0, 6);
  const featuredGuides = state.guides.filter(g => g.verificationStatus === 'VERIFIED').slice(0, 4);
  const featuredTours = state.tours.slice(0, 3);
  const fairPriceSamples = getFairPriceEstimates('Jaipur').slice(0, 3);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/guides?destination=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/guides');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 hero-gradient overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-brand-700 text-xs font-bold uppercase tracking-wider animate-pulse">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>STHANIQ — Verified Locals. Fair Prices. Better Journeys.</span>
          </div>

          {/* Hero Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            Explore Like a Local.<br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-600 via-amber-500 to-amber-600 bg-clip-text text-transparent">
              Pay a Fair Price.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
            Connect with 100% identity-checked local guides, get transparent transport & tour pricing estimates, and request custom bids for your destination.
          </p>

          {/* Primary Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-3xl mx-auto bg-white p-3 sm:p-4 rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col sm:flex-row items-center gap-3 transition-all focus-within:ring-4 focus-within:ring-amber-500/20"
          >
            <div className="flex-1 flex items-center gap-3 px-3 w-full">
              <MapPin className="w-6 h-6 text-brand-500 flex-shrink-0" />
              <div className="w-full text-left">
                <label htmlFor="home-search-input" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Where are you going?
                </label>
                <input
                  id="home-search-input"
                  type="text"
                  placeholder="e.g. Jaipur, Delhi, Udaipur, Agra, Varanasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-slate-900 font-semibold text-base focus:outline-none placeholder:text-slate-400 placeholder:font-normal"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-700 hover:to-amber-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-amber-500/25 transition transform active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Search className="w-5 h-5 stroke-[2.5]" />
              <span>Search Destination</span>
            </button>
          </form>

          {/* Quick Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onRequestOpen}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-3 rounded-2xl text-sm shadow-md transition flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span>Find a Guide</span>
            </button>

            <button
              onClick={() => navigate('/ai-planner')}
              className="bg-amber-50 hover:bg-amber-100 text-brand-800 border border-amber-200/80 font-semibold px-5 py-3 rounded-2xl text-sm transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Plan My Trip (AI)</span>
            </button>

            <button
              onClick={() => navigate('/tours')}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 font-semibold px-5 py-3 rounded-2xl text-sm transition flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Explore Tours</span>
            </button>

            <button
              onClick={() => navigate('/fair-prices')}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200/80 font-semibold px-5 py-3 rounded-2xl text-sm transition flex items-center gap-2"
            >
              <Tag className="w-4 h-4 text-indigo-600" />
              <span>Check Fair Prices</span>
            </button>
          </div>
        </div>
      </section>

      {/* POPULAR DESTINATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
              <MapPin className="w-4 h-4" /> Top Indian Cities
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Popular Destinations</h2>
          </div>
          <button
            onClick={() => navigate('/guides')}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 hover:underline"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularDestinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => navigate(`/guides?destination=${encodeURIComponent(dest.name)}`)}
              className="group relative rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover border border-slate-200/60 bg-white cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="h-52 w-full overflow-hidden relative">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1">
                  <Users className="w-3 h-3 text-amber-400" />
                  <span>{dest.popularCount}+ Verified Bookings</span>
                </div>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">{dest.state}</span>
                  <h3 className="text-xl font-extrabold">{dest.name}</h3>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <p className="text-xs text-slate-600 line-clamp-2">{dest.tagline}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {dest.topAttractions.slice(0, 3).map((attr, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                      {attr}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VERIFIED LOCAL GUIDES MARKETPLACE SECTION */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-800">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Identity Checked Experts
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Verified Local Guides</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Ranked by verification status, review quality, experience, and responsiveness — not just cheapest price.
              </p>
            </div>
            <button
              onClick={() => navigate('/guides')}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGuides.map((guide) => (
              <div
                key={guide.id}
                onClick={() => navigate(`/guides/${guide.id}`)}
                className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-5 hover:border-amber-500/50 transition cursor-pointer flex flex-col justify-between space-y-4 group hover:shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <img
                        src={guide.avatar}
                        alt={guide.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400/40"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full" title="Verified Guide">
                        <ShieldCheck className="w-3.5 h-3.5 fill-emerald-500 stroke-white" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <h3 className="font-bold text-white group-hover:text-amber-400 transition">{guide.name}</h3>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-400 block flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Verified Local Guide
                      </span>
                      <div className="flex items-center gap-1 mt-1 text-xs text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                        <span>{guide.rating}</span>
                        <span className="text-slate-400 font-normal">({guide.reviewCount})</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{guide.bio}</p>

                  <div className="space-y-1 text-xs text-slate-400">
                    <div className="flex items-center justify-between">
                      <span>Experience:</span>
                      <span className="font-semibold text-slate-200">{guide.experienceYears} Years</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Languages:</span>
                      <span className="font-semibold text-slate-200">{guide.languages.join(' • ')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Areas:</span>
                      <span className="font-semibold text-slate-200">{guide.serviceAreas[0]}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Starting From</span>
                    <span className="text-lg font-extrabold text-amber-400">₹{guide.startingPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <button className="bg-slate-700 hover:bg-amber-500 hover:text-slate-950 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR GUIDE-CREATED TOURS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" /> Transparent Packages
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Popular Local Tours</h2>
          </div>
          <button
            onClick={() => navigate('/tours')}
            className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
          >
            <span>Browse All Tours</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTours.map((tour) => (
            <div
              key={tour.id}
              onClick={() => navigate(`/tours/${tour.id}`)}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-card hover:shadow-card-hover transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{tour.isMultiDay ? `${tour.durationDays} Days / ${(tour.durationDays || 2) - 1} Night` : `${tour.durationHours} Hours`}</span>
                  </div>

                  {tour.isMultiDay && (
                    <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      Cost Breakdown Clear
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <img src={tour.guideAvatar} alt={tour.guideName} className="w-6 h-6 rounded-full object-cover border" />
                    <span className="text-xs font-semibold text-slate-700">{tour.guideName}</span>
                    <span className="text-[11px] text-amber-600 font-bold ml-auto flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-500" /> {tour.guideRating}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition leading-snug">
                    {tour.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2">{tour.description}</p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Tour Price</span>
                  <span className="text-lg font-extrabold text-slate-900">₹{tour.pricePerPerson.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-slate-400"> / traveler</span>
                </div>
                <button className="bg-amber-50 text-brand-700 font-bold px-4 py-2 rounded-xl text-xs hover:bg-brand-500 hover:text-white transition">
                  View Itinerary
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAIR PRICE INSIGHTS WIDGET */}
      <section className="bg-amber-500/10 border border-amber-500/20 rounded-3xl max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-extrabold">
              <Tag className="w-3.5 h-3.5 fill-slate-950" /> Fair Price Engine
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Never Overpay in India Again.</h2>
            <p className="text-xs text-slate-700 leading-relaxed">
              STHANIQ checks prepaid auto tariffs, verified guide standards, and ticket prices to display clear estimated fair ranges. No fake AI invented rates.
            </p>
            <button
              onClick={() => navigate('/fair-prices')}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition"
            >
              <span>Explore All Price Benchmarks</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {fairPriceSamples.map((fp) => (
              <div key={fp.itemOrRoute} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{fp.category}</span>
                <h4 className="font-bold text-xs text-slate-900 line-clamp-2">{fp.itemOrRoute}</h4>
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-500 block">Estimated Fair Range</span>
                  <span className="text-base font-extrabold text-emerald-700">{fp.formattedRange}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
