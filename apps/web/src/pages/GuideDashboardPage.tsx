import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useGuideStore } from '../store/useGuideStore';
import { useBookingStore, TouristBooking } from '../store/useBookingStore';
import { useToastStore } from '../store/useToastStore';
import { PackageCreatorModal } from '../components/modals/PackageCreatorModal';
import { RequestDetailsModal } from '../components/modals/RequestDetailsModal';

export const GuideDashboardPage: React.FC = () => {
  const { online, toggleOnline, packages, openCreatePackageModal, openIncomingRequestModal } = useGuideStore();
  const { userBookings, acceptBooking, cancelBooking } = useBookingStore();
  const showToast = useToastStore((state) => state.showToast);

  // Host Selector State (Priya Sharma vs Vikram Singh Rathore)
  const [currentHost, setCurrentHost] = useState<'Priya' | 'Vikram'>('Priya');
  
  // Dashboard Tab Navigation State
  const [activeTab, setActiveTab] = useState<'requests' | 'upcoming' | 'completed' | 'earnings' | 'reviews' | 'availability' | 'profile'>('requests');

  // Selected Booking for Details Modal
  const [selectedBooking, setSelectedBooking] = useState<TouristBooking | null>(null);

  // Host Availability Settings State
  const [availableDays, setAvailableDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  const [workingHours, setWorkingHours] = useState('08:00 AM - 07:00 PM');

  // Toggle host status
  const handleToggleOnline = () => {
    toggleOnline();
    showToast({
      type: online ? 'info' : 'success',
      title: online ? 'Radar Status: Offline' : 'Radar Status: Online ✓',
      message: online
        ? 'You are currently not receiving tourist booking requests.'
        : 'You are now live on the Jaipur guide radar to receive incoming requests.'
    });
  };

  const handleAcceptRequest = (id: string) => {
    acceptBooking(id);
    showToast({
      type: 'success',
      title: 'Booking Request Accepted! ✓',
      message: 'The tourist has been notified. Check trip details below.'
    });
  };

  const handleDeclineRequest = (id: string) => {
    cancelBooking(id);
    showToast({
      type: 'info',
      title: 'Booking Declined',
      message: 'The booking request was declined.'
    });
  };

  const toggleDay = (day: string) => {
    if (availableDays.includes(day)) {
      setAvailableDays(availableDays.filter((d) => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  // Relevant tourist requests for current active guide profile
  const guideName = currentHost === 'Priya' ? 'Priya Sharma' : 'Vikram Singh Rathore';
  const guideRequests = userBookings;

  const pendingRequests = guideRequests.filter((r) => r.status === 'Pending');
  const upcomingBookings = guideRequests.filter((r) => r.status === 'Confirmed');
  const completedBookings = guideRequests.filter((r) => r.status === 'Completed');

  // Computed Metrics
  const todayBookingsCount = pendingRequests.length + upcomingBookings.length;
  const upcomingBookingsCount = upcomingBookings.length;
  const totalEarningsAmount = 18450 + completedBookings.reduce((sum, b) => sum + b.hourlySubtotal, 0);
  const todayEarningsAmount = upcomingBookings.reduce((sum, b) => sum + b.hourlySubtotal, 0);

  return (
    <div className="space-y-8 text-left font-sans pb-16">
      
      {/* HEADER & WELCOME DASHBOARD BANNER */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-extrabold border border-emerald-200 dark:border-emerald-500/20">
              <i className="fa-solid fa-circle-check text-xs"></i> Verified Local Guide Account
            </span>

            {/* Quick Host Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-full text-[11px] font-bold">
              <button
                onClick={() => setCurrentHost('Priya')}
                className={`px-3 py-1 rounded-full transition ${
                  currentHost === 'Priya' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-500'
                }`}
              >
                Priya S.
              </button>
              <button
                onClick={() => setCurrentHost('Vikram')}
                className={`px-3 py-1 rounded-full transition ${
                  currentHost === 'Vikram' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-500'
                }`}
              >
                Vikram R.
              </button>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
            Good Morning, {currentHost} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            Here is your live tour activity, earnings, and upcoming bookings for <span className="font-bold text-orange-600 dark:text-orange-400">{guideName}</span>.
          </p>
        </div>

        {/* Radar Status & Create Tour Package Button */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <NavLink
            to="/guide/create-tour"
            className="px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-full text-xs transition shadow-md shadow-emerald-500/20 flex items-center gap-2 uppercase tracking-wider"
          >
            <i className="fa-solid fa-plus text-xs"></i> Create Tour Package
          </NavLink>

          <button
            onClick={openIncomingRequestModal}
            className="px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full text-xs transition shadow-md shadow-orange-500/20 flex items-center gap-2 uppercase tracking-wider"
          >
            <i className="fa-solid fa-bell"></i> Test Request Ping
          </button>

          <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div>
              <div className="text-[10px] uppercase font-extrabold text-slate-400">Radar Status</div>
              <div className={`text-xs font-black ${online ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                {online ? 'ONLINE ●' : 'OFFLINE ●'}
              </div>
            </div>
            <button
              onClick={handleToggleOnline}
              className={`w-12 h-7 rounded-full p-1 transition-colors relative focus:outline-none ${
                online ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform transform shadow-md ${
                  online ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>
        </div>
      </div>

      {/* 5 KEY METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1: Today's Bookings */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-1">
          <div className="text-[10px] text-slate-400 font-extrabold uppercase">Today's Bookings</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading">
            {todayBookingsCount}
          </div>
          <div className="text-[10px] text-orange-600 dark:text-orange-400 font-semibold">
            {pendingRequests.length} pending action
          </div>
        </div>

        {/* Metric 2: Upcoming Bookings */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-1">
          <div className="text-[10px] text-slate-400 font-extrabold uppercase">Upcoming Bookings</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-heading">
            {upcomingBookingsCount}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold">Confirmed tours</div>
        </div>

        {/* Metric 3: Total Earnings */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-1">
          <div className="text-[10px] text-slate-400 font-extrabold uppercase">Total Earnings</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-heading">
            ₹{totalEarningsAmount.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold">+14% this month</div>
        </div>

        {/* Metric 4: Average Rating */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-1">
          <div className="text-[10px] text-slate-400 font-extrabold uppercase">Average Rating</div>
          <div className="text-2xl sm:text-3xl font-black text-amber-500 font-heading">
            {currentHost === 'Priya' ? '4.98' : '4.95'} ★
          </div>
          <div className="text-[10px] text-slate-500 font-medium">100% 5-Star Verified</div>
        </div>

        {/* Metric 5: Profile Views */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-1 col-span-2 lg:col-span-1">
          <div className="text-[10px] text-slate-400 font-extrabold uppercase">Profile Views</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading">
            1,240
          </div>
          <div className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold">Jaipur radar searches</div>
        </div>
      </div>

      {/* DASHBOARD TABBED WORKSPACE */}
      <div className="space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-700">
          {[
            { key: 'requests', label: 'Booking Requests', count: pendingRequests.length, icon: 'fa-solid fa-inbox' },
            { key: 'upcoming', label: 'Upcoming', count: upcomingBookings.length, icon: 'fa-solid fa-calendar-check' },
            { key: 'completed', label: 'Completed', count: completedBookings.length, icon: 'fa-solid fa-circle-check' },
            { key: 'earnings', label: 'Earnings', icon: 'fa-solid fa-wallet' },
            { key: 'reviews', label: 'Reviews', icon: 'fa-solid fa-star' },
            { key: 'availability', label: 'Availability', icon: 'fa-solid fa-clock' },
            { key: 'profile', label: 'Profile & KYC', icon: 'fa-solid fa-id-card' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-100 dark:border-slate-700'
              }`}
            >
              <i className={tab.icon}></i>
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-black">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: BOOKING REQUESTS */}
        {activeTab === 'requests' && (
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-500">INBOUND REQUESTS</span>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                  Tourist Booking Requests ({guideRequests.length})
                </h2>
                <p className="text-slate-500 text-xs">Review and accept tour requests from tourists.</p>
              </div>
            </div>

            <div className="space-y-4">
              {guideRequests.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="text-slate-400 text-xl"><i className="fa-solid fa-inbox"></i></div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300">No active booking requests</div>
                  <p className="text-xs text-slate-500">Toggle your status Online to receive instant requests.</p>
                </div>
              ) : (
                guideRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white">Request #{req.id}</span>
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${
                            req.status === 'Confirmed'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-300'
                              : req.status === 'Pending'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-300'
                              : req.status === 'Completed'
                              ? 'bg-sky-50 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400 border-sky-300'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border-rose-300'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                        <div>
                          <i className="fa-solid fa-user text-orange-500 mr-1.5"></i>
                          <span>Assigned Host: <strong>{req.guideName}</strong> • {req.travelersCount} Tourist(s)</span>
                        </div>
                        <div>
                          <i className="fa-solid fa-calendar-day text-amber-500 mr-1.5"></i>
                          <span>Date & Time: <strong>{req.date} at {req.startTime}</strong> ({req.durationHours} Hours)</span>
                        </div>
                        <div>
                          <i className="fa-solid fa-location-dot text-emerald-500 mr-1.5"></i>
                          <span>Meeting Point: <strong>{req.meetingPoint}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-end md:items-center gap-3 w-full md:w-auto border-t md:border-t-0 border-slate-200 dark:border-slate-700 pt-3 md:pt-0">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block leading-none">Net Payout</span>
                        <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                          ₹{req.hourlySubtotal}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => setSelectedBooking(req)}
                          className="px-3.5 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 font-bold rounded-full text-xs transition"
                        >
                          Details
                        </button>

                        {req.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleDeclineRequest(req.id)}
                              className="px-3.5 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold rounded-full text-xs transition border border-rose-200 dark:border-rose-500/30"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleAcceptRequest(req.id)}
                              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-full text-xs transition shadow-md shadow-emerald-500/20"
                            >
                              Accept ✓
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: UPCOMING BOOKINGS */}
        {activeTab === 'upcoming' && (
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-6">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
              Confirmed Upcoming Tours ({upcomingBookings.length})
            </h2>

            {upcomingBookings.length === 0 ? (
              <p className="text-xs text-slate-500">No confirmed upcoming tours. Accept pending requests to populate.</p>
            ) : (
              upcomingBookings.map((b) => (
                <div key={b.id} className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Trip #{b.id}</span>
                    <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Confirmed ✓</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <div><strong>Date & Time:</strong> {b.date} at {b.startTime} ({b.durationHours} hrs)</div>
                    <div><strong>Meeting Location:</strong> {b.meetingPoint}</div>
                    <div><strong>Start OTP Code:</strong> <span className="font-extrabold text-amber-600 font-heading text-sm">{b.startOtp}</span></div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: COMPLETED BOOKINGS */}
        {activeTab === 'completed' && (
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-6">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
              Completed Tours History
            </h2>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <div className="flex justify-between font-bold">
                <span>Amer Fort Heritage Walk (Sarah J.)</span>
                <span className="text-emerald-600">₹1,350 Payout</span>
              </div>
              <p className="text-[11px] text-slate-400">Completed Yesterday • 5-Star Review Received ★★★★★</p>
            </div>
          </div>
        )}

        {/* TAB 4: EARNINGS HUB */}
        {activeTab === 'earnings' && (
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-6">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
              Earnings & Payout Breakdown
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Today's Earnings</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-heading">₹{todayEarningsAmount}</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">This Week's Earnings</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-heading">₹5,400</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Lifetime Earnings</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-heading">₹{totalEarningsAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: REVIEWS CENTER */}
        {activeTab === 'reviews' && (
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
              Traveler Reviews & Feedback
            </h2>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="font-bold text-slate-900 dark:text-white">Sarah Jenkins (UK)</span>
                <span className="text-amber-500 font-bold">★★★★★ 5.0</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 italic">"Unbelievable guide! Secret passages in Amer Fort were mind-blowing."</p>
            </div>
          </div>
        )}

        {/* TAB 6: AVAILABILITY MANAGER */}
        {activeTab === 'availability' && (
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-6">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
              Host Availability & Working Hours
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Available Days</label>
                <div className="flex flex-wrap gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                        availableDays.includes(day)
                          ? 'bg-orange-500 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-900 text-slate-500'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Working Hours</label>
                <select
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  className="w-full sm:w-64 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="08:00 AM - 07:00 PM">08:00 AM - 07:00 PM (Full Day)</option>
                  <option value="07:00 AM - 02:00 PM">07:00 AM - 02:00 PM (Morning Shift)</option>
                  <option value="02:00 PM - 08:00 PM">02:00 PM - 08:00 PM (Afternoon Shift)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: PROFILE & KYC VERIFICATION */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-6">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
              Government KYC & Partner Credentials
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Aadhaar Identity</div>
                  <div className="text-emerald-600 font-bold mt-1">✓ Authenticated</div>
                </div>
                <i className="fa-solid fa-id-card text-2xl text-slate-400"></i>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Tourism License</div>
                  <div className="text-emerald-600 font-bold mt-1">✓ Active</div>
                </div>
                <i className="fa-solid fa-file-contract text-2xl text-slate-400"></i>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Police Clearance</div>
                  <div className="text-emerald-600 font-bold mt-1">✓ Approved</div>
                </div>
                <i className="fa-solid fa-user-shield text-2xl text-slate-400"></i>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Package Creator Modal */}
      <PackageCreatorModal />

      {/* Request Details Modal */}
      <RequestDetailsModal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        booking={selectedBooking}
        onAccept={handleAcceptRequest}
        onDecline={handleDeclineRequest}
      />
    </div>
  );
};

export default GuideDashboardPage;
