import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Star,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  Check,
  Trophy,
  Award,
  Users
} from 'lucide-react';
import { marketplaceStore } from '../services/store';
import { GuideRequest, TourOffer, Booking } from '../types';
import { MobileComparisonView } from '../components/MobileComparisonView';

interface RequestComparisonPageProps {
  onOfferAccepted: (booking: Booking) => void;
}

export const RequestComparisonPage: React.FC<RequestComparisonPageProps> = ({ onOfferAccepted }) => {
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get('requestId') || 'req-jaipur-demo';

  const [request, setRequest] = useState<GuideRequest | undefined>(
    marketplaceStore.getState().requests.find(r => r.id === requestId)
  );

  const [offers, setOffers] = useState<TourOffer[]>(
    marketplaceStore.getState().offers.filter(o => o.requestId === requestId)
  );

  const navigate = useNavigate();

  useEffect(() => {
    const updateData = () => {
      const state = marketplaceStore.getState();
      setRequest(state.requests.find(r => r.id === requestId));
      setOffers(state.offers.filter(o => o.requestId === requestId));
    };
    return marketplaceStore.subscribe(updateData);
  }, [requestId]);

  if (!request) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Request Not Found</h2>
        <button onClick={() => navigate('/guides')} className="bg-amber-500 text-white font-bold px-4 py-2 rounded-xl text-xs">
          Return to Marketplace
        </button>
      </div>
    );
  }

  const handleAccept = (offerId: string) => {
    try {
      const booking = marketplaceStore.acceptOffer(offerId);
      onOfferAccepted(booking);
    } catch (e: any) {
      alert('Error accepting offer: ' + e.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-4 border border-slate-800">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
          <Sparkles className="w-4 h-4 text-amber-400" /> Bidding Flow: Tourist Request → Guides Respond → Compare → Book
        </div>
        
        {/* Prominent Bidding Response Highlight (Requirement #2) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-block bg-emerald-500/20 text-emerald-300 font-extrabold text-xs px-3 py-1 rounded-full border border-emerald-500/30 mb-1">
              ⚡ LIVE BIDS READY
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              {offers.length} Verified Guides Responded
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Review transparent offers for {request.destination} with guaranteed identity verification and escrow payment protection.
            </p>
          </div>
          
          <button
            onClick={() => navigate('/guides')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-5 py-3 rounded-2xl text-xs whitespace-nowrap shadow-lg shadow-amber-500/20"
          >
            Post Another Request
          </button>
        </div>

        {/* Request Summary Bar */}
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Destination & Pax</span>
            <span className="font-semibold text-white">{request.destination} • {request.travelersCount} Pax</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Duration</span>
            <span className="font-semibold text-white">{request.durationHours} Hours</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Budget</span>
            <span className="font-bold text-amber-400">₹{request.budget.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Offers Received</span>
            <span className="font-extrabold text-emerald-400">{offers.length} Bids Ready</span>
          </div>
        </div>
      </div>

      {/* Prominent Quick Comparison Table Banner (Desktop & Tablet) */}
      {offers.length > 0 && (
        <div className="hidden md:block bg-white rounded-3xl p-6 border-2 border-amber-500/30 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-slate-900 text-lg">
                Verified Guides Response Summary
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">Select a guide to compare full inclusions or book directly</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                  <th className="py-3 px-4 font-bold">Guide</th>
                  <th className="py-3 px-4 font-bold">Offered Price</th>
                  <th className="py-3 px-4 font-bold">Rating</th>
                  <th className="py-3 px-4 font-bold">Experience</th>
                  <th className="py-3 px-4 font-bold">Smart Label</th>
                  <th className="py-3 px-4 font-bold text-right">Instant Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {offers.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img src={o.guideAvatar} alt={o.guideName} className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/30" />
                        <div>
                          <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1">
                            <span>{o.guideName}</span>
                            <ShieldCheck className="w-4 h-4 text-emerald-600 inline" />
                          </div>
                          <span className="text-[10px] text-slate-400">{o.tourTitle}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-base font-extrabold text-slate-900">
                      ₹{o.price.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-amber-600 font-bold text-sm whitespace-nowrap">
                      ⭐ {o.guideRating}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-semibold whitespace-nowrap">
                      {o.guideExperience} yrs
                    </td>
                    <td className="py-3.5 px-4">
                      {o.badgeLabel ? (
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase text-white shadow-xs ${
                          o.badgeLabel === 'Best Match' ? 'bg-amber-500' :
                          o.badgeLabel === 'Best Value' ? 'bg-emerald-600' :
                          o.badgeLabel === 'Most Experienced' ? 'bg-indigo-600' : 'bg-slate-800'
                        }`}>
                          {o.badgeLabel === 'Best Match' ? '🏆 Best Match' :
                           o.badgeLabel === 'Best Value' ? '💰 Best Value' :
                           o.badgeLabel === 'Most Experienced' ? '⭐ Most Experienced' : o.badgeLabel}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleAccept(o.id)}
                        className={`font-extrabold px-4 py-2 rounded-xl text-xs transition shadow-sm inline-flex items-center gap-1.5 ${
                          o.badgeLabel === 'Best Match'
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        <span>Book ₹{o.price.toLocaleString('en-IN')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mobile View Component */}
      <MobileComparisonView offers={offers} onAccept={handleAccept} />

      {/* Full Detailed Desktop Cards Grid */}
      {offers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Clock className="w-10 h-10 text-amber-500 mx-auto animate-spin" />
          <h3 className="text-lg font-bold text-slate-800">We're finding verified locals for your request.</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Eligible verified local guides in {request.destination} have been notified and are submitting custom offers.
          </p>
        </div>
      ) : (
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className={`bg-white rounded-3xl border-2 transition-all p-6 flex flex-col justify-between space-y-6 shadow-card relative ${
                offer.badgeLabel === 'Best Match'
                  ? 'border-amber-500 ring-4 ring-amber-500/10'
                  : offer.badgeLabel === 'Best Value'
                  ? 'border-emerald-500'
                  : 'border-slate-200'
              }`}
            >
              {offer.badgeLabel && (
                <div
                  className={`absolute -top-3.5 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider text-white shadow-md ${
                    offer.badgeLabel === 'Best Match'
                      ? 'bg-amber-500'
                      : offer.badgeLabel === 'Best Value'
                      ? 'bg-emerald-600'
                      : offer.badgeLabel === 'Most Experienced'
                      ? 'bg-indigo-600'
                      : 'bg-slate-800'
                  }`}
                >
                  {offer.badgeLabel === 'Best Match' ? '🏆 Best Match' :
                   offer.badgeLabel === 'Best Value' ? '💰 Best Value' :
                   offer.badgeLabel === 'Most Experienced' ? '⭐ Most Experienced' : offer.badgeLabel}
                </div>
              )}

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3">
                  <img src={offer.guideAvatar} alt={offer.guideName} className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/20" />
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{offer.guideName}</h3>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Identity Checked
                    </span>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-extrabold mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{offer.guideRating}</span>
                      <span className="text-slate-400 font-normal">({offer.guideExperience} yrs exp)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Offered Tour Price</span>
                  <div className="text-3xl font-extrabold text-slate-900">
                    ₹{offer.price.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-slate-500">For {offer.durationHours} hours total</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Guide Pitch</span>
                  <p className="text-xs text-slate-700 italic bg-amber-50/60 p-3 rounded-xl border border-amber-200/50 leading-relaxed">
                    "{offer.pitch}"
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Included Services</span>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {offer.includedServices.map((inc, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => handleAccept(offer.id)}
                className={`w-full font-extrabold py-3.5 rounded-2xl text-sm shadow-md transition transform active:scale-95 flex items-center justify-center gap-2 ${
                  offer.badgeLabel === 'Best Match'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 shadow-amber-500/25'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <span>Accept Offer & Book</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
