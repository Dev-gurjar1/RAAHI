import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Users,
  Compass,
  DollarSign,
  Plus,
  Trash2,
  TrendingUp,
  Sliders,
  Award
} from 'lucide-react';
import { marketplaceStore } from '../services/store';
import { GuideVerification, Report, FairPriceRule } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'VERIFICATIONS' | 'REPORTS' | 'PRICING' | 'BOOKINGS' | 'COMMISSION'>('VERIFICATIONS');
  const [state, setState] = useState(marketplaceStore.getState());

  // Form state for adding new Fair Price Rule
  const [fpDestination, setFpDestination] = useState('Jaipur');
  const [fpCategory, setFpCategory] = useState<'AUTO_TAXI' | 'GUIDE_HERITAGE' | 'STREET_FOOD' | 'ENTRY_TICKET'>('AUTO_TAXI');
  const [fpRoute, setFpRoute] = useState('Auto: Railway Station → Amber Fort');
  const [fpMin, setFpMin] = useState(250);
  const [fpMax, setFpMax] = useState(350);
  const [fpUnit, setFpUnit] = useState('Per Auto');
  const [fpSource, setFpSource] = useState('Jaipur Traffic Police Prepaid Chart');

  const [commissionInput, setCommissionInput] = useState(state.platformCommissionPercent);

  useEffect(() => {
    return marketplaceStore.subscribe(() => {
      setState(marketplaceStore.getState());
    });
  }, []);

  const pendingVerifs = state.verifications.filter(v => v.status === 'PENDING' || v.status === 'UNDER_REVIEW');
  const pendingReports = state.reports.filter(r => r.status === 'PENDING');

  const handleApprove = (vId: string) => {
    marketplaceStore.updateVerificationStatus(vId, 'VERIFIED', 'Identity and background checks approved by admin.');
    alert('Guide application approved! Profile is now live in the verified marketplace.');
  };

  const handleReject = (vId: string) => {
    marketplaceStore.updateVerificationStatus(vId, 'REJECTED', 'Documents failed verification criteria.');
  };

  const handleResolveReport = (rId: string) => {
    marketplaceStore.updateReportStatus(rId, 'RESOLVED');
  };

  const handleAddFairPriceRule = (e: React.FormEvent) => {
    e.preventDefault();
    marketplaceStore.addFairPriceRule({
      destination: fpDestination,
      category: fpCategory,
      routeOrItem: fpRoute,
      priceRangeMin: fpMin,
      priceRangeMax: fpMax,
      unit: fpUnit,
      trustedSource: fpSource
    });
    alert('New Fair Price Benchmark Rule Added!');
  };

  const handleSaveCommission = () => {
    marketplaceStore.setPlatformCommission(commissionInput);
    alert(`Platform Commission updated to ${commissionInput}%`);
  };

  const totalGrossBookings = state.bookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const totalPlatformEarnings = state.bookings.reduce((sum, b) => sum + b.platformFee, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-indigo-400" /> Administrative Moderation Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold">STHANIQ Admin Control Panel</h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Approve local guide verification applications, manage safety reports, moderate fair price rules, and configure platform commissions.
          </p>
        </div>

        <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 text-center min-w-[200px]">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Platform Revenue</span>
          <span className="text-2xl font-extrabold text-indigo-400">₹{totalPlatformEarnings.toLocaleString('en-IN')}</span>
          <span className="text-[10px] text-slate-400 block">{state.platformCommissionPercent}% Commission</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Applications</span>
          <span className="text-xl font-extrabold text-amber-500">{pendingVerifs.length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Verified Guides</span>
          <span className="text-xl font-extrabold text-emerald-600">{state.guides.filter(g => g.verificationStatus === 'VERIFIED').length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Safety Reports</span>
          <span className="text-xl font-extrabold text-rose-600">{pendingReports.length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Bookings</span>
          <span className="text-xl font-extrabold text-indigo-600">{state.bookings.length}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 flex flex-wrap gap-1">
        <button
          onClick={() => setActiveTab('VERIFICATIONS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'VERIFICATIONS' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span>Guide Applications ({pendingVerifs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('REPORTS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'REPORTS' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>Safety Reports ({pendingReports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('PRICING')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'PRICING' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4 text-amber-400" />
          <span>Fair Price Rules ({state.fairPriceRules.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('COMMISSION')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'COMMISSION' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>Commission Settings</span>
        </button>
      </div>

      {/* TAB 1: GUIDE VERIFICATION APPLICATIONS */}
      {activeTab === 'VERIFICATIONS' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Guide Verification Queue</h3>
          {state.verifications.length === 0 ? (
            <p className="text-xs text-slate-500">No applications in queue.</p>
          ) : (
            <div className="space-y-4">
              {state.verifications.map((v) => (
                <div key={v.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">{v.fullName}</h4>
                      <span className="text-xs text-slate-500">City: {v.city} • Age: {v.age} • Exp: {v.experienceYears} Yrs</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                      v.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' :
                      v.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {v.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <strong>Pitch:</strong> "{v.whyChooseMe}"
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Doc Attached: <strong>{v.idDocName}</strong></span>
                    <span>Submitted: {v.submittedAt.split('T')[0]}</span>
                  </div>

                  {v.status !== 'VERIFIED' && (
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleApprove(v.id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve & Verify Guide</span>
                      </button>
                      <button
                        onClick={() => handleReject(v.id)}
                        className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: REPORTS */}
      {activeTab === 'REPORTS' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Safety & Moderation Reports</h3>
          <div className="space-y-3">
            {state.reports.map((r) => (
              <div key={r.id} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-rose-600">Reason: {r.reason}</span>
                  <span className="bg-slate-100 px-2.5 py-0.5 rounded-full font-bold">{r.status}</span>
                </div>
                <div className="text-xs text-slate-700">
                  Reporter: <strong>{r.reporterName}</strong> against Guide: <strong>{r.guideName}</strong>
                </div>
                <p className="text-xs text-slate-600 italic bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                  "{r.description}"
                </p>
                {r.status === 'PENDING' && (
                  <button
                    onClick={() => handleResolveReport(r.id)}
                    className="bg-slate-900 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FAIR PRICE RULES MANAGEMENT */}
      {activeTab === 'PRICING' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add New City Fair Price Benchmark</h3>
            <form onSubmit={handleAddFairPriceRule} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Destination</label>
                  <input
                    type="text"
                    required
                    value={fpDestination}
                    onChange={(e) => setFpDestination(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={fpCategory}
                    onChange={(e) => setFpCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold"
                  >
                    <option value="AUTO_TAXI">Auto / Taxi</option>
                    <option value="GUIDE_HERITAGE">Guide Heritage</option>
                    <option value="STREET_FOOD">Street Food</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Route / Item</label>
                  <input
                    type="text"
                    required
                    value={fpRoute}
                    onChange={(e) => setFpRoute(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Min Price (₹)</label>
                  <input
                    type="number"
                    value={fpMin}
                    onChange={(e) => setFpMin(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Price (₹)</label>
                  <input
                    type="number"
                    value={fpMax}
                    onChange={(e) => setFpMax(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit / Terms</label>
                  <input
                    type="text"
                    value={fpUnit}
                    onChange={(e) => setFpUnit(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold"
                  />
                </div>
              </div>

              <button type="submit" className="bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs">
                Add Fair Price Rule
              </button>
            </form>
          </div>

          <div className="space-y-3">
            {state.fairPriceRules.map((rule) => (
              <div key={rule.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-600 uppercase">{rule.destination} • {rule.category}</span>
                  <h4 className="font-bold text-slate-900 text-xs">{rule.routeOrItem}</h4>
                  <span className="text-xs font-extrabold text-emerald-700">₹{rule.priceRangeMin} – ₹{rule.priceRangeMax}</span>
                </div>
                <button
                  onClick={() => marketplaceStore.deleteFairPriceRule(rule.id)}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: COMMISSION CONFIGURATION */}
      {activeTab === 'COMMISSION' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm max-w-md space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Configurable Platform Commission</h3>
          <p className="text-xs text-slate-500">
            Set the marketplace commission percentage deducted from guide payouts upon booking completion.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Commission Percentage (%)</label>
            <input
              type="number"
              min="0"
              max="50"
              value={commissionInput}
              onChange={(e) => setCommissionInput(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-extrabold text-indigo-600 focus:outline-none"
            />
          </div>

          <button
            onClick={handleSaveCommission}
            className="w-full bg-slate-900 text-white font-extrabold py-3 rounded-xl text-xs"
          >
            Save Commission Rate
          </button>
        </div>
      )}
    </div>
  );
};
