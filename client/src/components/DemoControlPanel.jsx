import React, { useState } from 'react';
import { useBookingStore } from '../store/useBookingStore.js';
import { useGuideStore } from '../store/useGuideStore.js';

export const DemoControlPanel = () => {
  const [open, setOpen] = useState(false);
  const { openBookingModal } = useBookingStore();
  const { openIncomingRequestModal } = useGuideStore();

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {open && (
        <div className="mb-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-amber-500/40 p-4 rounded-2xl shadow-2xl w-64 space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 font-heading">
              <i className="fa-solid fa-sliders"></i> DEMO CONTROLS
            </span>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => { openBookingModal(); setOpen(false); }}
              className="w-full py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-left px-2 text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
            >
              ⚡ Match Demo Guide
            </button>
            <button
              onClick={() => { openIncomingRequestModal(); setOpen(false); }}
              className="w-full py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-left px-2 text-emerald-600 dark:text-emerald-400 font-medium cursor-pointer"
            >
              🔔 Trigger Incoming Request
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-1.5 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 border border-rose-300 dark:border-rose-500/30 rounded text-left px-2 text-rose-700 dark:text-rose-300 font-medium cursor-pointer"
            >
              🔄 Reset Demo State
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-3.5 py-2 rounded-full shadow-2xl text-xs flex items-center gap-2 transition transform hover:scale-105 border border-amber-400 cursor-pointer"
      >
        <i className="fa-solid fa-bolt"></i> DEMO PANEL
      </button>
    </div>
  );
};
