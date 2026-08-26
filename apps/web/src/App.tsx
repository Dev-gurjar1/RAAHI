import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { RaahiLogo } from './components/RaahiLogo';
import { ToastContainer } from './components/ToastContainer';
import { DemoControlPanel } from './components/DemoControlPanel';
import { AuthModal } from './components/modals/AuthModal';
import { BookingModal } from './components/modals/BookingModal';
import { IncomingRequestModal } from './components/modals/IncomingRequestModal';

import { HomePage } from './pages/HomePage';
import { GuidesPage } from './pages/GuidesPage';
import { GuideProfilePage } from './pages/GuideProfilePage';
import { ToursPage } from './pages/ToursPage';
import { FairPricePage } from './pages/FairPricePage';
import { PlannerPage } from './pages/PlannerPage';
import { TripsPage } from './pages/TripsPage';
import { GuideDashboardPage } from './pages/GuideDashboardPage';
import { LoginPage } from './pages/LoginPage';
import { BecomeGuidePage } from './pages/BecomeGuidePage';
import { SafetyCenterPage } from './pages/SafetyCenterPage';
import { TourDetailsPage } from './pages/TourDetailsPage';
import { TourCreatorPage } from './pages/TourCreatorPage';
import { ProtectedRoute } from './components/ProtectedRoute';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* WARM CORAL / SUNSET OUTER BACKGROUND FRAME */}
      <div className="min-h-screen bg-gradient-to-br from-[#FF7A45] via-[#FF7043] to-[#FF6233] p-0 sm:p-4 md:p-6 lg:p-8 flex flex-col items-center justify-start relative">
        
        {/* Ambient Decorative Background Circles */}
        <div className="absolute top-12 left-10 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-orange-950/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* FLOATING WHITE APPLICATION CANVAS (border-radius: 32px) */}
        <div className="w-full max-w-[1400px] bg-[#FFFDF9] dark:bg-slate-900 rounded-none sm:rounded-[32px] shadow-2xl border border-white/50 dark:border-slate-800 flex flex-col overflow-hidden min-h-[92vh] relative z-10 transition-colors">
          
          <AnnouncementBar />
          <Navbar />

          <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-6 sm:py-10 space-y-16">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/guides" element={<GuidesPage />} />
              <Route path="/guides/:id" element={<GuideProfilePage />} />
              <Route path="/tours" element={<ToursPage />} />
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
            </Routes>
          </main>

          {/* Minimalist Canvas Footer */}
          <footer className="bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 py-10 px-6 sm:px-12 text-xs text-slate-500 dark:text-slate-400">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div className="space-y-2">
                <RaahiLogo variant="full" size={44} />
                <p className="text-[11px] text-slate-400 max-w-md pt-1">
                  A high-trust cultural guide marketplace and transparent anti-scam travel platform for India.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-slate-600 dark:text-slate-300 font-semibold text-xs">
                <a href="#guides" className="hover:text-orange-600">Local Guides</a>
                <a href="#fair-price" className="hover:text-orange-600">Fair Price Shield</a>
                <a href="#tours" className="hover:text-orange-600">Tour Experiences</a>
                <a href="#planner" className="hover:text-orange-600">AI Planner</a>
              </div>
            </div>
          </footer>
        </div>

        {/* Global Modals, Controls & Toasts */}
        <ToastContainer />
        <AuthModal />
        <BookingModal />
        <IncomingRequestModal />
        <DemoControlPanel />
      </div>
    </BrowserRouter>
  );
};

export default App;
