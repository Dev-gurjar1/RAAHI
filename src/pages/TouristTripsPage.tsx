import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Calendar,
  ShieldCheck,
  Share2,
  AlertTriangle,
  Star,
  UserCheck
} from 'lucide-react';
import { marketplaceStore } from '../services/store';
import type { Booking } from '../types';
import { ShareTripModal } from '../components/ShareTripModal';

export const TouristTripsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'>('UPCOMING');
  const [bookings, setBookings] = useState<Booking[]>(marketplaceStore.getState().bookings);

  const [shareBooking, setShareBooking] = useState<Booking | null>(null);

  // Review Modal State
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [overallRating, setOverallRating] = useState(5);
  const [comment, setComment] = useState('Rahul was amazing! Very knowledgeable and punctual.');

  // Report Modal State
  const [reportBooking, setReportBooking] = useState<Booking | null>(null);
  const [reportReason, setReportReason] = useState<'Misleading price' | 'Unsafe behaviour' | 'No-show' | 'Misrepresentation' | 'Harassment' | 'Other'>('Misleading price');
  const [reportDesc, setReportDesc] = useState('');

  useEffect(() => {
    return marketplaceStore.subscribe(() => {
      setBookings(marketplaceStore.getState().bookings);
    });
  }, []);

  const filtered = bookings.filter(b => b.bookingStatus === activeTab);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBooking) return;

    marketplaceStore.submitReview({
      bookingId: reviewBooking.id,
      touristId: 'user-tourist-demo',
      touristName: 'Aarav Patel',
      touristAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      guideId: reviewBooking.guideId || 'guide-rahul',
      overallRating,
      knowledgeRating: overallRating,
      behaviourRating: overallRating,
      punctualityRating: overallRating,
      communicationRating: overallRating,
      valueRating: overallRating,
      comment,
      wouldRecommend: true
    });

    setReviewBooking(null);
    alert('Thank you! Your review has been recorded.');
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportBooking) return;

    marketplaceStore.submitReport({
      reporterId: 'user-tourist-demo',
      reporterName: 'Aarav Patel',
      guideId: reportBooking.guideId || 'guide-rahul',
      guideName: reportBooking.guideName || 'Guide',
      reason: reportReason,
      description: reportDesc || 'Report details...'
    });

    setReportBooking(null);
    alert('Report submitted to Admin Moderation.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl space-y-3 border border-slate-800">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-extrabold">
          <Briefcase className="w-4 h-4 text-amber-400" /> My Trips & Bookings Management
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold">Your Travel Itineraries</h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
          Track upcoming local guide bookings, share trip safety links with contacts, leave verified reviews, or report issues.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 flex flex-wrap gap-1">
        {(['UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition ${
              activeTab === tab ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab} TRIPS ({bookings.filter(b => b.bookingStatus === tab).length})
          </button>
        ))}
      </div>

      {/* Trips Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No {activeTab.toLowerCase()} trips found</h3>
          <p className="text-xs text-slate-500">Book a verified guide or tour package to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => (
            <div key={b.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Booking ID: {b.id}</span>
                  <h3 className="font-extrabold text-slate-900 text-lg">{b.title}</h3>
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-extrabold text-xs px-3 py-1 rounded-full">
                  {b.bookingStatus} • {b.paymentStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Verified Host Guide</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> {b.guideName || 'Local Host'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Date & Time</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{b.date} at {b.time}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Travelers</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{b.travelersCount} Pax</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Paid Total</span>
                  <span className="font-extrabold text-emerald-700 mt-0.5 block">₹{b.totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="text-xs text-slate-700 bg-amber-50/50 p-3 rounded-xl border border-amber-200/50">
                <strong>Meeting Point:</strong> {b.meetingPoint}
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setShareBooking(b)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
                >
                  <Share2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Share Trip Details</span>
                </button>

                {activeTab === 'COMPLETED' && !b.isReviewed && (
                  <button
                    onClick={() => setReviewBooking(b)}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
                  >
                    <Star className="w-3.5 h-3.5 fill-white" />
                    <span>Leave Review</span>
                  </button>
                )}

                <button
                  onClick={() => setReportBooking(b)}
                  className="text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl text-xs font-bold border border-rose-200 transition flex items-center gap-1 ml-auto"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Report Issue</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Share Trip Safety Modal */}
      {shareBooking && <ShareTripModal booking={shareBooking} onClose={() => setShareBooking(null)} />}

      {/* Review Modal */}
      {reviewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Review Your Local Guide</h3>
            <div className="flex gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setOverallRating(star)}>
                  <Star className={`w-7 h-7 ${star <= overallRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
            />
            <div className="flex gap-2">
              <button onClick={handleReviewSubmit} className="flex-1 bg-amber-500 text-white font-bold py-2.5 rounded-xl text-xs">
                Submit Review
              </button>
              <button onClick={() => setReviewBooking(null)} className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Report Issue with Guide</h3>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
            >
              <option value="Misleading price">Misleading price</option>
              <option value="Unsafe behaviour">Unsafe behaviour</option>
              <option value="No-show">No-show</option>
              <option value="Misrepresentation">Misrepresentation</option>
              <option value="Harassment">Harassment</option>
              <option value="Other">Other</option>
            </select>
            <textarea
              rows={3}
              placeholder="Describe the issue for admin moderation..."
              value={reportDesc}
              onChange={(e) => setReportDesc(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
            />
            <div className="flex gap-2">
              <button onClick={handleReportSubmit} className="flex-1 bg-rose-600 text-white font-bold py-2.5 rounded-xl text-xs">
                File Safety Report
              </button>
              <button onClick={() => setReportBooking(null)} className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
