import React, { useState } from 'react';
import { useBookingStore } from '../store/useBookingStore';
import { SOSModal } from '../components/modals/SOSModal';
import { ReportGuideModal } from '../components/modals/ReportGuideModal';

export const SafetyCenterPage: React.FC = () => {
  const { userBookings } = useBookingStore();

  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Active / Upcoming booking for safety monitor
  const activeBooking = userBookings.find(
    (b) => b.status === 'Pending' || b.status === 'Confirmed'
  );

  return (
    <div className="space-y-8 text-left font-sans pb-16">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-br from-rose-600 via-orange-600 to-rose-700 text-white p-6 sm:p-10 rounded-3xl shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold border border-white/30 backdrop-blur-md uppercase tracking-wider">
            <i className="fa-solid fa-shield-check"></i> RAAHI SAFETY SHIELD & DISPATCH
          </span>

          <button
            onClick={() => setIsSosOpen(true)}
            className="px-4 py-2 bg-white text-rose-600 hover:bg-rose-50 font-black rounded-full text-xs transition shadow-lg flex items-center gap-1.5 uppercase tracking-wider"
          >
            <span>🆘 SOS Emergency</span>
          </button>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading">
          Traveler Safety & Emergency Assistance Center
        </h1>

        <p className="text-white/90 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Comprehensive 24/7 emergency dispatch, police verification details, active booking safety monitoring, and incident reporting for RAAHI travelers across India.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Active Booking Monitor & Emergency Hotlines (Col 7) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* ACTIVE BOOKING SAFETY MONITOR */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-orange-500 tracking-wider">LIVE MONITORING</span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
                  Active Tour Safety Monitor
                </h2>
              </div>
              {activeBooking && (
                <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-200">
                  ● Tour Monitored
                </span>
              )}
            </div>

            {activeBooking ? (
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={activeBooking.guideAvatar}
                        alt={activeBooking.guideName}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500"
                      />
                      <div>
                        <div className="text-xs text-slate-400 font-bold">Booking #{activeBooking.id}</div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base font-heading">
                          Tour with {activeBooking.guideName}
                        </h3>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                      ₹{activeBooking.totalAmount}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div><strong>Date & Time:</strong> {activeBooking.date} at {activeBooking.startTime}</div>
                    <div><strong>Meeting Point:</strong> {activeBooking.meetingPoint}</div>
                  </div>

                  {/* 4-Digit OTP Verification Callout */}
                  <div className="bg-amber-50 dark:bg-amber-500/10 p-3.5 rounded-xl border border-amber-200 dark:border-amber-500/30 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400">Start-Tour OTP</div>
                      <div className="text-lg font-black text-amber-600 font-heading tracking-widest">{activeBooking.startOtp}</div>
                    </div>
                    <p className="text-[10px] text-amber-800 dark:text-amber-300 max-w-[200px] text-right">
                      Verify this 4-digit code in person with {activeBooking.guideName} before starting.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsSosOpen(true)}
                    className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider transition shadow-md shadow-rose-600/20 flex items-center justify-center gap-2"
                  >
                    <span>🆘 Emergency Assistance</span>
                  </button>
                  <button
                    onClick={() => setIsReportOpen(true)}
                    className="py-3 px-5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold rounded-2xl text-xs transition"
                  >
                    Report Guide
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-slate-400 text-xl"><i className="fa-solid fa-suitcase text-2xl"></i></div>
                <div className="text-sm font-bold text-slate-700 dark:text-slate-300">No Active Tour Currently Monitored</div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  When you book a local guide on RAAHI, live safety tracking and Start-Tour OTP verification will appear here.
                </p>
              </div>
            )}
          </div>

          {/* EMERGENCY HOTLINES CARD */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
              <i className="fa-solid fa-phone-volume text-rose-500"></i> Emergency Hotlines & Contacts
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="text-[10px] font-bold uppercase text-orange-600">RAAHI 24/7 DISPATCH</div>
                <div className="text-lg font-black text-slate-900 dark:text-white font-heading">1800-RAAHI-SAFE</div>
                <div className="text-[10px] text-slate-400">Toll-free incident helpline</div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="text-[10px] font-bold uppercase text-rose-600">TOURIST POLICE HOTLINE</div>
                <div className="text-lg font-black text-slate-900 dark:text-white font-heading">112 / 0141-2603838</div>
                <div className="text-[10px] text-slate-400">Government Rajasthan Police</div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Safety Tips & Report Issue (Col 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* TRAVELER SAFETY TIPS */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
              <i className="fa-solid fa-shield-check text-emerald-500"></i> Essential Safety Tips
            </h2>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-700">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-extrabold text-[11px] flex-shrink-0">1</span>
                <div>
                  <strong className="text-slate-900 dark:text-white block">Verify 4-Digit OTP In Person</strong>
                  Always check that your host reads back the 4-digit start OTP before beginning any tour.
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-700">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-extrabold text-[11px] flex-shrink-0">2</span>
                <div>
                  <strong className="text-slate-900 dark:text-white block">Public Landmark Meeting Points</strong>
                  Meet your host at prominent public landmarks such as Amer Fort Main Gate or Hawa Mahal.
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-700">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-extrabold text-[11px] flex-shrink-0">3</span>
                <div>
                  <strong className="text-slate-900 dark:text-white block">Zero Pushy Shopping Trap Guarantee</strong>
                  RAAHI hosts are prohibited from forcing commissions at souvenir shops or carpet stores.
                </div>
              </div>
            </div>
          </div>

          {/* REPORT AN ISSUE CARD */}
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 p-6 rounded-3xl space-y-3 text-xs">
            <h3 className="text-base font-bold text-rose-800 dark:text-rose-300 font-heading flex items-center gap-2">
              <i className="fa-solid fa-flag"></i> Report Host or Incident
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Did your guide demand extra cash or act unprofessionally? Log an instant incident report.
            </p>
            <button
              onClick={() => setIsReportOpen(true)}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-2xl transition shadow-md shadow-rose-600/20 uppercase tracking-wider"
            >
              Report Host / Incident
            </button>
          </div>

        </div>

      </div>

      {/* Global Safety Modals */}
      <SOSModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        onOpenReportModal={() => setIsReportOpen(true)}
      />

      <ReportGuideModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        guideName={activeBooking?.guideName || 'Vikram Singh Rathore'}
        bookingId={activeBooking?.id}
      />
    </div>
  );
};
