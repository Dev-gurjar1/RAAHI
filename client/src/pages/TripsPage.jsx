import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useBookingStore } from '../store/useBookingStore.js';
import { useToastStore } from '../store/useToastStore.js';
import { JAIPUR_GUIDES_DATA } from '../constants/guides.js';
import { VerifiedBadge } from '../components/ui/VerifiedBadge.jsx';
import { StarRating } from '../components/ui/StarRating.jsx';

export const TripsPage = () => {
  const [tab, setTab] = useState('upcoming');

  const { userBookings = [], cancelBooking, completeBooking } = useBookingStore();
  const showToast = useToastStore((state) => state.showToast);

  const upcomingBookings = userBookings.filter(
    (b) => b.status === 'Pending' || b.status === 'Confirmed'
  );
  const completedBookings = userBookings.filter((b) => b.status === 'Completed');
  const cancelledBookings = userBookings.filter((b) => b.status === 'Cancelled');

  const activeTrip = upcomingBookings.length > 0 ? upcomingBookings[0] : null;

  const currentTabBookings =
    tab === 'upcoming'
      ? upcomingBookings
      : tab === 'completed'
      ? completedBookings
      : cancelledBookings;

  const handleCancel = (id, name) => {
    if (window.confirm(`Are you sure you want to cancel your booking with ${name}?`)) {
      cancelBooking(id);
      showToast({
        type: 'info',
        title: 'Booking Cancelled',
        message: `Your booking with ${name} has been cancelled.`
      });
    }
  };

  const handleComplete = (id, name) => {
    completeBooking(id);
    showToast({
      type: 'success',
      title: 'Tour Completed! 🎉',
      message: `Your tour with ${name} has been marked completed.`
    });
  };

  return (
    <div className="bg-[#F8F7F3] dark:bg-[#0D1710] min-h-screen text-[#152238] dark:text-[#E8F0EC] font-sans text-left">

      {/* ══════════════════════════════════════════════════
          PAGE HEADER
          ══════════════════════════════════════════════════ */}
      <section className="bg-white dark:bg-[#111C15] border-b border-[#E0E8E4] dark:border-[#243028] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F7F1] dark:bg-[#07543F]/30 text-[#07543F] dark:text-[#4ADE80] text-xs font-bold border border-[#0B9B6E]/30">
            <i className="fa-solid fa-suitcase text-[#0B9B6E]"></i>
            <span>PERSONAL TRAVEL COMMAND CENTER</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#152238] dark:text-white font-heading tracking-tight">
            My Trips & Bookings
          </h1>

          <p className="text-sm sm:text-base text-[#4A5C6E] dark:text-[#9AB0A4] max-w-xl">
            Live itineraries, verified local hosts, start-tour OTPs, and booking records.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* ══════════════════════════════════════════════════
            1. UPCOMING TRIP AS PRIMARY VISUAL ELEMENT
            ══════════════════════════════════════════════════ */}
        {activeTrip ? (
          <div className="bg-gradient-to-br from-[#07543F] to-[#152238] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#0B9B6E]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-8 space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-emerald-300 text-xs font-black uppercase tracking-wider backdrop-blur-xs">
                    ● UPCOMING TRIP • ACTIVE ITINERARY
                  </span>
                  <span className="text-xs text-white/70">Booking ID: {activeTrip.id}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-black font-heading leading-tight">
                  Guided Tour with {activeTrip.guideName}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-xs border border-white/15">
                    <span className="text-[10px] text-white/60 uppercase font-bold block">Date & Time</span>
                    <span className="font-extrabold text-sm text-white">{activeTrip.date} • {activeTrip.startTime || '09:00 AM'}</span>
                  </div>

                  <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-xs border border-white/15">
                    <span className="text-[10px] text-white/60 uppercase font-bold block">Duration & Guests</span>
                    <span className="font-extrabold text-sm text-white">{activeTrip.durationHours || 3} Hours • {activeTrip.travelersCount} Guests</span>
                  </div>

                  <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-xs border border-white/15">
                    <span className="text-[10px] text-white/60 uppercase font-bold block">Meeting Point</span>
                    <span className="font-extrabold text-sm text-white truncate block">{activeTrip.meetingPoint || 'Amer Fort Gate'}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleComplete(activeTrip.id, activeTrip.guideName)}
                    className="btn-primary text-xs px-5 py-2.5"
                  >
                    <i className="fa-solid fa-check"></i>
                    <span>Mark Tour Completed</span>
                  </button>

                  <button
                    onClick={() => handleCancel(activeTrip.id, activeTrip.guideName)}
                    className="px-4 py-2.5 text-xs font-bold text-rose-300 hover:text-white bg-white/10 rounded-full border border-white/20 transition-colors"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>

              {/* OTP Callout Box */}
              <div className="lg:col-span-4 bg-white/95 text-[#152238] p-6 rounded-2xl shadow-xl text-center space-y-2 backdrop-blur-md">
                <span className="text-[10px] text-[#8A9BAD] uppercase font-black tracking-widest block">
                  START-TOUR OTP
                </span>
                <div className="text-4xl font-black text-[#F4A340] font-heading tracking-widest py-1">
                  {activeTrip.startOtp || '4821'}
                </div>
                <p className="text-[11px] text-[#4A5C6E] leading-relaxed">
                  Share this 4-digit code with <strong>{activeTrip.guideName}</strong> only upon meeting in person.
                </p>
                <div className="pt-2 border-t border-[#E0E8E4] flex justify-between text-xs font-bold text-[#152238]">
                  <span>Total Fare:</span>
                  <span className="text-[#0B9B6E]">₹{activeTrip.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#162019] p-8 sm:p-12 rounded-3xl border border-[#E0E8E4] dark:border-[#243028] text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#E8F7F1] dark:bg-[#07543F]/30 text-[#0B9B6E] flex items-center justify-center mx-auto text-2xl">
              <i className="fa-solid fa-compass"></i>
            </div>
            <h2 className="text-2xl font-black text-[#152238] dark:text-white font-heading">
              No upcoming trips scheduled
            </h2>
            <p className="text-xs sm:text-sm text-[#8A9BAD] max-w-md mx-auto">
              Ready to explore India like a resident? Discover background-verified local guides and book with fair price protection.
            </p>
            <div className="pt-2">
              <NavLink to="/guides" className="btn-primary text-xs px-6 py-3">
                <span>Browse Verified Guides</span>
                <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </NavLink>
            </div>
          </div>
        )}


        {/* ══════════════════════════════════════════════════
            2. BOOKINGS TAB SWITCHER & LIST
            ══════════════════════════════════════════════════ */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E0E8E4] dark:border-[#243028] pb-4">
            <div className="flex items-center gap-2">
              {[
                { id: 'upcoming', label: 'Upcoming', count: upcomingBookings.length },
                { id: 'completed', label: 'Completed', count: completedBookings.length },
                { id: 'cancelled', label: 'Cancelled', count: cancelledBookings.length },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                    tab === t.id
                      ? 'bg-[#152238] text-white border-[#152238] shadow-sm'
                      : 'bg-white dark:bg-[#162019] text-[#4A5C6E] dark:text-[#9AB0A4] border-[#E0E8E4] dark:border-[#243028]'
                  }`}
                >
                  {t.label} ({t.count})
                </button>
              ))}
            </div>

            <span className="text-xs text-[#8A9BAD] hidden sm:inline-block">
              {currentTabBookings.length} booking records found
            </span>
          </div>

          {currentTabBookings.length > 0 && (
            <div className="space-y-4">
              {currentTabBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white dark:bg-[#162019] p-5 sm:p-6 rounded-2xl border border-[#E0E8E4] dark:border-[#243028] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={b.guideAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}
                      alt={b.guideName}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-[#0B9B6E]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-base text-[#152238] dark:text-white font-heading">
                          {b.guideName}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F7F1] dark:bg-[#07543F]/30 text-[#07543F] dark:text-[#4ADE80]">
                          {b.status}
                        </span>
                      </div>
                      <div className="text-xs text-[#8A9BAD] mt-0.5">
                        {b.date} • {b.startTime || '09:00 AM'} • {b.durationHours || 3}h • {b.travelersCount} Guests
                      </div>
                      <div className="text-xs text-[#4A5C6E] dark:text-[#9AB0A4] mt-1 flex items-center gap-1">
                        <i className="fa-solid fa-location-dot text-[#0B9B6E] text-[10px]"></i>
                        <span>{b.meetingPoint || 'Jaipur'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                    <div>
                      <span className="text-[10px] text-[#8A9BAD] uppercase font-bold block">Fare</span>
                      <span className="text-xl font-black text-[#152238] dark:text-white font-heading">
                        ₹{b.totalAmount}
                      </span>
                    </div>

                    {b.status === 'Confirmed' && (
                      <span className="text-xs font-black text-[#F4A340] tracking-wider">
                        OTP: {b.startOtp}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


        {/* ══════════════════════════════════════════════════
            3. SAVED GUIDES & EXPERIENCES MODULES
            ══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Saved Guides */}
          <div className="bg-white dark:bg-[#162019] p-6 sm:p-8 rounded-3xl border border-[#E0E8E4] dark:border-[#243028] shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-lg text-[#152238] dark:text-white font-heading flex items-center gap-2">
                <i className="fa-solid fa-bookmark text-[#0B9B6E]"></i>
                <span>Saved Local Guides</span>
              </h3>
              <NavLink to="/guides" className="text-xs font-bold text-[#07543F] dark:text-[#4ADE80] hover:underline">
                Explore More &rarr;
              </NavLink>
            </div>

            <div className="space-y-3">
              {JAIPUR_GUIDES_DATA.slice(0, 2).map((g) => (
                <div
                  key={g.id}
                  className="p-3.5 rounded-2xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={g.avatar}
                      alt={g.name}
                      className="w-12 h-12 rounded-xl object-cover border border-[#0B9B6E]"
                    />
                    <div>
                      <NavLink
                        to={`/guides/${g.id}`}
                        className="font-black text-sm text-[#152238] dark:text-white hover:text-[#0B9B6E] font-heading block"
                      >
                        {g.name}
                      </NavLink>
                      <StarRating rating={g.rating} />
                    </div>
                  </div>

                  <span className="font-extrabold text-xs text-[#152238] dark:text-white">
                    ₹{g.hourlyRate}/hr
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="bg-white dark:bg-[#162019] p-6 sm:p-8 rounded-3xl border border-[#E0E8E4] dark:border-[#243028] shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-lg text-[#152238] dark:text-white font-heading flex items-center gap-2">
                <i className="fa-solid fa-clock-rotate-left text-[#F4A340]"></i>
                <span>Recent Platform Activity</span>
              </h3>
              <span className="text-[10px] text-[#8A9BAD] font-bold">Audit Log</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] flex items-start gap-2.5">
                <i className="fa-solid fa-circle-check text-[#0B9B6E] mt-0.5"></i>
                <div>
                  <span className="font-bold text-[#152238] dark:text-white">Account Aadhaar Security Verified</span>
                  <div className="text-[10px] text-[#8A9BAD]">Traveler profile active with 24/7 SOS protection.</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] flex items-start gap-2.5">
                <i className="fa-solid fa-shield-halved text-[#0B9B6E] mt-0.5"></i>
                <div>
                  <span className="font-bold text-[#152238] dark:text-white">Fair Price Shield Consulted</span>
                  <div className="text-[10px] text-[#8A9BAD]">Checked standard RTO rates for Jaipur metropolitan routes.</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default TripsPage;
