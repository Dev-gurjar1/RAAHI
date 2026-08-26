import { create } from 'zustand';
import { User, UserRole } from '@raahi/shared-types';

export type GuideVerificationStatus = 'Pending Verification' | 'Verified' | 'Rejected';

export interface ExtendedUser extends User {
  city?: string;
  languages?: string[];
  specialties?: string[];
  bio?: string;
  hourlyRate?: number;
  idDocument?: string;
  verificationStatus?: GuideVerificationStatus;
}

interface AuthState {
  authenticated: boolean;
  user: ExtendedUser | null;
  role: UserRole;
  stage: 1 | 2 | 3;
  phone: string;
  isAuthModalOpen: boolean;

  openAuthModal: () => void;
  closeAuthModal: () => void;
  setStage: (stage: 1 | 2 | 3) => void;
  setPhone: (phone: string) => void;
  setRole: (role: UserRole) => void;
  loginSuccess: (user: ExtendedUser) => void;
  logout: () => void;
  updateVerificationStatus: (status: GuideVerificationStatus) => void;
}

// Load initial user from localStorage if available
const loadInitialUser = (): ExtendedUser | null => {
  try {
    const saved = localStorage.getItem('raahi_auth_user');
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.error('Failed to parse saved user:', err);
  }
  return null;
};

const initialUser = loadInitialUser();

export const useAuthStore = create<AuthState>((set) => ({
  authenticated: !!initialUser,
  user: initialUser,
  role: initialUser?.role || 'tourist',
  stage: 1,
  phone: initialUser?.phone || '',
  isAuthModalOpen: false,

  openAuthModal: () => set({ isAuthModalOpen: true, stage: 1 }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  setStage: (stage) => set({ stage }),
  setPhone: (phone) => set({ phone }),
  
  setRole: (role) => set((state) => {
    const updatedUser = state.user ? { ...state.user, role } : null;
    if (updatedUser) {
      localStorage.setItem('raahi_auth_user', JSON.stringify(updatedUser));
    }
    return { role, user: updatedUser };
  }),

  loginSuccess: (user) => {
    localStorage.setItem('raahi_auth_user', JSON.stringify(user));
    localStorage.setItem('raahi_auth_token', `token_${Date.now()}`);
    set({ user, authenticated: true, role: user.role, isAuthModalOpen: false });
  },

  logout: () => {
    localStorage.removeItem('raahi_auth_user');
    localStorage.removeItem('raahi_auth_token');
    set({ user: null, authenticated: false, role: 'tourist' });
  },

  updateVerificationStatus: (status) => set((state) => {
    if (!state.user) return state;
    const updatedUser: ExtendedUser = { ...state.user, verificationStatus: status };
    localStorage.setItem('raahi_auth_user', JSON.stringify(updatedUser));
    return { user: updatedUser };
  })
}));

