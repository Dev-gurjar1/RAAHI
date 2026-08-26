import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { RaahiLogo } from '../components/RaahiLogo';
import { UserRole } from '@raahi/shared-types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginSuccess } = useAuthStore();
  const showToast = useToastStore((state) => state.showToast);

  const [activeRoleTab, setActiveRoleTab] = useState<UserRole>('tourist');
  const [isSignUp, setIsSignUp] = useState(false);

  // Tourist Form Fields
  const [name, setName] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('Jaipur');

  const handleDemoLogin = (role: UserRole, guideName?: string) => {
    const demoUser = {
      id: `usr_${Date.now()}`,
      name: guideName || (role === 'guide' ? 'Priya Sharma' : 'Smart Traveler'),
      phone: '+91 9876543210',
      email: role === 'guide' ? 'host@raahi.in' : 'traveler@raahi.in',
      role,
      verified: true,
      city: 'Jaipur',
      createdAt: new Date().toISOString(),
      ...(role === 'guide'
        ? {
            verificationStatus: 'Verified' as const,
            hourlyRate: 500,
            languages: ['Hindi', 'English', 'French']
          }
        : {})
    };

    loginSuccess(demoUser);

    showToast({
      type: 'success',
      title: `Welcome, ${demoUser.name}!`,
      message: `Signed in as ${role === 'guide' ? 'Verified Local Host' : 'Smart Traveler'}`
    });

    if (role === 'guide') {
      navigate('/guide');
    } else {
      navigate('/trips');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneOrEmail.trim()) {
      showToast({
        type: 'warning',
        title: 'Input Required',
        message: 'Please enter your email or phone number.'
      });
      return;
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: name || (activeRoleTab === 'guide' ? 'Verified Host' : 'Smart Traveler'),
      phone: phoneOrEmail.includes('@') ? '+91 9876543210' : phoneOrEmail,
      email: phoneOrEmail.includes('@') ? phoneOrEmail : 'user@raahi.in',
      role: activeRoleTab,
      verified: true,
      city,
      createdAt: new Date().toISOString()
    };

    loginSuccess(newUser);

    showToast({
      type: 'success',
      title: 'Authentication Successful',
      message: `Logged in as ${activeRoleTab === 'guide' ? 'Local Host' : 'Tourist'}`
    });

    if (activeRoleTab === 'guide') {
      navigate('/guide');
    } else {
      navigate('/trips');
    }
  };

  return (
    <div className="space-y-8 text-left font-sans max-w-xl mx-auto py-8">
      
      {/* Header Card */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card text-center space-y-3 flex flex-col items-center">
        <RaahiLogo variant="compact" size={42} className="mb-1" />
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
          {isSignUp ? 'Create RAAHI Account' : 'Log In to RAAHI'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
          Access your verified tourist itineraries or manage your local guide partner hub.
        </p>

        {/* Role Selection Tabs */}
        <div className="flex items-center bg-slate-50 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold pt-2 mt-2">
          <button
            type="button"
            onClick={() => setActiveRoleTab('tourist')}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
              activeRoleTab === 'tourist'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <i className="fa-solid fa-compass"></i>
            <span>Continue as Tourist</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRoleTab('guide')}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
              activeRoleTab === 'guide'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <i className="fa-solid fa-id-badge"></i>
            <span>Become a Guide</span>
          </button>
        </div>
      </div>

      {/* Quick 1-Click Demo Accounts Card */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3">
        <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
          INSTANT DEMO AUTHENTICATION
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => handleDemoLogin('tourist')}
            className="p-3 bg-white dark:bg-slate-900 hover:bg-orange-50 text-slate-800 dark:text-slate-200 rounded-2xl border border-slate-200 dark:border-slate-700 transition flex items-center gap-2"
          >
            <i className="fa-solid fa-user text-orange-500"></i> Tourist Demo
          </button>

          <button
            type="button"
            onClick={() => handleDemoLogin('guide', 'Priya Sharma')}
            className="p-3 bg-white dark:bg-slate-900 hover:bg-emerald-50 text-slate-800 dark:text-slate-200 rounded-2xl border border-slate-200 dark:border-slate-700 transition flex items-center gap-2"
          >
            <i className="fa-solid fa-user-check text-emerald-500"></i> Priya S. (Guide)
          </button>

          <button
            type="button"
            onClick={() => handleDemoLogin('guide', 'Vikram Singh Rathore')}
            className="p-3 bg-white dark:bg-slate-900 hover:bg-emerald-50 text-slate-800 dark:text-slate-200 rounded-2xl border border-slate-200 dark:border-slate-700 transition flex items-center gap-2"
          >
            <i className="fa-solid fa-user-gear text-emerald-500"></i> Vikram R. (Guide)
          </button>
        </div>
      </div>

      {/* Main Authentication Form */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-5">
        
        {activeRoleTab === 'guide' && isSignUp ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
              <i className="fa-solid fa-id-card"></i>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                Guide Partner Onboarding
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Turn your local knowledge into income. Complete your full host profile and KYC document verification.
              </p>
            </div>
            <NavLink
              to="/become-guide"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-full text-xs transition shadow-lg shadow-emerald-500/25 uppercase tracking-wider"
            >
              <span>Go to Full Guide Application Form</span>
              <i className="fa-solid fa-arrow-right"></i>
            </NavLink>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            {isSignUp && (
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 text-xs font-semibold"
                />
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile Phone Number or Email</label>
              <input
                type="text"
                required
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                placeholder="e.g. 9876543210 or traveler@example.com"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Password or Verification Code</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 text-xs font-semibold"
              />
            </div>

            {isSignUp && (
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">City / Region</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Jaipur"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 text-xs font-semibold"
                />
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-3.5 text-white font-extrabold rounded-2xl transition uppercase tracking-wider text-xs shadow-md ${
                activeRoleTab === 'guide'
                  ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'
                  : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'
              }`}
            >
              {isSignUp ? `Sign Up as ${activeRoleTab === 'guide' ? 'Local Host' : 'Tourist'}` : `Log In as ${activeRoleTab === 'guide' ? 'Local Host' : 'Tourist'}`}
            </button>
          </form>
        )}

        <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-orange-500 transition"
          >
            {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};
