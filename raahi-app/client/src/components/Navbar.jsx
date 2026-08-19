import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, ShieldCheck, UserCheck, LogOut, Compass, ShieldAlert, Sparkles } from 'lucide-react';

export const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <MapPin className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-white font-sans">
              RAAHI<span className="text-amber-400">.</span>
            </span>
            <span className="hidden sm:block text-[10px] uppercase font-extrabold text-emerald-400 tracking-wider">
              Verified Locals • Scam Prevention
            </span>
          </div>
        </Link>

        {/* Dynamic User Status & Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Role Badge */}
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-1 border ${
                user.role === 'guide'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                {user.role === 'guide' ? <UserCheck className="w-3.5 h-3.5" /> : <Compass className="w-3.5 h-3.5" />}
                {user.role}
              </span>

              {/* Navigation Dashboard Link */}
              <button
                onClick={() => navigate(user.role === 'guide' ? '/guide' : '/tourist')}
                className="bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition border border-slate-700 hidden sm:block"
              >
                Dashboard
              </button>

              {/* Profile Avatar */}
              <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 pr-3 rounded-2xl border border-slate-700">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={user.name}
                  className="w-7 h-7 rounded-xl object-cover"
                />
                <span className="text-xs font-bold text-slate-200 hidden md:block">{user.name}</span>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-extrabold px-5 py-2 rounded-xl text-xs hover:opacity-90 transition shadow-md flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Get Started</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
