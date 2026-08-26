import React, { useState } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import { JAIPUR_GUIDES_DATA } from '../constants/guides';
import { useBookingStore } from '../store/useBookingStore';
import { useToastStore } from '../store/useToastStore';

export const GuideProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const openBookingModal = useBookingStore((state) => state.openBookingModal);
  const showToast = useToastStore((state) => state.showToast);

  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');

  // Find guide by ID or fallback to first guide (Vikram)
  const guide = JAIPUR_GUIDES_DATA.find((g) => g.id === id) || JAIPUR_GUIDES_DATA[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setMessageModalOpen(false);
    setMessageText('');
    showToast({
      type: 'success',
      title: 'Message Sent to Host',
      message: `${guide.name} will respond to your inquiry in ${guide.responseTime}.`
    });
  };

  const handleReportProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) return;
    setReportModalOpen(false);
    setReportReason('');
    showToast({
      type: 'info',
      title: 'Report Submitted',
      message: 'Thank you for helping keep RAAHI safe. Our trust team will review this profile.'
    });
  };

  return (
    <div className="space-y-8 text-left font-sans pb-20 sm:pb-8">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <NavLink
          to="/guides"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-orange-600 transition"
        >
          <i className="fa-solid fa-arrow-left text-[10px]"></i>
          <span>Back to All Local Guides</span>
        </NavLink>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Directory</span>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-bold">{guide.name}</span>
        </div>
      </div>

      {/* HERO COVER BANNER & PROFILE HEADER */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/80 shadow-card overflow-hidden">
        {/* Cover Photo Banner */}
        <div className="h-44 sm:h-60 relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700">
          <img
            src="https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&auto=format&fit=crop&q=80"
            alt="Jaipur Heritage"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
          
          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full border border-white/20 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{guide.online ? 'Online & Available Now' : 'Active Today'}</span>
          </div>
        </div>

        {/* Profile Details Header */}
        <div className="p-6 sm:p-8 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 -mt-16 sm:-mt-20">
            {/* Avatar & Main Credentials */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <div className="relative">
                <img
                  src={guide.avatar}
                  alt={guide.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-xl"
                />
                <span className="absolute -bottom-2 -right-2 w-7 h-7 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-md">
                  ✓
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                    ✓ Aadhaar & Police Vetted Host
                  </span>
                  <span className="text-[10px] font-extrabold uppercase text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-500/20">
                    Rajasthan Tourism Licensed
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
                  {guide.name}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span className="text-amber-500 font-bold flex items-center gap-1">
                    <i className="fa-solid fa-star text-sm"></i> {guide.rating} ({guide.reviewCount} reviews)
                  </span>
                  <span>•</span>
                  <span>{guide.completedTrips} Completed Tours</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-semibold">
                    <i className="fa-solid fa-location-dot text-orange-500"></i> Jaipur • {guide.distanceKm} km away
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Tariff Summary & Direct CTA */}
            <div className="w-full sm:w-auto bg-slate-50 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Hourly Tariff</span>
                <span className="text-2xl font-extrabold text-orange-600 dark:text-orange-400 font-heading">
                  ₹{guide.hourlyRate} <span className="text-xs font-normal text-slate-400">/ hour</span>
                </span>
              </div>
              <button
                onClick={() => openBookingModal(guide)}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-full text-xs uppercase tracking-wider transition shadow-md shadow-orange-500/20"
              >
                Book This Guide
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN CONTENT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Detailed Profile Sections (Col 8) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* SECTION 1: ABOUT THE GUIDE */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
              <i className="fa-solid fa-user-check text-orange-500"></i> About {guide.name}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
              Namaste! I am {guide.name}, born and raised in the Pink City of Jaipur. For over {guide.experience}, I have been guiding travelers through Rajasthan's royal fortresses, secret palace passages, and vibrant artisan bazaars. 
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
              As an authenticated RAAHI local host, my priority is giving you an authentic, hassle-free experience with zero shop commission traps or overcharging. Whether you want to explore Amer Fort's underground tunnels or taste 90-year-old street food delicacies, I am here to make your journey unforgettable.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Experience</span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">{guide.experience}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Response Time</span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">{guide.responseTime}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Completed Tours</span>
                <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{guide.completedTrips}+</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: AREAS OF EXPERTISE */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
              <i className="fa-solid fa-star text-amber-500"></i> Areas of Expertise
            </h2>
            <p className="text-xs text-slate-500">Specialized knowledge and curated tour themes hosted by {guide.name}.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {guide.specialties.map((specialty, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center text-sm flex-shrink-0 font-bold">
                    <i className="fa-solid fa-compass"></i>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{specialty}</div>
                    <div className="text-[11px] text-slate-500">In-depth historical & cultural storytelling</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: LANGUAGES SPOKEN */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
              <i className="fa-solid fa-language text-sky-500"></i> Languages Spoken
            </h2>
            
            <div className="flex flex-wrap gap-3">
              {guide.languages.map((lang, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-3"
                >
                  <div className="w-7 h-7 rounded-full bg-sky-500/15 text-sky-600 flex items-center justify-center text-xs font-bold">
                    🗣️
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{lang}</div>
                    <div className="text-[10px] text-slate-400">
                      {idx === 0 ? 'Native Speaker' : 'Fluent / Professional'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: HANDCRAFTED LOCAL EXPERIENCES */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
                  <i className="fa-solid fa-map text-emerald-500"></i> Hosted Tours & Experiences
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Handcrafted itineraries hosted directly by {guide.name}.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="text-[10px] uppercase font-bold text-orange-600 bg-orange-100 dark:bg-orange-500/10 px-2.5 py-0.5 rounded-full">
                  Heritage Forts
                </span>
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white font-heading">
                  Amer Fort Secret Passages & Royal History
                </h3>
                <div className="text-xs text-slate-500 flex items-center justify-between">
                  <span>3.5 Hours</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">₹899 / person</span>
                </div>
                <button
                  onClick={() => openBookingModal(guide)}
                  className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition"
                >
                  Book Package with {guide.name.split(' ')[0]}
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-100 dark:bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                  Cultural Crawl
                </span>
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white font-heading">
                  Pink City Royal Havelis & Artisan Bazaars
                </h3>
                <div className="text-xs text-slate-500 flex items-center justify-between">
                  <span>3.0 Hours</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">₹750 / person</span>
                </div>
                <button
                  onClick={() => openBookingModal(guide)}
                  className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition"
                >
                  Book Package with {guide.name.split(' ')[0]}
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 5: TRAVELER REVIEWS */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-card space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading flex items-center gap-2">
                  <i className="fa-solid fa-[#F59E0B] fa-comments"></i> Traveler Reviews ({guide.reviewCount})
                </h2>
                <p className="text-xs text-slate-500">Verified feedback from tourists who booked {guide.name}.</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-amber-500 font-heading">{guide.rating} ★</span>
                <span className="text-[10px] text-slate-400 block font-semibold">100% Verified Trips</span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Review 1 */}
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                      SJ
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Sarah Jenkins</div>
                      <div className="text-[10px] text-slate-400">London, UK • Verified Tour</div>
                    </div>
                  </div>
                  <div className="text-amber-500 text-xs font-bold">★★★★★</div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "{guide.name.split(' ')[0]} was an unbelievable guide! He took us through underground tunnels in Amer Fort that were completely empty of crowds. Extremely knowledgeable and zero pushy shopping."
                </p>
                <div className="text-[10px] text-slate-400">Reviewed 4 days ago</div>
              </div>

              {/* Review 2 */}
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">
                      ER
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Elena Rostova</div>
                      <div className="text-[10px] text-slate-400">Berlin, Germany • Verified Tour</div>
                    </div>
                  </div>
                  <div className="text-amber-500 text-xs font-bold">★★★★★</div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "As a solo female traveler, having an Aadhaar-verified local host made me feel completely safe. The 4-digit OTP booking system works perfectly!"
                </p>
                <div className="text-[10px] text-slate-400">Reviewed 1 week ago</div>
              </div>
            </div>
          </div>

          {/* SECTION 6 & 7: SAFETY & VERIFICATION GUARANTEE */}
          <div className="bg-emerald-950 text-white p-6 sm:p-8 rounded-3xl border border-emerald-800 shadow-xl space-y-4">
            <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
              <i className="fa-solid fa-shield-check text-emerald-400"></i> Verification & Safety Credentials
            </h2>
            <p className="text-emerald-100/80 text-xs leading-relaxed">
              Every host on RAAHI is background checked by local authorities and bound by our strict anti-exploitation traveler code.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-emerald-900/50 p-3.5 rounded-2xl border border-emerald-700/50">
                <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <i className="fa-solid fa-id-card text-emerald-400"></i> Government Aadhaar
                </div>
                <div className="text-[10px] text-emerald-200/70 mt-1">Identity & address verified</div>
              </div>

              <div className="bg-emerald-900/50 p-3.5 rounded-2xl border border-emerald-700/50">
                <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <i className="fa-solid fa-file-contract text-emerald-400"></i> Tourism License
                </div>
                <div className="text-[10px] text-emerald-200/70 mt-1">Rajasthan Tourism certified</div>
              </div>

              <div className="bg-emerald-900/50 p-3.5 rounded-2xl border border-emerald-700/50">
                <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <i className="fa-solid fa-user-shield text-emerald-400"></i> Police Clearance
                </div>
                <div className="text-[10px] text-emerald-200/70 mt-1">Record clearance approved</div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-emerald-200 font-medium">Have a concern regarding this host?</span>
              <button
                onClick={() => setReportModalOpen(true)}
                className="text-rose-300 underline font-bold hover:text-rose-200"
              >
                Report Profile
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Sticky Booking & Messaging Card (Desktop Col 4) */}
        <div className="lg:col-span-4 sticky top-6 space-y-4">
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-floating space-y-6">
            
            {/* Tariff Header */}
            <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">HOURLY TARIFF</span>
              <div className="text-3xl font-black text-orange-600 dark:text-orange-400 font-heading">
                ₹{guide.hourlyRate} <span className="text-xs font-normal text-slate-400">/ hour</span>
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                ✓ Fair Price Shield Guaranteed
              </p>
            </div>

            {/* Inclusions checklist */}
            <div className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-emerald-500"></i>
                <span>Private 1-on-1 Local Companion</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-emerald-500"></i>
                <span>Skip-the-line Entrance Assistance</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-emerald-500"></i>
                <span>Zero Shopping Commission Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-emerald-500"></i>
                <span>Protected by 4-Digit Start OTP</span>
              </div>
            </div>

            {/* Primary Actions */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => openBookingModal(guide)}
                className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-full text-xs uppercase tracking-wider transition shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-calendar-check"></i>
                <span>Book This Guide Now</span>
              </button>

              <button
                onClick={() => setMessageModalOpen(true)}
                className="w-full py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold rounded-full text-xs transition flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-paper-plane text-orange-500"></i>
                <span>Contact {guide.name.split(' ')[0]}</span>
              </button>
            </div>

            <p className="text-[10px] text-slate-400 text-center">
              No upfront payment required until you meet your host and verify the 4-digit OTP.
            </p>
          </div>

        </div>

      </div>

      {/* MOBILE FLOATING BOTTOM BOOKING BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4 shadow-floating flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block leading-none">Tariff</span>
          <span className="text-xl font-extrabold text-orange-600 dark:text-orange-400 font-heading">
            ₹{guide.hourlyRate} <span className="text-xs font-normal text-slate-400">/ hr</span>
          </span>
        </div>

        <button
          onClick={() => openBookingModal(guide)}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-full text-xs uppercase tracking-wider shadow-md"
        >
          Book Guide Now
        </button>
      </div>

      {/* CONTACT HOST MODAL */}
      {messageModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 space-y-4 text-left shadow-2xl relative">
            <button
              onClick={() => setMessageModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
              Send Message to {guide.name}
            </h3>
            <p className="text-xs text-slate-500">Ask about availability, custom itineraries, or specific places.</p>

            <form onSubmit={handleSendMessage} className="space-y-3">
              <textarea
                rows={4}
                required
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={`Hi ${guide.name.split(' ')[0]}, I will be visiting Amer Fort tomorrow and wanted to check...`}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-full text-xs transition uppercase tracking-wider"
              >
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      )}

      {/* REPORT PROFILE MODAL */}
      {reportModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 space-y-4 text-left shadow-2xl relative">
            <button
              onClick={() => setReportModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
              Report Profile ({guide.name})
            </h3>
            <p className="text-xs text-slate-500">Please describe why you are reporting this host profile.</p>

            <form onSubmit={handleReportProfile} className="space-y-3">
              <textarea
                rows={3}
                required
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Detail any concern or discrepancy..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-full text-xs transition uppercase tracking-wider"
              >
                Submit Safety Report
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default GuideProfilePage;
