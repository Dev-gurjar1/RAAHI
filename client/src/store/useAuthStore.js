import { create } from 'zustand';
import api from '../services/api.js';

// Load initial user from localStorage if available
const loadInitialUser = () => {
  try {
    const saved = localStorage.getItem('raahi_auth_user');
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.error('Failed to parse saved user:', err);
  }
  return null;
};

const initialUser = loadInitialUser();

export const useAuthStore = create((set, get) => ({
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

  loginSuccess: (user, token) => {
    localStorage.setItem('raahi_auth_user', JSON.stringify(user));
    if (token) {
      localStorage.setItem('raahi_auth_token', token);
    }
    set({ user, authenticated: true, role: user.role, isAuthModalOpen: false });
  },

  logout: () => {
    localStorage.removeItem('raahi_auth_user');
    localStorage.removeItem('raahi_auth_token');
    set({ user: null, authenticated: false, role: 'tourist' });
  },

  updateVerificationStatus: async (status) => {
    const state = get();
    if (!state.user) return;
    const updatedUser = { ...state.user, verificationStatus: status };
    localStorage.setItem('raahi_auth_user', JSON.stringify(updatedUser));
    set({ user: updatedUser });

    try {
      await api.auth.updateProfile({ verificationStatus: status });
    } catch (err) {
      console.warn('Could not sync verification status to backend:', err.message);
    }
  }
}));
