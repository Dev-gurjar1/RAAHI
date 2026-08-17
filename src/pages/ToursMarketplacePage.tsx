import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Clock, Star, Users, MapPin, Tag, CheckCircle2, ArrowRight } from 'lucide-react';
import { marketplaceStore } from '../services/store';
import { Tour } from '../types';

export const ToursMarketplacePage: React.FC = () => {
  const [destinationFilter, setDestinationFilter] = useState('');
  const [tours, setTours] = useState<Tour[]>(marketplaceStore.getState().tours);
  const navigate = useNavigate();

  useEffect(() => {
    return marketplaceStore.subscribe(() => {
      setTours(marketplaceStore.getState().tours);
    });
  }, []);

  const filtered = tours.filter(t => {
    if (destinationFilter && !t.destination.toLowerCase().includes(destinationFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
            <Compass className="w-4 h-4 text-emerald-400" /> Guide-Created Experiences
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Explore Local Tour Packages</h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Single-day heritage walks and multi-day pilgrimage journeys with complete price & cost breakdown transparency.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <MapPin className="w-5 h-5 text-amber-500" />
        <input
          type="text"
          placeholder="Filter by city (e.g. Jaipur, Delhi, Katra)..."
          value={destinationFilter}
          onChange={(e) => setDestinationFilter(e.target.value)}
          className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Tours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((tour) => (
          <div
            key={tour.id}
            onClick={() => navigate(`/tours/${tour.id}`)}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-card hover:shadow-card-hover transition cursor-pointer flex flex-col justify-between group transform hover:-translate-y-1"
          >
            <div>
              <div className="h-48 relative overflow-hidden">
                <img src={tour.image} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{tour.isMultiDay ? `${tour.durationDays} Days / ${(tour.durationDays || 2) - 1} Night` : `${tour.durationHours} Hours`}</span>
                </div>
                {tour.isMultiDay && (
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    Multi-Day Package
                  </div>
                )}
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <img src={tour.guideAvatar} alt={tour.guideName} className="w-6 h-6 rounded-full object-cover border" />
                  <span className="text-xs font-semibold text-slate-700">{tour.guideName}</span>
                  <span className="text-[11px] text-amber-600 font-bold ml-auto flex items-center gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-500" /> {tour.guideRating}
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
                <span className="text-xl font-extrabold text-slate-900">₹{tour.pricePerPerson.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-slate-400"> / traveler</span>
              </div>
              <button className="bg-slate-900 hover:bg-brand-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
