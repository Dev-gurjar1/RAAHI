import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, Radio, CheckCircle2, XCircle, MapPin, Clock, Plus, KeyRound, Sparkles } from 'lucide-react';

export const GuideDashboard = ({ user, socket }) => {
  const [incomingRequest, setIncomingRequest] = useState(null);
  const [activeBookings, setActiveBookings] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [showCreateTourModal, setShowCreateTourModal] = useState(false);
  const [tourTitle, setTourTitle] = useState('');
  const [tourDesc, setTourDesc] = useState('');
  const [tourPrice, setTourPrice] = useState(1800);
  const [otpVerifyInput, setOtpVerifyInput] = useState('');
  const [otpNotice, setOtpNotice] = useState('');

  useEffect(() => {
    fetchGuideBookings();
  }, []);

  // Listen for real-time dispatch alerts from socket
  useEffect(() => {
    if (!socket) return;

    socket.on('dispatch:new_request', (data) => {
      console.log('Incoming Dispatch Alert:', data);
      setIncomingRequest(data);
    });

    return () => {
      socket.off('dispatch:new_request');
    };
  }, [socket]);

  const fetchGuideBookings = async () => {
    try {
      const token = localStorage.getItem('raahi_token');
      if (!token) return;
      const res = await fetch('/api/bookings/my-bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setActiveBookings(data.bookings);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAcceptRequest = () => {
    if (!incomingRequest) return;
    if (socket) {
      socket.emit('trip:accept', {
        bookingId: incomingRequest.bookingId,
        touristId: incomingRequest.touristId,
        guideId: user._id,
        guideName: user.name,
        guidePhone: user.phone || '+91 98290 12345',
        startOtp: '4892'
      });
    }
    setIncomingRequest(null);
    fetchGuideBookings();
  };

  const handleRejectRequest = () => {
    if (!incomingRequest) return;
    if (socket) {
      socket.emit('trip:reject', {
        bookingId: incomingRequest.bookingId,
        touristId: incomingRequest.touristId
      });
    }
    setIncomingRequest(null);
  };

  const handleCreateTour = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('raahi_token');
      const res = await fetch('/api/bookings/tours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: tourTitle,
          description: tourDesc,
          pricePerPerson: Number(tourPrice),
          city: user.city || 'Jaipur'
        })
      });

      const data = await res.json();
      if (data.success) {
        setShowCreateTourModal(false);
        setTourTitle('');
        setTourDesc('');
        fetchGuideBookings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerifyOtpCode = async (bookingId, type) => {
    try {
      const token = localStorage.getItem('raahi_token');
      const res = await fetch(`/api/bookings/${bookingId}/verify-otp`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ otp: otpVerifyInput, type })
      });

      const data = await res.json();
      if (data.success) {
        setOtpNotice(`✅ Successfully verified ${type} OTP! Booking updated.`);
        setOtpVerifyInput('');
        fetchGuideBookings();
      } else {
        setOtpNotice(`❌ ${data.message}`);
      }
    } catch (err) {
      setOtpNotice('❌ OTP Verification error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified Host Control Panel
          </div>
          <h1 className="text-3xl font-black">Welcome, {user?.name || 'Local Host'}!</h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Manage live on-demand tourist requests, update availability status, publish custom tour packages, and collect escrow earnings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-2 border ${
              isOnline
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-red-500/20 text-red-400 border-red-500/30'
            }`}
          >
            <Radio className={`w-4 h-4 ${isOnline ? 'text-emerald-400 animate-ping' : 'text-red-400'}`} />
            <span>{isOnline ? 'Online for Dispatch' : 'Offline'}</span>
          </button>

          <button
            onClick={() => setShowCreateTourModal(true)}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-2xl text-xs flex items-center gap-1.5 transition shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Create Tour</span>
          </button>
        </div>
      </div>

      {/* Incoming Live Trip Request Dispatch Alert */}
      {incomingRequest && (
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 border-2 border-amber-500 rounded-3xl p-6 shadow-2xl space-y-4 animate-bounce">
          <div className="flex items-center justify-between">
            <span className="bg-amber-500/20 text-amber-300 text-xs font-black px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-amber-400 animate-ping" /> LIVE NEARBY TOURIST DISPATCH REQUEST
            </span>
            <span className="text-xs text-slate-400 font-mono">Fare: ₹{incomingRequest.estimatedFare}</span>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black text-white">Tourist: {incomingRequest.touristName}</h3>
            <p className="text-xs text-slate-300">📍 Pickup Landmark: {incomingRequest.meetingPoint}</p>
            <p className="text-xs text-slate-400">⏳ Booking Duration: {incomingRequest.hoursCount} Hours</p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleAcceptRequest}
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition"
            >
              <CheckCircle2 className="w-4 h-4" /> Accept Trip Request
            </button>
            <button
              onClick={handleRejectRequest}
              className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition"
            >
              <XCircle className="w-4 h-4" /> Decline
            </button>
          </div>
        </div>
      )}

      {/* Guide Active & History Bookings */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-6">
        <h3 className="text-xl font-extrabold text-white">My Active Tourist Bookings & Trips</h3>

        {otpNotice && <div className="text-xs font-bold text-emerald-400">{otpNotice}</div>}

        {activeBookings.length === 0 ? (
          <p className="text-xs text-slate-400">No active bookings yet. Turn on live status to receive dispatch requests.</p>
        ) : (
          <div className="space-y-4">
            {activeBookings.map((b) => (
              <div key={b._id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] text-amber-400 font-mono block">ID: {b._id}</span>
                    <h4 className="font-bold text-white text-sm">{b.title}</h4>
                    <p className="text-xs text-slate-400">Tourist: {b.touristId?.name || 'Verified Traveler'}</p>
                  </div>
                  <div className="text-right">
                    <span className="bg-emerald-500/20 text-emerald-300 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-500/30">
                      {b.status}
                    </span>
                    <span className="text-sm font-black text-amber-400 block mt-1">Earnings: ₹{b.guideEarnings}</span>
                  </div>
                </div>

                {/* OTP Action for Guide */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <input
                    type="text"
                    placeholder="Enter Tourist OTP to verify"
                    value={otpVerifyInput}
                    onChange={(e) => setOtpVerifyInput(e.target.value)}
                    className="flex-1 w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleVerifyOtpCode(b._id, 'START')}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs whitespace-nowrap transition"
                    >
                      Verify Start OTP
                    </button>
                    <button
                      onClick={() => handleVerifyOtpCode(b._id, 'END')}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs whitespace-nowrap transition"
                    >
                      Verify Complete OTP
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Tour Modal */}
      {showCreateTourModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-card rounded-3xl max-w-md w-full p-6 border border-slate-800 space-y-4">
            <h3 className="text-xl font-bold text-white">Publish Custom Tour Package</h3>
            <form onSubmit={handleCreateTour} className="space-y-3">
              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-1">Tour Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1-Day Secret Old City Food & Forts Walk"
                  value={tourTitle}
                  onChange={(e) => setTourTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-1">Tour Description</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Details on monuments visited, street food stops included, and highlights."
                  value={tourDesc}
                  onChange={(e) => setTourDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-1">Price Per Person (₹)</label>
                <input
                  type="number"
                  required
                  value={tourPrice}
                  onChange={(e) => setTourPrice(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl text-xs transition"
                >
                  Publish Tour Package
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateTourModal(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
