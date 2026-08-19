import { create } from 'zustand';
import { User, UserRole } from '@raahi/shared-types';

interface AuthState {
  authenticated: boolean;
  user: User | null;
  role: UserRole;
  stage: 1 | 2 | 3;
  phone: string;
  isAuthModalOpen: boolean;
  
  openAuthModal: () => void;
  closeAuthModal: () => void;
  setStage: (stage: 1 | 2 | 3) => void;
  setPhone: (phone: string) => void;
  setRole: (role: UserRole) => void;
  loginSuccess: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  authenticated: false,
  user: null,
  role: 'tourist',
  stage: 1,
  phone: '',
  isAuthModalOpen: false,

  openAuthModal: () => set({ isAuthModalOpen: true, stage: 1 }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  setStage: (stage) => set({ stage }),
  setPhone: (phone) => set({ phone }),
  setRole: (role) => set((state) => ({
    role,
    user: state.user ? { ...state.user, role } : null
  })),
  loginSuccess: (user) => set({ user, authenticated: true, role: user.role, isAuthModalOpen: false }),
  logout: () => set({ user: null, authenticated: false, role: 'tourist' })
}));
