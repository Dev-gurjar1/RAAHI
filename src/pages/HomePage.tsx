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
  Heart,
  Award,
  Zap,
  Lock,
  MessageSquare,
  Trophy
} from 'lucide-react';
import { marketplaceStore } from '../services/store';
import { getFairPriceEstimates } from '../services/fairPriceService';
import { InteractivePriceChecker } from '../components/InteractivePriceChecker';
import { VerificationModal } from '../components/VerificationModal';
import { SearchAutocomplete } from '../components/SearchAutocomplete';
import { GuideProfile } from '../types';

interface HomePageProps {
  onRequestOpen: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onRequestOpen }) => {
  const [selectedGuideForVerification, setSelectedGuideForVerification] = useState<GuideProfile | null>(null);

  const navigate = useNavigate();

  const state = marketplaceStore.getState();
  const popularDestinations = state.destinations.slice(0, 6);
  const featuredGuides = state.guides.filter(g => g.verificationStatus === 'VERIFIED').slice(0, 4);
  const featuredTours = state.tours.slice(0, 3);
  const sampleOffers = state.offers.slice(0, 3);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. FIRST VIEWPORT HERO SECTION (Requirement #3 MUST DO) */}
      <section className="relative pt-10 pb-16 px-4 sm:px-6 lg:px-8 hero-gradient overflow-hidden border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">

          {/* Hero Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] block">
            Find Verified Locals.<br className="hidden sm:inline" />
            <span className="text-amber-600 dark:text-amber-400 font-extrabold hero-brand-accent">
              Travel at Fair Prices.
            </span>
          </h1>

          {/* Location Query Label & Search Autocomplete */}
          <div className="max-w-3xl mx-auto space-y-3">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
              Where are you going?
            </label>
            <SearchAutocomplete placeholder="e.g. Jaipur, Delhi, Udaipur..." />
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
            <button
              onClick={onRequestOpen}
              className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-8 py-4 rounded-2xl text-sm sm:text-base shadow-lg hover:shadow-xl transition flex items-center gap-2.5 transform hover:-translate-y-0.5 active:scale-95"
            >
              <Users className="w-5 h-5 text-amber-400" />
              <span>Find a Guide</span>
            </button>

            <button
              onClick={() => navigate('/fair-prices')}
              className="bg-amber-50 hover:bg-amber-100 text-slate-900 border-2 border-amber-300/80 font-extrabold px-8 py-4 rounded-2xl text-sm sm:text-base transition flex items-center gap-2.5 shadow-sm active:scale-95"
            >
              <Tag className="w-5 h-5 text-amber-600" />
              <span>Check a Fair Price</span>
            </button>
          </div>

          {/* Trust Bar Row */}
          <div className="pt-3 border-t border-slate-200/60 max-w-2xl mx-auto">
            <div className="flex items-center justify-center flex-wrap gap-4 sm:gap-8 text-xs sm:text-sm font-extrabold text-slate-700">
              <span className="flex items-center gap-1.5 text-emerald-700">
                ✓ Verified locals
              </span>
              <span className="text-slate-300 font-normal">•</span>
              <span className="flex items-center gap-1.5 text-slate-900">
                ₹ Transparent pricing
              </span>
              <span className="text-slate-300 font-normal">•</span>
              <span className="flex items-center gap-1.5 text-amber-700">
                ⭐ Real reviews
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLAGSHIP INTERACTIVE FAIR PRICE CHECKER (Requirement #1 FLAGSHIP) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-amber-500" />
          <h2 className="text-xl font-extrabold text-slate-900">Flagship Fair Price Checker</h2>
        </div>
        <InteractivePriceChecker />
      </section>

      {/* 3. GUIDE MARKETPLACE BIDDING DEMO ("3 Verified Guides Responded") (Requirement #2 MUST DO) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold text-brand-600 uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Marketplace Killer Flow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tourist Request → Guides Respond → Compare → Book
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Post your custom travel requirements and receive instant competing offers from identity-checked local guides.
          </p>
        </div>

        {/* Live Bidding Matrix Demo Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6">
          <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Live Tourist Request</span>
              <h4 className="font-extrabold text-white text-base">Jaipur Heritage + Food Tour (2 Travelers • 6 Hours)</h4>
            </div>
            <div className="inline-flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 font-extrabold text-xs px-3 py-1 rounded-full border border-emerald-500/30">
                3 Verified Guides Responded
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleOffers.map((offer) => (
              <div
                key={offer.id}
                className={`bg-slate-50 p-5 rounded-2xl border-2 space-y-3 relative flex flex-col justify-between ${
                  offer.badgeLabel === 'Best Match' ? 'border-amber-500 bg-amber-50/20' :
                  offer.badgeLabel === 'Best Value' ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200'
                }`}
              >
                {offer.badgeLabel && (
                  <span className={`absolute -top-3 left-4 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase text-white shadow-sm ${
                    offer.badgeLabel === 'Best Match' ? 'bg-amber-500' :
                    offer.badgeLabel === 'Best Value' ? 'bg-emerald-600' :
                    offer.badgeLabel === 'Most Experienced' ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}>
                    {offer.badgeLabel === 'Best Match' ? '🏆 Best Match' :
                     offer.badgeLabel === 'Best Value' ? '💰 Best Value' :
                     offer.badgeLabel === 'Most Experienced' ? '⭐ Most Experienced' : offer.badgeLabel}
                  </span>
                )}

                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-3">
                    <img src={offer.guideAvatar} alt={offer.guideName} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/20" />
                    <div>
                      <h5 className="font-extrabold text-slate-900 text-base">{offer.guideName}</h5>
                      <span className="text-xs text-amber-600 font-extrabold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-500" /> {offer.guideRating} • {offer.guideExperience} Yrs Exp
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500">Offered Price:</span>
                    <span className="text-xl font-extrabold text-slate-900">₹{offer.price.toLocaleString('en-IN')}</span>
                  </div>

                  <p className="text-xs text-slate-600 italic line-clamp-2">"{offer.pitch}"</p>
                </div>

                <button
                  onClick={() => navigate(`/request-offers?requestId=${offer.requestId}`)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                >
                  <span>Compare & Book</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW STHANIQ WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold text-brand-600 uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Platform Benefits
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">How STHANIQ Protects You</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-4 relative overflow-hidden">
            <span className="text-4xl font-extrabold text-amber-500/20 absolute top-4 right-6">01</span>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-brand-700 flex items-center justify-center font-bold">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Tell us where you're going</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Specify your destination, dates, travelers count, and preferences in seconds.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-4 relative overflow-hidden">
            <span className="text-4xl font-extrabold text-emerald-500/20 absolute top-4 right-6">02</span>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Compare verified locals</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Receive custom bids from identity-verified local hosts and review ratings and prices side-by-side.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-4 relative overflow-hidden">
            <span className="text-4xl font-extrabold text-indigo-500/20 absolute top-4 right-6">03</span>
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Book with confidence</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Book securely with transparent escrow payment protection and guaranteed fair rates.
            </p>
          </div>
        </div>
      </section>

      {/* 5. VERIFIED GUIDES MARKETPLACE ("Meet Your Local") */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-800">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Identity Checked Experts
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Meet Your Local</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Real people. Real experience. Verified by STHANIQ.
              </p>
            </div>
            <button
              onClick={() => navigate('/guides')}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>Explore All Verified Guides</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGuides.map((guide) => (
              <div
                key={guide.id}
                className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-5 hover:border-amber-500/50 transition cursor-pointer flex flex-col justify-between space-y-4 group hover:shadow-xl relative"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="relative" onClick={() => setSelectedGuideForVerification(guide)}>
                      <img
                        src={guide.avatar}
                        alt={guide.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400/40"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full" title="Click for Verification Details">
                        <ShieldCheck className="w-3.5 h-3.5 fill-emerald-500 stroke-white" />
                      </div>
                    </div>
                    <div>
                      <h3
                        onClick={() => navigate(`/guides/${guide.id}`)}
                        className="font-bold text-white group-hover:text-amber-400 transition"
                      >
                        {guide.name}
                      </h3>

                      <button
                        onClick={() => setSelectedGuideForVerification(guide)}
                        className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md inline-flex items-center gap-1 mt-0.5"
                      >
                        <ShieldCheck className="w-3 h-3" /> Verified Local
                      </button>

                      <div className="flex items-center gap-1 mt-1 text-xs text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                        <span>{guide.rating}</span>
                        <span className="text-slate-400 font-normal">({guide.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md inline-block">
                    Heritage & Culinary Specialist
                  </span>

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
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">From</span>
                    <span className="text-lg font-extrabold text-amber-400">₹{guide.startingPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/guides/${guide.id}`)}
                    className="bg-slate-700 hover:bg-amber-500 hover:text-slate-950 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition"
                  >
                    View Guide
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. POPULAR TOURS */}
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
                  <img src={tour.image} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{tour.isMultiDay ? `${tour.durationDays} Days / ${(tour.durationDays || 2) - 1} Night` : `${tour.durationHours} Hours`}</span>
                  </div>
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
                  View Tour
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. AI TRIP PLANNER — REPOSITIONED BELOW HERO & CORE MARKETPLACE (Requirement #3) */}
      <section className="bg-amber-500/10 border border-amber-500/20 rounded-3xl max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="space-y-3 lg:col-span-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-extrabold">
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" /> Real Marketplace AI Planner
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Plan Your Trip with Real STHANIQ Guides & Tours
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Build a personalized itinerary using real local experiences, guides and tours available on STHANIQ.
            </p>
          </div>

          <div className="text-right">
            <button
              onClick={() => navigate('/ai-planner')}
              className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-6 py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 transition w-full sm:w-auto"
            >
              <span>Launch AI Planner</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      </section>

      {/* 8. BECOME A GUIDE CONVERSION */}
      <section className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 text-white py-12 px-6 rounded-3xl max-w-7xl mx-auto border border-slate-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-500/30">
              Local Earning Opportunity
            </span>
            <h2 className="text-3xl font-extrabold text-white">Know Your City? Earn From It.</h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Turn your local knowledge into an opportunity. Students, residents, and local experts can apply to become verified hosts.
            </p>
          </div>
          <button
            onClick={() => navigate('/become-guide')}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-6 py-3.5 rounded-2xl shadow-lg transition whitespace-nowrap"
          >
            Become a Guide
          </button>
        </div>
      </section>

      {/* 9. WHY TRUST STHANIQ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900">Why Trust STHANIQ?</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">✓ Verified Locals</h3>
            <p className="text-xs text-slate-600">Every public guide goes through an approval process.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <Tag className="w-8 h-8 text-amber-500" />
            <h3 className="font-extrabold text-slate-900 text-sm">₹ Transparent Pricing</h3>
            <p className="text-xs text-slate-600">Compare real offers before booking.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <Lock className="w-8 h-8 text-indigo-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">🔒 Secure Booking</h3>
            <p className="text-xs text-slate-600">Your booking is recorded through STHANIQ.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
            <h3 className="font-extrabold text-slate-900 text-sm">⭐ Real Reviews</h3>
            <p className="text-xs text-slate-600">Reviews come from completed experiences.</p>
          </div>
        </div>
      </section>

      {/* Verification Modal Popup */}
      <VerificationModal
        guide={selectedGuideForVerification}
        onClose={() => setSelectedGuideForVerification(null)}
      />
    </div>
  );
};
