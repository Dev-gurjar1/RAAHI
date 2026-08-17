import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Clock,
  MapPin,
  Star,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Calendar,
  Users,
  ArrowLeft,
  DollarSign
} from 'lucide-react';
import { marketplaceStore } from '../services/store';
import { Tour } from '../types';

interface TourDetailPageProps {
  onBookTourDirect: (tour: Tour, date: string, travelers: number) => void;
}

export const TourDetailPage: React.FC<TourDetailPageProps> = ({ onBookTourDirect }) => {
  const { tourId } = useParams<{ tourId: string }>();
  const navigate = useNavigate();

  const tour = marketplaceStore.getState().tours.find(t => t.id === tourId);

  const [selectedDate, setSelectedDate] = useState('2026-08-25');
  const [travelersCount, setTravelersCount] = useState(2);

  if (!tour) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Tour Package Not Found</h2>
        <button onClick={() => navigate('/tours')} className="bg-amber-500 text-white font-bold px-4 py-2 rounded-xl text-xs">
          Back to Tours Marketplace
        </button>
      </div>
    );
  }

  const handleBook = () => {
    onBookTourDirect(tour, selectedDate, travelersCount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/tours')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Tours</span>
      </button>

      {/* Main Tour Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Media & Itinerary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative rounded-3xl overflow-hidden shadow-lg h-72 sm:h-96">
            <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-amber-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full">
                  {tour.destination}
                </span>
                <span className="bg-slate-900/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{tour.isMultiDay ? `${tour.durationDays} Days / ${(tour.durationDays || 2) - 1} Night` : `${tour.durationHours} Hours`}</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">{tour.title}</h1>
            </div>
          </div>

          {/* Guide Host Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={tour.guideAvatar} alt={tour.guideName} className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500/20" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Hosted by {tour.guideName}</h4>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified Local Host
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm font-extrabold text-amber-500">
              <Star className="w-4 h-4 fill-amber-500" />
              <span>{tour.guideRating}</span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Experience Overview</h3>
            <p className="text-sm text-slate-700 leading-relaxed">{tour.description}</p>
          </div>

          {/* Multi-Day Transparent Cost Breakdown (Requirement #13) */}
          {tour.isMultiDay && tour.costBreakdown && (
            <div className="bg-emerald-50/70 p-6 rounded-3xl border border-emerald-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-900 uppercase tracking-wider">
                  <DollarSign className="w-4 h-4 text-emerald-700" /> Transparent Pricing Cost Breakdown
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-200/60 px-3 py-1 rounded-full">
                  Verified Itemized Costs
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs bg-white p-4 rounded-2xl border border-emerald-200/50 shadow-sm">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Transport</span>
                  <span className="font-bold text-slate-900">₹{tour.costBreakdown.transport.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Hotel</span>
                  <span className="font-bold text-slate-900">₹{tour.costBreakdown.hotel.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Food</span>
                  <span className="font-bold text-slate-900">₹{tour.costBreakdown.food.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Guide / Service</span>
                  <span className="font-bold text-slate-900">₹{tour.costBreakdown.guide.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Misc / Permits</span>
                  <span className="font-bold text-slate-900">₹{tour.costBreakdown.other.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-emerald-900 pt-1 font-semibold">
                <span>Estimated Direct Costs Total: ₹{tour.costBreakdown.estimatedTotal.toLocaleString('en-IN')}</span>
                <span className="font-extrabold">Final Package Price: ₹{tour.pricePerPerson.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}

          {/* Itinerary Timeline */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Itinerary Schedule</h3>
            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200">
              {tour.itinerary.map((step) => (
                <div key={step.id} className="relative pl-8 space-y-1">
                  <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-brand-500 ring-4 ring-white"></div>
                  <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider">{step.time}</span>
                  <h4 className="font-bold text-slate-900 text-sm">{step.title}</h4>
                  <p className="text-xs text-slate-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> What's Included
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {tour.includes.map((inc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" /> What's Excluded
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                {tour.excludes.map((exc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Booking Widget Card */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-6 sticky top-24">
            <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Package Rate</span>
                <span className="text-2xl font-extrabold text-amber-400">₹{tour.pricePerPerson.toLocaleString('en-IN')}</span>
                <span className="text-xs text-slate-400"> / traveler</span>
              </div>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                Verified Listing
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Select Tour Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Number of Travelers</label>
                <input
                  type="number"
                  min="1"
                  max={tour.maxTravelers}
                  value={travelersCount}
                  onChange={(e) => setTravelersCount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal ({travelersCount} pax):</span>
                  <span className="font-bold text-white">₹{(tour.pricePerPerson * travelersCount).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>STHANIQ Protection Fee:</span>
                  <span className="text-emerald-400 font-bold">Included</span>
                </div>
                <div className="pt-1.5 border-t border-slate-700 flex justify-between font-extrabold text-sm text-amber-400">
                  <span>Total Amount:</span>
                  <span>₹{(tour.pricePerPerson * travelersCount).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleBook}
              className="w-full bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-700 hover:to-amber-600 text-white font-extrabold py-3.5 rounded-2xl text-sm shadow-lg shadow-amber-500/25 transition transform active:scale-95"
            >
              Proceed to Booking Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
