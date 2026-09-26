import { create } from 'zustand';
import api from '../services/api.js';

// Initial mock bookings so My Trips page has demo data
const INITIAL_DEMO_BOOKINGS = [
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

const loadBookingsFromStorage = () => {
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

const saveBookingsToStorage = (bookings) => {
  try {
    localStorage.setItem('raahi_user_bookings', JSON.stringify(bookings));
  } catch (e) {
    console.error('Error saving bookings to storage:', e);
  }
};

const getTomorrowDateString = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

export const useBookingStore = create((set, get) => ({
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

  fetchBookingsFromBackend: async () => {
    try {
      const res = await api.bookings.getAll();
      if (res && res.data && res.data.length > 0) {
        saveBookingsToStorage(res.data);
        set({ userBookings: res.data });
      }
    } catch (err) {
      console.warn('Backend booking sync notice:', err.message);
    }
  },

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
        meetingPoint: `${defaultGuide.specialties?.[0] || 'Amer Fort'} Main Entrance, Jaipur`
      }
    });
  },

  closeBookingModal: () => set({ isBookingModalOpen: false, step: 1 }),

  setStep: (step) => set({ step }),

  updateDraft: (updates) => set((state) => ({
    bookingDraft: { ...state.bookingDraft, ...updates }
  })),

  createBooking: async (customBooking) => {
    const { bookingDraft, userBookings } = get();

    if (customBooking) {
      const updatedBookings = [customBooking, ...userBookings];
      saveBookingsToStorage(updatedBookings);
      set({
        userBookings: updatedBookings,
        latestConfirmedBooking: customBooking,
        startOtp: customBooking.startOtp
      });
      // Fire-and-forget sync to backend
      try {
        await api.bookings.create(customBooking);
      } catch (e) {
        console.warn('Booking sync to backend notice:', e.message);
      }
      return customBooking;
    }

    if (!bookingDraft.guide) return null;

    const g = bookingDraft.guide;
    const model = (g.pricingType || 'HOURLY').toUpperCase();
    const hourly = g.hourlyRate || g.pricePerHour || 350;
    let baseSubtotal = 0;

    if (model === 'PER_PERSON') {
      const perPerson = g.pricePerPerson || hourly;
      baseSubtotal = perPerson * bookingDraft.travelersCount;
    } else if (model === 'PER_GROUP') {
      baseSubtotal = g.pricePerGroup || (hourly * 3.5);
    } else if (model === 'FIXED_TRIP') {
      baseSubtotal = g.fixedTripPrice || (hourly * (g.fixedTripDuration || 4));
    } else {
      baseSubtotal = hourly * bookingDraft.durationHours;
    }

    const serviceFee = 50;
    const totalAmount = Math.round(baseSubtotal + serviceFee);
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const bookingId = `RAAHI-BK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking = {
      id: bookingId,
      bookingId: bookingId,
      bookingType: 'GUIDE_HIRE',
      pricingType: model,
      guideId: g.id,
      guideName: g.name,
      guideAvatar: g.avatar,
      guideHourlyRate: hourly,
      guideSpecialties: g.specialties || [],
      date: bookingDraft.date,
      startTime: bookingDraft.startTime,
      durationHours: bookingDraft.durationHours,
      travelersCount: bookingDraft.travelersCount,
      specialRequirements: bookingDraft.specialRequirements,
      meetingPoint: bookingDraft.meetingPoint,
      baseSubtotal,
      hourlySubtotal: baseSubtotal,
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

    try {
      await api.bookings.create(newBooking);
    } catch (e) {
      console.warn('Backend booking sync notice:', e.message);
    }

    return newBooking;
  },

  cancelBooking: async (bookingId) => {
    set((state) => {
      const updated = state.userBookings.map(b =>
        b.id === bookingId || b.bookingId === bookingId ? { ...b, status: 'Cancelled' } : b
      );
      saveBookingsToStorage(updated);
      return { userBookings: updated };
    });

    try {
      await api.bookings.updateStatus(bookingId, 'Cancelled');
    } catch (e) {
      console.warn('Backend booking status update notice:', e.message);
    }
  },

  acceptBooking: async (bookingId) => {
    set((state) => {
      const updated = state.userBookings.map(b =>
        b.id === bookingId || b.bookingId === bookingId ? { ...b, status: 'Confirmed' } : b
      );
      saveBookingsToStorage(updated);
      return { userBookings: updated };
    });

    try {
      await api.bookings.updateStatus(bookingId, 'Confirmed');
    } catch (e) {
      console.warn('Backend booking status update notice:', e.message);
    }
  },

  completeBooking: async (bookingId) => {
    set((state) => {
      const updated = state.userBookings.map(b =>
        b.id === bookingId || b.bookingId === bookingId ? { ...b, status: 'Completed' } : b
      );
      saveBookingsToStorage(updated);
      return { userBookings: updated };
    });

    try {
      await api.bookings.updateStatus(bookingId, 'Completed');
    } catch (e) {
      console.warn('Backend booking status update notice:', e.message);
    }
  },

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
