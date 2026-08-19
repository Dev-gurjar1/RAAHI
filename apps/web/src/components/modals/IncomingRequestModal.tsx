import React, { useEffect } from 'react';
import { useGuideStore } from '../../store/useGuideStore';

export const IncomingRequestModal: React.FC = () => {
  const { isIncomingRequestModalOpen, closeIncomingRequestModal, requestCountdown } = useGuideStore();

  useEffect(() => {
    if (isIncomingRequestModalOpen && requestCountdown > 0) {
      const timer = setTimeout(() => {
        // countdown handler if needed
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isIncomingRequestModalOpen, requestCountdown]);

  if (!isIncomingRequestModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500 rounded-3xl max-w-md w-full p-6 space-y-6 relative shadow-2xl text-center">
        
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-2xl font-bold animate-pulse">
          <i className="fa-solid fa-bell-ring"></i>
        </div>

        <div className="space-y-1">
          <span className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
            New Tourist Booking Request
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-heading pt-2">Heritage Walk — Amer Fort</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs">2 Travelers • 1.8 km pickup distance</p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-around">
          <div>
            <div className="text-[10px] text-slate-400">Estimated Earning</div>
            <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">₹900</div>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
          <div>
            <div className="text-[10px] text-slate-400">Time Left</div>
            <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400">15s</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={closeIncomingRequestModal} className="flex-1 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs">
            Decline
          </button>
          <button
            onClick={() => {
              alert("✓ Request Accepted! Matched with Tourist.");
              closeIncomingRequestModal();
            }}
            className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-emerald-500/20"
          >
            Accept Request ✓
          </button>
        </div>
      </div>
    </div>
  );
};
