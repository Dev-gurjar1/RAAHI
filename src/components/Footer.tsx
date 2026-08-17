import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck, Heart, Award, HelpCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      {/* Become a Guide CTA Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-amber-950 py-10 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
              <ShieldCheck className="w-4 h-4" /> Local Earning Opportunity
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Know Your City? Earn From It.</h3>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Students, local experts, and experienced guides can apply to become verified local hosts. Set your own pricing and share your hometown history.
            </p>
          </div>
          <Link
            to="/become-guide"
            className="whitespace-nowrap bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-2 transform hover:-translate-y-0.5"
          >
            <span>Apply to Become a Guide</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Vision */}
        <div className="space-y-4 md:col-span-1">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
              <MapPin className="w-5 h-5 fill-slate-950/20" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">STHANIQ<span className="text-amber-400">.</span></span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed">
            Verified locals. Fair prices. Better journeys. Connecting tourists with authentic local guides and tour creators with complete price transparency.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>100% Identity Checked Local Guides</span>
          </div>
        </div>

        {/* Tourist Links */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Tourist Marketplace</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/guides" className="hover:text-amber-400 transition">Verified Local Guides</Link></li>
            <li><Link to="/tours" className="hover:text-amber-400 transition">Explore Tour Packages</Link></li>
            <li><Link to="/fair-prices" className="hover:text-amber-400 transition">Fair Price Benchmark Engine</Link></li>
            <li><Link to="/ai-planner" className="hover:text-amber-400 transition">Budget-Aware AI Trip Planner</Link></li>
            <li><Link to="/ask-local" className="hover:text-amber-400 transition">Ask a Local Q&A Forum</Link></li>
          </ul>
        </div>

        {/* Local Guides Links */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Local Guides</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/become-guide" className="hover:text-emerald-400 transition">Apply to Become a Guide</Link></li>
            <li><Link to="/guide-dashboard" className="hover:text-emerald-400 transition">Guide Dashboard & Requests</Link></li>
            <li><Link to="/guide-dashboard" className="hover:text-emerald-400 transition">Tour Package Creator</Link></li>
            <li><Link to="/fair-prices" className="hover:text-emerald-400 transition">Local Pricing Rules</Link></li>
            <li><a href="#verification-faq" className="hover:text-emerald-400 transition">Verification Guidelines</a></li>
          </ul>
        </div>

        {/* Trust & Safety */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Trust & Safety</h4>
          <ul className="space-y-2.5 text-xs">
            <li className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-amber-400" /> Verified Identity Badges
            </li>
            <li className="flex items-center gap-2 text-slate-400">
              <Award className="w-4 h-4 text-emerald-400" /> Fair Price Guarantee Standard
            </li>
            <li className="flex items-center gap-2 text-slate-400">
              <HelpCircle className="w-4 h-4 text-indigo-400" /> 24/7 Safety Reporting
            </li>
            <li><Link to="/admin-panel" className="hover:text-indigo-400 transition">Admin Verification Control</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 py-6 text-center text-xs text-slate-400 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 STHANIQ Travel Marketplace. Built for trusted travel.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Jaipur</span> • <span>Delhi</span> • <span>Udaipur</span> • <span>Agra</span> • <span>Varanasi</span> • <span>Manali</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
