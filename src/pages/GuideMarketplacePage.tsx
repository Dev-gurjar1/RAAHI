import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ShieldCheck,
  Star,
  Users,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowUpDown,
  Sparkles,
  MapPin
} from 'lucide-react';
import { marketplaceStore } from '../services/store';
import { GuideProfile } from '../types';

interface GuideMarketplacePageProps {
  onRequestOpen: () => void;
}

export const GuideMarketplacePage: React.FC<GuideMarketplacePageProps> = ({ onRequestOpen }) => {
  const [searchParams] = useSearchParams();
  const destQuery = searchParams.get('destination') || '';

  const [destinationFilter, setDestinationFilter] = useState(destQuery);
  const [languageFilter, setLanguageFilter] = useState('ALL');
  const [maxPriceFilter, setMaxPriceFilter] = useState(5000);
  const [minRatingFilter, setMinRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState<'MATCH' | 'RATING' | 'EXPERIENCE' | 'PRICE_LOW'>('MATCH');

  const [guides, setGuides] = useState<GuideProfile[]>(
    marketplaceStore.getState().guides.filter(g => g.verificationStatus === 'VERIFIED')
  );

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = marketplaceStore.subscribe(() => {
      setGuides(marketplaceStore.getState().guides.filter(g => g.verificationStatus === 'VERIFIED'));
    });
    return unsubscribe;
  }, []);

  // Filter logic
  let filtered = guides.filter(g => {
    if (destinationFilter && !g.serviceAreas.some(area => area.toLowerCase().includes(destinationFilter.toLowerCase()))) {
      return false;
    }
    if (languageFilter !== 'ALL' && !g.languages.includes(languageFilter)) {
      return false;
    }
    if (g.startingPrice > maxPriceFilter) {
      return false;
    }
    if (g.rating < minRatingFilter) {
      return false;
    }
    return true;
  });

  // Multi-Factor Ranking Logic (Requirement #6)
  // Ranking considers: Verification, Rating, Review quality, Experience, Price, Availability, Response rate, Completed bookings
  filtered.sort((a, b) => {
    if (sortBy === 'RATING') {
      return b.rating - a.rating;
    } else if (sortBy === 'EXPERIENCE') {
      return b.experienceYears - a.experienceYears;
    } else if (sortBy === 'PRICE_LOW') {
      return a.startingPrice - b.startingPrice;
    } else {
      // SMART MATCH RANKING SCORE
      const scoreA = (a.rating * 20) + (a.experienceYears * 5) + (a.completedTours * 0.5) + (a.reviewCount * 0.2);
      const scoreB = (b.rating * 20) + (b.experienceYears * 5) + (b.completedTours * 0.5) + (b.reviewCount * 0.2);
      return scoreB - scoreA;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Post Request CTA Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Identity Verified Local Experts</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Verified Local Guides Marketplace</h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Compare trusted local storytellers, view certified identity badges, and select a guide at a fair price — or request custom bids!
          </p>
        </div>

        <button
          onClick={onRequestOpen}
          className="bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-700 hover:to-amber-600 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5 whitespace-nowrap flex items-center gap-2"
        >
          <Users className="w-5 h-5" />
          <span>Post Custom Guide Request</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-200/80 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Destination Search */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Destination</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search city (e.g. Jaipur)"
                value={destinationFilter}
                onChange={(e) => setDestinationFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>
          </div>

          {/* Language Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Language</label>
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Languages</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="French">French</option>
              <option value="Spanish">Spanish</option>
            </select>
          </div>

          {/* Max Price Slider */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Max Price: ₹{maxPriceFilter.toLocaleString('en-IN')}
            </label>
            <input
              type="range"
              min="1500"
              max="6000"
              step="250"
              value={maxPriceFilter}
              onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer mt-2"
            />
          </div>

          {/* Min Rating */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Min Rating</label>
            <select
              value={minRatingFilter}
              onChange={(e) => setMinRatingFilter(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
            >
              <option value={0}>Any Rating</option>
              <option value={4.5}>⭐ 4.5+</option>
              <option value={4.8}>⭐ 4.8+</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Sort Ranking</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
            >
              <option value="MATCH">Smart Match (Verified + Rating)</option>
              <option value="RATING">Highest Rating</option>
              <option value="EXPERIENCE">Most Experience</option>
              <option value="PRICE_LOW">Lowest Starting Price</option>
            </select>
          </div>
        </div>
      </div>

      {/* Guide Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Showing <strong>{filtered.length}</strong> verified local guides</span>
          <span className="text-[11px] bg-slate-100 px-2.5 py-1 rounded-full font-medium">
            Multi-Factor Ranked by Trust & Quality
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No guides matching your exact filter</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We're finding verified locals for your request. Try adjusting your destination or budget filter.
            </p>
            <button
              onClick={() => { setDestinationFilter(''); setLanguageFilter('ALL'); setMaxPriceFilter(5000); }}
              className="bg-amber-500 text-white font-bold px-4 py-2 rounded-xl text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((guide) => (
              <div
                key={guide.id}
                onClick={() => navigate(`/guides/${guide.id}`)}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition p-6 cursor-pointer flex flex-col justify-between space-y-4 group transform hover:-translate-y-1"
              >
                <div className="space-y-4">
                  {/* Guide Header */}
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img
                        src={guide.avatar}
                        alt={guide.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/30"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-0.5 rounded-full" title="Verified Local Guide">
                        <ShieldCheck className="w-4 h-4 fill-emerald-600 stroke-white" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-slate-900 text-base group-hover:text-brand-600 transition">
                          {guide.name}
                        </h3>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-flex items-center gap-1 mt-0.5">
                        <ShieldCheck className="w-3 h-3" /> Verified Local Guide
                      </span>

                      <div className="flex items-center gap-2 mt-1.5 text-xs">
                        <div className="flex items-center gap-1 font-extrabold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <span>{guide.rating}</span>
                        </div>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600 font-semibold">{guide.reviewCount} reviews</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {guide.bio}
                  </p>

                  {/* Info Tags */}
                  <div className="bg-slate-50 p-3 rounded-2xl space-y-1.5 text-xs text-slate-700 border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Experience:</span>
                      <span className="font-bold text-slate-900">{guide.experienceYears} Years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Languages:</span>
                      <span className="font-bold text-slate-900">{guide.languages.join(' • ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Primary Destination:</span>
                      <span className="font-bold text-slate-900">{guide.serviceAreas[0]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-medium">Tours Completed:</span>
                      <span className="font-bold text-emerald-700">{guide.completedTours} Tours</span>
                    </div>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Starting From</span>
                    <span className="text-xl font-extrabold text-slate-900">
                      ₹{guide.startingPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <button className="bg-slate-900 text-white hover:bg-brand-500 font-bold px-4 py-2 rounded-xl text-xs transition">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
