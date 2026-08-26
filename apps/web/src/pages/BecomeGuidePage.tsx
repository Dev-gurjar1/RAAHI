import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, GuideVerificationStatus } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
];

export const BecomeGuidePage: React.FC = () => {
  const navigate = useNavigate();
  const { loginSuccess } = useAuthStore();
  const showToast = useToastStore((state) => state.showToast);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Jaipur');
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState(450);
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['Hindi', 'English']);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(['Heritage', 'Amer Fort']);
  const [uploadedDocument, setUploadedDocument] = useState<File | null>(null);
  
  const [demoStatus, setDemoStatus] = useState<GuideVerificationStatus>('Pending Verification');

  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      setSelectedLanguages(selectedLanguages.filter((l) => l !== lang));
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  const toggleSpecialty = (spec: string) => {
    if (selectedSpecialties.includes(spec)) {
      setSelectedSpecialties(selectedSpecialties.filter((s) => s !== spec));
    } else {
      setSelectedSpecialties([...selectedSpecialties, spec]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      showToast({
        type: 'warning',
        title: 'Missing Fields',
        message: 'Please fill in all required profile details.'
      });
      return;
    }

    const newGuideUser = {
      id: `guide_${Date.now()}`,
      name: fullName,
      phone: `+91 ${phone}`,
      email,
      avatar,
      role: 'guide' as const,
      verified: demoStatus === 'Verified',
      createdAt: new Date().toISOString(),
      city,
      languages: selectedLanguages,
      specialties: selectedSpecialties,
      bio,
      hourlyRate,
      idDocument: uploadedDocument ? uploadedDocument.name : 'Aadhaar_Govt_ID.pdf',
      verificationStatus: demoStatus
    };

    loginSuccess(newGuideUser);

    showToast({
      type: demoStatus === 'Verified' ? 'success' : 'info',
      title: demoStatus === 'Verified' ? 'Guide Account Active! 🎉' : 'Application Submitted! 📋',
      message: demoStatus === 'Verified' 
        ? 'Your local host account is verified and live.' 
        : 'Your guide verification is under review. Welcome to RAAHI!'
    });

    navigate('/guide');
  };

  return (
    <div className="space-y-10 text-left font-sans pb-16">
      
      {/* HERO BANNER SECTION */}
      <div className="bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 text-white p-8 sm:p-12 rounded-3xl shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold border border-white/30 backdrop-blur-md uppercase tracking-wider">
          <i className="fa-solid fa-user-check"></i> Local Host Partner Onboarding
        </span>

        <h1 className="text-3xl sm:text-5xl font-extrabold font-heading leading-tight max-w-3xl">
          Turn your local knowledge into income while helping travelers experience your city authentically.
        </h1>

        <p className="text-white/90 text-sm sm:text-base max-w-2xl leading-relaxed">
          Join India's verified local guide marketplace. Set your own hourly rate, host private heritage walks, and protect travelers from tourist traps and shopping scams.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs font-bold">
          <div className="bg-black/20 p-4 rounded-2xl border border-white/20 flex items-center gap-3">
            <i className="fa-solid fa-wallet text-amber-300 text-xl"></i>
            <div>
              <div>Set Own Hourly Rates</div>
              <div className="text-[10px] text-white/70 font-normal">Direct traveler payouts</div>
            </div>
          </div>

          <div className="bg-black/20 p-4 rounded-2xl border border-white/20 flex items-center gap-3">
            <i className="fa-solid fa-shield-check text-emerald-300 text-xl"></i>
            <div>
              <div>Aadhaar & KYC Clearance</div>
              <div className="text-[10px] text-white/70 font-normal">Govt-verified trust badge</div>
            </div>
          </div>

          <div className="bg-black/20 p-4 rounded-2xl border border-white/20 flex items-center gap-3">
            <i className="fa-solid fa-clock text-sky-300 text-xl"></i>
            <div>
              <div>Flexible Schedule</div>
              <div className="text-[10px] text-white/70 font-normal">Toggle Online anytime</div>
            </div>
          </div>
        </div>
      </div>

      {/* FORM SECTION */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-10 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-8 max-w-4xl mx-auto">
        <div className="border-b border-slate-100 dark:border-slate-700 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
              Local Guide Application Form
            </h2>
            <p className="text-xs text-slate-500">Provide your personal credentials and hosting preferences.</p>
          </div>

          {/* Demo Status Selector Toggle */}
          <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Simulated Verification Status</div>
            <div className="flex items-center gap-1.5 font-bold">
              {(['Pending Verification', 'Verified', 'Rejected'] as GuideVerificationStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setDemoStatus(st)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] transition ${
                    demoStatus === st
                      ? st === 'Verified'
                        ? 'bg-emerald-500 text-white'
                        : st === 'Pending Verification'
                        ? 'bg-amber-500 text-white'
                        : 'bg-rose-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs font-sans">
          
          {/* Basic Personal Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Mobile Phone Number *</label>
              <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden">
                <span className="px-3.5 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 border-r border-slate-300 dark:border-slate-700">+91</span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full bg-transparent p-3 text-slate-900 dark:text-white focus:outline-none text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya.sharma@example.com"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Primary Operating City *</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 text-xs font-semibold"
              >
                <option value="Jaipur">Jaipur (Pink City)</option>
                <option value="Udaipur">Udaipur (City of Lakes)</option>
                <option value="Jodhpur">Jodhpur (Blue City)</option>
                <option value="Delhi">Delhi NCR</option>
              </select>
            </div>
          </div>

          {/* Languages Selector */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Spoken Languages</label>
            <div className="flex flex-wrap gap-2">
              {['Hindi', 'English', 'French', 'German', 'Spanish', 'Japanese'].map((lang) => (
                <button
                  type="button"
                  key={lang}
                  onClick={() => toggleLanguage(lang)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    selectedLanguages.includes(lang)
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Areas of Expertise */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Areas of Expertise</label>
            <div className="flex flex-wrap gap-2">
              {['Heritage', 'Amer Fort', 'Secret Passages', 'Street Food Crawl', 'Royal Architecture', 'Photography', 'Artisan Bazaars'].map((spec) => (
                <button
                  type="button"
                  key={spec}
                  onClick={() => toggleSpecialty(spec)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                    selectedSpecialties.includes(spec)
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>

          {/* Bio & Hourly Rate */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Short Host Bio</label>
              <textarea
                rows={3}
                required
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your background story, passion for your city, and hosting philosophy..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 text-xs"
              ></textarea>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Hourly Rate (₹/hr) *</label>
              <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden">
                <span className="px-3.5 text-xs font-extrabold text-slate-500 bg-slate-100 dark:bg-slate-800 border-r border-slate-300 dark:border-slate-700">₹</span>
                <input
                  type="number"
                  required
                  min="200"
                  max="2000"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(parseInt(e.target.value) || 450)}
                  className="w-full bg-transparent p-3 text-slate-900 dark:text-white focus:outline-none font-extrabold text-sm"
                />
              </div>
            </div>
          </div>

          {/* Profile Photo Selector */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">Select Profile Photo Avatar</label>
            <div className="flex items-center gap-4">
              {PRESET_AVATARS.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Avatar ${idx}`}
                  onClick={() => setAvatar(url)}
                  className={`w-14 h-14 rounded-2xl object-cover cursor-pointer transition border-4 ${
                    avatar === url ? 'border-orange-500 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ID Verification Document Upload Placeholder */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Government Identity Verification Document (Aadhaar / Tourism License)
            </label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-4 text-center bg-slate-50/50 dark:bg-slate-900/50 relative hover:bg-slate-100/50 transition">
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => e.target.files && setUploadedDocument(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="space-y-1">
                <i className="fa-solid fa-shield-halved text-2xl text-emerald-500"></i>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {uploadedDocument ? uploadedDocument.name : 'Click to Upload Aadhaar / Govt Tourism License (PDF/PNG)'}
                </div>
                <div className="text-[10px] text-slate-400">Required for official verified local host badge</div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-2xl transition shadow-lg shadow-orange-500/25 uppercase tracking-wider text-xs flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-paper-plane"></i>
            <span>Submit Guide Partner Application</span>
          </button>
        </form>
      </div>
    </div>
  );
};
