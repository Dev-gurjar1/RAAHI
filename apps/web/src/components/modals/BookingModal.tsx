import React, { useEffect } from 'react';
import { useBookingStore } from '../../store/useBookingStore';

export const BookingModal: React.FC = () => {
  const {
    isBookingModalOpen,
    closeBookingModal,
    status,
    matchedGuide,
    startOtp,
    etaMinutes,
    setMatchedGuide,
    resetBooking
  } = useBookingStore();

  useEffect(() => {
    if (status === 'SEARCHING') {
      const timer = setTimeout(() => {
        const dummyGuide = matchedGuide || {
          id: 'g1',
          userId: 'u1',
          name: 'Vikram Singh Rathore',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          rating: 4.92,
          reviewCount: 142,
          languages: ['Hindi', 'English'],
          experience: '8 Years',
          hourlyRate: 450,
          specialties: ['Heritage', 'Amer Fort'],
          distanceKm: 1.2,
          lat: 26.9855,
          lng: 75.8513,
          verified: true,
          online: true,
          responseTime: '< 5 mins',
          completedTrips: 260
        };
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        setMatchedGuide(dummyGuide, otp, 4);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [status, matchedGuide, setMatchedGuide]);

  if (!isBookingModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative shadow-2xl">
        <button onClick={closeBookingModal} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1">
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        {status === 'SEARCHING' && (
          <div className="radar-sweep-bg p-8 rounded-2xl text-center space-y-6">
            <div className="radar-sweep-line"></div>
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto text-2xl font-bold animate-spin">
              <i className="fa-solid fa-compass"></i>
            </div>
            <div className="space-y-2 relative z-10">
              <h3 className="text-xl font-bold text-white font-heading">Finding Verified Local Hosts...</h3>
              <p className="text-slate-300 text-xs">Connecting to authenticated Jaipur guides near Amer Fort</p>
            </div>
          </div>
        )}

        {status === 'MATCHED' && matchedGuide && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Guide Matched ✓</span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-heading pt-2">{matchedGuide.name}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs">Arriving in approx <span className="text-amber-600 dark:text-amber-400 font-bold">{etaMinutes} mins</span></p>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <img src={matchedGuide.avatar} className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500" />
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white">⭐ {matchedGuide.rating} ({matchedGuide.reviewCount} reviews)</div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300">Languages: {matchedGuide.languages.join(", ")}</div>
                <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">₹{matchedGuide.hourlyRate}/hr • Verified Host</div>
              </div>
            </div>

            <div className="bg-slate-100 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-1">
              <div className="text-[10px] uppercase text-slate-500 dark:text-slate-400 font-bold">Start-Tour Verification OTP</div>
              <div className="text-3xl font-extrabold tracking-widest text-amber-600 dark:text-amber-400">{startOtp}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Provide this code to your guide upon arrival to start tour.</div>
            </div>

            <button
              onClick={() => {
                alert("Tour started! Added to My Trips.");
                resetBooking();
              }}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs transition shadow-md shadow-emerald-500/20"
            >
              Start Tour Now ✓
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
