import React, { useState } from 'react';
import { useBookingStore } from '../store/useBookingStore';
import { useToastStore } from '../store/useToastStore';
import { NavLink } from 'react-router-dom';

export const TripsPage: React.FC = () => {
  const [tab, setTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  
  const { userBookings, cancelBooking, completeBooking } = useBookingStore();
  const showToast = useToastStore((state) => state.showToast);

  const filteredBookings = userBookings.filter((b) => {
    if (tab === 'upcoming') {
      return b.status === 'Pending' || b.status === 'Confirmed';
    } else if (tab === 'completed') {
      return b.status === 'Completed';
    } else {
      return b.status === 'Cancelled';
    }
  });

  const handleCancel = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to cancel your booking with ${name}?`)) {
      cancelBooking(id);
      showToast({
        type: 'info',
        title: 'Booking Cancelled',
        message: `Your booking with ${name} has been cancelled.`
      });
    }
  };

  const handleComplete = (id: string, name: string) => {
    completeBooking(id);
    showToast({
      type: 'success',
      title: 'Tour Completed! 🎉',
      message: `Your tour with ${name} has been marked completed.`
    });
  };

  const handleRate = (id: string, name: string) => {
    showToast({
      type: 'success',
      title: 'Review Submitted',
      message: `Thank you for rating your experience with ${name}!`
    });
  };

  return (
    <div className="space-y-8 text-left font-sans">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-orange-500">
            TRAVELER DASHBOARD
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            My Trips & Bookings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Manage upcoming local guide tours, start OTPs, and completed itineraries.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center bg-slate-50 dark:bg-slate-900 p-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold">
          {[
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'completed', label: 'Completed' },
            { key: 'cancelled', label: 'Cancelled' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key as any)}
              className={`px-4 py-2 rounded-full transition capitalize ${
                tab === key
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {label} ({userBookings.filter(b => key === 'upcoming' ? (b.status === 'Pending' || b.status === 'Confirmed') : b.status.toLowerCase() === key).length})
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-700 space-y-4">
            <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-slate-700 text-orange-500 flex items-center justify-center mx-auto text-2xl">
              <i className="fa-solid fa-suitcase"></i>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                No {tab} bookings found
              </h3>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">
                Explore our background-verified local hosts across Jaipur and book your authentic experience today.
              </p>
            </div>
            <NavLink
              to="/guides"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-full text-xs transition shadow-md shadow-orange-500/20 uppercase tracking-wider"
            >
              <i className="fa-solid fa-user-check"></i>
              <span>Find a Local Guide</span>
            </NavLink>
          </div>
        ) : (
          filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-6 shadow-card hover:shadow-floating transition duration-300 space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/80 pb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={b.guideAvatar}
                    alt={b.guideName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400">ID: {b.id}</span>
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${
                          b.status === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-300'
                            : b.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-300'
                            : b.status === 'Completed'
                            ? 'bg-sky-50 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400 border-sky-300'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border-rose-300'
                        }`}
                      >
                        {b.status === 'Pending' ? '● Pending Host Confirmation' : b.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-white text-lg font-heading">
                      Tour with {b.guideName}
                    </h3>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block leading-none">Total Fare</span>
                  <span className="text-xl font-extrabold text-orange-600 dark:text-orange-400">
                    ₹{b.totalAmount}
                  </span>
                </div>
              </div>

              {/* Trip Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/60">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Date & Time</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{b.date} • {b.startTime}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Duration & Guests</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{b.durationHours} Hours • {b.travelersCount} Guest(s)</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Meeting Location</span>
                  <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                    <i className="fa-solid fa-location-dot text-orange-500"></i> {b.meetingPoint}
                  </span>
                </div>
              </div>

              {/* Active OTP Callout for Upcoming Bookings */}
              {(b.status === 'Pending' || b.status === 'Confirmed') && (
                <div className="bg-amber-50 dark:bg-amber-500/10 p-4 rounded-2xl border border-amber-200 dark:border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg font-bold">
                      <i className="fa-solid fa-key"></i>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-extrabold text-amber-700 dark:text-amber-300">
                        Start-Tour Verification OTP
                      </div>
                      <div className="text-xl font-black text-amber-600 dark:text-amber-400 tracking-widest font-heading">
                        {b.startOtp}
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-amber-700 dark:text-amber-300/80 text-left sm:text-right max-w-xs">
                    Share this 4-digit code with {b.guideName} when they arrive at the meeting point.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                {(b.status === 'Pending' || b.status === 'Confirmed') && (
                  <>
                    <button
                      onClick={() => handleCancel(b.id, b.guideName)}
                      className="px-4 py-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 font-bold rounded-full text-xs transition border border-rose-200 dark:border-rose-500/30"
                    >
                      Cancel Booking
                    </button>
                    {b.status === 'Confirmed' && (
                      <button
                        onClick={() => handleComplete(b.id, b.guideName)}
                        className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-full text-xs transition shadow-xs"
                      >
                        Mark Tour Completed ✓
                      </button>
                    )}
                  </>
                )}

                {b.status === 'Completed' && (
                  <button
                    onClick={() => handleRate(b.id, b.guideName)}
                    className="px-5 py-2.5 bg-slate-50 dark:bg-slate-700 hover:bg-orange-500 hover:text-white text-orange-600 dark:text-orange-400 font-bold rounded-full text-xs transition border border-slate-200 dark:border-slate-600 flex items-center gap-1.5"
                  >
                    <i className="fa-solid fa-star text-amber-500"></i> Rate Guide & Review
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

