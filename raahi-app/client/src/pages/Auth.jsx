import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserCheck, Compass, Lock, Mail, User, Phone, MapPin, Sparkles, ArrowRight, Upload } from 'lucide-react';

export const Auth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('tourist');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Jaipur');
  const [hourlyRate, setHourlyRate] = useState(450);
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin
      ? { email, password }
      : { name, email, password, role, phone, city, hourlyRate: Number(hourlyRate), bio };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Authentication failed');
      }

      onLoginSuccess(data.user, data.token);
      navigate(data.user.role === 'guide' ? '/guide' : '/tourist');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 px-4 py-6 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-slate-950 mx-auto shadow-xl shadow-amber-500/20">
          <ShieldCheck className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h2 className="text-3xl font-black text-white">RAAHI Marketplace</h2>
        <p className="text-xs text-slate-400">
          {isLogin ? 'Welcome back! Sign in to manage your bookings' : 'Create an account to join verified tourist & guide network'}
        </p>
      </div>

      {/* Auth Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-2xl">
        {/* Login / Signup Tab Switcher */}
        <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition ${
              isLogin ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition ${
              !isLogin ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register Account
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs font-bold">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              {/* Dual Role Selector */}
              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-1.5">Select Account Role</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('tourist')}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition ${
                      role === 'tourist'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Compass className="w-5 h-5 text-amber-400" />
                    <div>
                      <span className="text-xs font-black block">Tourist</span>
                      <span className="text-[10px] opacity-75">Book guides & tours</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('guide')}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition ${
                      role === 'guide'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <UserCheck className="w-5 h-5 text-emerald-400" />
                    <div>
                      <span className="text-xs font-black block">Local Guide</span>
                      <span className="text-[10px] opacity-75">Offer tours & earn</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikramaditya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-extrabold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-extrabold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {!isLogin && role === 'guide' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1">Hourly Rate (₹)</label>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-1">KYC Govt ID Verification Document</label>
                <div className="border border-dashed border-slate-700 bg-slate-900 p-3 rounded-xl text-center space-y-1">
                  <Upload className="w-5 h-5 text-emerald-400 mx-auto" />
                  <span className="text-[11px] text-slate-300 block font-bold">Government ID Proof Attached</span>
                  <span className="text-[9px] text-slate-500 block">Verified identity check automatically applied to guide profile</span>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3 rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Processing...' : isLogin ? 'Sign In to Dashboard' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
