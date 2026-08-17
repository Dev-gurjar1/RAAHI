import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Star,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  ThumbsUp,
  MessageSquare,
  Award,
  AlertTriangle,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { marketplaceStore } from '../services/store';
import { GuideProfile, Tour, Review } from '../types';

interface GuideProfilePageProps {
  onRequestOpen: () => void;
  onBookGuideDirect: (guide: GuideProfile) => void;
}

export const GuideProfilePage: React.FC<GuideProfilePageProps> = ({ onRequestOpen, onBookGuideDirect }) => {
  const { guideId } = useParams<{ guideId: string }>();
  const navigate = useNavigate();

  const [guide, setGuide] = useState<GuideProfile | undefined>(
    marketplaceStore.getState().guides.find(g => g.id === guideId)
  );

  const [tours, setTours] = useState<Tour[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const updateData = () => {
      const g = marketplaceStore.getState().guides.find(item => item.id === guideId);
      setGuide(g);
      if (g) {
        setTours(marketplaceStore.getState().tours.filter(t => t.guideId === g.id));
        setReviews(marketplaceStore.getState().reviews.filter(r => r.guideId === g.id));
      }
    };
    updateData();
    return marketplaceStore.subscribe(updateData);
  }, [guideId]);

  if (!guide) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Guide Profile Not Found</h2>
        <p className="text-slate-500 text-sm">The guide profile you requested does not exist or is pending verification.</p>
        <button
          onClick={() => navigate('/guides')}
          className="bg-amber-500 text-white font-bold px-4 py-2 rounded-xl text-xs"
        >
          Return to Guides Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/guides')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Guides</span>
      </button>

      {/* Guide Header Banner Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/80 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="relative">
              <img
                src={guide.avatar}
                alt={guide.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-emerald-500/20 shadow-md"
              />
              <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-1.5 rounded-2xl shadow-md">
                <ShieldCheck className="w-5 h-5 fill-emerald-600 stroke-white" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{guide.name}</h1>
                {guide.verificationStatus === 'VERIFIED' && (
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> Verified Local Guide
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-1 font-extrabold text-amber-500 text-sm">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span>{guide.rating}</span>
                </div>
                <span className="text-slate-400">•</span>
                <span className="text-slate-700 font-semibold">{guide.reviewCount} verified reviews</span>
                <span className="text-slate-400">•</span>
                <span className="text-emerald-700 font-semibold">{guide.completedTours} completed bookings</span>
              </div>

              {/* Badges list */}
              <div className="flex flex-wrap gap-2 pt-1">
                {guide.verificationBadges.map((badge, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>{badge}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">About Local Guide</h3>
            <p className="text-sm text-slate-700 leading-relaxed font-sans">{guide.bio}</p>
          </div>

          {/* Key Facts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Experience</span>
              <span className="font-extrabold text-slate-900">{guide.experienceYears} Years</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Languages</span>
              <span className="font-extrabold text-slate-900">{guide.languages.join(', ')}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Areas Covered</span>
              <span className="font-extrabold text-slate-900">{guide.serviceAreas.join(', ')}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Response Rate</span>
              <span className="font-extrabold text-emerald-700">{guide.responseRate}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & CTAs */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Starting Guide Fee</span>
              <span className="text-2xl font-extrabold text-amber-400">₹{guide.startingPrice.toLocaleString('en-IN')}</span>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Includes private guide service</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Flexible date scheduling</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Direct in-app messaging</span>
              </div>
            </div>

            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-[11px] text-slate-300 space-y-1">
              <span className="font-bold text-white block">Cancellation Policy</span>
              <p>{guide.cancellationPolicy}</p>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => onBookGuideDirect(guide)}
              className="w-full bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-700 hover:to-amber-600 text-white font-extrabold py-3.5 rounded-xl text-sm shadow-md transition transform active:scale-95"
            >
              Book Guide Direct
            </button>

            <button
              onClick={onRequestOpen}
              className="w-full bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold py-3 rounded-xl text-xs border border-slate-700 transition"
            >
              Submit Custom Offer Request
            </button>
          </div>
        </div>
      </div>

      {/* Guide Created Tours Section */}
      {tours.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Tours Created by {guide.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tours.map(t => (
              <div
                key={t.id}
                onClick={() => navigate(`/tours/${t.id}`)}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer flex gap-4 items-center"
              >
                <img src={t.image} alt={t.title} className="w-24 h-24 rounded-xl object-cover" />
                <div className="space-y-1 flex-1">
                  <h4 className="font-bold text-slate-900 text-sm">{t.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{t.description}</p>
                  <div className="flex items-center justify-between text-xs font-bold pt-2">
                    <span className="text-brand-600">₹{t.pricePerPerson} / pax</span>
                    <span className="text-slate-400">{t.durationHours} hrs</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verified Reviews */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Verified Tourist Reviews</h3>
            <p className="text-xs text-slate-500">Only travelers with confirmed completed bookings can leave reviews</p>
          </div>
          <div className="flex items-center gap-1 text-lg font-extrabold text-amber-500">
            <Star className="w-5 h-5 fill-amber-500" />
            <span>{guide.rating}</span>
            <span className="text-xs text-slate-400 font-normal">({reviews.length} reviews)</span>
          </div>
        </div>

        {reviews.length === 0 ? (
          <p className="text-xs text-slate-500 py-4">No reviews recorded yet for recent tours.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={r.touristAvatar} alt={r.touristName} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <span className="text-xs font-bold text-slate-900">{r.touristName}</span>
                      <span className="text-[10px] text-slate-400 block">{r.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-xs text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{r.overallRating}.0</span>
                  </div>
                </div>
                <p className="text-xs text-slate-700 italic">"{r.comment}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
