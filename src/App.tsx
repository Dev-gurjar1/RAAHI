import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';

import { HomePage } from './pages/HomePage';
import { GuideMarketplacePage } from './pages/GuideMarketplacePage';
import { GuideProfilePage } from './pages/GuideProfilePage';
import { GuideRequestModal } from './pages/GuideRequestModal';
import { RequestComparisonPage } from './pages/RequestComparisonPage';
import { BecomeGuidePage } from './pages/BecomeGuidePage';
import { GuideDashboardPage } from './pages/GuideDashboardPage';
import { ToursMarketplacePage } from './pages/ToursMarketplacePage';
import { TourDetailPage } from './pages/TourDetailPage';
import { FairPriceEnginePage } from './pages/FairPriceEnginePage';
import { AiPlannerPage } from './pages/AiPlannerPage';
import { BookingCheckoutModal } from './pages/BookingCheckoutModal';
import { TouristTripsPage } from './pages/TouristTripsPage';
import { AskLocalPage } from './pages/AskLocalPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

import { GuideProfile, Tour, Booking } from './types';

export function App() {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Booking Checkout modal state
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutGuide, setCheckoutGuide] = useState<GuideProfile | undefined>(undefined);
  const [checkoutTour, setCheckoutTour] = useState<Tour | undefined>(undefined);
  const [checkoutDate, setCheckoutDate] = useState('2026-08-25');
  const [checkoutTravelers, setCheckoutTravelers] = useState(2);
  const [checkoutInitialBooking, setCheckoutInitialBooking] = useState<Booking | undefined>(undefined);

  const handleOpenRequest = () => {
    setIsRequestModalOpen(true);
  };

  const handleBookGuideDirect = (guide: GuideProfile) => {
    setCheckoutGuide(guide);
    setCheckoutTour(undefined);
    setCheckoutInitialBooking(undefined);
    setCheckoutDate('2026-08-25');
    setCheckoutTravelers(2);
    setCheckoutModalOpen(true);
  };

  const handleBookTourDirect = (tour: Tour, date: string, travelers: number) => {
    setCheckoutTour(tour);
    setCheckoutGuide(undefined);
    setCheckoutInitialBooking(undefined);
    setCheckoutDate(date);
    setCheckoutTravelers(travelers);
    setCheckoutModalOpen(true);
  };

  const handleOfferAccepted = (booking: Booking) => {
    setCheckoutInitialBooking(booking);
    setCheckoutGuide(undefined);
    setCheckoutTour(undefined);
    setCheckoutModalOpen(true);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-amber-500 selection:text-white">
        <Navigation onRequestOpen={handleOpenRequest} />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage onRequestOpen={handleOpenRequest} />} />
            <Route path="/guides" element={<GuideMarketplacePage onRequestOpen={handleOpenRequest} />} />
            <Route
              path="/guides/:guideId"
              element={
                <GuideProfilePage
                  onRequestOpen={handleOpenRequest}
                  onBookGuideDirect={handleBookGuideDirect}
                />
              }
            />
            <Route
              path="/request-offers"
              element={<RequestComparisonPage onOfferAccepted={handleOfferAccepted} />}
            />
            <Route path="/become-guide" element={<BecomeGuidePage />} />
            <Route path="/guide-dashboard" element={<GuideDashboardPage />} />
            <Route path="/tours" element={<ToursMarketplacePage />} />
            <Route
              path="/tours/:tourId"
              element={<TourDetailPage onBookTourDirect={handleBookTourDirect} />}
            />
            <Route path="/fair-prices" element={<FairPriceEnginePage />} />
            <Route path="/ai-planner" element={<AiPlannerPage />} />
            <Route path="/my-trips" element={<TouristTripsPage />} />
            <Route path="/ask-local" element={<AskLocalPage />} />
            <Route path="/admin-panel" element={<AdminDashboardPage />} />
          </Routes>
        </main>

        <Footer />

        {/* Post Guide Request Modal */}
        <GuideRequestModal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
        />

        {/* Booking Checkout Modal */}
        <BookingCheckoutModal
          isOpen={checkoutModalOpen}
          onClose={() => setCheckoutModalOpen(false)}
          guide={checkoutGuide}
          tour={checkoutTour}
          date={checkoutDate}
          travelersCount={checkoutTravelers}
          initialBooking={checkoutInitialBooking}
        />
      </div>
    </Router>
  );
}

export default App;
