import React from 'react';
import { useGuideStore } from '../store/useGuideStore';
import { useToastStore } from '../store/useToastStore';
import { PackageCreatorModal } from '../components/modals/PackageCreatorModal';

export const GuideDashboardPage: React.FC = () => {
  const { online, toggleOnline, packages, openCreatePackageModal, openIncomingRequestModal } = useGuideStore();
  const showToast = useToastStore((state) => state.showToast);

  const handleToggleOnline = () => {
    toggleOnline();
    showToast({
      type: online ? 'info' : 'success',
      title: online ? 'Status: Offline' : 'Status: Online ✓',
      message: online
        ? 'You are currently not receiving tourist booking requests.'
        : 'You are now live on the Jaipur guide radar to receive incoming requests.'
    });
  };

  return (
    <div className="space-y-8 text-left">
      {/* Hero Header & Availability Toggle */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-500/20">
            <i className="fa-solid fa-id-card"></i> Verified Local Guide Account
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            Local Guide Partner Hub
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            Welcome back, <span className="text-orange-600 dark:text-orange-400 font-bold">Vikram Singh Rathore</span>! You are authenticated for Amer Fort & Old City tours.
          </p>
        </div>

        {/* Online Toggle & Test Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={openIncomingRequestModal}
            className="px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full text-xs transition shadow-md shadow-orange-500/20 flex items-center gap-2 uppercase tracking-wider"
          >
            <i className="fa-solid fa-bell"></i> Test Tourist Request
          </button>

          <div className="bg-slate-50 dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Radar Status</div>
              <div className={`text-xs font-extrabold ${online ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                {online ? 'ONLINE ●' : 'OFFLINE ●'}
              </div>
            </div>
            <button
              onClick={handleToggleOnline}
              className={`w-14 h-8 rounded-full p-1 transition-colors relative focus:outline-none ${
                online ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full transition-transform transform shadow-md ${
                  online ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-1">
          <div className="text-xs text-slate-400 font-semibold uppercase">Total Earnings</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-heading">
            ₹18,450
          </div>
          <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <i className="fa-solid fa-arrow-trend-up"></i> +12% this week
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-1">
          <div className="text-xs text-slate-400 font-semibold uppercase">Completed Tours</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            42
          </div>
          <div className="text-[11px] text-slate-500 font-medium">100% 5-Star Verified</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-1">
          <div className="text-xs text-slate-400 font-semibold uppercase">Host Rating</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-500 font-heading">
            4.95 ★
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Based on 38 reviews</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-1">
          <div className="text-xs text-slate-400 font-semibold uppercase">KYC Status</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-heading">
            Verified ✓
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Govt ID & Police Clear</div>
        </div>
      </div>

      {/* Tour Packages Manager */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
              My Active Tour Packages
            </h2>
            <p className="text-slate-500 text-xs">Experiences published to travelers searching Jaipur.</p>
          </div>
          <button
            onClick={openCreatePackageModal}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-full text-xs transition flex items-center gap-1.5 shadow-md shadow-orange-500/20 uppercase tracking-wider"
          >
            <i className="fa-solid fa-plus"></i> Create Package
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-card space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-2.5 py-0.5 rounded-full">
                  {p.category}
                </span>
                <span className="text-xs text-slate-400"><i className="fa-solid fa-clock mr-1"></i> {p.duration}</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-heading">{p.title}</h3>
              <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                ₹{p.price} <span className="text-xs font-normal text-slate-400">/ person</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KYC Center */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
          <i className="fa-solid fa-shield-check text-emerald-500"></i> Government KYC & Verification Status
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Government Aadhaar ID</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                <i className="fa-solid fa-circle-check"></i> Authenticated (DEMO)
              </div>
            </div>
            <i className="fa-solid fa-id-card text-2xl text-slate-400"></i>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Rajasthan Tourism License</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                <i className="fa-solid fa-circle-check"></i> Active (DEMO)
              </div>
            </div>
            <i className="fa-solid fa-file-contract text-2xl text-slate-400"></i>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Police Clearance Certificate</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                <i className="fa-solid fa-circle-check"></i> Approved (DEMO)
              </div>
            </div>
            <i className="fa-solid fa-user-shield text-2xl text-slate-400"></i>
          </div>
        </div>
      </div>

      <PackageCreatorModal />
    </div>
  );
};
