import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { RaahiLogo } from './RaahiLogo.jsx';
import { useAuthStore } from '../store/useAuthStore.js';
import { useThemeStore } from '../store/useThemeStore.js';

export const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { role, setRole, authenticated, user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll detection for sticky shadow & backdrop transition
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!userDropdownOpen) return;
    const handler = (e) => {
      if (!e.target.closest('#user-dropdown-root')) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [userDropdownOpen]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [location.pathname]);

  const handleRoleToggle = () => {
    const nextRole = role === 'tourist' ? 'guide' : 'tourist';
    setRole(nextRole);
    if (nextRole === 'guide') {
      navigate('/guide');
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `relative px-3 py-1.5 text-xs font-bold transition-all duration-150 rounded-full whitespace-nowrap ${
      isActive
        ? 'text-[#07543F] dark:text-[#4ADE80] bg-[#E8F7F1] dark:bg-[#07543F]/30 shadow-2xs font-extrabold'
        : 'text-[#4A5C6E] dark:text-[#9AB0A4] hover:text-[#152238] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
    }`;

  const isGuideView = role === 'guide';

  return (
    <header
      className={`w-full sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-[#111C15]/95 backdrop-blur-md border-b border-[#E0E8E4] dark:border-[#243028] shadow-xs'
          : 'bg-white dark:bg-[#111C15] border-b border-[#F1F5F3] dark:border-[#243028]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[68px] flex items-center justify-between gap-3">

        {/* LEFT: RAAHI Brand Logo */}
        <NavLink to="/" className="focus:outline-none flex-shrink-0 group">
          <RaahiLogo variant="compact" size={38} />
        </NavLink>

        {/* CENTER: Primary Navigation Links */}
        {!isGuideView ? (
          <nav className="hidden lg:flex items-center gap-1" aria-label="Traveler navigation">
            <NavLink to="/explore" className={navLinkClass}>
              Explore
            </NavLink>
            <NavLink to="/guides" className={navLinkClass}>
              Guides
            </NavLink>
            <NavLink to="/tours" className={navLinkClass}>
              Tours
            </NavLink>
            <NavLink to="/experiences" className={navLinkClass}>
              Experiences
            </NavLink>
            <NavLink to="/fair-price" className={navLinkClass}>
              Fair Price
            </NavLink>
            <NavLink to="/planner" className={navLinkClass}>
              AI Planner
            </NavLink>
          </nav>
        ) : (
          <nav className="hidden lg:flex items-center gap-1" aria-label="Provider navigation">
            <NavLink to="/guide" end className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/guide?tab=tours" className={navLinkClass}>
              My Tours
            </NavLink>
            <NavLink to="/guide?tab=requests" className={navLinkClass}>
              Requests
            </NavLink>
            <NavLink to="/guide?tab=upcoming" className={navLinkClass}>
              Bookings
            </NavLink>
            <NavLink to="/guide?tab=earnings" className={navLinkClass}>
              Earnings
            </NavLink>
            <NavLink to="/guide/create-tour" className="px-3 py-1.5 text-xs font-bold text-white bg-[#0B9B6E] hover:bg-[#07543F] rounded-full transition flex items-center gap-1.5 shadow-xs">
              <i className="fa-solid fa-plus text-[10px]"></i>
              <span>Create Tour</span>
            </NavLink>
          </nav>
        )}

        {/* RIGHT: CTAs & User Controls */}
        <div className="flex items-center gap-2">

          {/* Campus Ambassador Link */}
          <NavLink
            to="/campus-ambassador/dashboard"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#07543F] dark:text-[#4ADE80] bg-[#E8F7F1] dark:bg-[#07543F]/25 hover:bg-[#D4EFE5] rounded-full border border-[#0B9B6E]/30 transition-all"
          >
            <i className="fa-solid fa-graduation-cap text-[11px] text-[#0B9B6E]"></i>
            <span>Campus Ambassador</span>
          </NavLink>

          {/* Become a Guide (Hidden if currently in guide mode) */}
          {role !== 'guide' && (
            <NavLink
              to="/become-guide"
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#07543F] dark:text-[#4ADE80] bg-[#E8F7F1] dark:bg-[#07543F]/25 hover:bg-[#D4EFE5] rounded-full border border-[#0B9B6E]/30 transition-all"
            >
              <i className="fa-solid fa-id-badge text-[11px] text-[#0B9B6E]"></i>
              <span>Become a Guide</span>
            </NavLink>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-[#F8F7F3] dark:bg-[#162019] text-[#4A5C6E] dark:text-[#9AB0A4] hover:text-[#152238] dark:hover:text-white border border-[#E0E8E4] dark:border-[#243028] transition-all cursor-pointer"
          >
            <i className={`fa-solid ${theme === 'light' ? 'fa-moon text-xs' : 'fa-sun text-xs text-[#F4A340]'}`}></i>
          </button>

          {/* Authentication State */}
          {authenticated && user ? (
            <div className="relative" id="user-dropdown-root">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 bg-[#F8F7F3] dark:bg-[#162019] hover:bg-[#E8F7F1] dark:hover:bg-[#1A2720] text-[#152238] dark:text-white font-bold px-2.5 sm:px-3 py-1.5 rounded-full border border-[#E0E8E4] dark:border-[#243028] transition-all text-xs cursor-pointer"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover border border-[#0B9B6E]"
                  />
                ) : (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#0B9B6E] flex items-center justify-center text-white text-[10px] font-extrabold">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                )}
                <span className="hidden sm:inline-block max-w-[80px] truncate font-heading">
                  {user.name?.split(' ')[0] || 'Account'}
                </span>
                <i className="fa-solid fa-chevron-down text-[8px] text-[#8A9BAD]"></i>
              </button>

              {/* User Menu Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#162019] rounded-2xl shadow-xl border border-[#E0E8E4] dark:border-[#243028] p-2 space-y-1 z-50 animate-scale-in">
                  <div className="px-3.5 py-3 border-b border-[#F1F5F3] dark:border-[#243028]">
                    <div className="font-extrabold text-[#152238] dark:text-white text-sm truncate font-heading">
                      {user.name}
                    </div>
                    <div className="text-xs text-[#8A9BAD] mt-0.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0B9B6E]"></span>
                      <span className="capitalize">{user.role} Member</span>
                    </div>
                  </div>

                  {user.role === 'guide' ? (
                    <>
                      <NavLink
                        to="/guide"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-[#E8F7F1] dark:hover:bg-[#1A2720] font-semibold text-xs text-[#152238] dark:text-[#E8F0EC] transition-colors"
                      >
                        <i className="fa-solid fa-id-badge text-[#0B9B6E] w-4"></i>
                        Guide Partner Dashboard
                      </NavLink>
                      <NavLink
                        to="/guide?tab=tours"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl hover:bg-[#E8F7F1] dark:hover:bg-[#1A2720] font-semibold text-xs text-[#152238] dark:text-[#E8F0EC] transition-colors"
                      >
                        <i className="fa-solid fa-map-location-dot text-[#F4A340] w-4"></i>
                        Manage My Tours
                      </NavLink>
                    </>
                  ) : user.role === 'campus_ambassador' ? (
                    <NavLink
                      to="/campus-ambassador/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-[#E8F7F1] dark:hover:bg-[#1A2720] font-semibold text-xs text-[#152238] dark:text-[#E8F0EC] transition-colors"
                    >
                      <i className="fa-solid fa-graduation-cap text-[#0B9B6E] w-4"></i>
                      Ambassador Dashboard
                    </NavLink>
                  ) : (
                    <NavLink
                      to="/trips"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-[#E8F7F1] dark:hover:bg-[#1A2720] font-semibold text-xs text-[#152238] dark:text-[#E8F0EC] transition-colors"
                    >
                      <i className="fa-solid fa-suitcase text-[#F4A340] w-4"></i>
                      My Trips & Bookings
                    </NavLink>
                  )}

                  {/* Campus Ambassador Link for any logged in user */}
                  <NavLink
                    to="/campus-ambassador/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl hover:bg-[#E8F7F1] dark:hover:bg-[#1A2720] font-semibold text-xs text-[#07543F] dark:text-[#4ADE80] transition-colors"
                  >
                    <i className="fa-solid fa-graduation-cap text-[#0B9B6E] w-4"></i>
                    Campus Ambassador
                  </NavLink>

                  <button
                    onClick={handleRoleToggle}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl hover:bg-[#F8F7F3] dark:hover:bg-[#1A2720] font-medium text-xs text-[#4A5C6E] dark:text-[#9AB0A4] transition-colors cursor-pointer text-left"
                  >
                    <i className="fa-solid fa-repeat text-xs w-4"></i>
                    Switch to {role === 'tourist' ? 'Guide Mode' : 'Traveler Mode'}
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 font-semibold text-xs text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                  >
                    <i className="fa-solid fa-right-from-bracket text-xs w-4"></i>
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink
                to="/login"
                className="px-3 py-1.5 text-xs font-bold text-[#152238] dark:text-white hover:text-[#0B9B6E] transition-colors"
              >
                Sign In
              </NavLink>

              <NavLink
                to="/explore"
                className="btn-primary text-xs px-3.5 py-1.5"
              >
                <span>Explore</span>
                <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </NavLink>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            aria-label="Open Navigation Menu"
            className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-[#F8F7F3] dark:bg-[#162019] text-[#152238] dark:text-white border border-[#E0E8E4] dark:border-[#243028] hover:bg-[#E8F7F1] transition-all cursor-pointer"
          >
            <i className="fa-solid fa-bars text-sm"></i>
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          <div className="fixed right-0 top-0 bottom-0 w-5/6 max-w-sm bg-[#F8F7F3] dark:bg-[#111C15] shadow-2xl flex flex-col z-50 animate-slide-up">
            <div className="p-5 border-b border-[#E0E8E4] dark:border-[#243028] flex items-center justify-between bg-white dark:bg-[#162019]">
              <RaahiLogo variant="compact" size={32} />
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F8F7F3] dark:hover:bg-[#1A2720] text-[#8A9BAD] hover:text-[#152238] dark:hover:text-white transition-all cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
              {/* Role Indicator Banner */}
              <div className="p-3 bg-white dark:bg-[#162019] rounded-2xl border border-[#E0E8E4] dark:border-[#243028] mb-3 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold uppercase text-[#8A9BAD]">Active Mode</div>
                  <div className="text-xs font-bold text-[#152238] dark:text-white capitalize">{role === 'guide' ? 'Local Guide / Host' : 'Traveler Explorer'}</div>
                </div>
                <button
                  onClick={handleRoleToggle}
                  className="px-2.5 py-1 text-[11px] font-bold bg-[#E8F7F1] dark:bg-[#07543F]/30 text-[#07543F] dark:text-[#4ADE80] rounded-full border border-[#0B9B6E]/30"
                >
                  Switch
                </button>
              </div>

              {!isGuideView ? (
                <>
                  {[
                    { to: '/explore', icon: 'fa-compass', label: 'Explore Destinations' },
                    { to: '/guides', icon: 'fa-users', label: 'Find Guides' },
                    { to: '/tours', icon: 'fa-map-location-dot', label: 'Explore Tours' },
                    { to: '/experiences', icon: 'fa-palette', label: 'Local Experiences' },
                    { to: '/fair-price', icon: 'fa-scale-balanced', label: 'Fair Price Checker' },
                    { to: '/planner', icon: 'fa-wand-magic-sparkles', label: 'AI Trip Planner' },
                    { to: '/trips', icon: 'fa-suitcase', label: 'My Bookings & Trips' },
                    { to: '/safety', icon: 'fa-shield-halved', label: 'Safety & SOS Center' },
                  ].map(({ to, icon, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                          isActive
                            ? 'bg-[#E8F7F1] dark:bg-[#07543F]/30 text-[#07543F] dark:text-[#4ADE80] border border-[#0B9B6E]/30'
                            : 'text-[#4A5C6E] dark:text-[#9AB0A4] hover:bg-white dark:hover:bg-[#162019] hover:text-[#152238] dark:hover:text-white'
                        }`
                      }
                    >
                      <i className={`fa-solid ${icon} w-5 text-center text-[#0B9B6E]`}></i>
                      <span>{label}</span>
                    </NavLink>
                  ))}
                </>
              ) : (
                <>
                  {[
                    { to: '/guide', icon: 'fa-table-columns', label: 'Partner Dashboard' },
                    { to: '/guide?tab=tours', icon: 'fa-map-location-dot', label: 'My Tours & Packages' },
                    { to: '/guide/create-tour', icon: 'fa-circle-plus', label: 'Create New Tour' },
                    { to: '/guide?tab=requests', icon: 'fa-inbox', label: 'Booking Requests' },
                    { to: '/guide?tab=upcoming', icon: 'fa-calendar-check', label: 'Upcoming Bookings' },
                    { to: '/guide?tab=earnings', icon: 'fa-wallet', label: 'Earnings & Payouts' },
                    { to: '/guide?tab=pricing', icon: 'fa-tags', label: 'Pricing Model Settings' },
                  ].map(({ to, icon, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={() => setMobileDrawerOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs text-[#4A5C6E] dark:text-[#9AB0A4] hover:bg-white dark:hover:bg-[#162019] hover:text-[#152238] dark:hover:text-white"
                    >
                      <i className={`fa-solid ${icon} w-5 text-center text-[#0B9B6E]`}></i>
                      <span>{label}</span>
                    </NavLink>
                  ))}
                </>
              )}

              <div className="pt-3 mt-3 border-t border-[#E0E8E4] dark:border-[#243028] space-y-2">
                {role !== 'guide' && (
                  <NavLink
                    to="/become-guide"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-xs text-[#07543F] dark:text-[#4ADE80] bg-[#E8F7F1] dark:bg-[#07543F]/25 border border-[#0B9B6E]/30"
                  >
                    <i className="fa-solid fa-id-badge w-5 text-center text-[#0B9B6E]"></i>
                    <span>Become a Verified Guide</span>
                  </NavLink>
                )}

                {!authenticated && (
                  <NavLink
                    to="/login"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="w-full btn-primary py-2.5 text-xs justify-center"
                  >
                    <span>Sign In / Get Started</span>
                  </NavLink>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
