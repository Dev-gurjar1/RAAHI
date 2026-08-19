import { create } from 'zustand';
import { BookingStatus, GuideProfile, ServiceTier } from '@raahi/shared-types';

interface BookingState {
  status: BookingStatus;
  serviceTier: ServiceTier;
  pickupLocation: string;
  matchedGuide: GuideProfile | null;
  startOtp: string | null;
  etaMinutes: number;
  isBookingModalOpen: boolean;

  openBookingModal: (guide?: GuideProfile) => void;
  closeBookingModal: () => void;
  setServiceTier: (tier: ServiceTier) => void;
  setBookingStatus: (status: BookingStatus) => void;
  setMatchedGuide: (guide: GuideProfile, otp: string, eta: number) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  status: 'IDLE',
  serviceTier: 'Express Walk',
  pickupLocation: 'Amer Fort, Jaipur',
  matchedGuide: null,
  startOtp: null,
  etaMinutes: 4,
  isBookingModalOpen: false,

  openBookingModal: (guide) => set({
    isBookingModalOpen: true,
    matchedGuide: guide || null,
    status: guide ? 'SEARCHING' : 'SERVICE_SELECTED'
  }),
  closeBookingModal: () => set({ isBookingModalOpen: false }),
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
    isBookingModalOpen: false
  })
}));
