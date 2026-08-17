import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Calendar,
  DollarSign,
  Star,
  Users,
  Plus,
  Clock,
  CheckCircle2,
  Send,
  Compass,
  ShieldCheck,
  MapPin,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { marketplaceStore } from '../services/store';
import { GuideProfile, GuideRequest, TourOffer, Tour, Booking } from '../types';
import { TourCreatorModal } from './TourCreatorModal';

export const GuideDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'REQUESTS' | 'OFFERS' | 'TOURS' | 'BOOKINGS' | 'EARNINGS'>('REQUESTS');
  const [isTourCreatorOpen, setIsTourCreatorOpen] = useState(false);

  const [state, setState] = useState(marketplaceStore.getState());

  useEffect(() => {
    return marketplaceStore.subscribe(() => {
      setState(marketplaceStore.getState());
    });
  }, []);

  // Currently logged in guide (Rahul Sharma demo default)
  const currentGuide: GuideProfile = state.guides.find(g => g.id === 'guide-rahul') || state.guides[0];

  const guideRequests = state.requests.filter(r =>
    currentGuide.serviceAreas.some(area => area.toLowerCase().includes(r.destination.toLowerCase()))
  );

  const myOffers = state.offers.filter(o => o.guideId === currentGuide.id);
  const myTours = state.tours.filter(t => t.guideId === currentGuide.id);
  const myBookings = state.bookings.filter(b => b.guideId === currentGuide.id);

  // Form state for submitting bid offer on a request
  const [selectedReqId, setSelectedReqId] = useState<string | null>(guideRequests[0]?.id || null);
  const [bidPrice, setBidPrice] = useState(2500);
  const [bidDuration, setBidDuration] = useState(6);
  const [bidPitch, setBidPitch] = useState('I will offer a customized heritage walk covering Amber Fort & local street food.');
  const [bidInclusions, setBidInclusions] = useState('Private 6-hr Heritage Walk, Food Tasting at Rawat Sweets, High-res Photos');

  const handleSendBid = (req: GuideRequest) => {
    marketplaceStore.submitGuideOffer({
      requestId: req.id,
      guideId: currentGuide.id,
      guideName: currentGuide.name,
      guideAvatar: currentGuide.avatar,
      guideRating: currentGuide.rating,
      guideExperience: currentGuide.experienceYears,
      price: bidPrice,
      durationHours: bidDuration,
      includedServices: bidInclusions.split(',').map(s => s.trim()),
      excludedServices: ['Monument tickets'],
      tourTitle: `${req.destination} Personalized Heritage & Food Walk`,
      pitch: bidPitch,
      highlights: ['100% Verified Local', 'Includes Food Tasting'],
      cancellationPolicy: currentGuide.cancellationPolicy
    });

    setSelectedReqId(null);
    alert('Your custom offer bid has been sent to the tourist!');
  };

  const totalGrossEarnings = myBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const totalNetEarnings = myBookings.reduce((sum, b) => sum + b.guideEarnings, 0);
  const totalPlatformFee = myBookings.reduce((sum, b) => sum + b.platformFee, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Guide Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src={currentGuide.avatar} alt={currentGuide.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-400" />
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full">
              <ShieldCheck className="w-4 h-4 fill-emerald-500 stroke-white" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold">{currentGuide.name}</h1>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                {currentGuide.verificationStatus}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Primary City: {currentGuide.serviceAreas[0]} • {currentGuide.experienceYears} Years Experience
            </p>
            <div className="flex items-center gap-3 text-xs text-amber-400 font-bold pt-1">
              <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-400" /> {currentGuide.rating} Rating</span>
              <span>•</span>
              <span className="text-emerald-400">{currentGuide.completedTours} Tours Completed</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsTourCreatorOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-3 rounded-2xl shadow-lg transition flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Create Tour Package</span>
        </button>
      </div>

      {/* Metrics Cards (Requirement #11) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Today's Bookings</span>
          <span className="text-xl font-extrabold text-slate-900">1 Active</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Upcoming Tours</span>
          <span className="text-xl font-extrabold text-indigo-600">{myBookings.filter(b => b.bookingStatus === 'UPCOMING').length}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Requests</span>
          <span className="text-xl font-extrabold text-amber-500">{guideRequests.length}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">This Month Net</span>
          <span className="text-xl font-extrabold text-emerald-600">₹{totalNetEarnings.toLocaleString('en-IN')}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Rating</span>
          <span className="text-xl font-extrabold text-amber-500 flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-500" /> {currentGuide.rating}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Response Rate</span>
          <span className="text-xl font-extrabold text-emerald-600">{currentGuide.responseRate}</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 flex flex-wrap gap-1">
        <button
          onClick={() => setActiveTab('REQUESTS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'REQUESTS' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4 text-amber-400" />
          <span>Pending Tourist Requests ({guideRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('OFFERS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'OFFERS' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Send className="w-4 h-4 text-indigo-400" />
          <span>My Submitted Offers ({myOffers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('TOURS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'TOURS' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Compass className="w-4 h-4 text-emerald-400" />
          <span>My Created Tours ({myTours.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('BOOKINGS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'BOOKINGS' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4 text-sky-400" />
          <span>Bookings Calendar ({myBookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('EARNINGS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'EARNINGS' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>Earnings & Payouts</span>
        </button>
      </div>

      {/* TAB CONTENT: REQUESTS & BIDDING SYSTEM */}
      {activeTab === 'REQUESTS' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Incoming Tourist Requests in {currentGuide.serviceAreas[0]}</h3>
          {guideRequests.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl text-center text-slate-500 text-xs border border-slate-200">
              No open requests in your service area right now. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {guideRequests.map((req) => (
                <div key={req.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <img src={req.touristAvatar} alt={req.touristName} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{req.touristName}</h4>
                        <span className="text-[10px] text-slate-400">{req.createdAt}</span>
                      </div>
                    </div>
                    <span className="bg-amber-100 text-amber-900 font-extrabold text-xs px-3 py-1 rounded-full">
                      Target Budget ₹{req.budget.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Date</span>
                      <span className="font-bold text-slate-800">{req.date}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Travelers</span>
                      <span className="font-bold text-slate-800">{req.travelersCount} Pax</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Duration</span>
                      <span className="font-bold text-slate-800">{req.durationHours} Hours</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 bg-amber-50/50 p-3 rounded-xl border border-amber-200/50">
                    "{req.specialRequirements}"
                  </p>

                  {/* Bidding Form Accordion */}
                  {selectedReqId === req.id ? (
                    <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3">
                      <h5 className="font-bold text-xs text-amber-400">Submit Your Custom Offer Bid</h5>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400">Offered Price (₹)</label>
                          <input
                            type="number"
                            value={bidPrice}
                            onChange={(e) => setBidPrice(Number(e.target.value))}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-xs text-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400">Duration (Hrs)</label>
                          <input
                            type="number"
                            value={bidDuration}
                            onChange={(e) => setBidDuration(Number(e.target.value))}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-xs text-white font-bold"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400">Included Services (comma separated)</label>
                        <input
                          type="text"
                          value={bidInclusions}
                          onChange={(e) => setBidInclusions(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400">Personal Pitch Note</label>
                        <textarea
                          rows={2}
                          value={bidPitch}
                          onChange={(e) => setBidPitch(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-xs text-white"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSendBid(req)}
                          className="flex-1 bg-emerald-500 text-slate-950 font-bold py-2 rounded-xl text-xs hover:bg-emerald-400 transition"
                        >
                          Submit Bid Offer
                        </button>
                        <button
                          onClick={() => setSelectedReqId(null)}
                          className="bg-slate-800 text-slate-400 py-2 px-3 rounded-xl text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedReqId(req.id)}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5 text-amber-400" />
                      <span>Submit Bid Offer</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: MY OFFERS */}
      {activeTab === 'OFFERS' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Submitted Offers Status</h3>
          <div className="space-y-3">
            {myOffers.map((offer) => (
              <div key={offer.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{offer.tourTitle}</h4>
                  <span className="text-xs text-slate-500">Offered Price: ₹{offer.price} • {offer.durationHours} hrs</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  offer.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {offer.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: MY TOURS */}
      {activeTab === 'TOURS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">My Tour Packages</h3>
            <button
              onClick={() => setIsTourCreatorOpen(true)}
              className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Create Package
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myTours.map((tour) => (
              <div key={tour.id} className="bg-white rounded-2xl p-4 border border-slate-200 flex gap-4">
                <img src={tour.image} alt={tour.title} className="w-24 h-24 rounded-xl object-cover" />
                <div className="space-y-1 flex-1">
                  <h4 className="font-bold text-slate-900 text-sm">{tour.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{tour.description}</p>
                  <div className="flex items-center justify-between text-xs font-bold pt-2">
                    <span className="text-emerald-700">₹{tour.pricePerPerson} / person</span>
                    <span className="text-slate-400">{tour.isMultiDay ? `${tour.durationDays} Days` : `${tour.durationHours} hrs`}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: BOOKINGS CALENDAR */}
      {activeTab === 'BOOKINGS' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Confirmed Tourist Bookings</h3>
          <div className="space-y-3">
            {myBookings.map((b) => (
              <div key={b.id} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Booking ID: {b.id}</span>
                  <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full">
                    {b.bookingStatus}
                  </span>
                </div>
                <div className="text-xs text-slate-700">
                  Tourist: <strong>{b.touristName}</strong> ({b.travelersCount} Pax) • Date: <strong>{b.date}</strong> at {b.time}
                </div>
                <div className="text-xs bg-slate-50 p-2 rounded-lg border border-slate-100 font-mono">
                  Meeting Point: {b.meetingPoint}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: EARNINGS & PAYOUTS (Requirement #20) */}
      {activeTab === 'EARNINGS' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Earnings & Commission Architecture</h3>
            <p className="text-xs text-slate-500">
              Platform commission is configured at {state.platformCommissionPercent}%. Payouts are triggered automatically upon tour completion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-slate-400 block font-bold uppercase">Gross Bookings Volume</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
                ₹{totalGrossEarnings.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-slate-400 block font-bold uppercase">Platform Fee ({state.platformCommissionPercent}%)</span>
              <span className="text-2xl font-extrabold text-amber-600 mt-1 block">
                ₹{totalPlatformFee.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
              <span className="text-emerald-800 block font-bold uppercase">Net Guide Payout</span>
              <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">
                ₹{totalNetEarnings.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tour Creator Modal */}
      <TourCreatorModal
        isOpen={isTourCreatorOpen}
        onClose={() => setIsTourCreatorOpen(false)}
        guideId={currentGuide.id}
        guideName={currentGuide.name}
        guideAvatar={currentGuide.avatar}
      />
    </div>
  );
};
