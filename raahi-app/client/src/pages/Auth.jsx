import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserCheck, Compass, ArrowRight, KeyRound, Edit2, IdCard, CheckCircle2 } from 'lucide-react';

export const Auth = ({ onLoginSuccess }) => {
  const [stage, setStage] = useState('PHONE'); // 'PHONE' | 'OTP' | 'CHOOSE_ROLE'
  const [selectedRole, setSelectedRole] = useState('tourist');
  const [phone, setPhone] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // Stage 1: Google OAuth Direct Action -> Move to Stage 3 (Choose Role)
  const handleGoogleAuth = () => {
    setError('');
    setStage('CHOOSE_ROLE');
  };

  // Stage 1: Submit Phone Number -> Move to Stage 2 (OTP)
  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setStage('OTP');
    setTimeout(() => {
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    }, 100);
  };

  // Stage 2: OTP Input & Auto-Advance Focus
  const handleOtpInputChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otpDigits];
    newOtp[index] = value.slice(-1);
    setOtpDigits(newOtp);

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Stage 2: Backspace Key Navigation
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
        const newOtp = [...otpDigits];
        newOtp[index - 1] = '';
        setOtpDigits(newOtp);
      }
    }
  };

  // Stage 2: Verify OTP -> Move to Stage 3 (Choose Role)
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const code = otpDigits.join('');
    if (code.length < 6) {
      setError('Please enter all 6 OTP digits');
      return;
    }
    setError('');
    setStage('CHOOSE_ROLE');
  };

  // Stage 3: Complete Role Selection Onboarding
  const handleCompleteOnboarding = () => {
    setLoading(true);
    setTimeout(() => {
      const mockUser = {
        _id: `user-${Date.now()}`,
        name: selectedRole === 'guide' ? 'Rahul Verma (Guide)' : 'Verified Traveler',
        phone: phone ? `+91 ${phone}` : '+91 98765 43210',
        role: selectedRole,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        isKycVerified: true,
        city: 'Jaipur'
      };
      const mockToken = `raahi_token_${Date.now()}`;
      if (onLoginSuccess) onLoginSuccess(mockUser, mockToken);
      setLoading(false);
      navigate(selectedRole === 'guide' ? '/guide' : '/tourist');
    }, 400);
  };

  return (
    <div className="max-w-md mx-auto my-10 px-4 py-6 space-y-6 relative">
      {/* Background Radial Glow */}
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center space-y-2 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-slate-950 mx-auto shadow-xl shadow-amber-500/20">
          <ShieldCheck className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h2 className="text-3xl font-black text-white">
          {stage === 'CHOOSE_ROLE' ? 'Choose Your RAAHI Role' : 'Sign In to RAAHI'}
        </h2>
        <p className="text-xs text-slate-400">
          {stage === 'CHOOSE_ROLE'
            ? 'Select how you will be using RAAHI today'
            : 'Access verified local guides, price shield & scam protection'}
        </p>
      </div>

      {/* Auth Card Container */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/30 space-y-6 shadow-2xl relative z-10">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs font-bold">
            ⚠️ {error}
          </div>
        )}

        {/* STAGE 1: Phone & Google Direct Auth */}
        {stage === 'PHONE' && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 font-extrabold py-3 px-4 rounded-2xl text-xs transition flex items-center justify-center gap-3 shadow-md group"
            >
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.1 0-5.74-2.09-6.68-4.91H1.36v3.15C3.34 21.32 7.39 24 12 24z"/>
                <path fill="#FBBC05" d="M5.32 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.56H1.36C.49 8.29 0 10.09 0 12s.49 3.71 1.36 5.44l3.96-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.39 0 3.34 2.68 1.36 6.56l3.96 3.15c.94-2.82 3.58-4.96 6.68-4.96z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">or continue with phone OTP</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-1">Mobile Phone Number</label>
                <div className="flex items-center bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden focus-within:border-amber-500 transition">
                  <span className="bg-slate-800 text-amber-400 font-black px-3.5 py-3 text-xs border-r border-slate-700 flex items-center gap-1.5">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-transparent text-white px-3 py-3 text-xs font-bold font-mono outline-none tracking-wider placeholder:text-slate-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3.5 rounded-2xl text-xs transition shadow-lg flex items-center justify-center gap-2"
              >
                <span>Get 6-Digit Verification Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* STAGE 2: 6-Digit OTP Entry */}
        {stage === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="text-center space-y-1">
              <span className="text-xs text-slate-300 font-bold block">Enter 6-Digit Code sent to:</span>
              <span className="text-sm font-black font-mono text-amber-400">+91 {phone}</span>
            </div>

            <div className="flex justify-between gap-2 px-1">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpInputChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-11 h-12 bg-slate-900 border border-slate-700 focus:border-amber-500 text-amber-400 font-mono font-black text-center text-lg rounded-xl outline-none transition"
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setStage('PHONE')}
                className="text-slate-400 hover:text-white font-bold flex items-center gap-1 transition"
              >
                <Edit2 className="w-3.5 h-3.5" /> Change Number
              </button>
              <button
                type="button"
                onClick={() => setError('New 6-digit code sent: 489201')}
                className="text-amber-400 hover:underline font-bold"
              >
                Resend Code
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black py-3.5 rounded-2xl text-xs transition shadow-lg flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify & Continue</span>
            </button>
          </form>
        )}

        {/* STAGE 3: Post-Login Role Selection Screen */}
        {stage === 'CHOOSE_ROLE' && (
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <span className="text-xs text-emerald-400 font-mono font-bold uppercase tracking-wider block">✓ Account Verified</span>
              <h4 className="text-lg font-black text-white">Select Your Application Role</h4>
            </div>

            <div className="space-y-3">
              {/* Tourist Role Card */}
              <div
                onClick={() => setSelectedRole('tourist')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start gap-3.5 ${
                  selectedRole === 'tourist'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/30 text-amber-400 flex items-center justify-center font-black shrink-0 mt-0.5">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-black text-white text-sm">I am a Tourist / Traveler</h5>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">Book 100% identity-verified local guides & check fair transit rates.</p>
                </div>
              </div>

              {/* Guide Role Card */}
              <div
                onClick={() => setSelectedRole('guide')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start gap-3.5 ${
                  selectedRole === 'guide'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/30 text-emerald-400 flex items-center justify-center font-black shrink-0 mt-0.5">
                  <IdCard className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-black text-white text-sm">I am a Local Tour Guide</h5>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">Go online for live dispatch pings, publish custom tour packages & earn safely.</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={handleCompleteOnboarding}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3.5 rounded-2xl text-xs transition shadow-lg flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Entering Dashboard...' : `Enter as ${selectedRole === 'guide' ? 'Local Tour Guide' : 'Tourist / Traveler'}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Trust Footer Banner */}
        <div className="pt-4 border-t border-slate-800 text-center flex items-center justify-center gap-2 text-[11px] text-slate-400 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Government verified guides & anti-scam protection</span>
        </div>
      </div>
    </div>
  );
};

export default Auth;
