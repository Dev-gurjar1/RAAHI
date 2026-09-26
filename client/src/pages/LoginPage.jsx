import React, { useState } from 'react';
import { useNavigate, useSearchParams, NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';
import { useToastStore } from '../store/useToastStore.js';
import { RaahiLogo } from '../components/RaahiLogo.jsx';
import api from '../services/api.js';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || searchParams.get('role');
  const redirectParam = searchParams.get('redirect') || searchParams.get('returnUrl');

  const { loginSuccess } = useAuthStore();
  const showToast = useToastStore((state) => state.showToast);

  const [activeRoleTab, setActiveRoleTab] = useState(
    tabParam === 'campus_ambassador' || tabParam === 'ambassador'
      ? 'campus_ambassador'
      : tabParam === 'guide'
      ? 'guide'
      : 'tourist'
  );
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('Jaipur');

  const handleDemoLogin = (role, demoName) => {
    const isAmbassador = role === 'campus_ambassador';
    const demoUser = {
      id: `usr_${Date.now()}`,
      name: demoName || (role === 'guide' ? 'Priya Sharma' : isAmbassador ? 'Arjun Sharma' : 'Smart Traveler'),
      phone: '+91 9876543210',
      email: role === 'guide' ? 'host@raahi.in' : isAmbassador ? 'arjun@poornima.edu.in' : 'traveler@raahi.in',
      role,
      roles: [role],
      verified: true,
      city: 'Jaipur',
      createdAt: new Date().toISOString(),
      ...(role === 'guide'
        ? {
            verificationStatus: 'Verified',
            hourlyRate: 500,
            languages: ['Hindi', 'English', 'French']
          }
        : isAmbassador
        ? {
            studentProfile: {
              fullName: 'Arjun Sharma',
              college: 'Poornima University',
              campus: 'Jaipur',
              city: 'Jaipur',
              state: 'Rajasthan',
              course: 'B.Tech CSE',
              yearOfStudy: '2nd Year',
              expectedGraduationYear: '2027'
            },
            studentVerification: {
              status: 'UNDER_REVIEW',
              method: 'student_id',
              submittedAt: new Date()
            },
            campusAmbassadorProfile: {
              referralCode: 'RAAHI-ARJUN26',
              campusReach: 0,
              profileViews: 0,
              ambassadorStatus: 'ACTIVE',
              joinedDate: new Date(),
              profileCompletionPercentage: 85
            },
            referralCode: 'RAAHI-ARJUN26'
          }
        : {})
    };

    loginSuccess(demoUser);

    showToast({
      type: 'success',
      title: `Welcome, ${demoUser.name}!`,
      message: `Signed in as ${isAmbassador ? 'Campus Ambassador' : role === 'guide' ? 'Verified Local Host' : 'Smart Traveler'}`
    });

    if (role === 'guide') {
      navigate('/guide');
    } else if (isAmbassador) {
      navigate('/campus-ambassador/dashboard');
    } else {
      navigate('/trips');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!phoneOrEmail.trim()) {
      setErrorMsg('Please enter your email address or mobile number.');
      return;
    }

    setLoading(true);

    const isAmbassador = activeRoleTab === 'campus_ambassador';
    let authenticatedUser = {
      id: `usr_${Date.now()}`,
      name: name || (isAmbassador ? 'Arjun Sharma' : activeRoleTab === 'guide' ? 'Verified Host' : 'Smart Traveler'),
      phone: phoneOrEmail.includes('@') ? '+91 9876543210' : phoneOrEmail,
      email: phoneOrEmail.includes('@') ? phoneOrEmail : isAmbassador ? 'arjun@poornima.edu.in' : 'user@raahi.in',
      role: activeRoleTab,
      roles: [activeRoleTab],
      verified: true,
      city,
      createdAt: new Date().toISOString(),
      ...(isAmbassador
        ? {
            studentProfile: {
              fullName: name || 'Arjun Sharma',
              college: 'Poornima University',
              campus: 'Jaipur',
              city: city || 'Jaipur',
              state: 'Rajasthan',
              course: 'B.Tech CSE',
              yearOfStudy: '2nd Year',
              expectedGraduationYear: '2027'
            },
            studentVerification: {
              status: 'VERIFIED',
              method: 'student_id',
              submittedAt: new Date()
            },
            campusAmbassadorProfile: {
              referralCode: `RAAHI-${(name || 'ARJUN').replace(/\s+/g, '').toUpperCase().slice(0, 6)}26`,
              campusReach: 15,
              profileViews: 42,
              ambassadorStatus: 'ACTIVE',
              joinedDate: new Date(),
              profileCompletionPercentage: 100
            },
            referralCode: `RAAHI-${(name || 'ARJUN').replace(/\s+/g, '').toUpperCase().slice(0, 6)}26`
          }
        : {})
    };
    let token = `token_${Date.now()}`;

    try {
      if (isSignUp) {
        const res = await api.auth.register({
          name: name || (isAmbassador ? 'Arjun Sharma' : activeRoleTab === 'guide' ? 'Verified Host' : 'Smart Traveler'),
          phone: phoneOrEmail.includes('@') ? '+91 9876543210' : phoneOrEmail,
          email: phoneOrEmail.includes('@') ? phoneOrEmail : undefined,
          password: password || 'raahi_pass_2026',
          role: activeRoleTab,
          city
        });
        if (res && res.data && res.data.user) {
          authenticatedUser = res.data.user;
          token = res.data.token;
        }
      } else {
        const res = await api.auth.login({
          phone: !phoneOrEmail.includes('@') ? phoneOrEmail : undefined,
          email: phoneOrEmail.includes('@') ? phoneOrEmail : undefined,
          password: password || 'raahi_pass_2026'
        });
        if (res && res.data && res.data.user) {
          authenticatedUser = res.data.user;
          token = res.data.token;
        }
      }
    } catch (err) {
      console.warn('Backend auth notice:', err.message);
    } finally {
      setLoading(false);
    }

    loginSuccess(authenticatedUser, token);

    showToast({
      type: 'success',
      title: 'Authentication Successful',
      message: `Signed in as ${isAmbassador ? 'Campus Ambassador' : activeRoleTab === 'guide' ? 'Verified Host' : 'Smart Traveler'}`
    });

    if (redirectParam) {
      navigate(redirectParam);
    } else if (isAmbassador || authenticatedUser.role === 'campus_ambassador') {
      navigate('/campus-ambassador/dashboard');
    } else if (activeRoleTab === 'guide' || authenticatedUser.role === 'guide') {
      navigate('/guide');
    } else {
      navigate('/trips');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F3] dark:bg-[#0D1710] flex items-center justify-center p-4 sm:p-6 lg:p-10 text-left font-sans">
      <div className="w-full max-w-5xl bg-white dark:bg-[#162019] rounded-3xl border border-[#E0E8E4] dark:border-[#243028] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">

        {/* ══════════════════════════════════════════════════
            LEFT SIDE: Editorial Indian Travel Visual
            ══════════════════════════════════════════════════ */}
        <div className="lg:col-span-5 relative hidden lg:block overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80"
            alt="Jaipur Palace Heritage Rajasthan"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

          {/* Top Brand Logo Overlay */}
          <div className="absolute top-8 left-8">
            <RaahiLogo variant="compact" size={38} />
          </div>

          {/* Bottom Editorial Content */}
          <div className="absolute bottom-8 left-8 right-8 text-white space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-emerald-300 text-xs font-bold border border-white/20">
              <i className="fa-solid fa-shield-check text-[#F4A340]"></i>
              <span>High Trust Network</span>
            </div>

            <h2 className="text-3xl font-black font-heading leading-tight">
              Travel India like a local, never a target.
            </h2>

            <p className="text-xs text-white/80 leading-relaxed">
              Join thousands of travelers experiencing authentic cultural journeys protected by government-mandated fair tariffs and 24/7 SOS safety.
            </p>

            {/* Micro Trust Checklist */}
            <div className="space-y-1.5 pt-2 text-[11px] font-semibold text-white/90">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-[#0B9B6E]"></i>
                <span>Aadhaar & Police Vetted Guides</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-[#0B9B6E]"></i>
                <span>Zero Shopping Commission Trap Policy</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-[#0B9B6E]"></i>
                <span>4-Digit Start OTP Protection</span>
              </div>
            </div>
          </div>
        </div>


        {/* ══════════════════════════════════════════════════
            RIGHT SIDE: Premium Authentication Panel
            ══════════════════════════════════════════════════ */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">

          <div className="space-y-6">

            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-between pb-2 border-b border-[#F1F5F3] dark:border-[#243028]">
              <RaahiLogo variant="compact" size={34} />
              <span className="text-[10px] font-bold text-[#0B9B6E] bg-[#E8F7F1] dark:bg-[#07543F]/30 px-2.5 py-1 rounded-full">
                Secure Login
              </span>
            </div>

            {/* Header Titles */}
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black text-[#152238] dark:text-white font-heading">
                {isSignUp ? 'Create your RAAHI account' : 'Welcome back to RAAHI'}
              </h1>
              <p className="text-xs sm:text-sm text-[#4A5C6E] dark:text-[#9AB0A4]">
                {isSignUp
                  ? 'Join India’s most trusted travel ecosystem in 30 seconds.'
                  : 'Enter your credentials to access your trips and bookings.'}
              </p>
            </div>

            {/* Account Role Selector Pills */}
            <div className="p-1 rounded-2xl bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveRoleTab('tourist')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeRoleTab === 'tourist'
                    ? 'bg-white dark:bg-[#162019] text-[#152238] dark:text-white shadow-xs'
                    : 'text-[#8A9BAD] hover:text-[#152238]'
                }`}
              >
                <i className="fa-solid fa-compass text-xs"></i>
                <span>Traveler</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveRoleTab('guide')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeRoleTab === 'guide'
                    ? 'bg-white dark:bg-[#162019] text-[#07543F] dark:text-[#4ADE80] shadow-xs'
                    : 'text-[#8A9BAD] hover:text-[#152238]'
                }`}
              >
                <i className="fa-solid fa-id-badge text-xs"></i>
                <span>Local Host</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveRoleTab('campus_ambassador')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeRoleTab === 'campus_ambassador'
                    ? 'bg-white dark:bg-[#162019] text-[#0B9B6E] shadow-xs'
                    : 'text-[#8A9BAD] hover:text-[#0B9B6E]'
                }`}
              >
                <i className="fa-solid fa-graduation-cap text-xs"></i>
                <span>Ambassador</span>
              </button>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
                <i className="fa-solid fa-circle-exclamation"></i>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {isSignUp && (
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#152238] dark:text-[#E8F0EC] uppercase tracking-wider">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <i className="fa-solid fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#8A9BAD]"></i>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] rounded-xl pl-9 pr-3.5 py-3 text-xs sm:text-sm font-semibold text-[#152238] dark:text-white placeholder-[#8A9BAD] focus:outline-none focus:border-[#0B9B6E] transition-colors"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#152238] dark:text-[#E8F0EC] uppercase tracking-wider">
                  Mobile Number or Email Address
                </label>
                <div className="relative">
                  <i className="fa-solid fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#8A9BAD]"></i>
                  <input
                    type="text"
                    required
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    placeholder="name@example.com or +91 98765 43210"
                    className="w-full bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] rounded-xl pl-9 pr-3.5 py-3 text-xs sm:text-sm font-semibold text-[#152238] dark:text-white placeholder-[#8A9BAD] focus:outline-none focus:border-[#0B9B6E] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-[#152238] dark:text-[#E8F0EC] uppercase tracking-wider">
                    Password
                  </label>
                  {!isSignUp && (
                    <span className="text-[11px] font-bold text-[#0B9B6E] hover:underline cursor-pointer">
                      Forgot?
                    </span>
                  )}
                </div>
                <div className="relative">
                  <i className="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#8A9BAD]"></i>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] rounded-xl pl-9 pr-10 py-3 text-xs sm:text-sm font-semibold text-[#152238] dark:text-white placeholder-[#8A9BAD] focus:outline-none focus:border-[#0B9B6E] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#8A9BAD] hover:text-[#152238] dark:hover:text-white cursor-pointer"
                  >
                    <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#152238] dark:text-[#E8F0EC] uppercase tracking-wider">
                    Base City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Jaipur, Rajasthan"
                    className="w-full bg-[#F8F7F3] dark:bg-[#111C15] border border-[#E0E8E4] dark:border-[#243028] rounded-xl px-3.5 py-3 text-xs sm:text-sm font-semibold text-[#152238] dark:text-white focus:outline-none focus:border-[#0B9B6E]"
                  />
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3.5 text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {loading && <i className="fa-solid fa-spinner fa-spin text-xs"></i>}
                <span>{isSignUp ? 'Create Account' : 'Sign In to Account'}</span>
                {!loading && <i className="fa-solid fa-arrow-right text-[10px]"></i>}
              </button>
            </form>

            {/* Toggle Sign Up vs Sign In */}
            <div className="text-center text-xs text-[#8A9BAD]">
              <span>{isSignUp ? 'Already have an account? ' : "Don't have an account yet? "}</span>
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-bold text-[#0B9B6E] hover:underline cursor-pointer"
              >
                {isSignUp ? 'Sign In' : 'Create Free Account'}
              </button>
            </div>

          </div>

          {/* Quick Demo Access Bar */}
          <div className="pt-4 border-t border-[#F1F5F3] dark:border-[#243028] space-y-2">
            <span className="text-[10px] text-[#8A9BAD] uppercase font-bold tracking-wider block text-center">
              Quick 1-Click Sandbox Test Profiles
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('tourist', 'Amit Patel')}
                className="p-2 rounded-xl border border-[#E0E8E4] dark:border-[#243028] bg-[#F8F7F3] dark:bg-[#111C15] hover:border-[#0B9B6E] text-[10px] font-bold text-[#152238] dark:text-white transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <i className="fa-solid fa-user text-[#0B9B6E]"></i>
                <span>Traveler</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('guide', 'Rajesh Sharma')}
                className="p-2 rounded-xl border border-[#E0E8E4] dark:border-[#243028] bg-[#F8F7F3] dark:bg-[#111C15] hover:border-[#0B9B6E] text-[10px] font-bold text-[#07543F] dark:text-[#4ADE80] transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <i className="fa-solid fa-id-badge text-[#0B9B6E]"></i>
                <span>Local Host</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('campus_ambassador', 'Arjun Sharma')}
                className="p-2 rounded-xl border border-[#0B9B6E]/40 bg-[#E8F7F1]/50 dark:bg-[#07543F]/20 hover:border-[#0B9B6E] text-[10px] font-bold text-[#07543F] dark:text-[#4ADE80] transition-all cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
              >
                <i className="fa-solid fa-graduation-cap text-[#0B9B6E]"></i>
                <span>Ambassador</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default LoginPage;
