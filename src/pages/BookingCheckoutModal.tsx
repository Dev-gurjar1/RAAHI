import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, X, Lock, Calendar, Clock, MapPin, CreditCard } from 'lucide-react';
import { marketplaceStore } from '../services/store';
import { GuideProfile, Tour, Booking } from '../types';

interface BookingCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  guide?: GuideProfile;
  tour?: Tour;
  date?: string;
  travelersCount?: number;
  initialBooking?: Booking;
}

export const BookingCheckoutModal: React.FC<BookingCheckoutModalProps> = ({
  isOpen,
  onClose,
  guide,
  tour,
  date = '2026-08-25',
  travelersCount = 2,
  initialBooking
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD'>('UPI');
  const [upiId, setUpiId] = useState('tourist@upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(initialBooking || null);

  const navigate = useNavigate();

  if (!isOpen) return null;

  const itemTitle = tour ? tour.title : guide ? `${guide.name} — Verified Private Guide` : initialBooking?.title || 'Tour Booking';
  const price = tour ? tour.pricePerPerson * travelersCount : guide ? guide.startingPrice : initialBooking?.totalPrice || 2500;
  const meetingPoint = tour ? tour.meetingPoint : 'Hawa Mahal Main Gate / Agreed Location';
  const destination = tour ? tour.destination : guide ? guide.serviceAreas[0] : initialBooking?.destination || 'Jaipur';

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      let b: Booking;
      if (initialBooking) {
        b = initialBooking;
      } else if (tour) {
        b = marketplaceStore.bookTourDirect(tour.id, date, '09:00 AM', travelersCount);
      } else if (guide) {
        const commPct = marketplaceStore.getState().platformCommissionPercent / 100;
        const platformFee = Math.round(price * commPct);
        b = {
          id: `STH-${Math.floor(10000 + Math.random() * 90000)}`,
          touristId: 'user-tourist-demo',
          touristName: 'Aarav Patel',
          guideId: guide.id,
          guideName: guide.name,
          guideAvatar: guide.avatar,
          title: itemTitle,
          destination,
          date,
          time: '09:00 AM',
          travelersCount,
          totalPrice: price,
          platformFee,
          guideEarnings: price - platformFee,
          paymentStatus: 'PAID',
          bookingStatus: 'UPCOMING',
          meetingPoint,
          createdAt: new Date().toISOString()
        };
        marketplaceStore.getState().bookings.unshift(b);
      } else {
        b = marketplaceStore.getState().bookings[0];
      }

      setIsProcessing(false);
      setConfirmedBooking(b);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedBooking ? (
          /* Confirmation State */
          <div className="text-center space-y-5 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Payment Received & Booking Confirmed
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 pt-2">You're All Set for {confirmedBooking.destination}!</h2>
              <p className="text-xs text-slate-500 font-mono">Booking ID: {confirmedBooking.id}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Host Guide:</span>
                <span className="font-bold text-slate-900">{confirmedBooking.guideName || 'Verified Host'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Time:</span>
                <span className="font-bold text-slate-900">{confirmedBooking.date} at {confirmedBooking.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Meeting Point:</span>
                <span className="font-semibold text-slate-800">{confirmedBooking.meetingPoint}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                navigate('/my-trips');
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-xl text-sm shadow-lg transition"
            >
              View My Trips & Share Itinerary
            </button>
          </div>
        ) : (
          /* Checkout State */
          <div className="space-y-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                <Lock className="w-3.5 h-3.5 text-emerald-600" /> Secure 256-Bit Escrow Booking
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Review & Confirm Booking</h2>
            </div>

            {/* Item Summary */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">{itemTitle}</h4>
              <div className="flex justify-between text-slate-600">
                <span>Date: {date}</span>
                <span>Travelers: {travelersCount} Pax</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Meeting Point:</span>
                <span className="font-semibold text-slate-800">{meetingPoint}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-sm text-slate-900">
                <span>Total Amount:</span>
                <span className="text-emerald-700">₹{price.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <form onSubmit={handlePayment} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Payment Option</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                      paymentMethod === 'UPI' ? 'border-amber-500 bg-amber-50 text-brand-700' : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>UPI / GPay / PhonePe</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                      paymentMethod === 'CARD' ? 'border-amber-500 bg-amber-50 text-brand-700' : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Credit / Debit Card</span>
                  </button>
                </div>
              </div>

              {paymentMethod === 'UPI' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Enter UPI ID</label>
                  <input
                    type="text"
                    required
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Card Number (4000 1234 5678 9010)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="MM/YY" className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs" />
                    <input type="text" placeholder="CVV" className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs" />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-700 hover:to-amber-600 text-white font-extrabold py-3.5 rounded-xl text-sm shadow-lg shadow-amber-500/25 transition transform active:scale-95 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Processing Escrow Payment...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pay ₹{price.toLocaleString('en-IN')} & Confirm Booking</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
