import {
  UserRole,
  GuideProfile,
  GuideVerification,
  Tour,
  GuideRequest,
  TourOffer,
  Booking,
  Review,
  Report,
  FairPriceRule,
  LocalQuestion,
  LocalAnswer,
  Notification,
  VerificationStatus,
  Destination,
  Place
} from '../types';

import {
  SEED_DESTINATIONS,
  SEED_GUIDES,
  SEED_TOURS,
  SEED_FAIR_PRICE_RULES,
  SEED_PLACES,
  SEED_GUIDE_REQUESTS,
  SEED_OFFERS,
  SEED_QUESTIONS,
  SEED_ANSWERS,
  SEED_BOOKINGS,
  SEED_REVIEWS,
  SEED_REPORTS
} from './seedData';

const STORAGE_KEY = 'sthaniq_marketplace_v1';

export interface StoreState {
  activeRole: UserRole;
  platformCommissionPercent: number; // e.g. 10%
  destinations: Destination[];
  places: Place[];
  guides: GuideProfile[];
  verifications: GuideVerification[];
  tours: Tour[];
  requests: GuideRequest[];
  offers: TourOffer[];
  bookings: Booking[];
  reviews: Review[];
  reports: Report[];
  fairPriceRules: FairPriceRule[];
  questions: LocalQuestion[];
  answers: LocalAnswer[];
  notifications: Notification[];
}

// Initial state creator
const getInitialState = (): StoreState => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved STHANIQ store state:', e);
    }
  }

  // Fallback initial state
  const initialVerifications: GuideVerification[] = SEED_GUIDES.map(g => ({
    id: `verif-${g.id}`,
    guideId: g.id,
    fullName: g.name,
    age: 28 + Math.floor(Math.random() * 10),
    city: g.serviceAreas[0] || 'Jaipur',
    languages: g.languages,
    areasKnown: g.serviceAreas,
    experienceYears: g.experienceYears,
    interests: ['History', 'Culture', 'Culinary'],
    idDocName: 'Government_Aadhaar_ID_Verified.pdf',
    whyChooseMe: g.bio,
    expectedPricePerDay: g.startingPrice,
    emergencyContact: g.emergencyContact || '+91 98000 11122',
    submittedAt: '2026-08-01T10:00:00Z',
    status: g.verificationStatus
  }));

  const initialNotifications: Notification[] = [
    {
      id: 'notif-1',
      userId: 'user-tourist-demo',
      roleTarget: 'TOURIST',
      title: 'Guide Offers Received!',
      message: 'You have 3 competitive offers for your Jaipur Heritage request.',
      read: false,
      createdAt: 'Just now',
      actionUrl: '/request-offers'
    },
    {
      id: 'notif-2',
      userId: 'guide-rahul',
      roleTarget: 'GUIDE',
      title: 'New Tourist Request in Jaipur',
      message: 'Aarav Patel requested a 6-hr heritage tour for 2 travelers.',
      read: false,
      createdAt: '10 mins ago',
      actionUrl: '/guide-dashboard'
    }
  ];

  return {
    activeRole: 'TOURIST',
    platformCommissionPercent: 10,
    destinations: SEED_DESTINATIONS,
    places: SEED_PLACES,
    guides: SEED_GUIDES,
    verifications: initialVerifications,
    tours: SEED_TOURS,
    requests: SEED_GUIDE_REQUESTS,
    offers: SEED_OFFERS,
    bookings: SEED_BOOKINGS,
    reviews: SEED_REVIEWS,
    reports: SEED_REPORTS,
    fairPriceRules: SEED_FAIR_PRICE_RULES,
    questions: SEED_QUESTIONS,
    answers: SEED_ANSWERS,
    notifications: initialNotifications
  };
};

class MarketplaceStore {
  private state: StoreState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = getInitialState();
  }

  public getState(): StoreState {
    return this.state;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    this.listeners.forEach(l => l());
  }

  // --- Role Actions ---
  public setRole(role: UserRole) {
    this.state.activeRole = role;
    this.notify();
  }

  public setPlatformCommission(commissionPercent: number) {
    this.state.platformCommissionPercent = commissionPercent;
    this.notify();
  }

  // --- Guide Verification & Applications ---
  public submitGuideApplication(app: Omit<GuideVerification, 'id' | 'submittedAt' | 'status'>) {
    const newVerif: GuideVerification = {
      ...app,
      id: `verif-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'PENDING'
    };

    this.state.verifications.unshift(newVerif);

    // Also add pending profile to guides array if missing
    let guide = this.state.guides.find(g => g.id === app.guideId || g.name.toLowerCase() === app.fullName.toLowerCase());
    if (!guide) {
      guide = {
        id: app.guideId || `guide-${Date.now()}`,
        userId: `user-${Date.now()}`,
        name: app.fullName,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        rating: 5.0,
        reviewCount: 0,
        experienceYears: app.experienceYears,
        languages: app.languages,
        serviceAreas: app.areasKnown,
        startingPrice: app.expectedPricePerDay,
        completedTours: 0,
        availability: 'Available',
        bio: app.whyChooseMe,
        verificationStatus: 'PENDING',
        verificationBadges: ['New Applicant'],
        expectedPricing: `₹${app.expectedPricePerDay} / Day`,
        emergencyContact: app.emergencyContact,
        cancellationPolicy: 'Free cancellation up to 24 hrs before tour.',
        responseRate: '100%'
      };
      this.state.guides.push(guide);
    } else {
      guide.verificationStatus = 'PENDING';
    }

    // Add admin notification
    this.state.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: 'admin',
      roleTarget: 'ADMIN',
      title: 'New Guide Verification Application',
      message: `${app.fullName} applied to become a local guide in ${app.city}.`,
      read: false,
      createdAt: 'Just now'
    });

    this.notify();
    return newVerif;
  }

  public updateVerificationStatus(verifId: string, status: VerificationStatus, adminNotes?: string) {
    const v = this.state.verifications.find(item => item.id === verifId);
    if (!v) return;

    v.status = status;
    if (adminNotes) v.adminNotes = adminNotes;

    const g = this.state.guides.find(guide => guide.id === v.guideId || guide.name === v.fullName);
    if (g) {
      g.verificationStatus = status;
      if (status === 'VERIFIED') {
        if (!g.verificationBadges.includes('Identity Verified')) {
          g.verificationBadges.push('Identity Verified', 'Local Expert');
        }
      }
    }

    // Notify Guide
    this.state.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: v.guideId,
      roleTarget: 'GUIDE',
      title: `Verification Status Updated: ${status}`,
      message: status === 'VERIFIED'
        ? 'Congratulations! Your local guide profile has been verified and is now live in the marketplace.'
        : `Your verification status was updated to ${status}. ${adminNotes || ''}`,
      read: false,
      createdAt: 'Just now'
    });

    this.notify();
  }

  // --- Requests & Offers ---
  public createTouristRequest(reqData: Omit<GuideRequest, 'id' | 'touristId' | 'touristName' | 'touristAvatar' | 'status' | 'createdAt'>): GuideRequest {
    const newReq: GuideRequest = {
      ...reqData,
      id: `req-${Date.now()}`,
      touristId: 'user-tourist-demo',
      touristName: 'Aarav Patel',
      touristAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      status: 'OPEN',
      createdAt: new Date().toISOString()
    };

    this.state.requests.unshift(newReq);

    // Notify eligible guides in destination
    this.state.guides
      .filter(g => g.serviceAreas.some(area => area.toLowerCase().includes(reqData.destination.toLowerCase())))
      .forEach(g => {
        this.state.notifications.unshift({
          id: `notif-${Date.now()}-${g.id}`,
          userId: g.id,
          roleTarget: 'GUIDE',
          title: `New Tourist Request in ${reqData.destination}!`,
          message: `${reqData.travelersCount} travelers requesting ${reqData.durationHours}h tour (Budget ₹${reqData.budget}).`,
          read: false,
          createdAt: 'Just now',
          actionUrl: '/guide-dashboard'
        });
      });

    this.notify();
    return newReq;
  }

  public submitGuideOffer(offerData: Omit<TourOffer, 'id' | 'status' | 'createdAt'>): TourOffer {
    const newOffer: TourOffer = {
      ...offerData,
      id: `offer-${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    this.state.offers.unshift(newOffer);

    // Update request status to BIDDED
    const req = this.state.requests.find(r => r.id === offerData.requestId);
    if (req) {
      req.status = 'BIDDED';
    }

    // Auto calculate badge hints for offers in this request
    this.updateOfferBadges(offerData.requestId);

    // Notify Tourist
    this.state.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: 'user-tourist-demo',
      roleTarget: 'TOURIST',
      title: 'New Offer Received!',
      message: `${offerData.guideName} submitted an offer of ₹${offerData.price} for your trip.`,
      read: false,
      createdAt: 'Just now'
    });

    this.notify();
    return newOffer;
  }

  private updateOfferBadges(requestId: string) {
    const reqOffers = this.state.offers.filter(o => o.requestId === requestId);
    if (reqOffers.length === 0) return;

    // Sort by price to get lowest
    const sortedByPrice = [...reqOffers].sort((a, b) => a.price - b.price);
    const lowest = sortedByPrice[0];

    // Sort by rating for best match
    const sortedByRating = [...reqOffers].sort((a, b) => b.guideRating - a.guideRating);
    const bestMatch = sortedByRating[0];

    reqOffers.forEach(o => {
      if (o.id === bestMatch.id) {
        o.badgeLabel = 'Best Match';
      } else if (o.id === lowest.id) {
        o.badgeLabel = 'Lowest Price';
      } else {
        o.badgeLabel = 'Best Value';
      }
    });
  }

  public acceptOffer(offerId: string): Booking {
    const offer = this.state.offers.find(o => o.id === offerId);
    if (!offer) throw new Error('Offer not found');

    offer.status = 'ACCEPTED';

    // Reject other offers for this request
    this.state.offers
      .filter(o => o.requestId === offer.requestId && o.id !== offerId)
      .forEach(o => { o.status = 'REJECTED'; });

    // Mark request ACCEPTED
    const req = this.state.requests.find(r => r.id === offer.requestId);
    if (req) req.status = 'ACCEPTED';

    // Create Booking
    const commPct = this.state.platformCommissionPercent / 100;
    const platformFee = Math.round(offer.price * commPct);
    const guideEarnings = offer.price - platformFee;

    const newBooking: Booking = {
      id: `STH-${Math.floor(10000 + Math.random() * 90000)}`,
      touristId: 'user-tourist-demo',
      touristName: 'Aarav Patel',
      guideId: offer.guideId,
      guideName: offer.guideName,
      guideAvatar: offer.guideAvatar,
      title: offer.tourTitle,
      destination: req?.destination || 'Jaipur',
      date: req?.date || new Date().toISOString().split('T')[0],
      time: '09:00 AM',
      travelersCount: req?.travelersCount || 2,
      totalPrice: offer.price,
      platformFee,
      guideEarnings,
      paymentStatus: 'PAID',
      bookingStatus: 'UPCOMING',
      meetingPoint: 'Hawa Mahal Main Gate / Agreed Location',
      createdAt: new Date().toISOString()
    };

    this.state.bookings.unshift(newBooking);

    // Increment completed tours & earnings counter for guide
    const guide = this.state.guides.find(g => g.id === offer.guideId);
    if (guide) {
      guide.completedTours += 1;
    }

    // Notify Guide
    this.state.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: offer.guideId,
      roleTarget: 'GUIDE',
      title: 'Offer Accepted! Booking Confirmed',
      message: `Aarav Patel accepted your offer of ₹${offer.price}. Booking ID: ${newBooking.id}.`,
      read: false,
      createdAt: 'Just now'
    });

    this.notify();
    return newBooking;
  }

  // --- Tour Package Management ---
  public createTourPackage(tourData: Omit<Tour, 'id' | 'guideRating'>): Tour {
    const guide = this.state.guides.find(g => g.id === tourData.guideId);
    const newTour: Tour = {
      ...tourData,
      id: `tour-${Date.now()}`,
      guideRating: guide?.rating || 5.0
    };

    this.state.tours.unshift(newTour);

    this.state.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: tourData.guideId,
      roleTarget: 'GUIDE',
      title: 'Tour Package Published',
      message: `Your tour "${tourData.title}" is now available to tourists.`,
      read: false,
      createdAt: 'Just now'
    });

    this.notify();
    return newTour;
  }

  public bookTourDirect(tourId: string, date: string, time: string, travelersCount: number): Booking {
    const tour = this.state.tours.find(t => t.id === tourId);
    if (!tour) throw new Error('Tour not found');

    const totalPrice = tour.pricePerPerson * travelersCount;
    const commPct = this.state.platformCommissionPercent / 100;
    const platformFee = Math.round(totalPrice * commPct);
    const guideEarnings = totalPrice - platformFee;

    const newBooking: Booking = {
      id: `STH-${Math.floor(10000 + Math.random() * 90000)}`,
      touristId: 'user-tourist-demo',
      touristName: 'Aarav Patel',
      guideId: tour.guideId,
      guideName: tour.guideName,
      guideAvatar: tour.guideAvatar,
      tourId: tour.id,
      title: tour.title,
      destination: tour.destination,
      date,
      time,
      travelersCount,
      totalPrice,
      platformFee,
      guideEarnings,
      paymentStatus: 'PAID',
      bookingStatus: 'UPCOMING',
      meetingPoint: tour.meetingPoint,
      createdAt: new Date().toISOString()
    };

    this.state.bookings.unshift(newBooking);

    this.notify();
    return newBooking;
  }

  // --- Reviews & Safety Reports ---
  public submitReview(reviewData: Omit<Review, 'id' | 'createdAt'>) {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    this.state.reviews.unshift(newReview);

    // Update booking state
    const b = this.state.bookings.find(item => item.id === reviewData.bookingId);
    if (b) b.isReviewed = true;

    // Recalculate guide average rating
    const guideReviews = this.state.reviews.filter(r => r.guideId === reviewData.guideId);
    const guide = this.state.guides.find(g => g.id === reviewData.guideId);
    if (guide && guideReviews.length > 0) {
      const avg = guideReviews.reduce((sum, r) => sum + r.overallRating, 0) / guideReviews.length;
      guide.rating = Number(avg.toFixed(2));
      guide.reviewCount = guideReviews.length;
    }

    this.notify();
  }

  public submitReport(repData: Omit<Report, 'id' | 'status' | 'createdAt'>) {
    const newRep: Report = {
      ...repData,
      id: `rep-${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    this.state.reports.unshift(newRep);

    // Notify Admin
    this.state.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: 'admin',
      roleTarget: 'ADMIN',
      title: 'New Safety Report Filed',
      message: `Report filed against ${repData.guideName} (${repData.reason}).`,
      read: false,
      createdAt: 'Just now'
    });

    this.notify();
  }

  public updateReportStatus(reportId: string, status: Report['status']) {
    const r = this.state.reports.find(rep => rep.id === reportId);
    if (r) {
      r.status = status;
      this.notify();
    }
  }

  // --- Fair Price Engine Rules Management ---
  public addFairPriceRule(rule: Omit<FairPriceRule, 'id' | 'lastUpdated'>) {
    const newRule: FairPriceRule = {
      ...rule,
      id: `fp-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    this.state.fairPriceRules.unshift(newRule);
    this.notify();
  }

  public deleteFairPriceRule(id: string) {
    this.state.fairPriceRules = this.state.fairPriceRules.filter(r => r.id !== id);
    this.notify();
  }

  // --- Ask A Local Q&A ---
  public addQuestion(questionText: string, destination: string) {
    const newQ: LocalQuestion = {
      id: `q-${Date.now()}`,
      touristName: 'Aarav Patel',
      touristAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      destination,
      question: questionText,
      createdAt: 'Just now',
      likes: 1,
      answersCount: 0
    };
    this.state.questions.unshift(newQ);
    this.notify();
  }

  public addAnswer(questionId: string, answerText: string, responderName: string, isVerifiedLocal: boolean = true) {
    const newAns: LocalAnswer = {
      id: `ans-${Date.now()}`,
      questionId,
      responderName,
      responderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      isVerifiedLocal,
      answer: answerText,
      helpfulVotes: 1,
      createdAt: 'Just now'
    };
    this.state.answers.unshift(newAns);

    const q = this.state.questions.find(item => item.id === questionId);
    if (q) q.answersCount += 1;

    this.notify();
  }

  // --- Notifications ---
  public markNotificationsRead() {
    this.state.notifications.forEach(n => { n.read = true; });
    this.notify();
  }
}

export const marketplaceStore = new MarketplaceStore();
