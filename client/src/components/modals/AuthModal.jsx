import React from 'react';
import { useAuthStore } from '../../store/useAuthStore.js';
import { useToastStore } from '../../store/useToastStore.js';
import { OTPInput } from '../inputs/OTPInput.jsx';
import { RaahiLogo } from '../RaahiLogo.jsx';
import api from '../../services/api.js';

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    stage,
    setStage,
    phone,
    setPhone,
    setRole,
    loginSuccess
  } = useAuthStore();

  const showToast = useToastStore((state) => state.showToast);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      showToast({
        type: 'warning',
        title: 'Invalid Mobile',
        message: 'Please enter a valid 10-digit mobile number.'
      });
      return;
    }
    
    try {
      await api.auth.sendOtp(phone);
    } catch (e) {
      console.warn('API send-otp fallback:', e.message);
    }

    setStage(2);
    showToast({
      type: 'info',
      title: 'Demo OTP Sent',
      message: 'Code is 123456 (auto-filled ready)'
    });
  };

  const handleVerifyOtp = (otp) => {
    if (otp === '123456' || otp.length === 6) {
      setStage(3);
      showToast({
        type: 'success',
        title: 'Phone Verified ✓',
        message: 'Please choose your user account type.'
      });
    }
  };

  const handleSelectRole = async (selectedRole) => {
    setRole(selectedRole);

    const isAmbassador = selectedRole === 'campus_ambassador';
    let loggedUser = {
      id: `usr_${Date.now()}`,
      phone: phone || '+91 9876543210',
      name: selectedRole === 'guide' ? 'Vikram Singh Rathore' : isAmbassador ? 'Arjun Sharma' : 'Smart Traveler',
      role: selectedRole,
      roles: [selectedRole],
      verified: true,
      createdAt: new Date().toISOString(),
      ...(isAmbassador
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
              status: 'VERIFIED',
              method: 'student_id',
              submittedAt: new Date()
            },
            campusAmbassadorProfile: {
              referralCode: 'RAAHI-ARJUN26',
              campusReach: 15,
              profileViews: 42,
              ambassadorStatus: 'ACTIVE',
              joinedDate: new Date(),
              profileCompletionPercentage: 100
            },
            referralCode: 'RAAHI-ARJUN26'
          }
        : {})
    };
    let token = `token_${Date.now()}`;

    try {
      const res = await api.auth.verifyOtp({
        phone: phone || '+91 9876543210',
        code: '123456',
        role: selectedRole,
        name: selectedRole === 'guide' ? 'Vikram Singh Rathore' : isAmbassador ? 'Arjun Sharma' : 'Smart Traveler'
      });

      if (res && res.data && res.data.user) {
        loggedUser = res.data.user;
        token = res.data.token;
      }
    } catch (err) {
      console.warn('API verify-otp fallback notice:', err.message);
    }

    loginSuccess(loggedUser, token);

    showToast({
      type: 'success',
      title: 'Welcome to RAAHI!',
      message: `Signed in as ${isAmbassador ? 'Campus Ambassador' : selectedRole === 'guide' ? 'Verified Local Guide' : 'Smart Traveler'}`
    });

    closeAuthModal();

    if (isAmbassador) {
      window.location.href = '/campus-ambassador/dashboard';
    } else if (selectedRole === 'guide') {
      window.location.href = '/guide';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 relative shadow-floating">
        <button onClick={closeAuthModal} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 cursor-pointer">
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        {/* Stage 1: Phone / Google */}
        {stage === 1 && (
          <div className="space-y-6 text-left">
            <div className="space-y-1.5 text-center flex flex-col items-center">
              <RaahiLogo variant="compact" size={38} className="mb-2" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">Welcome to RAAHI</h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs">Enter your mobile phone number to receive a demo OTP.</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleSelectRole('tourist')}
                className="w-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-center gap-3 transition cursor-pointer"
              >
                <i className="fa-brands fa-google text-rose-500 text-sm"></i> Continue with Google (Instant Demo)
              </button>

              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">or phone login</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Mobile Phone Number</label>
                <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20">
                  <span className="px-3.5 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800/80 border-r border-slate-300 dark:border-slate-700">+91</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full bg-transparent px-3 py-3 text-sm text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleSendOtp}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-3.5 rounded-full transition text-xs uppercase tracking-wider shadow-md shadow-orange-500/25 cursor-pointer"
              >
                Send Verification OTP Code
              </button>
            </div>
          </div>
        )}

        {/* Stage 2: OTP Entry */}
        {stage === 2 && (
          <div className="space-y-6 text-center">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">Enter Verification Code</h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs">Sent to <span className="text-orange-600 dark:text-orange-400 font-bold">+91 {phone}</span></p>
              <div className="inline-block bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[11px] px-3 py-1 rounded-full border border-orange-500/20 font-bold">
                Demo Code: 123456
              </div>
            </div>

            <OTPInput onComplete={handleVerifyOtp} />

            <button
              onClick={() => handleVerifyOtp('123456')}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-3.5 rounded-full transition text-xs uppercase tracking-wider shadow-md shadow-emerald-500/25 cursor-pointer"
            >
              Verify OTP Code
            </button>
          </div>
        )}

        {/* Stage 3: Role Selection (Requirement 1) */}
        {stage === 3 && (
          <div className="space-y-5 text-left max-h-[80vh] overflow-y-auto pr-1">
            <div className="space-y-1.5 text-center">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white font-heading">
                How will you use RAAHI?
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                Choose the role that best describes you.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {/* 1. TRAVELER */}
              <button
                onClick={() => handleSelectRole('tourist')}
                className="p-4 bg-white dark:bg-slate-800 hover:bg-emerald-50/40 dark:hover:bg-slate-700/60 border-2 border-slate-200 dark:border-slate-700 hover:border-[#0B9B6E] rounded-2xl text-left space-y-1.5 transition shadow-xs group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🧳</span>
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">TRAVELER</span>
                  </div>
                  <i className="fa-solid fa-arrow-right text-xs text-slate-400 group-hover:text-[#0B9B6E] transition"></i>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                  Discover guides, tours and experiences. Plan your trip and book with confidence.
                </p>
              </button>

              {/* 2. PROFESSIONAL GUIDE */}
              <button
                onClick={() => handleSelectRole('guide')}
                className="p-4 bg-white dark:bg-slate-800 hover:bg-emerald-50/40 dark:hover:bg-slate-700/60 border-2 border-slate-200 dark:border-slate-700 hover:border-[#0B9B6E] rounded-2xl text-left space-y-1.5 transition shadow-xs group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🧭</span>
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">PROFESSIONAL GUIDE</span>
                  </div>
                  <i className="fa-solid fa-arrow-right text-xs text-slate-400 group-hover:text-[#0B9B6E] transition"></i>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                  Offer your expertise and host travelers.
                </p>
              </button>

              {/* 3. LOCAL HOST */}
              <button
                onClick={() => handleSelectRole('local_host')}
                className="p-4 bg-white dark:bg-slate-800 hover:bg-emerald-50/40 dark:hover:bg-slate-700/60 border-2 border-slate-200 dark:border-slate-700 hover:border-[#0B9B6E] rounded-2xl text-left space-y-1.5 transition shadow-xs group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🏠</span>
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">LOCAL HOST</span>
                  </div>
                  <i className="fa-solid fa-arrow-right text-xs text-slate-400 group-hover:text-[#0B9B6E] transition"></i>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                  Share your local knowledge and experiences.
                </p>
              </button>

              {/* 4. CAMPUS AMBASSADOR */}
              <button
                onClick={() => handleSelectRole('campus_ambassador')}
                className="p-4 bg-white dark:bg-slate-800 hover:bg-emerald-50/40 dark:hover:bg-slate-700/60 border-2 border-[#0B9B6E]/60 rounded-2xl text-left space-y-1.5 transition shadow-sm group cursor-pointer ring-1 ring-[#0B9B6E]/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🎓</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-slate-900 dark:text-white text-sm">CAMPUS AMBASSADOR</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-[#0B9B6E]/15 text-[#0B9B6E] text-[10px] font-black uppercase">
                        Student
                      </span>
                    </div>
                  </div>
                  <i className="fa-solid fa-arrow-right text-xs text-[#0B9B6E] transition"></i>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                  Represent RAAHI on your campus, help students discover RAAHI, and build your campus community.
                </p>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
