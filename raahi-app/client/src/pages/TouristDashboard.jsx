import React, { useState, useEffect } from 'react';
import { GuideMap } from '../components/GuideMap';
import { FairPriceEstimator } from '../components/FairPriceEstimator';
import { ShieldCheck, Compass, MapPin, Clock, Users, Star, Sparkles, CheckCircle2, PhoneCall, KeyRound, Radio } from 'lucide-react';

export const TouristDashboard = ({ user, socket }) => {
  const [guides, setGuides] = useState([]);
  const [tours, setTours] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [activeBooking, setActiveBooking] = useState(null);
  const [activeTab, setActiveTab] = useState('ON_DEMAND'); // ON_DEMAND | TOURS | FAIR_PRICE
  const [hoursCount, setHoursCount] = useState(3);
  const [travelersCount, setTravelersCount] = useState(2);
  const [meetingPoint, setMeetingPoint] = useState('Hawa Mahal Main Gate, Jaipur');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpMessage, setOtpMessage] = useState('');

  // Initial Data Fetching
  useEffect(() => {
    fetchNearbyGuides();
    fetchMarketplaceTours();
    fetchMyBookings();
  }, []);

  // Socket Real-time Dispatch Listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('radar:guide_moved', (data) => {
      setGuides((prev) =>
        prev.map((g) => (g._id === data.guideId ? { ...g, location: data.location } : g))
      );
    });

    socket.on('trip:status_updated', (data) => {
      if (data.status === 'ACCEPTED') {
        fetchMyBookings();
      }
    });

    return () => {
      socket.off('radar:guide_moved');
      socket.off('trip:status_updated');
    };
  }, [socket]);

  const fetchNearbyGuides = async () => {
    try {
      const res = await fetch('/api/auth/guides/nearby');
      const data = await res.json();
      if (data.success && data.guides.length > 0) {
        setGuides(data.guides);
        setSelectedGuide(data.guides[0]);
      } else {
        // Fallback Mock Guides for Instant Dev Testing
        const mockGuides = [
          {
            _id: 'g1',
            name: 'Rahul Verma',
            hourlyRate: 450,
            rating: 4.9,
            totalReviews: 84,
            city: 'Jaipur',
            bio: 'Certified heritage walk guide for Hawa Mahal, Amber Fort & local street food gems.',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
            location: { coordinates: [75.8185, 26.9124] }
          },
          {
            _id: 'g2',
            name: 'Priya Rathore',
            hourlyRate: 500,
            rating: 5.0,
            totalReviews: 62,
            city: 'Jaipur',
            bio: 'Expert in royal Rajputana history, Johri Bazaar jewellery & textile walks.',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
            location: { coordinates: [75.8267, 26.9239] }
          }
        ];
        setGuides(mockGuides);
        setSelectedGuide(mockGuides[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMarketplaceTours = async () => {
    try {
      const res = await fetch('/api/bookings/tours');
      const data = await res.json();
      if (data.success) {
        setTours(data.tours);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMyBookings = async () => {
    try {
      const token = localStorage.getItem('raahi_token');
      if (!token) return;
      const res = await fetch('/api/bookings/my-bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.bookings.length > 0) {
        setActiveBooking(data.bookings[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRequestGuide = async (e) => {
    e.preventDefault();
    if (!selectedGuide) return;
    setBookingLoading(true);

    try {
      const token = localStorage.getItem('raahi_token');
      const res = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          guideId: selectedGuide._id,
          hoursCount,
          travelersCount,
          meetingPoint
        })
      });

      const data = await res.json();
      if (data.success) {
        setActiveBooking(data.booking);
        // Emit Socket Dispatch Event
        if (socket) {
          socket.emit('trip:request_nearby', {
            bookingId: data.booking._id,
            touristId: user._id,
            touristName: user.name,
            meetingPoint,
            hoursCount,
            estimatedFare: data.booking.totalAmount
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleVerifyOtp = async (type) => {
    if (!activeBooking || !otpInput) return;
    try {
      const token = localStorage.getItem('raahi_token');
      const res = await fetch(`/api/bookings/${activeBooking._id}/verify-otp`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ otp: otpInput, type })
      });

      const data = await res.json();
      if (data.success) {
        setActiveBooking(data.booking);
        setOtpMessage(`✅ OTP Verified Successfully! Trip Status: ${data.booking.status}`);
        setOtpInput('');
      } else {
        setOtpMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      setOtpMessage('❌ Failed to verify OTP code');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase">
            <Compass className="w-4 h-4 text-amber-400" /> Tourist On-Demand Hub
          </div>
          <h1 className="text-3xl font-black">Welcome back, {user?.name || 'Traveler'}!</h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Dispatch verified local guides on-demand, verify official fare benchmarks, and explore authentic custom tour packages.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 gap-1">
          <button
            onClick={() => setActiveTab('ON_DEMAND')}
            className={`px-4 py-2 text-xs font-black rounded-xl transition ${
              activeTab === 'ON_DEMAND' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ On-Demand Guide Radar
          </button>
          <button
            onClick={() => setActiveTab('TOURS')}
            className={`px-4 py-2 text-xs font-black rounded-xl transition ${
              activeTab === 'TOURS' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            🏰 Custom Tours
          </button>
          <button
            onClick={() => setActiveTab('FAIR_PRICE')}
            className={`px-4 py-2 text-xs font-black rounded-xl transition ${
              activeTab === 'FAIR_PRICE' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            🛡️ Fair Price Calculator
          </button>
        </div>
      </div>

      {/* Live Active Booking OTP Banner */}
      {activeBooking && (
        <div className="glass-card rounded-3xl p-6 border-2 border-emerald-500/40 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1 w-fit mb-1">
                <Radio className="w-3 h-3 text-emerald-400 animate-ping" /> Live Trip Active: {activeBooking.status}
              </span>
              <h3 className="text-xl font-extrabold text-white">{activeBooking.title}</h3>
              <p className="text-xs text-slate-400">Meeting Point: {activeBooking.meetingPoint}</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-6">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Trip Start OTP</span>
                <span className="text-2xl font-black font-mono text-amber-400">{activeBooking.startOtp}</span>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Trip End OTP</span>
                <span className="text-2xl font-black font-mono text-emerald-400">{activeBooking.endOtp}</span>
              </div>
            </div>
          </div>

          {/* OTP Verification Control */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Enter 4-digit OTP from guide to update trip state"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-9 pr-3 py-2 text-xs font-mono font-bold"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleVerifyOtp('START')}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs whitespace-nowrap transition"
              >
                Verify Start OTP
              </button>
              <button
                onClick={() => handleVerifyOtp('END')}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs whitespace-nowrap transition"
              >
                Verify Complete OTP
              </button>
            </div>
          </div>

          {otpMessage && <div className="text-xs font-bold text-slate-300">{otpMessage}</div>}
        </div>
      )}

      {/* Main Tab Content */}
      {activeTab === 'ON_DEMAND' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Guide Radar Map */}
          <div className="lg:col-span-7 space-y-6">
            <GuideMap
              guides={guides}
              selectedGuide={selectedGuide}
              onSelectGuide={(g) => setSelectedGuide(g)}
            />
          </div>

          {/* Right: Booking Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" /> On-Demand Dispatch Form
              </h3>

              {selectedGuide ? (
                <form onSubmit={handleRequestGuide} className="space-y-4">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
                    <img
                      src={selectedGuide.avatar}
                      alt={selectedGuide.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-extrabold text-white text-xs">{selectedGuide.name}</h4>
                      <span className="text-[10px] text-amber-400 font-bold">₹{selectedGuide.hourlyRate} / Hour</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 mb-1">Meeting Point Landmark</label>
                    <input
                      type="text"
                      value={meetingPoint}
                      onChange={(e) => setMeetingPoint(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-300 mb-1">Duration (Hours)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={hoursCount}
                        onChange={(e) => setHoursCount(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-slate-300 mb-1">Travelers Count</label>
                      <input
                        type="number"
                        min="1"
                        max="8"
                        value={travelersCount}
                        onChange={(e) => setTravelersCount(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-bold"
                      />
                    </div>
                  </div>

                  {/* Fee Breakdown */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Guide Hourly Fee ({hoursCount} hrs):</span>
                      <span>₹{selectedGuide.hourlyRate * hoursCount}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>RAAHI Escrow Fee (10%):</span>
                      <span>₹{Math.round(selectedGuide.hourlyRate * hoursCount * 0.1)}</span>
                    </div>
                    <div className="pt-1 border-t border-slate-800 flex justify-between font-extrabold text-amber-400">
                      <span>Total Guaranteed Amount:</span>
                      <span>₹{Math.round(selectedGuide.hourlyRate * hoursCount * 1.1)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3 rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <Radio className="w-4 h-4 text-slate-950 animate-ping" />
                    <span>{bookingLoading ? 'Dispatching Request...' : 'Dispatch Live Local Guide Request'}</span>
                  </button>
                </form>
              ) : (
                <p className="text-xs text-slate-400">Select an available guide on the radar map to request dispatch.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'TOURS' && (
        <div className="space-y-6">
          <h3 className="text-xl font-extrabold text-white">Verified Custom Tour Packages</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tours.map((t) => (
              <div key={t._id} className="glass-card rounded-3xl overflow-hidden border border-slate-800 space-y-3">
                <img src={t.coverImage} alt={t.title} className="w-full h-44 object-cover" />
                <div className="p-5 space-y-3">
                  <span className="bg-amber-500/20 text-amber-300 text-[10px] font-black px-2.5 py-1 rounded-full border border-amber-500/30 uppercase">
                    {t.category} • {t.durationDays} Day
                  </span>
                  <h4 className="font-extrabold text-white text-base">{t.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{t.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-lg font-black text-amber-400">₹{t.pricePerPerson} / pax</span>
                    <button className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition">
                      Book Package
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'FAIR_PRICE' && <FairPriceEstimator />}
    </div>
  );
};
