import React, { useState } from 'react';
import { Booking } from '../types';
import { ShieldCheck, Share2, Copy, Check, PhoneCall, MapPin, Calendar, UserCheck, X } from 'lucide-react';

interface ShareTripModalProps {
  booking: Booking;
  onClose: () => void;
}

export const ShareTripModal: React.FC<ShareTripModalProps> = ({ booking, onClose }) => {
  const [copied, setCopied] = useState(false);

  const shareText = `STHANIQ Safety Trip Share:
Trip: ${booking.title} (${booking.destination})
Date: ${booking.date} at ${booking.time}
Booking ID: ${booking.id}
Verified Guide: ${booking.guideName || 'Verified Local Host'}
Meeting Point: ${booking.meetingPoint}
STHANIQ Verified Trust Status: Verified Local Guide Identity Checked
Emergency Helpline: +91 98290 12345`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Share Trip Details</h3>
            <p className="text-xs text-slate-500">Keep family & trusted contacts updated on your live itinerary</p>
          </div>
        </div>

        {/* Live Card Preview */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> STHANIQ Verified Trip
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {booking.id}</span>
          </div>

          <div>
            <h4 className="font-bold text-base text-white">{booking.title}</h4>
            <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" /> {booking.destination}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Verified Local Guide</span>
              <span className="font-semibold text-white flex items-center gap-1 mt-0.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> {booking.guideName || 'Local Host'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Schedule</span>
              <span className="font-semibold text-white flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> {booking.date}
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-300 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Meeting Point</span>
            <p className="font-medium bg-slate-800 p-2 rounded-lg text-slate-200 border border-slate-700 text-[11px]">
              {booking.meetingPoint}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Share Text'}</span>
          </button>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-3 rounded-xl text-sm flex items-center gap-2 transition"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
