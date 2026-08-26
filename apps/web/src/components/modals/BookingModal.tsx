import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingStore, BookingWizardStep } from '../../store/useBookingStore';
import { useToastStore } from '../../store/useToastStore';

export const BookingModal: React.FC = () => {
  const {
    isBookingModalOpen,
    closeBookingModal,
    step,
    setStep,
    bookingDraft,
    updateDraft,
    createBooking,
    latestConfirmedBooking
  } = useBookingStore();

  const showToast = useToastStore((state) => state.showToast);
  const navigate = useNavigate();

  if (!isBookingModalOpen) return null;

  const guide = bookingDraft.guide;
  const hourlyRate = guide?.hourlyRate || 450;
  const hourlySubtotal = hourlyRate * bookingDraft.durationHours;
  const serviceFee = 50;
  const totalAmount = hourlySubtotal + serviceFee;

  const handleNextStep = () => {
    if (step === 1) {
      if (!bookingDraft.date || !bookingDraft.startTime) {
        showToast({ type: 'warning', title: 'Date & Time Required', message: 'Please select a date and start time.' });
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      if (!bookingDraft.meetingPoint.trim()) {
        showToast({ type: 'warning', title: 'Meeting Point Required', message: 'Please specify where you will meet your guide.' });
        return;
      }
      setStep(4);
    } else if (step === 4) {
      setStep(5);
    } else if (step === 5) {
      const created = createBooking();
      if (created) {
        showToast({
          type: 'success',
          title: 'Booking Confirmed! 🎉',
          message: `Your booking with ${created.guideName} is placed. OTP: ${created.startOtp}`
        });
      }
    }
  };

  const handlePrevStep = () => {
    if (typeof step === 'number' && step > 1) {
      setStep((step - 1) as BookingWizardStep);
    }
  };

  const handleUseCurrentLocation = () => {
    const defaultPoint = guide?.specialties[0]
      ? `${guide.specialties[0]} Main Gate, Jaipur`
      : 'Amer Fort Entrance, Jaipur (GPS: 26.9855, 75.8513)';
    updateDraft({ meetingPoint: defaultPoint });
    showToast({ type: 'info', title: 'GPS Location Set', message: `Meeting point updated to ${defaultPoint}` });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl my-auto text-left space-y-6">
        
        {/* Modal Close Button */}
        <button
          onClick={closeBookingModal}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center transition"
        >
          <i className="fa-solid fa-xmark text-sm"></i>
        </button>

        {/* HOST MINI PREVIEW HEADER (Step 1 to 5) */}
        {step !== 'SUCCESS' && guide && (
          <div className="space-y-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <img
                  src={guide.avatar}
                  alt={guide.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[9px] border border-white">
                  ✓
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase border border-emerald-200 dark:border-emerald-500/20">
                  Verified Local Host
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-heading mt-0.5">
                  Book {guide.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="text-amber-500 font-bold">★ {guide.rating}</span>
                  <span>• ₹{guide.hourlyRate}/hr</span>
                  <span>• {guide.experience} Exp</span>
                </div>
              </div>
            </div>

            {/* Step Progress Dots */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 pt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] transition ${
                      step === s
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                        : typeof step === 'number' && step > s
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {typeof step === 'number' && step > s ? '✓' : s}
                  </div>
                  <span className={`hidden sm:inline text-[10px] uppercase ${step === s ? 'text-slate-900 dark:text-white font-extrabold' : ''}`}>
                    {s === 1 ? 'Date' : s === 2 ? 'Guests' : s === 3 ? 'Location' : s === 4 ? 'Price' : 'Confirm'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: DATE & TIME */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white font-heading">
                Step 1: Select Date & Time
              </h4>
              <p className="text-xs text-slate-500">Choose when you would like to start your tour.</p>
            </div>

            {/* Quick Date Chips */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase">Tour Date</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <input
                  type="date"
                  value={bookingDraft.date}
                  onChange={(e) => updateDraft({ date: e.target.value })}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 col-span-2 sm:col-span-1"
                />
                <button
                  type="button"
                  onClick={() => {
                    const today = new Date().toISOString().split('T')[0];
                    updateDraft({ date: today });
                  }}
                  className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-600 rounded-xl text-xs font-bold transition text-slate-700 dark:text-slate-300"
                >
                  Today (Instant)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    updateDraft({ date: tomorrow.toISOString().split('T')[0] });
                  }}
                  className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-600 rounded-xl text-xs font-bold transition text-slate-700 dark:text-slate-300"
                >
                  Tomorrow
                </button>
              </div>
            </div>

            {/* Time Slot Picker */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase">Start Time</label>
              <div className="grid grid-cols-4 gap-2">
                {['08:00 AM', '10:00 AM', '02:00 PM', '05:00 PM'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => updateDraft({ startTime: t })}
                    className={`py-2 rounded-xl text-xs font-bold transition ${
                      bookingDraft.startTime === t
                        ? 'bg-orange-500 text-white shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase">Duration (Hours)</label>
              <div className="grid grid-cols-5 gap-2">
                {[2, 3, 4, 6, 8].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => updateDraft({ durationHours: h })}
                    className={`py-2 rounded-xl text-xs font-bold transition ${
                      bookingDraft.durationHours === h
                        ? 'bg-orange-500 text-white shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {h} hrs
                  </button>
                ))}
              </div>
            </div>

            {/* Live Tariff Preview Box */}
            <div className="p-3.5 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-orange-600 dark:text-orange-400 block">Tariff Calculation</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  ₹{hourlyRate} × {bookingDraft.durationHours} hours
                </span>
              </div>
              <span className="text-lg font-extrabold text-orange-600 dark:text-orange-400">
                ₹{hourlySubtotal}
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: TRAVELERS & SPECIAL REQUIREMENTS */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white font-heading">
                Step 2: Travelers & Requirements
              </h4>
              <p className="text-xs text-slate-500">Specify group size and any special preferences.</p>
            </div>

            {/* Traveler Counter */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase">Number of Travelers</label>
              <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 w-fit">
                <button
                  type="button"
                  onClick={() => updateDraft({ travelersCount: Math.max(1, bookingDraft.travelersCount - 1) })}
                  className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-white font-bold text-base shadow-xs flex items-center justify-center hover:bg-orange-500 hover:text-white transition"
                >
                  -
                </button>
                <span className="text-base font-extrabold text-slate-900 dark:text-white w-8 text-center">
                  {bookingDraft.travelersCount}
                </span>
                <button
                  type="button"
                  onClick={() => updateDraft({ travelersCount: Math.min(10, bookingDraft.travelersCount + 1) })}
                  className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-white font-bold text-base shadow-xs flex items-center justify-center hover:bg-orange-500 hover:text-white transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Quick Requirement Chips */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase">Quick Preferences</label>
              <div className="flex flex-wrap gap-2">
                {['Wheelchair Friendly', 'English Speaking', 'Photography Focus', 'Food Hygiene Focus', 'Senior Pace'].map((pref) => {
                  const isSelected = bookingDraft.specialRequirements.includes(pref);
                  return (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => {
                        const newReq = isSelected
                          ? bookingDraft.specialRequirements.replace(pref, '').trim()
                          : `${bookingDraft.specialRequirements} ${pref}`.trim();
                        updateDraft({ specialRequirements: newReq });
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                        isSelected
                          ? 'bg-orange-500 text-white border-orange-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}{pref}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Additional Notes Box */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase">Additional Requirements (Optional)</label>
              <textarea
                rows={3}
                value={bookingDraft.specialRequirements}
                onChange={(e) => updateDraft({ specialRequirements: e.target.value })}
                placeholder="E.g., Senior citizen pace, vegetarian street food spots only, interest in block printing..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        )}

        {/* STEP 3: MEETING POINT */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white font-heading">
                Step 3: Choose Meeting Point
              </h4>
              <p className="text-xs text-slate-500">Where should your guide meet you?</p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="w-full py-3 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-400 font-bold rounded-2xl text-xs transition border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-location-crosshairs text-sm"></i>
                <span>Use Current Location / Landmark</span>
              </button>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Enter Meeting Location</label>
                <input
                  type="text"
                  value={bookingDraft.meetingPoint}
                  onChange={(e) => updateDraft({ meetingPoint: e.target.value })}
                  placeholder="E.g. Amer Fort Entrance, Wind View Cafe Hawa Mahal, Hotel Lobby..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Selected Location Card Preview */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Selected Meeting Spot</div>
                <div className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <i className="fa-solid fa-location-dot text-orange-500"></i>
                  <span>{bookingDraft.meetingPoint || 'Not set'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: PRICE SUMMARY */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white font-heading">
                Step 4: Price Summary & Transparent Breakdown
              </h4>
              <p className="text-xs text-slate-500">Review itemized pricing before confirming.</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                <span>Guide Tariff ({guide?.name})</span>
                <span className="font-bold">₹{hourlyRate} / hr</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                <span>Selected Duration ({bookingDraft.durationHours} hours)</span>
                <span className="font-bold">₹{hourlySubtotal}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                <span>Travelers Count</span>
                <span className="font-bold">{bookingDraft.travelersCount} Person(s)</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                <span>Anti-Scam Platform & Safety Fee</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{serviceFee}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Amount</span>
                  <span className="text-2xl font-extrabold text-orange-600 dark:text-orange-400 font-heading">
                    ₹{totalAmount}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                  ✓ Fair Price Shield Active
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: FINAL CONFIRMATION REVIEW */}
        {step === 5 && (
          <div className="space-y-5">
            <div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white font-heading">
                Step 5: Review & Confirm Booking
              </h4>
              <p className="text-xs text-slate-500">Verify your details before placing the request.</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Date & Time</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{bookingDraft.date} at {bookingDraft.startTime}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Duration</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{bookingDraft.durationHours} Hours</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Meeting Location</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{bookingDraft.meetingPoint}</span>
                </div>
                {bookingDraft.specialRequirements && (
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Requirements</span>
                    <span className="text-slate-600 dark:text-slate-300">{bookingDraft.specialRequirements}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Total Payable</span>
                <span className="text-xl font-extrabold text-orange-600 dark:text-orange-400">₹{totalAmount}</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP SUCCESS: CONFIRMATION SCREEN */}
        {step === 'SUCCESS' && latestConfirmedBooking && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto text-3xl font-extrabold animate-bounce">
              ✓
            </div>

            <div className="space-y-1">
              <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                BOOKING PLACED SUCCESSFULLY
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading pt-1">
                Booking ID: {latestConfirmedBooking.id}
              </h3>
              <p className="text-slate-500 text-xs">
                Your request has been routed to host <span className="font-bold text-slate-900 dark:text-white">{latestConfirmedBooking.guideName}</span>.
              </p>
            </div>

            {/* 4-DIGIT START-TOUR OTP BOX */}
            <div className="bg-amber-50 dark:bg-amber-500/10 p-5 rounded-2xl border border-amber-200 dark:border-amber-500/30 text-center space-y-1 shadow-xs">
              <span className="text-[10px] uppercase text-amber-700 dark:text-amber-300 font-extrabold tracking-widest block">
                YOUR 4-DIGIT START-TOUR OTP
              </span>
              <div className="text-4xl font-black tracking-widest text-amber-600 dark:text-amber-400 font-heading">
                {latestConfirmedBooking.startOtp}
              </div>
              <p className="text-[11px] text-amber-700 dark:text-amber-300/80">
                Share this secret code with {latestConfirmedBooking.guideName} upon meeting to start the tour.
              </p>
            </div>

            {/* Summary List */}
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-left text-xs space-y-2 border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Time:</span>
                <span className="font-bold text-slate-900 dark:text-white">{latestConfirmedBooking.date} at {latestConfirmedBooking.startTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Meeting Point:</span>
                <span className="font-bold text-slate-900 dark:text-white">{latestConfirmedBooking.meetingPoint}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Amount:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{latestConfirmedBooking.totalAmount}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  showToast({ type: 'info', title: 'Safety Helpline Connected', message: 'Calling +91 1800-RAAHI-SAFE...' });
                }}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold rounded-full text-xs transition border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5"
              >
                <i className="fa-solid fa-headset text-emerald-500"></i> Safety Helpline
              </button>

              <button
                type="button"
                onClick={() => {
                  closeBookingModal();
                  navigate('/trips');
                }}
                className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-full text-xs transition shadow-md shadow-orange-500/20"
              >
                View My Bookings →
              </button>
            </div>
          </div>
        )}

        {/* MODAL FOOTER ACTIONS (Step 1 to 5) */}
        {step !== 'SUCCESS' && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            {typeof step === 'number' && step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold rounded-full text-xs transition"
              >
                ← Back
              </button>
            ) : (
              <div></div>
            )}

            <button
              type="button"
              onClick={handleNextStep}
              className="px-7 py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-full text-xs uppercase tracking-wider transition shadow-md shadow-orange-500/20 flex items-center gap-2"
            >
              <span>{step === 5 ? 'Confirm & Book Now ✓' : 'Next Step →'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

