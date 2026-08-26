import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import { OTPInput } from '../inputs/OTPInput';
import { RaahiLogo } from '../RaahiLogo';
import { UserRole } from '@raahi/shared-types';

export const AuthModal: React.FC = () => {
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

  const handleSendOtp = () => {
    if (!phone || phone.length < 10) {
      showToast({
        type: 'warning',
        title: 'Invalid Mobile',
        message: 'Please enter a valid 10-digit mobile number.'
      });
      return;
    }
    setStage(2);
    showToast({
      type: 'info',
      title: 'Demo OTP Sent',
      message: 'Code is 123456 (auto-filled ready)'
    });
  };

  const handleVerifyOtp = (otp: string) => {
    if (otp === '123456' || otp.length === 6) {
      setStage(3);
      showToast({
        type: 'success',
        title: 'Phone Verified ✓',
        message: 'Please choose your user account type.'
      });
    }
  };

  const handleSelectRole = (selectedRole: UserRole) => {
    setRole(selectedRole);
    loginSuccess({
      id: `usr_${Date.now()}`,
      phone: phone || '+91 9876543210',
      name: selectedRole === 'guide' ? 'Vikram Singh Rathore' : 'Smart Traveler',
      role: selectedRole,
      verified: true,
      createdAt: new Date().toISOString()
    });

    showToast({
      type: 'success',
      title: 'Welcome to RAAHI!',
      message: `Signed in as ${selectedRole === 'guide' ? 'Verified Local Guide' : 'Smart Traveler'}`
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 relative shadow-floating">
        <button onClick={closeAuthModal} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1">
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
                className="w-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-center gap-3 transition"
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
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-3.5 rounded-full transition text-xs uppercase tracking-wider shadow-md shadow-orange-500/25"
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
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-3.5 rounded-full transition text-xs uppercase tracking-wider shadow-md shadow-emerald-500/25"
            >
              Verify OTP Code
            </button>
          </div>
        )}

        {/* Stage 3: Role Selection */}
        {stage === 3 && (
          <div className="space-y-6 text-left">
            <div className="space-y-1.5 text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">Select Account Type</h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs">How do you wish to explore RAAHI today?</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => handleSelectRole('tourist')}
                className="p-5 bg-white dark:bg-slate-800 hover:bg-orange-50/50 border-2 border-orange-500/50 rounded-2xl text-left space-y-2 transition shadow-sm group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-base">Traveler / Tourist</span>
                  <i className="fa-solid fa-compass text-orange-500 text-xl group-hover:scale-110 transition"></i>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Find verified local hosts, check fair benchmark tariffs, and book scam-free Jaipur tours.</p>
              </button>

              <button
                onClick={() => handleSelectRole('guide')}
                className="p-5 bg-white dark:bg-slate-800 hover:bg-emerald-50/50 border-2 border-emerald-500/50 rounded-2xl text-left space-y-2 transition shadow-sm group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-base">Local Guide / Host</span>
                  <i className="fa-solid fa-id-badge text-emerald-500 text-xl group-hover:scale-110 transition"></i>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Accept nearby tourist booking requests, publish heritage tour packages, and track earnings.</p>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
