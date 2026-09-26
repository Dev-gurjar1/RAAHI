import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useGuideStore } from '../store/useGuideStore';
import { useTourStore } from '../store/useTourStore';
import { useBookingStore } from '../store/useBookingStore';
import { useToastStore } from '../store/useToastStore';
import { useAuthStore } from '../store/useAuthStore';
import { getTourDisplayPricing, getGuideDisplayPricing } from '../utils/pricing';
import api from '../services/api';

export const GuideDashboardPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get('tab') || 'requests';

  const { online, toggleOnline } = useGuideStore();
  const { tours = [], duplicateTour, deleteTour, updateTourStatus, fetchToursFromBackend } = useTourStore();
  const { userBookings, acceptBooking, cancelBooking } = useBookingStore();
  const { user } = useAuthStore();
  const showToast = useToastStore((state) => state.showToast);

  const [activeTab, setActiveTab] = useState(requestedTab);
  const [tourSubTab, setTourSubTab] = useState('PUBLISHED'); // PUBLISHED, DRAFT, PENDING_REVIEW, PAUSED

  // Host Selector State
  const [currentHost, setCurrentHost] = useState('Vikram');

  // Guide Pricing Configuration State
  const [pricingType, setPricingType] = useState('HOURLY');
  const [startingPrice, setStartingPrice] = useState(300);
  const [hourlyRate, setHourlyRate] = useState(350);
  const [pricePerPerson, setPricePerPerson] = useState(400);
  const [pricePerGroup, setPricePerGroup] = useState(1200);
  const [fixedTripPrice, setFixedTripPrice] = useState(1400);
  const [fixedTripDuration, setFixedTripDuration] = useState(4);
  const [customPricingDesc, setCustomPricingDesc] = useState('Half-day royal fortress exploration with private audio equipment');
  const [guideCategoryType, setGuideCategoryType] = useState('PROFESSIONAL_GUIDE');

  // Fetch tours on load
  useEffect(() => {
    if (fetchToursFromBackend) {
      fetchToursFromBackend();
    }
  }, [fetchToursFromBackend]);

  // Sync tab with URL
  useEffect(() => {
    if (searchParams.get('tab') && searchParams.get('tab') !== activeTab) {
      setActiveTab(searchParams.get('tab'));
    }
  }, [searchParams, activeTab]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setSearchParams({ tab: tabKey });
  };

  const handleToggleOnline = () => {
    toggleOnline();
    showToast({
      type: online ? 'info' : 'success',
      title: online ? 'Radar Status: Offline' : 'Radar Status: Live ✓',
      message: online
        ? 'You are currently not receiving instant tourist booking requests.'
        : 'You are now live on the tourist radar to receive incoming requests.'
    });
  };

  const handleAcceptRequest = (id) => {
    acceptBooking(id);
    showToast({
      type: 'success',
      title: 'Booking Request Accepted! ✓',
      message: 'The tourist has been notified. Trip details are confirmed.'
    });
  };

  const handleDeclineRequest = (id) => {
    cancelBooking(id);
    showToast({
      type: 'info',
      title: 'Booking Request Declined',
      message: 'The booking request was removed.'
    });
  };

  // Tour management actions
  const handleDuplicateTour = async (id) => {
    await duplicateTour(id);
    showToast({
      type: 'success',
      title: 'Tour Duplicated! 📋',
      message: 'A duplicate draft copy has been created in your Drafts tab.'
    });
    setTourSubTab('DRAFT');
  };

  const handleTogglePause = async (tour) => {
    const nextStatus = tour.status === 'PAUSED' ? 'PUBLISHED' : 'PAUSED';
    await updateTourStatus(tour.id || tour.tourId, nextStatus);
    showToast({
      type: 'info',
      title: nextStatus === 'PAUSED' ? 'Tour Paused ⏸' : 'Tour Re-activated ▶',
      message: nextStatus === 'PAUSED'
        ? 'Tour is temporarily hidden from tourists.'
        : 'Tour is now published and live on the marketplace.'
    });
  };

  const handleDeleteTour = async (id) => {
    if (window.confirm('Are you sure you want to delete or archive this tour?')) {
      await deleteTour(id);
      showToast({
        type: 'info',
        title: 'Tour Archived',
        message: 'The tour has been removed from active listings.'
      });
    }
  };

  const handleSavePricing = async (e) => {
    e.preventDefault();
    try {
      await api.guides.updatePricing(user?.id || 'g1', {
        pricingType,
        startingPrice,
        hourlyRate,
        pricePerPerson,
        pricePerGroup,
        fixedTripPrice,
        fixedTripDuration,
        customPricingDescription: customPricingDesc,
        guideType: guideCategoryType
      });
    } catch (err) {
      console.warn('Backend pricing update sync notice:', err.message);
    }

    showToast({
      type: 'success',
      title: 'Pricing Model Updated! 💰',
      message: `Your profile now charges ${
        pricingType === 'HOURLY' ? `₹${hourlyRate}/hr (Starting from ₹${startingPrice}/hr)`
        : pricingType === 'PER_PERSON' ? `₹${pricePerPerson}/person`
        : pricingType === 'PER_GROUP' ? `₹${pricePerGroup}/group`
        : `₹${fixedTripPrice} fixed trip (${fixedTripDuration} hrs)`
      }. Travelers will see total prices first.`
    });
  };

  // Filter tours by current guide & subtab
  const currentGuideTours = tours.filter((t) => {
    if (tourSubTab === 'ALL') return true;
    return (t.status || 'PUBLISHED').toUpperCase() === tourSubTab.toUpperCase();
  });

  // Tourist requests
  const pendingRequests = userBookings.filter((r) => r.status === 'Pending');
  const upcomingBookings = userBookings.filter((r) => r.status === 'Confirmed');
  const completedBookings = userBookings.filter((r) => r.status === 'Completed');
  const totalEarningsAmount = 18450 + completedBookings.reduce((sum, b) => sum + (b.hourlySubtotal || b.totalAmount || 0), 0);

  return (
    <div className="text-left font-sans bg-[#F8F7F3] dark:bg-[#0D1710] min-h-screen pb-20">

      {/* Page Header */}
      <div className="bg-white dark:bg-[#111C15] border-b border-[#E0E8E4] dark:border-[#243028]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">

            {/* Left: Info */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F7F1] dark:bg-[#07543F]/30 text-[#07543F] dark:text-[#4ADE80] border border-[#0B9B6E]/30">
                  <i className="fa-solid fa-circle-check text-xs"></i>
                  <span>Verified Local Provider Account</span>
                </span>
                <span className="text-xs text-[#8A9BAD] font-bold">
                  ID: RA-GUIDE-8820
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-[#152238] dark:text-white font-heading">
                Provider Management Workspace
              </h1>
            </div>

            {/* Right: + Create Tour CTA & Live Status */}
            <div className="flex flex-wrap items-center gap-3">
              <NavLink
                to="/guide/create-tour"
                className="px-4 py-2.5 rounded-full bg-[#0B9B6E] hover:bg-[#07543F] text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-plus text-xs"></i>
                <span>+ Create Tour</span>
              </NavLink>

              <button
                onClick={handleToggleOnline}
                className={`px-4 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 border cursor-pointer ${
                  online
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                <span>{online ? 'Live on Radar' : 'Offline'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* 5 KEY METRICS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-[#162019] p-5 rounded-2xl border border-[#E0E8E4] dark:border-[#243028] shadow-sm space-y-1">
            <div className="text-[10px] text-[#8A9BAD] font-bold uppercase">Pending Requests</div>
            <div className="text-2xl sm:text-3xl font-black text-[#152238] dark:text-white font-heading">{pendingRequests.length}</div>
            <div className="text-[10px] text-[#F4A340] font-semibold">Requires confirmation</div>
          </div>

          <div className="bg-white dark:bg-[#162019] p-5 rounded-2xl border border-[#E0E8E4] dark:border-[#243028] shadow-sm space-y-1">
            <div className="text-[10px] text-[#8A9BAD] font-bold uppercase">My Tours</div>
            <div className="text-2xl sm:text-3xl font-black text-[#0B9B6E] font-heading">{tours.length}</div>
            <div className="text-[10px] text-[#0B9B6E] font-semibold">{tours.filter(t => t.status === 'PUBLISHED').length} live published</div>
          </div>

          <div className="bg-white dark:bg-[#162019] p-5 rounded-2xl border border-[#E0E8E4] dark:border-[#243028] shadow-sm space-y-1">
            <div className="text-[10px] text-[#8A9BAD] font-bold uppercase">Total Earnings</div>
            <div className="text-2xl sm:text-3xl font-black text-[#0B9B6E] font-heading">₹{totalEarningsAmount.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-[#0B9B6E] font-semibold">+18% this month</div>
          </div>

          <div className="bg-white dark:bg-[#162019] p-5 rounded-2xl border border-[#E0E8E4] dark:border-[#243028] shadow-sm space-y-1">
            <div className="text-[10px] text-[#8A9BAD] font-bold uppercase">Rating & Trust</div>
            <div className="text-2xl sm:text-3xl font-black text-[#F4A340] font-heading">4.95 ★</div>
            <div className="text-[10px] text-[#8A9BAD] font-medium">100% Verified Reviews</div>
          </div>

          <div className="bg-white dark:bg-[#162019] p-5 rounded-2xl border border-[#E0E8E4] dark:border-[#243028] shadow-sm space-y-1 col-span-2 lg:col-span-1">
            <div className="text-[10px] text-[#8A9BAD] font-bold uppercase">Pricing Model</div>
            <div className="text-xl sm:text-2xl font-black text-[#152238] dark:text-white font-heading truncate">
              {pricingType === 'HOURLY' ? `₹${hourlyRate}/hr` : pricingType === 'PER_PERSON' ? `₹${pricePerPerson}/p` : `₹${fixedTripPrice} trip`}
            </div>
            <div className="text-[10px] text-[#0B9B6E] font-semibold">Total prioritized</div>
          </div>
        </div>

        {/* DASHBOARD TABBED WORKSPACE */}
        <div className="space-y-6">
          
          {/* Navigation Tabs Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#E0E8E4] dark:border-[#243028]">
            {[
              { key: 'tours', label: 'My Tours', count: tours.length, icon: 'fa-solid fa-map-location-dot' },
              { key: 'pricing', label: 'Pricing Model', icon: 'fa-solid fa-tags' },
              { key: 'requests', label: 'Booking Requests', count: pendingRequests.length, icon: 'fa-solid fa-inbox' },
              { key: 'upcoming', label: 'Confirmed Bookings', count: upcomingBookings.length, icon: 'fa-solid fa-calendar-check' },
              { key: 'earnings', label: 'Earnings', icon: 'fa-solid fa-wallet' },
              { key: 'moderation', label: 'Admin Moderation', icon: 'fa-solid fa-gavel' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-[#07543F] text-white shadow-xs'
                    : 'bg-white dark:bg-[#162019] text-[#4A5C6E] dark:text-[#9AB0A4] hover:text-[#152238] dark:hover:text-white border border-[#E0E8E4] dark:border-[#243028]'
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

          {/* ══════════════════════════════════════════════════
              TAB 1: MY TOURS MANAGEMENT (Section 13)
              ══════════════════════════════════════════════════ */}
          {activeTab === 'tours' && (
            <div className="bg-white dark:bg-[#162019] p-6 sm:p-8 rounded-3xl border border-[#E0E8E4] dark:border-[#243028] shadow-sm space-y-6">
              
              {/* Top Bar with Subtabs & + Create Tour Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F1F5F3] dark:border-[#243028] pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#0B9B6E] tracking-wider">PORTFOLIO</span>
                  <h2 className="text-xl sm:text-2xl font-black text-[#152238] dark:text-white font-heading">
                    Manage My Bookable Tours
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <NavLink
                    to="/guide/create-tour"
                    className="btn-primary text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <i className="fa-solid fa-plus text-[10px]"></i>
                    <span>+ Create Tour</span>
                  </NavLink>
                </div>
              </div>

              {/* Subtabs: Published, Drafts, Pending Review, Paused */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                {[
                  { key: 'PUBLISHED', label: 'Published', count: tours.filter(t => (t.status || 'PUBLISHED') === 'PUBLISHED').length },
                  { key: 'DRAFT', label: 'Drafts', count: tours.filter(t => t.status === 'DRAFT').length },
                  { key: 'PENDING_REVIEW', label: 'Pending Review', count: tours.filter(t => t.status === 'PENDING_REVIEW').length },
                  { key: 'PAUSED', label: 'Paused', count: tours.filter(t => t.status === 'PAUSED').length },
                  { key: 'ALL', label: 'All Tours', count: tours.length }
                ].map((st) => (
                  <button
                    key={st.key}
                    onClick={() => setTourSubTab(st.key)}
                    className={`px-3 py-1.5 rounded-full font-bold transition cursor-pointer border ${
                      tourSubTab === st.key
                        ? 'bg-[#E8F7F1] dark:bg-[#07543F]/30 text-[#07543F] dark:text-[#4ADE80] border-[#0B9B6E]/30'
                        : 'bg-[#F8F7F3] dark:bg-[#111C15] text-[#8A9BAD] border-[#E0E8E4] dark:border-[#243028]'
                    }`}
                  >
                    <span>{st.label} ({st.count})</span>
                  </button>
                ))}
              </div>

              {/* Tours Cards List */}
              <div className="space-y-4">
                {currentGuideTours.length === 0 ? (
                  <div className="p-12 text-center bg-[#F8F7F3] dark:bg-[#111C15] rounded-3xl border border-[#E0E8E4] dark:border-[#243028] space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#E8F7F1] text-[#0B9B6E] flex items-center justify-center text-xl mx-auto">
                      <i className="fa-solid fa-map-location-dot"></i>
                    </div>
                    <div className="text-sm font-bold text-[#152238] dark:text-white">No tours in this category</div>
                    <p className="text-xs text-[#8A9BAD] max-w-sm mx-auto">
                      Create a tailored heritage walk, food crawl, or cultural safari to start receiving bookings.
                    </p>
                    <NavLink to="/guide/create-tour" className="btn-primary text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-1.5">
                      <i className="fa-solid fa-plus text-[10px]"></i>
                      <span>Create Your First Tour</span>
                    </NavLink>
                  </div>
                ) : (
                  currentGuideTours.map((tour) => {
                    const pricing = getTourDisplayPricing(tour);
                    const tourId = tour.tourId || tour.id;
                    const isPaused = tour.status === 'PAUSED';

                    return (
                      <div
                        key={tourId}
                        className="p-4 sm:p-5 rounded-2xl border border-[#E0E8E4] dark:border-[#243028] bg-white dark:bg-[#111C15] hover:border-[#0B9B6E]/40 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                      >
                        {/* Left: Thumbnail & Info */}
                        <div className="flex items-start gap-4">
                          <img
                            src={tour.coverImage || tour.image || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&auto=format&fit=crop&q=80'}
                            alt={tour.title}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-[#E0E8E4] dark:border-[#243028]"
                          />
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                                tour.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                                : tour.status === 'PAUSED' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                                : tour.status === 'PENDING_REVIEW' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                                : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                              }`}>
                                {tour.status || 'PUBLISHED'}
                              </span>
                              <span className="text-[11px] font-bold text-[#8A9BAD]">{tour.destination || 'Jaipur'}</span>
                              <span className="text-[11px] font-bold text-[#8A9BAD]">• {tour.duration || '3 Hours'}</span>
                            </div>

                            <h3 className="font-extrabold text-[#152238] dark:text-white text-base font-heading">
                              {tour.title}
                            </h3>

                            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#4A5C6E] dark:text-[#9AB0A4]">
                              <span className="text-[#0B9B6E] font-black">{pricing.primaryPrice}</span>
                              <span>★ {tour.rating || '4.9'} ({tour.reviewCount || 0} reviews)</span>
                              <span>👥 {tour.bookingCount || 0} bookings taken</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
                          <NavLink
                            to={`/tours/${tourId}`}
                            className="px-3 py-1.5 rounded-xl bg-[#F8F7F3] dark:bg-[#162019] text-[#152238] dark:text-white border border-[#E0E8E4] dark:border-[#243028] text-xs font-bold hover:border-[#0B9B6E] transition"
                          >
                            View
                          </NavLink>

                          <NavLink
                            to={`/guide/create-tour?editId=${tourId}`}
                            className="px-3 py-1.5 rounded-xl bg-[#F8F7F3] dark:bg-[#162019] text-[#0B9B6E] border border-[#0B9B6E]/30 text-xs font-bold hover:bg-[#E8F7F1] transition"
                          >
                            Edit
                          </NavLink>

                          <button
                            type="button"
                            onClick={() => handleTogglePause(tour)}
                            className="px-3 py-1.5 rounded-xl bg-[#F8F7F3] dark:bg-[#162019] text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-700 text-xs font-bold transition cursor-pointer"
                          >
                            {isPaused ? 'Resume' : 'Pause'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDuplicateTour(tourId)}
                            className="px-3 py-1.5 rounded-xl bg-[#F8F7F3] dark:bg-[#162019] text-[#4A5C6E] dark:text-[#9AB0A4] border border-[#E0E8E4] dark:border-[#243028] text-xs font-bold transition cursor-pointer"
                            title="Duplicate as draft"
                          >
                            <i className="fa-regular fa-copy"></i>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteTour(tourId)}
                            className="px-3 py-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs font-bold transition cursor-pointer"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              TAB 2: GUIDE PRICING MODEL CONFIGURATION (Section 1 & 3)
              ══════════════════════════════════════════════════ */}
          {activeTab === 'pricing' && (
            <div className="bg-white dark:bg-[#162019] p-6 sm:p-8 rounded-3xl border border-[#E0E8E4] dark:border-[#243028] shadow-sm space-y-6">
              <div className="space-y-1 border-b border-[#F1F5F3] dark:border-[#243028] pb-4">
                <span className="text-[10px] font-extrabold uppercase text-[#0B9B6E] tracking-wider">FLEXIBLE TARIFF ENGINE</span>
                <h2 className="text-xl sm:text-2xl font-black text-[#152238] dark:text-white font-heading">
                  Configure Your Guide Pricing Model
                </h2>
                <p className="text-xs text-[#8A9BAD]">
                  RAAHI does not force a universal ₹500/hour rate. You define your starting rate, trip prices, or hourly fees. Total trip price is displayed first to travelers.
                </p>
              </div>

              <form onSubmit={handleSavePricing} className="space-y-6">
                
                {/* Guide Category Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-extrabold uppercase text-[#4A5C6E] dark:text-[#9AB0A4]">
                    Provider Category
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'PROFESSIONAL_GUIDE', title: 'Professional Guide', sub: 'Licensed Govt / Heritage Historian', typical: 'Starting from ₹300/hr' },
                      { id: 'LOCAL_HOST', title: 'Local Host', sub: 'Resident Storyteller & Foodie', typical: 'Starting from ₹200/hr' },
                      { id: 'STUDENT_LOCAL', title: 'Student Local', sub: 'Youth Perspective & Budget Walks', typical: 'Starting from ₹150/hr' }
                    ].map((gc) => (
                      <button
                        type="button"
                        key={gc.id}
                        onClick={() => setGuideCategoryType(gc.id)}
                        className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                          guideCategoryType === gc.id
                            ? 'bg-[#E8F7F1] dark:bg-[#07543F]/25 border-[#0B9B6E]'
                            : 'bg-[#F8F7F3] dark:bg-[#111C15] border-[#E0E8E4] dark:border-[#243028]'
                        }`}
                      >
                        <div className="font-extrabold text-sm text-[#152238] dark:text-white">{gc.title}</div>
                        <div className="text-[11px] text-[#8A9BAD]">{gc.sub}</div>
                        <div className="text-[10px] font-bold text-[#0B9B6E] mt-2">{gc.typical}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary Pricing Model Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-extrabold uppercase text-[#4A5C6E] dark:text-[#9AB0A4]">
                    Primary Pricing Model
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { key: 'HOURLY', label: 'Hourly Rate', icon: 'fa-clock' },
                      { key: 'FIXED_TRIP', label: 'Fixed Trip', icon: 'fa-suitcase' },
                      { key: 'PER_PERSON', label: 'Per Person', icon: 'fa-user' },
                      { key: 'PER_GROUP', label: 'Per Group', icon: 'fa-users' },
                      { key: 'CUSTOM', label: 'Custom Tour', icon: 'fa-wand-magic-sparkles' }
                    ].map((pm) => (
                      <button
                        type="button"
                        key={pm.key}
                        onClick={() => setPricingType(pm.key)}
                        className={`p-3 rounded-xl border font-bold text-xs transition cursor-pointer text-center space-y-1 ${
                          pricingType === pm.key
                            ? 'bg-[#07543F] text-white border-[#07543F] shadow-sm'
                            : 'bg-[#F8F7F3] dark:bg-[#111C15] text-[#4A5C6E] dark:text-[#9AB0A4] border-[#E0E8E4] dark:border-[#243028]'
                        }`}
                      >
                        <i className={`fa-solid ${pm.icon} block text-sm`}></i>
                        <span>{pm.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pricing Fields Grid */}
                <div className="p-5 bg-[#F8F7F3] dark:bg-[#111C15] rounded-2xl border border-[#E0E8E4] dark:border-[#243028] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-[#8A9BAD] mb-1">
                      Starting Price (₹)
                    </label>
                    <input
                      type="number"
                      value={startingPrice}
                      onChange={(e) => setStartingPrice(parseInt(e.target.value) || 0)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-[#162019] border border-[#E0E8E4] dark:border-[#243028] text-sm font-black focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-[#8A9BAD] mb-1">
                      Price Per Hour (₹)
                    </label>
                    <input
                      type="number"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(parseInt(e.target.value) || 0)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-[#162019] border border-[#E0E8E4] dark:border-[#243028] text-sm font-black focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-[#8A9BAD] mb-1">
                      Price Per Person (₹)
                    </label>
                    <input
                      type="number"
                      value={pricePerPerson}
                      onChange={(e) => setPricePerPerson(parseInt(e.target.value) || 0)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-[#162019] border border-[#E0E8E4] dark:border-[#243028] text-sm font-black focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-[#8A9BAD] mb-1">
                      Price Per Group (₹)
                    </label>
                    <input
                      type="number"
                      value={pricePerGroup}
                      onChange={(e) => setPricePerGroup(parseInt(e.target.value) || 0)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-[#162019] border border-[#E0E8E4] dark:border-[#243028] text-sm font-black focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-[#8A9BAD] mb-1">
                      Fixed Trip Price (₹)
                    </label>
                    <input
                      type="number"
                      value={fixedTripPrice}
                      onChange={(e) => setFixedTripPrice(parseInt(e.target.value) || 0)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-[#162019] border border-[#E0E8E4] dark:border-[#243028] text-sm font-black focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-[#8A9BAD] mb-1">
                      Fixed Trip Duration (Hours)
                    </label>
                    <input
                      type="number"
                      step={0.5}
                      value={fixedTripDuration}
                      onChange={(e) => setFixedTripDuration(parseFloat(e.target.value) || 4)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-[#162019] border border-[#E0E8E4] dark:border-[#243028] text-sm font-black focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase text-[#4A5C6E] dark:text-[#9AB0A4] mb-1.5">
                    Custom Tour Pricing Description
                  </label>
                  <input
                    type="text"
                    value={customPricingDesc}
                    onChange={(e) => setCustomPricingDesc(e.target.value)}
                    placeholder="e.g. Includes heritage entrance tickets, private audio, and refreshments"
                    className="w-full p-3 rounded-xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] text-xs font-semibold focus:outline-none"
                  />
                </div>

                {/* Traveler Display Preview */}
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-300 dark:border-emerald-800 space-y-1">
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">How Travelers Will See Your Price:</div>
                  <div className="text-lg font-black text-emerald-900 dark:text-emerald-200">
                    {pricingType === 'HOURLY' ? `₹${(hourlyRate * 4).toLocaleString('en-IN')} total (4 hours) · ₹${hourlyRate}/hr equivalent`
                     : pricingType === 'PER_PERSON' ? `₹${pricePerPerson.toLocaleString('en-IN')}/person`
                     : pricingType === 'PER_GROUP' ? `₹${pricePerGroup.toLocaleString('en-IN')}/group (up to 4–6 people)`
                     : `₹${fixedTripPrice.toLocaleString('en-IN')} total (${fixedTripDuration} hours)`}
                  </div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400">Total trip price is prioritized so travelers clearly understand their complete tariff.</div>
                </div>

                <button
                  type="submit"
                  className="btn-primary text-xs px-6 py-3 rounded-xl cursor-pointer"
                >
                  Save Pricing Configuration
                </button>
              </form>
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              TAB 3: INBOUND BOOKING REQUESTS
              ══════════════════════════════════════════════════ */}
          {activeTab === 'requests' && (
            <div className="bg-white dark:bg-[#162019] p-6 sm:p-8 rounded-3xl border border-[#E0E8E4] dark:border-[#243028] shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#F1F5F3] dark:border-[#243028] pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0B9B6E]">ACTION REQUIRED</span>
                  <h2 className="text-xl sm:text-2xl font-black text-[#152238] dark:text-white font-heading">
                    Incoming Booking Requests ({pendingRequests.length})
                  </h2>
                </div>
              </div>

              <div className="space-y-4">
                {pendingRequests.length === 0 ? (
                  <div className="p-12 text-center bg-[#F8F7F3] dark:bg-[#111C15] rounded-3xl border border-[#E0E8E4] dark:border-[#243028] space-y-2">
                    <div className="text-[#8A9BAD] text-2xl"><i className="fa-solid fa-inbox"></i></div>
                    <div className="text-sm font-bold text-[#152238] dark:text-white">No pending requests right now</div>
                    <p className="text-xs text-[#8A9BAD]">Ensure your status is set to "Live on Radar" to receive nearby booking calls.</p>
                  </div>
                ) : (
                  pendingRequests.map((req) => (
                    <div key={req.id || req.bookingId} className="p-5 rounded-2xl border border-[#E0E8E4] dark:border-[#243028] bg-white dark:bg-[#111C15] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#F4A340]/20 text-[#F4A340]">
                            {req.bookingType || 'GUIDE_HIRE'}
                          </span>
                          <span className="text-xs font-bold text-[#152238] dark:text-white">{req.touristName}</span>
                          <span className="text-xs text-[#8A9BAD]">• {req.date} at {req.startTime}</span>
                        </div>
                        <div className="text-xs text-[#4A5C6E] dark:text-[#9AB0A4]">
                          📍 Meeting at: <span className="font-bold text-[#152238] dark:text-white">{req.meetingPoint}</span>
                        </div>
                        <div className="text-xs font-bold text-[#0B9B6E]">
                          Total Tariff: ₹{req.totalAmount || req.hourlySubtotal} ({req.durationHours} hrs)
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAcceptRequest(req.id || req.bookingId)}
                          className="px-4 py-2 rounded-xl bg-[#0B9B6E] hover:bg-[#07543F] text-white text-xs font-bold transition cursor-pointer"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeclineRequest(req.id || req.bookingId)}
                          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-rose-500 text-xs font-bold hover:bg-rose-50 transition cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              TAB 4: CONFIRMED UPCOMING TRIPS
              ══════════════════════════════════════════════════ */}
          {activeTab === 'upcoming' && (
            <div className="bg-white dark:bg-[#162019] p-6 sm:p-8 rounded-3xl border border-[#E0E8E4] dark:border-[#243028] shadow-sm space-y-6">
              <div className="border-b border-[#F1F5F3] dark:border-[#243028] pb-4">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0B9B6E]">SCHEDULED</span>
                <h2 className="text-xl sm:text-2xl font-black text-[#152238] dark:text-white font-heading">
                  Confirmed Trips ({upcomingBookings.length})
                </h2>
              </div>

              <div className="space-y-4">
                {upcomingBookings.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#8A9BAD]">No confirmed upcoming tours.</div>
                ) : (
                  upcomingBookings.map((b) => (
                    <div key={b.id || b.bookingId} className="p-5 rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="text-xs font-black text-emerald-800 dark:text-emerald-300">
                          {b.tourTitle || b.serviceTier || 'Heritage Tour'}
                        </div>
                        <div className="text-sm font-extrabold text-[#152238] dark:text-white">
                          Traveler: {b.touristName} ({b.travelersCount} guest{b.travelersCount > 1 ? 's' : ''})
                        </div>
                        <div className="text-xs text-[#4A5C6E] dark:text-[#9AB0A4]">
                          📅 {b.date} • {b.startTime} • 📍 {b.meetingPoint}
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <div className="text-base font-black text-[#07543F] dark:text-[#4ADE80]">
                          ₹{b.totalAmount || b.hourlySubtotal}
                        </div>
                        <div className="text-[11px] font-bold text-[#8A9BAD]">
                          Start OTP: <span className="text-emerald-600 font-mono font-black">{b.startOtp}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              TAB 5: EARNINGS
              ══════════════════════════════════════════════════ */}
          {activeTab === 'earnings' && (
            <div className="bg-white dark:bg-[#162019] p-6 sm:p-8 rounded-3xl border border-[#E0E8E4] dark:border-[#243028] shadow-sm space-y-6">
              <div className="border-b border-[#F1F5F3] dark:border-[#243028] pb-4">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0B9B6E]">FINANCIAL OVERVIEW</span>
                <h2 className="text-xl sm:text-2xl font-black text-[#152238] dark:text-white font-heading">
                  Earnings & Direct Payouts
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028]">
                  <div className="text-xs text-[#8A9BAD] font-bold">Lifetime Settled</div>
                  <div className="text-2xl font-black text-[#07543F] dark:text-[#4ADE80] mt-1">₹{totalEarningsAmount.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-1">0% Commission deducted</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028]">
                  <div className="text-xs text-[#8A9BAD] font-bold">Pending Clearing</div>
                  <div className="text-2xl font-black text-[#152238] dark:text-white mt-1">₹2,450</div>
                  <div className="text-[10px] text-[#8A9BAD] mt-1">Next payout: Friday (Auto-UPI)</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028]">
                  <div className="text-xs text-[#8A9BAD] font-bold">Linked UPI ID</div>
                  <div className="text-sm font-black text-[#152238] dark:text-white mt-1">vikram.singh@okaxis</div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-1">✓ Primary Account Verified</div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              TAB 6: ADMIN TOUR MODERATION (Section 22)
              ══════════════════════════════════════════════════ */}
          {activeTab === 'moderation' && (
            <div className="bg-white dark:bg-[#162019] p-6 sm:p-8 rounded-3xl border border-[#E0E8E4] dark:border-[#243028] shadow-sm space-y-6">
              <div className="border-b border-[#F1F5F3] dark:border-[#243028] pb-4">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0B9B6E]">TRUST & COMPLIANCE</span>
                <h2 className="text-xl sm:text-2xl font-black text-[#152238] dark:text-white font-heading">
                  Tour Moderation Review Console
                </h2>
                <p className="text-xs text-[#8A9BAD]">
                  Admin moderation interface to review tour quality, price fairness, and prevent unauthorized shopping emporium routes.
                </p>
              </div>

              <div className="space-y-4">
                {tours.map((t) => (
                  <div
                    key={t.tourId || t.id}
                    className="p-5 rounded-2xl border border-[#E0E8E4] dark:border-[#243028] bg-[#F8F7F3] dark:bg-[#111C15] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-[#152238] dark:text-white">{t.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-800">
                          {t.status || 'PUBLISHED'}
                        </span>
                      </div>
                      <div className="text-xs text-[#8A9BAD]">
                        Creator: <span className="font-bold text-[#152238] dark:text-white">{t.guideName}</span> (✓ Verified Guide) • {t.destination} • {t.category}
                      </div>
                      <div className="text-xs font-bold text-[#0B9B6E]">
                        Declared Price: ₹{t.price || t.pricePerPerson} ({t.pricingType || 'PER_PERSON'})
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateTourStatus(t.tourId || t.id, 'PUBLISHED')}
                        className="px-3 py-1.5 rounded-xl bg-[#0B9B6E] text-white text-xs font-bold hover:bg-[#07543F] cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => updateTourStatus(t.tourId || t.id, 'PAUSED')}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 cursor-pointer"
                      >
                        Pause
                      </button>
                      <button
                        type="button"
                        onClick={() => updateTourStatus(t.tourId || t.id, 'REJECTED', 'Requires verification of entrance ticket inclusions')}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer"
                      >
                        Request Changes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
