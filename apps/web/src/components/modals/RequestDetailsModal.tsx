import React from 'react';
import { TouristBooking } from '../../store/useBookingStore';

interface RequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: TouristBooking | null;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
}

export const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({
  isOpen,
  onClose,
  booking,
  onAccept,
  onDecline
}) => {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-left font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative shadow-2xl overflow-y-auto max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 transition"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase text-orange-600 bg-orange-50 dark:bg-orange-500/10 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-500/20">
              BOOKING REQUEST DETAILS
            </span>
            <span
              className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${
                booking.status === 'Confirmed'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-300'
                  : booking.status === 'Pending'
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-300'
                  : booking.status === 'Completed'
                  ? 'bg-sky-50 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400 border-sky-300'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border-rose-300'
              }`}
            >
              {booking.status}
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading pt-1">
            Request #{booking.id}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tour requested by traveler for host <span className="font-bold text-slate-900 dark:text-white">{booking.guideName}</span>.
          </p>
        </div>

        {/* Details Grid */}
        <div className="space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Scheduled Date</span>
              <span className="font-extrabold text-slate-900 dark:text-white text-sm">{booking.date}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Start Time & Duration</span>
              <span className="font-extrabold text-slate-900 dark:text-white text-sm">{booking.startTime} ({booking.durationHours} Hours)</span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Meeting Location</span>
            <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 text-sm">
              <i className="fa-solid fa-location-dot text-orange-500"></i>
              <span>{booking.meetingPoint}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Travelers Count</span>
              <span className="font-extrabold text-slate-900 dark:text-white">{booking.travelersCount} Guest(s)</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Net Payout to Host</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-base">₹{booking.hourlySubtotal}</span>
            </div>
          </div>

          {booking.specialRequirements && (
            <div className="bg-amber-50 dark:bg-amber-500/10 p-4 rounded-2xl border border-amber-200 dark:border-amber-500/30 space-y-1">
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase block">Traveler Special Notes</span>
              <p className="text-amber-900 dark:text-amber-200 italic">"{booking.specialRequirements}"</p>
            </div>
          )}

          {/* OTP Box for Active/Confirmed bookings */}
          {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
            <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 block">Start-Tour Verification OTP</span>
                <span className="text-xl font-black tracking-widest text-amber-400 font-heading">{booking.startOtp}</span>
              </div>
              <p className="text-[10px] text-slate-400 text-right max-w-[180px]">
                Verify this 4-digit code in person with the tourist when beginning the tour.
              </p>
            </div>
          )}

        </div>

        {/* Action Buttons */}
        {booking.status === 'Pending' && onAccept && onDecline && (
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => {
                onDecline(booking.id);
                onClose();
              }}
              className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 hover:text-rose-600 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-xs transition"
            >
              Decline Request
            </button>
            <button
              onClick={() => {
                onAccept(booking.id);
                onClose();
              }}
              className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-2xl text-xs transition shadow-lg shadow-emerald-500/25 uppercase tracking-wider"
            >
              Accept Request ✓
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
