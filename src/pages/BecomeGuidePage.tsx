import React, { useState } from 'react';
import { ShieldCheck, UserCheck, CheckCircle2, Clock, Sparkles, Upload, AlertCircle, ArrowRight } from 'lucide-react';
import { marketplaceStore } from '../services/store';
import { GuideVerification } from '../types';

export const BecomeGuidePage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState(25);
  const [city, setCity] = useState('Jaipur');
  const [languages, setLanguages] = useState('Hindi, English');
  const [areasKnown, setAreasKnown] = useState('Amber Fort, Johari Bazaar, Pink City');
  const [experienceYears, setExperienceYears] = useState(3);
  const [interests, setInterests] = useState('Heritage, Food, Architecture');
  const [whyChooseMe, setWhyChooseMe] = useState('');
  const [expectedPricePerDay, setExpectedPricePerDay] = useState(2500);
  const [emergencyContact, setEmergencyContact] = useState('');
  const [idDocName, setIdDocName] = useState('Government_ID_Verification.pdf');

  const [submittedApp, setSubmittedApp] = useState<GuideVerification | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const app = marketplaceStore.submitGuideApplication({
      guideId: `guide-${Date.now()}`,
      fullName,
      age,
      city,
      languages: languages.split(',').map(l => l.trim()),
      areasKnown: areasKnown.split(',').map(a => a.trim()),
      experienceYears,
      interests: interests.split(',').map(i => i.trim()),
      idDocName,
      whyChooseMe,
      expectedPricePerDay,
      emergencyContact: emergencyContact || '+91 98000 11223'
    });

    setSubmittedApp(app);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl text-center space-y-4 border border-slate-800">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Become a STHANIQ Verified Host
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Know Your City? <span className="text-emerald-400">Earn From It.</span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Students, local residents, and experienced tour leaders can apply to become verified local guides. Set your own fair prices and host travelers safely.
        </p>

        {/* Application Lifecycle Explanation */}
        <div className="pt-4 max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 space-y-1">
            <span className="text-amber-400 font-bold block">1. Apply Online</span>
            <p className="text-slate-400 text-[11px]">Fill profile & upload ID proof</p>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 space-y-1">
            <span className="text-indigo-400 font-bold block">2. Admin Verification</span>
            <p className="text-slate-400 text-[11px]">Identity checked & background review</p>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 space-y-1">
            <span className="text-emerald-400 font-bold block">3. Start Earning</span>
            <p className="text-slate-400 text-[11px]">Public marketplace listing active</p>
          </div>
        </div>
      </div>

      {/* Submission Success & Status Tracker */}
      {submittedApp ? (
        <div className="bg-white rounded-3xl p-8 border-2 border-emerald-500 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-900">Application Submitted Successfully!</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Your guide verification request for <strong>{submittedApp.city}</strong> has entered admin review.
            </p>
          </div>

          {/* Status Tracker Widget */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 max-w-md mx-auto">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Application Lifecycle Status</div>
            <div className="flex items-center justify-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-extrabold text-xs flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 animate-spin" /> {submittedApp.status}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Only approved guides appear publicly in the marketplace. You can switch to Admin Mode in the top navbar to approve this application.
            </p>
          </div>
        </div>
      ) : (
        /* Application Form */
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-900">Guide Verification Application</h3>
            <p className="text-xs text-slate-500">Provide accurate details. Identity proofs are verified by STHANIQ admins.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  min="18"
                  max="80"
                  required
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City / Primary Service Area</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jaipur, Delhi, Udaipur"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Languages Spoken</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hindi, English, French"
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Experience Years</label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Expected Daily Pricing (₹)</label>
                <input
                  type="number"
                  step="250"
                  value={expectedPricePerDay}
                  onChange={(e) => setExpectedPricePerDay(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-emerald-700 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Specific Areas & Monuments You Know Well</label>
              <input
                type="text"
                placeholder="e.g. Amber Fort, Johari Bazaar, Hawa Mahal"
                value={areasKnown}
                onChange={(e) => setAreasKnown(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Why Should Tourists Choose You?</label>
              <textarea
                rows={3}
                required
                placeholder="Share your passion for local storytelling, architectural history, or secret culinary spots..."
                value={whyChooseMe}
                onChange={(e) => setWhyChooseMe(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Identity Verification Document (Govt ID / Aadhaar)</label>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center bg-slate-50 space-y-2">
                <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                <span className="text-xs font-semibold text-slate-700 block">{idDocName}</span>
                <span className="text-[10px] text-slate-400 block">Identity documents are securely checked by STHANIQ safety team.</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition transform active:scale-95 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Submit Verification Application</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
