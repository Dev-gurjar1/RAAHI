import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { RaahiLogo } from './RaahiLogo';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';

export const Navbar: React.FC = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { role, setRole, authenticated, openAuthModal, user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const handleRoleToggle = () => {
    const nextRole = role === 'tourist' ? 'guide' : 'tourist';
    setRole(nextRole);
    if (nextRole === 'guide') {
      navigate('/guide');
    } else {
      navigate('/');
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-3.5 py-2 text-xs font-semibold tracking-wide transition-colors ${
      isActive
        ? 'text-orange-600 dark:text-orange-400 font-bold after:content-[""] after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-0.5 after:bg-orange-500 after:rounded-full'
        : 'text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400'
    }`;

  return (
    <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between gap-6">
        
        {/* Brand Logo */}
        <NavLink to="/" className="focus:outline-none">
          <RaahiLogo size={38} />
        </NavLink>

        {/* Center Minimal Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <NavLink to="/" className={navLinkClass}>
            Discover
          </NavLink>
          <NavLink to="/guides" className={navLinkClass}>
            Local Guides
          </NavLink>
          <NavLink to="/tours" className={navLinkClass}>
            Tours
          </NavLink>
          <NavLink to="/fair-price" className={navLinkClass}>
            Fair Price
          </NavLink>
          <NavLink to="/planner" className={navLinkClass}>
            AI Planner
          </NavLink>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <NavLink
            to="/trips"
            className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-orange-600 px-3 py-2 rounded-xl transition"
          >
            <i className="fa-solid fa-suitcase text-slate-400"></i> My Trips
          </NavLink>

          {/* Role Switcher Pill */}
          <button
            onClick={handleRoleToggle}
            title="Switch User Role"
            className="hidden sm:flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs px-3.5 py-2 rounded-full border border-slate-200 dark:border-slate-700 transition"
          >
            <span className="text-slate-400 font-medium">Mode:</span>
            <span className="font-bold text-orange-600 dark:text-orange-400 capitalize">{role}</span>
            <i className="fa-solid fa-repeat text-[10px] text-slate-400 ml-0.5"></i>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Light/Dark Theme"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
          >
            <i className={`fa-solid ${theme === 'light' ? 'fa-moon text-xs' : 'fa-sun text-xs'}`}></i>
          </button>

          {/* Login / Profile CTA */}
          <button
            onClick={openAuthModal}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-full transition shadow-md shadow-orange-500/20 text-xs flex items-center gap-2"
          >
            <i className="fa-solid fa-user text-[11px]"></i>
            <span>{authenticated ? (user?.name || 'Account') : 'Login'}</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            aria-label="Toggle Mobile Menu"
            className="lg:hidden p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
          >
            <i className="fa-solid fa-bars text-base"></i>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-4/5 max-w-sm h-full bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <RaahiLogo size={32} />
                <button onClick={() => setMobileDrawerOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                  <i className="fa-solid fa-xmark text-xl"></i>
                </button>
              </div>

              <nav className="mt-6 flex flex-col gap-1.5">
                <NavLink to="/" onClick={() => setMobileDrawerOpen(false)} className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 text-slate-800 dark:text-slate-200 font-semibold text-sm">
                  <i className="fa-solid fa-compass text-orange-500 w-5"></i> Discover
                </NavLink>
                <NavLink to="/guides" onClick={() => setMobileDrawerOpen(false)} className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 text-slate-800 dark:text-slate-200 font-semibold text-sm">
                  <i className="fa-solid fa-users text-orange-500 w-5"></i> Local Guides
                </NavLink>
                <NavLink to="/tours" onClick={() => setMobileDrawerOpen(false)} className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 text-slate-800 dark:text-slate-200 font-semibold text-sm">
                  <i className="fa-solid fa-map-location-dot text-orange-500 w-5"></i> Tours & Experiences
                </NavLink>
                <NavLink to="/fair-price" onClick={() => setMobileDrawerOpen(false)} className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 text-slate-800 dark:text-slate-200 font-semibold text-sm">
                  <i className="fa-solid fa-calculator text-orange-500 w-5"></i> Fair Price Shield
                </NavLink>
                <NavLink to="/planner" onClick={() => setMobileDrawerOpen(false)} className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 text-slate-800 dark:text-slate-200 font-semibold text-sm">
                  <i className="fa-solid fa-wand-magic-sparkles text-orange-500 w-5"></i> AI Travel Planner
                </NavLink>
                <NavLink to="/trips" onClick={() => setMobileDrawerOpen(false)} className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 text-slate-800 dark:text-slate-200 font-semibold text-sm">
                  <i className="fa-solid fa-suitcase text-orange-500 w-5"></i> My Trips
                </NavLink>
                <NavLink to="/guide" onClick={() => setMobileDrawerOpen(false)} className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-3 border border-emerald-200 dark:border-emerald-500/20 text-sm mt-2">
                  <i className="fa-solid fa-id-badge w-5"></i> Local Guide Partner Hub
                </NavLink>
              </nav>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => { handleRoleToggle(); setMobileDrawerOpen(false); }}
                className="w-full py-3 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-repeat"></i> Switch to {role === 'tourist' ? 'Guide Mode' : 'Traveler Mode'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
