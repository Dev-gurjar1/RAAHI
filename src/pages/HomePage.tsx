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
  MessageSquare
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
      {/* 1. HERO SECTION (Requirement #3, #5, #6, #36) */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 hero-gradient overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">

          {/* Hero Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            Find Verified Locals.<br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-600 via-amber-500 to-amber-600 bg-clip-text text-transparent">
              Travel at Fair Prices.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg font-medium text-slate-600 leading-relaxed">
            Connect with verified local guides, compare real offers, and explore cities without worrying about inflated prices.
          </p>

          {/* Search Autocomplete Input */}
          <div className="max-w-3xl mx-auto">
            <SearchAutocomplete placeholder="e.g. Jaipur" />
          </div>

          {/* Trust Microcopy Row */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-bold text-slate-700 pt-1">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verified locals
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 text-indigo-700">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" /> Transparent pricing
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 text-amber-700">
              <CheckCircle2 className="w-4 h-4 text-amber-500" /> Real reviews
            </span>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onRequestOpen}
              className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-7 py-3.5 rounded-2xl text-sm shadow-md transition flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span>Find a Guide</span>
            </button>

            <button
              onClick={() => navigate('/fair-prices')}
              className="bg-amber-50 hover:bg-amber-100 text-brand-900 border border-amber-200/80 font-bold px-6 py-3.5 rounded-2xl text-sm transition flex items-center gap-2"
            >
              <Tag className="w-4 h-4 text-brand-600" />
              <span>Check a Fair Price</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. HOW STHANIQ WORKS (Requirement #8 & #36) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold text-brand-600 uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Marketplace Model
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">How STHANIQ Works</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Book local hosts directly or receive competing offers to ensure fair travel pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-4 relative overflow-hidden">
            <span className="text-4xl font-extrabold text-amber-500/20 absolute top-4 right-6">01</span>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-brand-700 flex items-center justify-center font-bold">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Tell us where you're going</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Choose your destination city, travel dates, travelers count, duration, and interests.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-4 relative overflow-hidden">
            <span className="text-4xl font-extrabold text-emerald-500/20 absolute top-4 right-6">02</span>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Compare verified locals</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Receive custom offers from verified guides and compare price, experience, and reviews.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-4 relative overflow-hidden">
            <span className="text-4xl font-extrabold text-indigo-500/20 absolute top-4 right-6">03</span>
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Book with confidence</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Choose the best match, pay securely through STHANIQ escrow protection, and enjoy your journey.
            </p>
          </div>
        </div>
      </section>

      {/* 3. VERIFIED GUIDES MARKETPLACE ("Meet Your Local") (Requirement #9, #33, #36) */}
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

                      {/* Interactive Verification Badge Trigger (Requirement #33) */}
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

      {/* 4. GUIDE REQUEST + OFFER MARKETPLACE DEMO (Requirement #11, #12, #36) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold text-amber-600 uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Guide Offer Bidding System
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Compare Real Verified Bids</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Post your custom trip request and compare competing guide offers side-by-side.
          </p>
        </div>

        {/* Live Bidding Matrix Demo Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Example Tourist Request</span>
              <h4 className="font-extrabold text-slate-900 text-sm">Jaipur Heritage + Food Tour (2 Travelers • 6 Hours)</h4>
            </div>
            <span className="bg-amber-100 text-amber-900 font-extrabold text-xs px-3 py-1 rounded-full">
              Budget: ₹3,000
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleOffers.map((offer) => (
              <div key={offer.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 relative">
                {offer.badgeLabel && (
                  <span className={`absolute -top-3 left-4 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase text-white shadow-sm ${
                    offer.badgeLabel === 'Best Match' ? 'bg-amber-500' :
                    offer.badgeLabel === 'Lowest Price' ? 'bg-indigo-600' : 'bg-emerald-600'
                  }`}>
                    {offer.badgeLabel}
                  </span>
                )}
                <div className="flex items-center gap-3 pt-1">
                  <img src={offer.guideAvatar} alt={offer.guideName} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">{offer.guideName}</h5>
                    <span className="text-[11px] text-amber-600 font-extrabold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-500" /> {offer.guideRating} • {offer.guideExperience} Yrs Exp
                    </span>
                  </div>
                </div>

                <div className="text-xl font-extrabold text-slate-900">₹{offer.price.toLocaleString('en-IN')}</div>
                <p className="text-xs text-slate-600 line-clamp-2">"{offer.pitch}"</p>

                <button
                  onClick={() => navigate(`/request-offers?requestId=${offer.requestId}`)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl text-xs transition"
                >
                  View Offer
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAIR PRICE HERO FEATURE (Requirement #15, #19 & #36) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InteractivePriceChecker />
      </section>

      {/* 6. POPULAR TOURS (Requirement #36) */}
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

      {/* 7. AI TRIP PLANNER — REPOSITIONED SECONDARY (Requirement #20, #23 & #36) */}
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

      {/* 8. BECOME A GUIDE CONVERSION (Requirement #34 & #36) */}
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

      {/* 9. WHY TRUST STHANIQ (Requirement #32 & #36) */}
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
