import { create } from 'zustand';
import { BookingStatus, GuideProfile, ServiceTier } from '@raahi/shared-types';

export interface TouristBooking {
  id: string;
  guideId: string;
  guideName: string;
  guideAvatar: string;
  guideHourlyRate: number;
  guideSpecialties: string[];
  date: string;
  startTime: string;
  durationHours: number;
  travelersCount: number;
  specialRequirements?: string;
  meetingPoint: string;
  hourlySubtotal: number;
  serviceFee: number;
  totalAmount: number;
  startOtp: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export type BookingWizardStep = 1 | 2 | 3 | 4 | 5 | 'SUCCESS';

interface BookingDraft {
  guide: GuideProfile | null;
  date: string;
  startTime: string;
  durationHours: number;
  travelersCount: number;
  specialRequirements: string;
  meetingPoint: string;
}

interface BookingState {
  // Modal & Step state
  isBookingModalOpen: boolean;
  step: BookingWizardStep;
  
  // Legacy fields preserved for compatibility
  status: BookingStatus;
  serviceTier: ServiceTier;
  pickupLocation: string;
  matchedGuide: GuideProfile | null;
  startOtp: string | null;
  etaMinutes: number;

  // Active Draft
  bookingDraft: BookingDraft;

  // Persistent Tourist & Guide Bookings list
  userBookings: TouristBooking[];
  latestConfirmedBooking: TouristBooking | null;

  // Actions
  openBookingModal: (guide?: GuideProfile) => void;
  closeBookingModal: () => void;
  setStep: (step: BookingWizardStep) => void;
  updateDraft: (updates: Partial<BookingDraft>) => void;
  createBooking: (customBooking?: TouristBooking) => TouristBooking | null;
  cancelBooking: (bookingId: string) => void;
  acceptBooking: (bookingId: string) => void;
  completeBooking: (bookingId: string) => void;
  
  // Legacy setters preserved
  setServiceTier: (tier: ServiceTier) => void;
  setBookingStatus: (status: BookingStatus) => void;
  setMatchedGuide: (guide: GuideProfile, otp: string, eta: number) => void;
  resetBooking: () => void;
}

// Initial mock bookings so My Trips page has demo data
const INITIAL_DEMO_BOOKINGS: TouristBooking[] = [
  {
    id: "RAAHI-BK-8821",
    guideId: "g1",
    guideName: "Vikram Singh Rathore",
    guideAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    guideHourlyRate: 450,
    guideSpecialties: ["Amer Fort", "Royal Architecture"],
    date: "Yesterday",
    startTime: "03:30 PM",
    durationHours: 3,
    travelersCount: 2,
    meetingPoint: "Amer Fort Main Gate",
    hourlySubtotal: 1350,
    serviceFee: 50,
    totalAmount: 1400,
    startOtp: "8821",
    status: "Completed",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "RAAHI-BK-8822",
    guideId: "g2",
    guideName: "Priya Sharma",
    guideAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    guideHourlyRate: 500,
    guideSpecialties: ["Street Food Crawl", "Bazaars"],
    date: "3 Days Ago",
    startTime: "05:00 PM",
    durationHours: 2,
    travelersCount: 3,
    meetingPoint: "Lassiwala MI Road",
    hourlySubtotal: 1000,
    serviceFee: 50,
    totalAmount: 1050,
    startOtp: "4192",
    status: "Completed",
    createdAt: new Date(Date.now() - 259200000).toISOString()
  }
];

const loadBookingsFromStorage = (): TouristBooking[] => {
  try {
    const saved = localStorage.getItem('raahi_user_bookings');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading stored bookings:', e);
  }
  return INITIAL_DEMO_BOOKINGS;
};

const saveBookingsToStorage = (bookings: TouristBooking[]) => {
  try {
    localStorage.setItem('raahi_user_bookings', JSON.stringify(bookings));
  } catch (e) {
    console.error('Error saving bookings to storage:', e);
  }
};

const getTomorrowDateString = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

export const useBookingStore = create<BookingState>((set, get) => ({
  isBookingModalOpen: false,
  step: 1,
  
  status: 'IDLE',
  serviceTier: 'Express Walk',
  pickupLocation: 'Amer Fort, Jaipur',
  matchedGuide: null,
  startOtp: null,
  etaMinutes: 4,

  bookingDraft: {
    guide: null,
    date: getTomorrowDateString(),
    startTime: '10:00 AM',
    durationHours: 3,
    travelersCount: 2,
    specialRequirements: '',
    meetingPoint: 'Amer Fort Main Entrance Gate'
  },

  userBookings: loadBookingsFromStorage(),
  latestConfirmedBooking: null,

  openBookingModal: (guide) => {
    const defaultGuide = guide || {
      id: 'g1',
      userId: 'u1',
      name: 'Vikram Singh Rathore',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rating: 4.95,
      reviewCount: 142,
      languages: ['Hindi', 'English'],
      experience: '8 Years',
      hourlyRate: 450,
      specialties: ['Amer Fort', 'Royal Architecture'],
      distanceKm: 1.2,
      lat: 26.9855,
      lng: 75.8513,
      verified: true,
      online: true,
      responseTime: '< 5 mins',
      completedTrips: 260
    };

    set({
      isBookingModalOpen: true,
      step: 1,
      matchedGuide: defaultGuide,
      bookingDraft: {
        guide: defaultGuide,
        date: getTomorrowDateString(),
        startTime: '10:00 AM',
        durationHours: 3,
        travelersCount: 2,
        specialRequirements: '',
        meetingPoint: `${defaultGuide.specialties[0] || 'Amer Fort'} Main Entrance, Jaipur`
      }
    });
  },

  closeBookingModal: () => set({ isBookingModalOpen: false, step: 1 }),

  setStep: (step) => set({ step }),

  updateDraft: (updates) => set((state) => ({
    bookingDraft: { ...state.bookingDraft, ...updates }
  })),

  createBooking: (customBooking?: TouristBooking) => {
    const { bookingDraft, userBookings } = get();

    if (customBooking) {
      const updatedBookings = [customBooking, ...userBookings];
      saveBookingsToStorage(updatedBookings);
      set({
        userBookings: updatedBookings,
        latestConfirmedBooking: customBooking,
        startOtp: customBooking.startOtp
      });
      return customBooking;
    }

    if (!bookingDraft.guide) return null;

    const hourlyRate = bookingDraft.guide.hourlyRate;
    const hourlySubtotal = hourlyRate * bookingDraft.durationHours;
    const serviceFee = 50;
    const totalAmount = hourlySubtotal + serviceFee;
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const bookingId = `RAAHI-BK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: TouristBooking = {
      id: bookingId,
      guideId: bookingDraft.guide.id,
      guideName: bookingDraft.guide.name,
      guideAvatar: bookingDraft.guide.avatar,
      guideHourlyRate: hourlyRate,
      guideSpecialties: bookingDraft.guide.specialties,
      date: bookingDraft.date,
      startTime: bookingDraft.startTime,
      durationHours: bookingDraft.durationHours,
      travelersCount: bookingDraft.travelersCount,
      specialRequirements: bookingDraft.specialRequirements,
      meetingPoint: bookingDraft.meetingPoint,
      hourlySubtotal,
      serviceFee,
      totalAmount,
      startOtp: generatedOtp,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    const updatedBookings = [newBooking, ...userBookings];
    saveBookingsToStorage(updatedBookings);

    set({
      userBookings: updatedBookings,
      latestConfirmedBooking: newBooking,
      startOtp: generatedOtp,
      step: 'SUCCESS'
    });

    return newBooking;
  },

  cancelBooking: (bookingId) => set((state) => {
    const updated = state.userBookings.map(b =>
      b.id === bookingId ? { ...b, status: 'Cancelled' as const } : b
    );
    saveBookingsToStorage(updated);
    return { userBookings: updated };
  }),

  acceptBooking: (bookingId) => set((state) => {
    const updated = state.userBookings.map(b =>
      b.id === bookingId ? { ...b, status: 'Confirmed' as const } : b
    );
    saveBookingsToStorage(updated);
    return { userBookings: updated };
  }),

  completeBooking: (bookingId) => set((state) => {
    const updated = state.userBookings.map(b =>
      b.id === bookingId ? { ...b, status: 'Completed' as const } : b
    );
    saveBookingsToStorage(updated);
    return { userBookings: updated };
  }),

  setServiceTier: (serviceTier) => set({ serviceTier }),
  setBookingStatus: (status) => set({ status }),
  setMatchedGuide: (matchedGuide, startOtp, etaMinutes) => set({
    matchedGuide,
    startOtp,
    etaMinutes,
    status: 'MATCHED'
  }),
  resetBooking: () => set({
    status: 'IDLE',
    matchedGuide: null,
    startOtp: null,
    isBookingModalOpen: false,
    step: 1
  })
}));

