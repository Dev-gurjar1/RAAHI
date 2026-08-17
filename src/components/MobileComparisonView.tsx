import React from 'react';
import { ShieldCheck, Star, CheckCircle2, ArrowRight, Award } from 'lucide-react';
import { TourOffer } from '../types';

interface MobileComparisonViewProps {
  offers: TourOffer[];
  onAccept: (offerId: string) => void;
}

export const MobileComparisonView: React.FC<MobileComparisonViewProps> = ({ offers, onAccept }) => {
  return (
    <div className="space-y-6 md:hidden">
      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
        Mobile Vertical Offer Comparison ({offers.length} Bids)
      </div>

      {offers.map((offer) => (
        <div
          key={offer.id}
          className={`bg-white rounded-3xl border-2 p-5 space-y-4 shadow-card relative ${
            offer.badgeLabel === 'Best Match' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200'
          }`}
        >
          {offer.badgeLabel && (
            <span
              className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase text-white shadow-sm mb-2 ${
                offer.badgeLabel === 'Best Match' ? 'bg-amber-500' :
                offer.badgeLabel === 'Lowest Price' ? 'bg-indigo-600' : 'bg-emerald-600'
              }`}
            >
              {offer.badgeLabel}
            </span>
          )}

          <div className="flex items-center gap-3">
            <img src={offer.guideAvatar} alt={offer.guideName} className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500/20" />
            <div>
              <h4 className="font-extrabold text-slate-900 text-base">{offer.guideName}</h4>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified Host
              </span>
              <div className="flex items-center gap-1 text-xs text-amber-500 font-extrabold mt-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <span>{offer.guideRating}</span>
                <span className="text-slate-400 font-normal">({offer.guideExperience} yrs exp)</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Offered Rate ({offer.durationHours} hrs)</span>
            <span className="text-xl font-extrabold text-slate-900">₹{offer.price.toLocaleString('en-IN')}</span>
          </div>

          <div className="space-y-1 text-xs text-slate-700">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Inclusions</span>
            {offer.includedServices.map((inc, idx) => (
              <div key={idx} className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{inc}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onAccept(offer.id)}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 rounded-xl text-xs transition flex items-center justify-center gap-2"
          >
            <span>Accept & Book ₹{offer.price}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
