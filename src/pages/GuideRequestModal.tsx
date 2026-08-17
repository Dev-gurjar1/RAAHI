import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Clock, Tag, MapPin, X, CheckCircle2, Sparkles } from 'lucide-react';
import { marketplaceStore } from '../services/store';

interface GuideRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideRequestModal: React.FC<GuideRequestModalProps> = ({ isOpen, onClose }) => {
  const [destination, setDestination] = useState('Jaipur');
  const [date, setDate] = useState('2026-08-22');
  const [travelersCount, setTravelersCount] = useState(2);
  const [durationHours, setDurationHours] = useState(6);
  const [budget, setBudget] = useState(3000);
  const [language, setLanguage] = useState('Hindi + English');
  const [interests, setInterests] = useState<string[]>(['Heritage', 'Food']);
  const [specialRequirements, setSpecialRequirements] = useState(
    'We want a private heritage tour covering Amber Fort and authentic street food.'
  );

  const navigate = useNavigate();

  if (!isOpen) return null;

  const toggleInterest = (item: string) => {
    if (interests.includes(item)) {
      setInterests(interests.filter(i => i !== item));
    } else {
      setInterests([...interests, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const req = marketplaceStore.createTouristRequest({
      destination,
      date,
      travelersCount,
      durationHours,
      interests,
      language,
      budget,
      specialRequirements
    });

    onClose();
    // Navigate to request comparison page
    navigate(`/request-offers?requestId=${req.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-brand-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" /> STHANIQ Guide Bidding System
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Post Guide Request</h2>
          <p className="text-xs text-slate-500">
            Tell verified local guides what you need. Receive competing custom offers and compare inclusions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Destination */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Destination City</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
                />
                <MapPin className="w-4 h-4 text-amber-500 absolute right-3 top-3" />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tour Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Travelers */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Travelers</label>
              <input
                type="number"
                min="1"
                max="20"
                value={travelersCount}
                onChange={(e) => setTravelersCount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Duration (Hrs)</label>
              <input
                type="number"
                min="2"
                max="12"
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Budget (₹)</label>
              <input
                type="number"
                step="250"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500 font-bold text-brand-600"
              />
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Interests</label>
            <div className="flex flex-wrap gap-2">
              {['Heritage', 'Food', 'Photography', 'Shopping', 'Culture', 'Spiritual'].map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => toggleInterest(item)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    interests.includes(item)
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Language</label>
            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="e.g. Hindi + English"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Special Requirements */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Special Requirements / Notes</label>
            <textarea
              rows={2}
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-700 hover:to-amber-600 text-white font-extrabold py-3.5 rounded-xl text-sm shadow-lg shadow-amber-500/25 transition transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Users className="w-4 h-4" />
            <span>Submit Request & Get Guide Bids</span>
          </button>
        </form>
      </div>
    </div>
  );
};
