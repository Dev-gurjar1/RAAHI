import React, { useState } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { useTourStore } from '../store/useTourStore';
import { useBookingStore } from '../store/useBookingStore';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';

export const TourDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { tours, addReviewToTour } = useTourStore();
  const { createBooking } = useBookingStore();
  const { user } = useAuthStore();
  const showToast = useToastStore((state) => state.showToast);

  const tour = tours.find((t) => t.id === id) || tours[0];

  // Booking Form State
  const [selectedDate, setSelectedDate] = useState<string>(tour?.availableDates[0] || '2026-08-27');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  const [confirmedOtp, setConfirmedOtp] = useState<string | null>(null);

  // Review Form State
  const [reviewerName, setReviewerName] = useState<string>('');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');

  if (!tour) {
    return (
      <div className="p-12 text-center font-sans space-y-4">
        <h2 className="text-2xl font-bold">Tour Experience Not Found</h2>
        <NavLink to="/tours" className="px-5 py-2.5 bg-orange-500 text-white rounded-full text-xs font-bold">
          Return to Marketplace
        </NavLink>
      </div>
    );
  }

  const subtotalPrice = tour.pricePerPerson * guestCount;

  // Stage 7: Handle Booking Confirmation
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();

    const otpCode = `${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking = {
      id: `BK-${Math.floor(10000 + Math.random() * 90000)}`,
      guideId: tour.guideId,
      guideName: tour.guideName,
      guideAvatar: tour.guideAvatar,
      guideHourlyRate: tour.pricePerPerson,
      guideSpecialties: [tour.category],
      date: selectedDate,
      startTime: '09:00 AM',
      durationHours: tour.itinerary?.reduce((sum, d) => sum + d.durationHours, 0) || 4,
      travelersCount: guestCount,
      meetingPoint: tour.meetingPoint,
      notes: notes || `Booked experience package: ${tour.title}`,
      hourlySubtotal: subtotalPrice,
      serviceFee: 99,
      totalAmount: subtotalPrice + 99,
      status: 'Confirmed' as const,
      startOtp: otpCode,
      createdAt: new Date().toISOString()
    };

    createBooking(newBooking);
    setConfirmedOtp(otpCode);

    showToast({
      type: 'success',
      title: 'Booking Confirmed! 🎉',
      message: `Your booking for ${tour.title} is confirmed. Start OTP: ${otpCode}`
    });
  };

  // Stage 10: Handle Review Submission
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    addReviewToTour(tour.id, {
      id: `rev_${Date.now()}`,
      reviewer: reviewerName || user?.name || 'Traveler',
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toISOString().split('T')[0]
    });

    setReviewComment('');
    setReviewerName('');
    showToast({
      type: 'success',
      title: 'Review Posted! ★',
      message: 'Thank you for sharing your traveler feedback.'
    });
  };

  return (
    <div className="space-y-8 text-left font-sans pb-16">
      
      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
        <NavLink to="/tours" className="hover:text-orange-500">Experiences Marketplace</NavLink>
        <span>&gt;</span>
        <span className="text-slate-900 dark:text-white font-bold truncate max-w-xs">{tour.title}</span>
      </div>

      {/* HERO BANNER */}
      <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden shadow-xl">
        <img src={tour.coverImage} alt={tour.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>

        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <span className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md text-orange-600 font-extrabold text-xs px-4 py-1.5 rounded-full shadow-md uppercase tracking-wider">
            {tour.category}
          </span>
          <span className="bg-emerald-500 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-md">
            ✓ Verified Local Experience
          </span>
        </div>

        <div className="absolute bottom-6 left-6 right-6 space-y-2 text-white">
          <h1 className="text-2xl sm:text-4xl font-extrabold font-heading leading-tight max-w-3xl">
            {tour.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
              <img src={tour.guideAvatar} alt={tour.guideName} className="w-5 h-5 rounded-full object-cover" />
              <span>Host: {tour.guideName}</span>
            </span>
            <span className="bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
              📍 {tour.destination}
            </span>
            <span className="bg-amber-500 text-slate-950 font-black px-3 py-1 rounded-full">
              ★ {tour.rating} ({tour.reviewCount} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN CONTENT & BOOKING CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Itinerary Timeline & Details (Col 7) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Summary & Overview */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
              Experience Overview
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {tour.summary}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Duration</span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {tour.itinerary?.reduce((sum, d) => sum + d.durationHours, 0) || 4} Hours ({tour.itinerary?.length || 1} Days)
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Group Capacity</span>
                <span className="font-extrabold text-slate-900 dark:text-white">Max {tour.maxCapacity || 8} Guests</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Meeting Point</span>
                <span className="font-extrabold text-slate-900 dark:text-white truncate block">{tour.meetingPoint}</span>
              </div>
            </div>
          </div>

          {/* STAGE 6: DAY-BY-DAY ITINERARY TIMELINE */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-6">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading flex items-center gap-2">
              <i className="fa-solid fa-map-location-dot text-orange-500"></i> Day-by-Day Detailed Itinerary
            </h2>

            <div className="space-y-6 relative border-l-2 border-orange-500/30 ml-3 pl-6">
              {tour.itinerary?.map((day, idx) => (
                <div key={idx} className="relative space-y-3">
                  {/* Timeline Icon Node */}
                  <span className="absolute -left-[35px] top-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black shadow-md">
                    {day.day}
                  </span>

                  <div>
                    <span className="text-[10px] font-extrabold text-orange-600 uppercase tracking-wider">
                      DAY {day.day} • {day.durationHours} HOURS
                    </span>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base font-heading">
                      {day.title}
                    </h3>
                  </div>

                  {/* Places Badges */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {day.places.map((p, pIdx) => (
                      <span key={pIdx} className="bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full text-slate-800 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700 text-[11px]">
                        📍 {p}
                      </span>
                    ))}
                  </div>

                  {/* Activities List */}
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/80">
                    {day.activities.map((act, aIdx) => (
                      <li key={aIdx} className="flex items-start gap-2">
                        <i className="fa-solid fa-check text-emerald-500 text-xs mt-0.5"></i>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* HOST PROFILE & REVIEWS */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-6">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
              Your Verified Local Host
            </h2>

            <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
              <img src={tour.guideAvatar} alt={tour.guideName} className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{tour.guideName}</h3>
                  <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    ✓ Verified Host
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-semibold">Certified Rajasthan Tourism Storyteller</div>
                <div className="text-xs text-amber-500 font-bold">★ {tour.rating} Rating ({tour.reviewCount} Reviews)</div>
              </div>
            </div>

            {/* STAGE 10: TRAVELER REVIEWS */}
            <div className="space-y-4 pt-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                Traveler Feedback ({tour.reviews.length})
              </h3>

              {tour.reviews.length === 0 ? (
                <p className="text-xs text-slate-500">No traveler reviews posted yet. Be the first to review!</p>
              ) : (
                tour.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{rev.reviewer}</span>
                      <span className="text-amber-500 font-bold">★ {rev.rating}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 italic">"{rev.comment}"</p>
                    <span className="text-[10px] text-slate-400 block">{rev.date}</span>
                  </div>
                ))
              )}

              {/* Add Review Form */}
              <form onSubmit={handleAddReview} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs pt-3">
                <span className="font-bold text-slate-900 dark:text-white block">Post a Traveler Review</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Your Name (e.g. Alex Johnson)"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                  />
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(parseFloat(e.target.value))}
                    className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white font-bold"
                  >
                    <option value={5}>★★★★★ (5.0 Excellent)</option>
                    <option value={4}>★★★★☆ (4.0 Very Good)</option>
                  </select>
                </div>
                <textarea
                  rows={2}
                  required
                  placeholder="Write your tour experience feedback..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                ></textarea>
                <button type="submit" className="px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold rounded-xl text-xs">
                  Submit Review
                </button>
              </form>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: STAGE 7 BOOKING CALCULATOR CARD (Col 5) */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border-2 border-orange-500/50 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Tariff Rate</span>
                <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-heading">
                  ₹{tour.pricePerPerson} <span className="text-xs font-normal text-slate-400">/ person</span>
                </div>
              </div>
              <span className="bg-emerald-50 text-emerald-700 font-extrabold text-xs px-3 py-1 rounded-full border border-emerald-200">
                Instant Confirmation
              </span>
            </div>

            {/* STAGE 7 BOOKING WIZARD FORM */}
            {confirmedOtp ? (
              /* Confirmation Box */
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto text-2xl font-black shadow-md">
                  ✓
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-700">BOOKING CONFIRMED</span>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-lg font-heading">Trip Scheduled!</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Date: <strong>{selectedDate}</strong> • Guests: <strong>{guestCount}</strong>
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-emerald-200 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Start-Tour Verification OTP</span>
                  <div className="text-3xl font-black text-amber-600 font-heading tracking-widest">{confirmedOtp}</div>
                </div>

                <NavLink
                  to="/trips"
                  className="block w-full py-3 bg-emerald-600 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider text-center"
                >
                  View In My Trips Dashboard &rarr;
                </NavLink>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs font-sans">
                
                {/* Available Date Dropdown */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Select Hosting Date *</label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-orange-500 text-xs"
                  >
                    {tour.availableDates.map((d) => (
                      <option key={d} value={d}>
                        📅 {d} (Available)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Number of Guests Counter */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Number of Travelers *</label>
                  <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-2">
                    <button
                      type="button"
                      disabled={guestCount <= 1}
                      onClick={() => setGuestCount(guestCount - 1)}
                      className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 font-black text-slate-800 dark:text-slate-200 disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="font-extrabold text-base text-slate-900 dark:text-white font-heading">
                      {guestCount} Traveler(s)
                    </span>
                    <button
                      type="button"
                      disabled={guestCount >= (tour.maxCapacity || 8)}
                      onClick={() => setGuestCount(guestCount + 1)}
                      className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 font-black text-slate-800 dark:text-slate-200 disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Optional Special Requirements */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Special Requirements / Notes</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Senior citizens in group, need slow walking pace..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-slate-900 dark:text-white text-xs focus:outline-none"
                  ></textarea>
                </div>

                {/* Live Price Calculator Summary */}
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>₹{tour.pricePerPerson} × {guestCount} Traveler(s)</span>
                    <span>₹{subtotalPrice}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>RAAHI Service & Platform Fee</span>
                    <span>₹99</span>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-2 flex justify-between font-extrabold text-slate-900 dark:text-white text-sm font-heading">
                    <span>Total Amount Payable</span>
                    <span className="text-emerald-600 dark:text-emerald-400">₹{subtotalPrice + 99}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-2xl transition shadow-lg shadow-orange-500/25 uppercase tracking-wider text-xs flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-lock"></i>
                  <span>Confirm & Book Experience</span>
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
