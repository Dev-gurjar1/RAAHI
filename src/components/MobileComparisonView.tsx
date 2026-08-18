import React from 'react';
import { ShieldCheck, Star, CheckCircle2, ArrowRight, Trophy, Tag, Award } from 'lucide-react';
import { TourOffer } from '../types';

interface MobileComparisonViewProps {
  offers: TourOffer[];
  onAccept: (offerId: string) => void;
}

export const MobileComparisonView: React.FC<MobileComparisonViewProps> = ({ offers, onAccept }) => {
  return (
    <div className="space-y-6 md:hidden">
      {/* Prominent Banner Header */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 space-y-3">
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-extrabold">
          <ShieldCheck className="w-3.5 h-3.5" /> Bidding Active
        </div>
        <h3 className="text-xl font-extrabold text-white">
          {offers.length} Verified Guides Responded
        </h3>
        <p className="text-xs text-slate-300">
          Compare guide price, rating, experience, and badge labels.
        </p>
      </div>

      {/* Quick Mobile Comparison Summary Table */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-3 overflow-x-auto">
        <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-amber-500" /> Guide Comparison Quick Summary
        </div>

        <table className="w-full text-xs text-left border-collapse min-w-[320px]">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
              <th className="py-2 px-2 font-bold">Guide</th>
              <th className="py-2 px-2 font-bold">Price</th>
              <th className="py-2 px-2 font-bold">Rating</th>
              <th className="py-2 px-2 font-bold">Exp</th>
              <th className="py-2 px-2 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
            {offers.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50/80">
                <td className="py-2.5 px-2">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1">
                    <span>{o.guideName}</span>
                  </div>
                  {o.badgeLabel && (
                    <span className={`inline-block text-[9px] font-extrabold px-1.5 py-0.5 rounded text-white mt-0.5 ${
                      o.badgeLabel === 'Best Match' ? 'bg-amber-500' :
                      o.badgeLabel === 'Best Value' ? 'bg-emerald-600' :
                      o.badgeLabel === 'Most Experienced' ? 'bg-indigo-600' : 'bg-slate-700'
                    }`}>
                      {o.badgeLabel === 'Best Match' ? '🏆 Best Match' :
                       o.badgeLabel === 'Best Value' ? '💰 Best Value' :
                       o.badgeLabel === 'Most Experienced' ? '⭐ Most Experienced' : o.badgeLabel}
                    </span>
                  )}
                </td>
                <td className="py-2.5 px-2 font-extrabold text-slate-900">
                  ₹{o.price.toLocaleString('en-IN')}
                </td>
                <td className="py-2.5 px-2 text-amber-600 font-extrabold whitespace-nowrap">
                  ⭐ {o.guideRating}
                </td>
                <td className="py-2.5 px-2 text-slate-600 font-medium whitespace-nowrap">
                  {o.guideExperience} yrs
                </td>
                <td className="py-2.5 px-2 text-right">
                  <button
                    onClick={() => onAccept(o.id)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-3 py-1.5 rounded-lg text-[11px] transition shadow-xs whitespace-nowrap"
                  >
                    Book
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vertical Offer Cards */}
      {offers.map((offer) => (
        <div
          key={offer.id}
          className={`bg-white rounded-3xl border-2 p-5 space-y-4 shadow-card relative ${
            offer.badgeLabel === 'Best Match' ? 'border-amber-500 ring-2 ring-amber-500/20' :
            offer.badgeLabel === 'Best Value' ? 'border-emerald-500' : 'border-slate-200'
          }`}
        >
          {offer.badgeLabel && (
            <span
              className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase text-white shadow-sm mb-1 ${
                offer.badgeLabel === 'Best Match' ? 'bg-amber-500' :
                offer.badgeLabel === 'Best Value' ? 'bg-emerald-600' :
                offer.badgeLabel === 'Most Experienced' ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              {offer.badgeLabel === 'Best Match' ? '🏆 Best Match' :
               offer.badgeLabel === 'Best Value' ? '💰 Best Value' :
               offer.badgeLabel === 'Most Experienced' ? '⭐ Most Experienced' : offer.badgeLabel}
            </span>
          )}

          <div className="flex items-center gap-3">
            <img src={offer.guideAvatar} alt={offer.guideName} className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500/20" />
            <div>
              <h4 className="font-extrabold text-slate-900 text-base">{offer.guideName}</h4>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Identity Checked
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

          <p className="text-xs text-slate-700 italic bg-amber-50/50 p-3 rounded-xl border border-amber-200/50">
            "{offer.pitch}"
          </p>

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
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-xl text-xs transition flex items-center justify-center gap-2 active:scale-95 shadow-md"
          >
            <span>Accept & Book ₹{offer.price.toLocaleString('en-IN')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
