import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { RaahiLogo } from './components/RaahiLogo';
import { ToastContainer } from './components/ToastContainer';
import { AuthModal } from './components/modals/AuthModal';
import { BookingModal } from './components/modals/BookingModal';
import { IncomingRequestModal } from './components/modals/IncomingRequestModal';

import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { GuidesPage } from './pages/GuidesPage';
import { GuideProfilePage } from './pages/GuideProfilePage';
import { ToursPage } from './pages/ToursPage';
import { ExperiencesPage } from './pages/ExperiencesPage';
import { FairPricePage } from './pages/FairPricePage';
import { PlannerPage } from './pages/PlannerPage';
import { TripsPage } from './pages/TripsPage';
import { GuideDashboardPage } from './pages/GuideDashboardPage';
import { LoginPage } from './pages/LoginPage';
import { BecomeGuidePage } from './pages/BecomeGuidePage';
import { SafetyCenterPage } from './pages/SafetyCenterPage';
import { TourDetailsPage } from './pages/TourDetailsPage';
import { TourCreatorPage } from './pages/TourCreatorPage';
import { CampusAmbassadorOnboardingPage } from './pages/CampusAmbassadorOnboardingPage';
import { CampusAmbassadorDashboardPage } from './pages/CampusAmbassadorDashboardPage';
import { CampusAmbassadorAdminPage } from './pages/CampusAmbassadorAdminPage';
import { ProtectedRoute } from './components/ProtectedRoute';

export const App = () => {
  return (
    <BrowserRouter>
      {/* Deep forest outer background */}
      <div className="min-h-screen bg-[#07543F] flex flex-col items-center justify-start relative overflow-x-hidden">

        {/* Subtle ambient background elements */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-[#0B9B6E]/5 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#F4A340]/4 blur-[100px]" />
        </div>

        {/* Main Application Canvas */}
        <div className="relative z-10 w-full min-h-screen bg-[#F8F7F3] dark:bg-[#0D1710] flex flex-col transition-colors duration-300">

          <AnnouncementBar />
          <Navbar />

          <main className="flex-1 w-full">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/guides" element={<GuidesPage />} />
              <Route path="/instant-guide" element={<GuidesPage />} />
              <Route path="/guides/:id" element={<GuideProfilePage />} />
              <Route path="/tours" element={<ToursPage />} />
              <Route path="/experiences" element={<ExperiencesPage />} />
              <Route path="/tours/:id" element={<TourDetailsPage />} />
              <Route path="/fair-price" element={<FairPricePage />} />
              <Route path="/planner" element={<PlannerPage />} />
              <Route path="/safety" element={<SafetyCenterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/become-guide" element={<BecomeGuidePage />} />
              <Route
                path="/guide/create-tour"
                element={
                  <ProtectedRoute requiredRole="guide">
                    <TourCreatorPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trips"
                element={
                  <ProtectedRoute requiredRole="tourist">
                    <TripsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/guide"
                element={
                  <ProtectedRoute requiredRole="guide">
                    <GuideDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/campus-ambassador/apply" element={<CampusAmbassadorOnboardingPage />} />
              <Route path="/campus-ambassador/join" element={<CampusAmbassadorOnboardingPage />} />
              <Route
                path="/campus-ambassador/dashboard"
                element={
                  <ProtectedRoute>
                    <CampusAmbassadorDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/campus-ambassador/admin" element={<CampusAmbassadorAdminPage />} />
            </Routes>
          </main>

          {/* Premium Footer */}
          <footer className="bg-[#0D1F17] dark:bg-[#080F0A] border-t border-white/5 py-12 px-6 sm:px-12 mt-0">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-10">

                {/* Brand */}
                <div className="space-y-4 max-w-xs">
                  <RaahiLogo variant="full" size={44} />
                  <p className="text-sm text-white/40 leading-relaxed">
                    A high-trust cultural guide marketplace and transparent anti-scam travel platform across India.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-white/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0B9B6E] animate-pulse"></span>
                    <span>Pan-India Verified Escort Network • Live</span>
                  </div>
                </div>

                {/* Navigation links */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
                  <div className="space-y-3">
                    <div className="text-white/20 text-xs font-semibold uppercase tracking-widest">Explore</div>
                    <div className="space-y-2.5">
                      <Link to="/explore" className="block text-white/50 hover:text-white transition-colors">Explore India</Link>
                      <Link to="/guides" className="block text-white/50 hover:text-white transition-colors">Local Guides</Link>
                      <Link to="/tours" className="block text-white/50 hover:text-white transition-colors">Curated Tours</Link>
                      <Link to="/experiences" className="block text-white/50 hover:text-white transition-colors">Local Experiences</Link>
                      <Link to="/planner" className="block text-white/50 hover:text-white transition-colors">AI Trip Planner</Link>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-white/20 text-xs font-semibold uppercase tracking-widest">Community & Earn</div>
                    <div className="space-y-2.5">
                      <Link to="/campus-ambassador/dashboard" className="block text-[#4ADE80] font-bold hover:text-white transition-colors">
                        🎓 Campus Ambassador
                      </Link>
                      <Link to="/become-guide" className="block text-white/50 hover:text-white transition-colors">Become a Local Host</Link>
                      <Link to="/fair-price" className="block text-white/50 hover:text-white transition-colors">Fair Price Shield</Link>
                      <Link to="/safety" className="block text-white/50 hover:text-white transition-colors">Safety Center</Link>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-white/20 text-xs font-semibold uppercase tracking-widest">Trust</div>
                    <div className="space-y-2.5">
                      <span className="block text-white/50">Aadhaar Verified</span>
                      <span className="block text-white/50">Police Cleared</span>
                      <span className="block text-white/50">Govt. Fair Tariff</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/20">
                <span>© 2026 RAAHI Travel Technologies · All rights reserved</span>
                <div className="flex items-center gap-1.5 text-[#0B9B6E]/70">
                  <i className="fa-solid fa-shield-halved text-xs"></i>
                  <span>Verified Travel Platform</span>
                </div>
              </div>
            </div>
          </footer>
        </div>

        {/* Global Modals & Toasts (No Demo Panel) */}
        <ToastContainer />
        <AuthModal />
        <BookingModal />
        <IncomingRequestModal />
      </div>
    </BrowserRouter>
  );
};

export default App;
