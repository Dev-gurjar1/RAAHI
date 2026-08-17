import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Compass,
  Users,
  Tag,
  Sparkles,
  MapPin,
  ShieldCheck,
  Bell,
  CheckCircle2,
  Menu,
  X,
  ChevronDown,
  UserCheck,
  Briefcase,
  HelpCircle,
  User
} from 'lucide-react';
import { marketplaceStore } from '../services/store';
import { UserRole } from '../types';

interface NavigationProps {
  onRequestOpen: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onRequestOpen }) => {
  const [storeState, setStoreState] = useState(marketplaceStore.getState());
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = marketplaceStore.subscribe(() => {
      setStoreState(marketplaceStore.getState());
    });
    return unsubscribe;
  }, []);

  const handleRoleChange = (role: UserRole) => {
    marketplaceStore.setRole(role);
    setShowRoleDropdown(false);

    if (role === 'GUIDE') {
      navigate('/guide-dashboard');
    } else if (role === 'ADMIN') {
      navigate('/admin-panel');
    } else {
      navigate('/');
    }
  };

  const unreadNotifs = storeState.notifications.filter(
    n => !n.read && (n.roleTarget === storeState.activeRole || n.userId === 'user-tourist-demo' || n.userId === 'admin')
  );

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 shadow-sm transition-all">
      {/* Top Demo Bar / Quick Role Switcher */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-slate-300">STHANIQ — Verified Locals. Fair Prices. Better Journeys.</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 hidden sm:inline">Role Context:</span>
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1 rounded-md border border-slate-700 font-semibold transition"
            >
              <span className={`w-2 h-2 rounded-full ${
                storeState.activeRole === 'TOURIST' ? 'bg-amber-400' :
                storeState.activeRole === 'GUIDE' ? 'bg-emerald-400' : 'bg-indigo-400'
              }`}></span>
              <span>{storeState.activeRole} MODE</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-1.5 w-52 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-50 text-slate-200">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 border-b border-slate-700 uppercase tracking-wider">
                  Switch Active Role
                </div>
                <button
                  onClick={() => handleRoleChange('TOURIST')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-700 transition ${
                    storeState.activeRole === 'TOURIST' ? 'text-amber-400 font-bold bg-slate-700/50' : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-amber-400" /> Tourist Mode
                  </span>
                  {storeState.activeRole === 'TOURIST' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                </button>
                <button
                  onClick={() => handleRoleChange('GUIDE')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-700 transition ${
                    storeState.activeRole === 'GUIDE' ? 'text-emerald-400 font-bold bg-slate-700/50' : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-400" /> Local Guide Mode
                  </span>
                  {storeState.activeRole === 'GUIDE' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
                <button
                  onClick={() => handleRoleChange('ADMIN')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-700 transition ${
                    storeState.activeRole === 'ADMIN' ? 'text-indigo-400 font-bold bg-slate-700/50' : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" /> Admin Control Panel
                  </span>
                  {storeState.activeRole === 'ADMIN' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-amber-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5 fill-white/20 stroke-white stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 font-sans">
                STHANIQ<span className="text-brand-500">.</span>
              </span>
              <span className="hidden md:block text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">
                Verified Locals • Fair Prices
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links (Restructured Information Architecture) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/guides"
              className={`px-3 py-2 rounded-lg text-sm font-bold transition flex items-center gap-1.5 ${
                isActive('/guides') ? 'bg-amber-50 text-brand-700 font-extrabold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-brand-600" />
              <span>Find a Guide</span>
            </Link>

            <Link
              to="/tours"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                isActive('/tours') ? 'bg-amber-50 text-brand-600 font-semibold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Explore Tours</span>
            </Link>

            <Link
              to="/fair-prices"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                isActive('/fair-prices') ? 'bg-amber-50 text-brand-600 font-semibold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Tag className="w-4 h-4 text-indigo-600" />
              <span>Fair Price</span>
            </Link>

            <Link
              to="/ai-planner"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                isActive('/ai-planner') ? 'bg-amber-50 text-brand-600 font-semibold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI Planner</span>
            </Link>

            <Link
              to="/become-guide"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                isActive('/become-guide') ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Become a Guide</span>
            </Link>

            <Link
              to="/my-trips"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                isActive('/my-trips') ? 'bg-amber-50 text-brand-600 font-semibold' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4 text-slate-600" />
              <span>Trips</span>
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  if (!showNotifMenu) marketplaceStore.markNotificationsRead();
                }}
                className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 relative transition"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {/* Notification Menu */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Notifications</span>
                    <span className="text-[11px] text-slate-500">{storeState.notifications.length} Total</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {storeState.notifications.slice(0, 5).map(n => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-amber-50/50 transition">
                        <div className="text-xs font-bold text-slate-900">{n.title}</div>
                        <div className="text-xs text-slate-600 mt-0.5">{n.message}</div>
                        <div className="text-[10px] text-slate-400 mt-1">{n.createdAt}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <button
              onClick={onRequestOpen}
              className="bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-700 hover:to-amber-600 text-white px-4 py-2 rounded-xl font-extrabold text-sm shadow-md shadow-amber-500/20 hover:shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5"
            >
              <Users className="w-4 h-4" />
              <span>Find a Guide</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <Link
            to="/guides"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-extrabold text-slate-800 hover:bg-amber-50"
          >
            Find a Guide
          </Link>
          <Link
            to="/tours"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-amber-50"
          >
            Explore Tours
          </Link>
          <Link
            to="/fair-prices"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-amber-50"
          >
            Fair Price
          </Link>
          <Link
            to="/ai-planner"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-amber-50"
          >
            AI Planner
          </Link>
          <Link
            to="/become-guide"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
          >
            Become a Guide
          </Link>
          <Link
            to="/my-trips"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-amber-50"
          >
            Trips
          </Link>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onRequestOpen();
              }}
              className="w-full bg-brand-500 text-white font-extrabold py-2.5 rounded-xl text-sm"
            >
              Find a Guide
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
