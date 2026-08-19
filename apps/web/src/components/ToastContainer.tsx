import React from 'react';
import { useToastStore } from '../store/useToastStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const bgStyles = {
          success: 'bg-emerald-950/90 border-emerald-500 text-white',
          error: 'bg-rose-950/90 border-rose-500 text-white',
          warning: 'bg-amber-950/90 border-amber-500 text-white',
          info: 'bg-slate-900/90 border-orange-500 text-white',
        }[t.type];

        const iconStyles = {
          success: 'fa-circle-check text-emerald-400',
          error: 'fa-circle-exclamation text-rose-400',
          warning: 'fa-triangle-exclamation text-amber-400',
          info: 'fa-circle-info text-orange-400',
        }[t.type];

        return (
          <div
            key={t.id}
            className={`pointer-events-auto backdrop-blur-md p-4 rounded-2xl border shadow-floating flex items-start gap-3 animate-slide-up transition-all ${bgStyles}`}
          >
            <i className={`fa-solid ${iconStyles} text-lg mt-0.5`}></i>
            <div className="flex-1 text-left">
              {t.title && <div className="font-bold text-xs font-heading">{t.title}</div>}
              <div className="text-xs text-slate-200">{t.message}</div>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-white p-1 text-xs transition"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        );
      })}
    </div>
  );
};
