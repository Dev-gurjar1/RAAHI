import React from 'react';
import { useToastStore } from '../../store/useToastStore.js';

export const SOSModal = ({
  isOpen,
  onClose,
  onOpenReportModal
}) => {
  const showToast = useToastStore((state) => state.showToast);

  if (!isOpen) return null;

  const handleShareLocation = () => {
    const trackingUrl = `https://raahi.in/track?lat=26.9855&lng=75.8513&id=${Date.now()}`;
    navigator.clipboard?.writeText(trackingUrl);
    showToast({
      type: 'success',
      title: 'GPS Tracking Link Copied 📍',
      message: 'Live tracking URL copied to clipboard. Share with friends or family.'
    });
  };

  const handleCallSupport = () => {
    showToast({
      type: 'warning',
      title: 'Connecting to Safety Helpline 📞',
      message: 'Dialing 24/7 Helpline: 1800-RAAHI-SAFE (Demo Action).'
    });
  };

  const handleContactTrusted = () => {
    showToast({
      type: 'info',
      title: 'Trusted Contact Alerted 💬',
      message: 'Emergency SMS with live GPS pin sent to your trusted contact.'
    });
  };

  const handleReportGuide = () => {
    onClose();
    if (onOpenReportModal) {
      onOpenReportModal();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 text-left font-sans">
      <div className="bg-white dark:bg-slate-900 border-2 border-rose-500 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 relative shadow-2xl">
        
        {/* Header Alert Badge */}
        <div className="space-y-2 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-500 text-white flex items-center justify-center mx-auto text-3xl font-black shadow-lg shadow-rose-500/30 animate-bounce">
            🆘
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-500/20">
            EMERGENCY ASSISTANCE
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            Are you in danger?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            RAAHI 24/7 Safety Dispatch & Tourist Police Helpline. Choose an option below.
          </p>
        </div>

        {/* 5 Actions */}
        <div className="space-y-3 font-sans text-xs">
          
          {/* Action 1: Share Live Location */}
          <button
            onClick={handleShareLocation}
            className="w-full p-4 bg-orange-50 dark:bg-orange-500/10 hover:bg-orange-100 text-orange-800 dark:text-orange-300 font-extrabold rounded-2xl border border-orange-200 dark:border-orange-500/30 transition flex items-center gap-3 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center text-base">
              <i className="fa-solid fa-location-crosshairs"></i>
            </div>
            <div className="text-left">
              <div>Share Live Location</div>
              <div className="text-[10px] text-orange-600 dark:text-orange-400 font-normal">Copy live GPS tracking link for contacts</div>
            </div>
          </button>

          {/* Action 2: Call Emergency Support */}
          <button
            onClick={handleCallSupport}
            className="w-full p-4 bg-rose-500 hover:bg-rose-600 text-white font-extrabold rounded-2xl shadow-lg shadow-rose-500/30 transition flex items-center gap-3 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center text-base">
              <i className="fa-solid fa-phone-volume"></i>
            </div>
            <div className="text-left">
              <div>Call Emergency Support</div>
              <div className="text-[10px] text-white/80 font-normal">1800-RAAHI-SAFE (24/7 Dispatch Hotline)</div>
            </div>
          </button>

          {/* Action 3: Contact Trusted Person */}
          <button
            onClick={handleContactTrusted}
            className="w-full p-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200 font-extrabold rounded-2xl border border-slate-200 dark:border-slate-700 transition flex items-center gap-3 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center text-base">
              <i className="fa-solid fa-user-shield text-emerald-500"></i>
            </div>
            <div className="text-left">
              <div>Contact Trusted Emergency Person</div>
              <div className="text-[10px] text-slate-400 font-normal">Send automated SMS alert to ICE contact</div>
            </div>
          </button>

          {/* Action 4: Report Guide */}
          <button
            onClick={handleReportGuide}
            className="w-full p-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200 font-extrabold rounded-2xl border border-slate-200 dark:border-slate-700 transition flex items-center gap-3 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center text-base">
              <i className="fa-solid fa-flag"></i>
            </div>
            <div className="text-left">
              <div>Report Guide / Host</div>
              <div className="text-[10px] text-slate-400 font-normal">Log incident report against assigned host</div>
            </div>
          </button>

          {/* Action 5: Cancel */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold rounded-2xl transition cursor-pointer"
          >
            Cancel / Close Safety Panel
          </button>

        </div>

      </div>
    </div>
  );
};
