import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { useTourStore } from '../store/useTourStore.js';
import { useBookingStore } from '../store/useBookingStore.js';
import { useAuthStore } from '../store/useAuthStore.js';
import { useToastStore } from '../store/useToastStore.js';
import { getTourDisplayPricing } from '../utils/pricing.js';

export const TourDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { tours = [], addReviewToTour, fetchToursFromBackend } = useTourStore();
  const { createBooking } = useBookingStore();
  const { user } = useAuthStore();
  const showToast = useToastStore((state) => state.showToast);

  const [tour, setTour] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Booking Form State
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [specialNotes, setSpecialNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [confirmedOtp, setConfirmedOtp] = useState(null);

  // Review Form State
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Fetch / Resolve tour
  useEffect(() => {
    if (fetchToursFromBackend && (!tours || tours.length === 0)) {
      fetchToursFromBackend();
    }
  }, [fetchToursFromBackend, tours]);

  useEffect(() => {
    const found = (tours || []).find((t) => t.id === id || t.tourId === id);
    if (found) {
      setTour(found);
      const defaultDate = found.availableDates?.[0] || '2026-09-28';
      setSelectedDate(defaultDate);
      setSelectedTimeSlot(found.availability?.timeSlots?.[0] || '09:00 AM');
    }
  }, [id, tours]);

  if (!tour) {
    return (
      <div className="py-24 px-6 text-center font-sans space-y-5 bg-[#F8F7F3] dark:bg-[#0D1710] min-h-screen">
        <div className="w-16 h-16 rounded-full bg-[#E8F7F1] text-[#0B9B6E] flex items-center justify-center text-2xl mx-auto">
          <i className="fa-solid fa-map-location-dot"></i>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#152238] dark:text-white font-heading">Tour Experience Not Found</h2>
        <p className="text-sm text-[#4A5C6E] dark:text-[#9AB0A4] max-w-md mx-auto">
          The tour you are looking for may have been archived or is temporarily unavailable.
        </p>
        <NavLink to="/tours" className="btn-primary text-xs px-6 py-3 rounded-full inline-flex items-center gap-2">
          <span>Return to Tours Marketplace</span>
          <i className="fa-solid fa-arrow-right text-[10px]"></i>
        </NavLink>
      </div>
    );
  }

  const pricing = getTourDisplayPricing(tour, guestCount);
  const tourImages = tour.images && tour.images.length > 0
    ? tour.images
    : [tour.coverImage || tour.image || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80'];

  // Pricing calculations
  const isPerGroup = (tour.pricingType || '').toUpperCase() === 'PER_GROUP';
  const isFixed = (tour.pricingType || '').toUpperCase() === 'FIXED_PRICE';
  const unitPrice = isPerGroup ? (tour.pricePerGroup || tour.price) : isFixed ? (tour.fixedPrice || tour.price) : (tour.pricePerPerson || tour.price || 699);
  const subtotal = isPerGroup || isFixed ? unitPrice : (unitPrice * guestCount);
  const serviceFee = 60;
  const totalAmount = subtotal + serviceFee;

  // Handle Booking Confirmation (Seamlessly integrated with existing Booking system)
  const handleConfirmBooking = (e) => {
    e.preventDefault();

    const otpCode = `${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking = {
      bookingId: `BK-TOUR-${Math.floor(10000 + Math.random() * 90000)}`,
      bookingType: 'TOUR_BOOKING',
      tourId: tour.tourId || tour.id,
      tourTitle: tour.title,
      tourHostId: tour.guideId,
      touristId: user?.id || 'usr_tourist',
      touristName: user?.name || 'Smart Traveler',
      touristPhone: user?.phone || '+91 9876543210',
      guideId: tour.guideId || 'g1',
      guideName: tour.guideName || 'Vikram Singh Rathore',
      guideAvatar: tour.guideAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      guideHourlyRate: Math.round(unitPrice / (tour.durationHours || 3)),
      guideSpecialties: [tour.category || 'Heritage'],
      pricingType: tour.pricingType || 'PER_PERSON',
      serviceTier: 'Curated Tour Package',
      date: selectedDate,
      startTime: selectedTimeSlot,
      durationHours: tour.durationHours || 3,
      travelersCount: guestCount,
      meetingPoint: tour.meetingPoint || 'Central Landmark',
      specialRequirements: specialNotes || `Booked tour: ${tour.title}`,
      hourlySubtotal: subtotal,
      serviceFee,
      totalAmount,
      status: 'Confirmed',
      startOtp: otpCode,
      createdAt: new Date().toISOString()
    };

    createBooking(newBooking);
    setConfirmedOtp(otpCode);

    showToast({
      type: 'success',
      title: 'Tour Booking Confirmed! 🎉',
      message: `Your booking for "${tour.title}" is confirmed! Verification OTP: ${otpCode}`
    });
  };

  // Handle Review Submission
  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    addReviewToTour(tour.id || tour.tourId, {
      reviewer: reviewerName || user?.name || 'Verified Traveler',
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toISOString().split('T')[0]
    });

    setReviewComment('');
    setReviewerName('');
    showToast({
      type: 'success',
      title: 'Review Posted! ★',
      message: 'Thank you for your traveler feedback.'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tour.title,
        text: tour.summary,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast({
        type: 'info',
        title: 'Link Copied! 📋',
        message: 'Tour page link copied to your clipboard.'
      });
    }
  };

  const handleToggleSave = () => {
    setIsSaved(!isSaved);
    showToast({
      type: !isSaved ? 'success' : 'info',
      title: !isSaved ? 'Tour Saved to Wishlist ❤️' : 'Tour Removed from Wishlist',
      message: !isSaved ? 'You can review this tour anytime in your trips tab.' : ''
    });
  };

  return (
    <div className="bg-[#F8F7F3] dark:bg-[#0D1710] min-h-screen text-[#152238] dark:text-[#E8F0EC] pb-20">

      {/* ══════════════════════════════════════════════════
          1. BREADCRUMBS & TOP ACTIONS
          ══════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#8A9BAD] font-semibold">
            <NavLink to="/" className="hover:text-[#0B9B6E] transition-colors">Home</NavLink>
            <span>/</span>
            <NavLink to="/tours" className="hover:text-[#0B9B6E] transition-colors">Tours</NavLink>
            <span>/</span>
            <span className="text-[#152238] dark:text-white font-bold truncate max-w-xs">{tour.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSave}
              className={`px-3 py-1.5 rounded-full border transition flex items-center gap-1.5 font-bold cursor-pointer ${
                isSaved
                  ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 border-rose-300'
                  : 'bg-white dark:bg-[#162019] text-[#4A5C6E] dark:text-[#9AB0A4] border-[#E0E8E4] dark:border-[#243028] hover:text-rose-500'
              }`}
            >
              <i className={`fa-${isSaved ? 'solid' : 'regular'} fa-heart text-xs`}></i>
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-full bg-white dark:bg-[#162019] text-[#4A5C6E] dark:text-[#9AB0A4] hover:text-[#152238] dark:hover:text-white border border-[#E0E8E4] dark:border-[#243028] transition font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <i className="fa-solid fa-arrow-up-from-bracket text-xs"></i>
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          2. HERO GALLERY & TITLE
          ══════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          
          {/* Header Title & Badges */}
          <div className="space-y-2 text-left">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-[#E8F7F1] dark:bg-[#07543F]/30 text-[#07543F] dark:text-[#4ADE80] border border-[#0B9B6E]/30">
                {tour.category || 'Heritage'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F8F7F3] dark:bg-[#162019] text-[#152238] dark:text-white border border-[#E0E8E4] dark:border-[#243028]">
                <i className="fa-solid fa-location-dot text-[#0B9B6E]"></i>
                <span>{tour.destination || 'Jaipur, Rajasthan'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-[#F4A340]">
                <i className="fa-solid fa-star text-xs"></i>
                <span className="font-extrabold text-[#152238] dark:text-white">{tour.rating || '4.95'}</span>
                <span className="text-[#8A9BAD]">({tour.reviewCount || 0} reviews)</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#152238] dark:text-white font-heading tracking-tight leading-tight">
              {tour.title}
            </h1>
          </div>

          {/* Gallery Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8 rounded-3xl overflow-hidden shadow-lg border border-[#E0E8E4] dark:border-[#243028] aspect-[16/10] bg-slate-100 dark:bg-slate-800 relative">
              <img
                src={tourImages[activeImageIndex] || tourImages[0]}
                alt={tour.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2">
                <i className="fa-solid fa-camera text-[#4ADE80]"></i>
                <span>Photo {activeImageIndex + 1} of {tourImages.length}</span>
              </div>
            </div>

            {/* Thumbnail Column */}
            <div className="lg:col-span-4 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible">
              {tourImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`rounded-2xl overflow-hidden aspect-[16/10] lg:aspect-auto lg:h-28 flex-1 border-2 transition-all cursor-pointer relative ${
                    activeImageIndex === idx
                      ? 'border-[#0B9B6E] shadow-md ring-2 ring-[#0B9B6E]/30'
                      : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          3. MAIN 2-COLUMN LAYOUT: DETAILS & BOOKING SIDEBAR
          ══════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* LEFT 8-COLS: Detailed Tour Content */}
          <div className="lg:col-span-8 space-y-10 text-left">
            
            {/* Quick Tour Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white dark:bg-[#162019] rounded-3xl border border-[#E0E8E4] dark:border-[#243028] shadow-xs">
              <div className="space-y-1">
                <div className="text-[10px] font-extrabold uppercase text-[#8A9BAD] tracking-wider">Duration</div>
                <div className="text-sm font-black text-[#152238] dark:text-white flex items-center gap-1.5">
                  <i className="fa-regular fa-clock text-[#0B9B6E]"></i>
                  <span>{tour.duration || '3 Hours'}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-extrabold uppercase text-[#8A9BAD] tracking-wider">Group Size</div>
                <div className="text-sm font-black text-[#152238] dark:text-white flex items-center gap-1.5">
                  <i className="fa-solid fa-users text-[#F4A340]"></i>
                  <span>Max {tour.maxParticipants || tour.maxCapacity || 6}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-extrabold uppercase text-[#8A9BAD] tracking-wider">Languages</div>
                <div className="text-sm font-black text-[#152238] dark:text-white flex items-center gap-1.5">
                  <i className="fa-solid fa-language text-[#0B9B6E]"></i>
                  <span>{tour.languages ? tour.languages.join(', ') : 'Hindi, English'}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-extrabold uppercase text-[#8A9BAD] tracking-wider">Difficulty</div>
                <div className="text-sm font-black text-[#152238] dark:text-white flex items-center gap-1.5">
                  <i className="fa-solid fa-shoe-prints text-[#0B9B6E]"></i>
                  <span>{tour.difficultyLevel || 'Easy Walk'}</span>
                </div>
              </div>
            </div>

            {/* Verified Guide / Host Card */}
            <div className="p-6 bg-white dark:bg-[#162019] rounded-3xl border border-[#E0E8E4] dark:border-[#243028] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <img
                  src={tour.guideAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'}
                  alt={tour.guideName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#0B9B6E] shadow-sm"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[#152238] dark:text-white text-lg font-heading">
                      {tour.guideName || 'Vikram Singh Rathore'}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E8F7F1] dark:bg-[#07543F]/30 text-[#07543F] dark:text-[#4ADE80] border border-[#0B9B6E]/30">
                      <i className="fa-solid fa-circle-check text-[9px]"></i>
                      <span>Verified Host</span>
                    </span>
                  </div>
                  <div className="text-xs text-[#8A9BAD] font-semibold flex items-center gap-3">
                    <span>{tour.guideType ? tour.guideType.replace('_', ' ') : 'Professional Guide'}</span>
                    <span>•</span>
                    <span>★ {tour.guideRating || '4.95'} Rating</span>
                    <span>•</span>
                    <span>{tour.guideCompletedTrips || 260}+ Completed Tours</span>
                  </div>
                </div>
              </div>

              <NavLink
                to={`/guides/${tour.guideId || 'g1'}`}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#F8F7F3] dark:bg-[#111C15] text-[#152238] dark:text-white border border-[#E0E8E4] dark:border-[#243028] hover:border-[#0B9B6E] transition whitespace-nowrap cursor-pointer"
              >
                View Host Profile
              </NavLink>
            </div>

            {/* Description & Overview */}
            <div className="p-6 sm:p-8 bg-white dark:bg-[#162019] rounded-3xl border border-[#E0E8E4] dark:border-[#243028] shadow-xs space-y-4">
              <h2 className="text-xl font-extrabold text-[#152238] dark:text-white font-heading">
                About This Tour Experience
              </h2>
              <p className="text-sm text-[#4A5C6E] dark:text-[#9AB0A4] leading-relaxed whitespace-pre-line">
                {tour.description || tour.summary}
              </p>

              {tour.highlights && tour.highlights.length > 0 && (
                <div className="pt-3 border-t border-[#F1F5F3] dark:border-[#243028] space-y-2.5">
                  <div className="text-xs font-extrabold uppercase text-[#8A9BAD] tracking-wider">Experience Highlights:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-[#152238] dark:text-white">
                    {tour.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <i className="fa-solid fa-circle-check text-[#0B9B6E] mt-0.5 text-xs"></i>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ══════════════════════════════════════════════════
                TOUR ITINERARY: TIMELINE UI
                ══════════════════════════════════════════════════ */}
            <div className="p-6 sm:p-8 bg-white dark:bg-[#162019] rounded-3xl border border-[#E0E8E4] dark:border-[#243028] shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0B9B6E]">STEP-BY-STEP ROUTE</span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#152238] dark:text-white font-heading">
                    Detailed Timeline Itinerary
                  </h2>
                </div>
                <span className="text-xs text-[#8A9BAD] font-bold">
                  {tour.itinerary ? `${tour.itinerary.length} stops` : 'Scheduled walk'}
                </span>
              </div>

              {tour.itinerary && tour.itinerary.length > 0 ? (
                <div className="relative border-l-2 border-[#0B9B6E]/30 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8">
                  {tour.itinerary.map((stop, index) => (
                    <div key={index} className="relative group">
                      {/* Timeline Dot Indicator */}
                      <span className="absolute -left-[35px] sm:-left-[43px] top-0 w-7 h-7 rounded-full bg-[#07543F] text-white flex items-center justify-center text-xs font-black shadow-md border-2 border-white dark:border-[#162019]">
                        {stop.stopNumber || index + 1}
                      </span>

                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-black text-[#0B9B6E] bg-[#E8F7F1] dark:bg-[#07543F]/30 px-2 py-0.5 rounded-md">
                            {stop.time || 'Scheduled Stop'}
                          </span>
                          <span className="text-xs font-semibold text-[#8A9BAD]">
                            ({stop.durationMinutes || 30} mins)
                          </span>
                          {stop.location && (
                            <span className="text-xs font-semibold text-[#4A5C6E] dark:text-[#9AB0A4] flex items-center gap-1">
                              <i className="fa-solid fa-location-dot text-[10px] text-[#F4A340]"></i>
                              {stop.location}
                            </span>
                          )}
                        </div>

                        <h4 className="text-base font-extrabold text-[#152238] dark:text-white font-heading">
                          {stop.title}
                        </h4>

                        {stop.description && (
                          <p className="text-xs text-[#4A5C6E] dark:text-[#9AB0A4] leading-relaxed">
                            {stop.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center bg-[#F8F7F3] dark:bg-[#111C15] rounded-2xl text-xs text-[#8A9BAD]">
                  Itinerary timeline defined upon confirmation with the host.
                </div>
              )}
            </div>

            {/* Meeting Point with Directions */}
            <div className="p-6 bg-white dark:bg-[#162019] rounded-3xl border border-[#E0E8E4] dark:border-[#243028] shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#0B9B6E]">
                <i className="fa-solid fa-map-pin"></i>
                <span>Meeting Point</span>
              </div>
              <div className="text-base font-extrabold text-[#152238] dark:text-white">
                {tour.meetingPoint || 'Central City Landmark, Jaipur'}
              </div>
              <p className="text-xs text-[#4A5C6E] dark:text-[#9AB0A4] leading-relaxed">
                Please arrive 10 minutes before tour departure. Your guide will be holding a RAAHI verified badge and waiting at the designated landmark.
              </p>
            </div>

            {/* What's Included & What's Excluded */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 sm:p-8 bg-white dark:bg-[#162019] rounded-3xl border border-[#E0E8E4] dark:border-[#243028] shadow-xs">
              {/* Inclusions */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#0B9B6E] tracking-wider">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>What's Included</span>
                </div>
                <div className="space-y-2 text-xs font-semibold text-[#152238] dark:text-white">
                  {(tour.included || ['Licensed Local Guide', 'Heritage Route Assistance', 'Water bottle']).map((inc, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <i className="fa-solid fa-check text-[#0B9B6E] text-xs mt-0.5"></i>
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exclusions */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-rose-500 tracking-wider">
                  <i className="fa-solid fa-circle-xmark"></i>
                  <span>What's Excluded</span>
                </div>
                <div className="space-y-2 text-xs font-semibold text-[#4A5C6E] dark:text-[#9AB0A4]">
                  {(tour.excluded || ['Personal Transport', 'Monument Entry Tickets', 'Gratuities']).map((exc, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <i className="fa-solid fa-xmark text-rose-500 text-xs mt-0.5"></i>
                      <span>{exc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Safety & Cancellation Policies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-white dark:bg-[#162019] rounded-3xl border border-[#E0E8E4] dark:border-[#243028] text-xs">
              <div className="space-y-1.5">
                <div className="font-extrabold text-[#152238] dark:text-white flex items-center gap-1.5">
                  <i className="fa-solid fa-rotate-left text-[#0B9B6E]"></i>
                  <span>Cancellation Policy</span>
                </div>
                <p className="text-[#4A5C6E] dark:text-[#9AB0A4] leading-relaxed">
                  {tour.cancellationPolicy || 'Free cancellation up to 24 hours before tour start for 100% refund.'}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="font-extrabold text-[#152238] dark:text-white flex items-center gap-1.5">
                  <i className="fa-solid fa-shield-halved text-[#0B9B6E]"></i>
                  <span>Safety & Anti-Scam Standard</span>
                </div>
                <p className="text-[#4A5C6E] dark:text-[#9AB0A4] leading-relaxed">
                  {tour.safetyInfo || 'Background-verified guide, zero shopping commission guarantee, and in-app SOS safety shield.'}
                </p>
              </div>
            </div>

            {/* Traveler Reviews Section */}
            <div className="p-6 sm:p-8 bg-white dark:bg-[#162019] rounded-3xl border border-[#E0E8E4] dark:border-[#243028] shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-extrabold text-[#152238] dark:text-white font-heading">
                  Traveler Reviews ({tour.reviews?.length || tour.reviewCount || 0})
                </h3>
                <div className="flex items-center gap-1.5 text-amber-500 font-extrabold text-sm">
                  <i className="fa-solid fa-star"></i>
                  <span>{tour.rating || '4.95'} out of 5.0</span>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {tour.reviews && tour.reviews.length > 0 ? (
                  tour.reviews.map((r, i) => (
                    <div key={i} className="p-4 bg-[#F8F7F3] dark:bg-[#111C15] rounded-2xl border border-[#E0E8E4] dark:border-[#243028] space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-[#152238] dark:text-white">{r.reviewer}</span>
                        <span className="text-[#8A9BAD]">{r.date}</span>
                      </div>
                      <div className="text-amber-500 text-xs">
                        {'★'.repeat(Math.round(r.rating || 5))}
                      </div>
                      <p className="text-xs text-[#4A5C6E] dark:text-[#9AB0A4] leading-relaxed">
                        {r.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#8A9BAD]">No reviews yet. Be the first traveler to share your feedback!</p>
                )}
              </div>

              {/* Add Review Form */}
              <form onSubmit={handleAddReview} className="pt-4 border-t border-[#F1F5F3] dark:border-[#243028] space-y-3">
                <div className="text-xs font-bold text-[#152238] dark:text-white">Leave a Review</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="Your Name (e.g. Marcus B.)"
                    className="p-2.5 rounded-xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] text-xs font-semibold focus:outline-none"
                  />
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="p-2.5 rounded-xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] text-xs font-semibold focus:outline-none"
                  >
                    <option value={5}>★★★★★ (5 Stars - Outstanding)</option>
                    <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                    <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                  </select>
                </div>
                <textarea
                  rows={2}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details of your experience with this tour..."
                  className="w-full p-2.5 rounded-xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] text-xs font-semibold focus:outline-none"
                />
                <button type="submit" className="btn-secondary text-xs px-4 py-2 rounded-xl cursor-pointer">
                  Submit Review
                </button>
              </form>
            </div>

          </div>

          {/* RIGHT 4-COLS: STICKY BOOKING CARD */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white dark:bg-[#162019] p-6 sm:p-7 rounded-3xl border border-[#E0E8E4] dark:border-[#243028] shadow-xl space-y-6 text-left">
              
              {/* Pricing Display (Prioritizing Total) */}
              <div className="space-y-1 border-b border-[#F1F5F3] dark:border-[#243028] pb-4">
                <div className="text-[10px] font-extrabold uppercase text-[#8A9BAD] tracking-wider">
                  Tour Price
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#07543F] dark:text-[#4ADE80] font-heading">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-[#8A9BAD]">
                    {isPerGroup ? 'total for group' : isFixed ? 'fixed total' : `total for ${guestCount} person${guestCount > 1 ? 's' : ''}`}
                  </span>
                </div>
                <div className="text-xs text-[#0B9B6E] font-bold">
                  {pricing.primaryPrice} · {tour.duration || '3 Hours'}
                </div>
              </div>

              {/* Booking Form */}
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                {/* Date Selection */}
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-[#8A9BAD] mb-1">
                    Select Tour Date
                  </label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] text-xs font-bold text-[#152238] dark:text-white focus:outline-none"
                  />
                </div>

                {/* Time Slot Selection */}
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-[#8A9BAD] mb-1">
                    Departure Time Slot
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(tour.availability?.timeSlots || ['09:00 AM', '02:30 PM']).map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`p-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                          selectedTimeSlot === slot
                            ? 'bg-[#07543F] text-white border-[#07543F]'
                            : 'bg-[#F8F7F3] dark:bg-[#111C15] text-[#152238] dark:text-white border-[#E0E8E4] dark:border-[#243028]'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Number of Travelers */}
                {!isPerGroup && (
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-[#8A9BAD] mb-1">
                      Travelers Count
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                        className="w-9 h-9 rounded-xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] font-bold text-sm cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-black text-sm text-[#152238] dark:text-white min-w-[30px] text-center">
                        {guestCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => setGuestCount(Math.min(tour.maxParticipants || 8, guestCount + 1))}
                        className="w-9 h-9 rounded-xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] font-bold text-sm cursor-pointer"
                      >
                        +
                      </button>
                      <span className="text-xs text-[#8A9BAD]">
                        (Max {tour.maxParticipants || tour.maxCapacity || 8})
                      </span>
                    </div>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="p-3.5 bg-[#F8F7F3] dark:bg-[#111C15] rounded-2xl border border-[#E0E8E4] dark:border-[#243028] space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#4A5C6E] dark:text-[#9AB0A4]">
                    <span>Tour Subtotal:</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[#4A5C6E] dark:text-[#9AB0A4]">
                    <span>Safety Shield & Platform Fee:</span>
                    <span>₹{serviceFee}</span>
                  </div>
                  <div className="border-t border-[#E0E8E4] dark:border-[#243028] pt-1.5 flex justify-between font-extrabold text-[#152238] dark:text-white text-sm">
                    <span>Total Due:</span>
                    <span className="text-[#07543F] dark:text-[#4ADE80]">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Primary CTA */}
                <button
                  type="submit"
                  className="w-full btn-primary py-3.5 text-xs justify-center shadow-lg font-black tracking-wider uppercase cursor-pointer"
                >
                  <i className="fa-solid fa-lock text-[11px]"></i>
                  <span>BOOK THIS TOUR</span>
                </button>
              </form>

              {/* Confirmed OTP Notice if Booked */}
              {confirmedOtp && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-300 dark:border-emerald-700 text-center space-y-1">
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Start Tour Verification OTP</div>
                  <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 tracking-widest">{confirmedOtp}</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Share with host upon arrival at meeting point.</div>
                </div>
              )}

              {/* Secondary Host CTA */}
              <div className="pt-2 border-t border-[#F1F5F3] dark:border-[#243028] space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    showToast({
                      type: 'info',
                      title: 'Direct Message to Host',
                      message: `Connecting with ${tour.guideName}. You can ask custom route questions.`
                    });
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#F8F7F3] dark:bg-[#111C15] text-[#152238] dark:text-white border border-[#E0E8E4] dark:border-[#243028] hover:border-[#0B9B6E] font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <i className="fa-regular fa-comment-dots text-[#0B9B6E]"></i>
                  <span>ASK THE GUIDE</span>
                </button>
              </div>

              {/* Trust Guarantee */}
              <div className="pt-1 flex items-center justify-center gap-2 text-[11px] font-bold text-[#8A9BAD]">
                <i className="fa-solid fa-shield-halved text-[#0B9B6E]"></i>
                <span>100% Anti-Scam Protection Guarantee</span>
              </div>
            </div>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════
            4. MARKETPLACE BRIDGE
            ══════════════════════════════════════════════════ */}
        <section className="mt-20 bg-gradient-to-br from-[#07543F] to-[#0D1F17] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl text-left">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-[#4ADE80] border border-white/20">
              EXPLORE MORE OF INDIA
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-heading">
              Want something more personalized?
            </h3>
            <p className="text-sm text-white/80 leading-relaxed">
              Prefer a private custom itinerary, bespoke timings, or special requirements? You can book a verified local guide directly by the hour, or post your trip for custom offers.
            </p>
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <NavLink
                to="/guides"
                className="px-6 py-3 rounded-full bg-[#0B9B6E] hover:bg-[#09825C] text-white font-bold text-xs shadow-md transition flex items-center gap-2"
              >
                <i className="fa-solid fa-user-tie"></i>
                <span>FIND A GUIDE</span>
              </NavLink>
              <NavLink
                to="/planner"
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition flex items-center gap-2"
              >
                <i className="fa-solid fa-paper-plane text-[#F4A340]"></i>
                <span>POST YOUR OWN TRIP</span>
              </NavLink>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
