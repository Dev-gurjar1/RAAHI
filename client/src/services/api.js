import axios from 'axios';

// Base API URL with fallback
const API_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('raahi_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const api = {
  // Authentication
  auth: {
    sendOtp: async (phone) => {
      const res = await apiClient.post('/auth/send-otp', { phone });
      return res.data;
    },
    verifyOtp: async (payload) => {
      const res = await apiClient.post('/auth/verify-otp', payload);
      return res.data;
    },
    register: async (payload) => {
      const res = await apiClient.post('/auth/register', payload);
      return res.data;
    },
    login: async (payload) => {
      const res = await apiClient.post('/auth/login', payload);
      return res.data;
    },
    logout: async () => {
      const res = await apiClient.post('/auth/logout');
      return res.data;
    },
    getMe: async () => {
      const res = await apiClient.get('/auth/me');
      return res.data;
    },
    updateProfile: async (data) => {
      const res = await apiClient.put('/auth/profile', data);
      return res.data;
    }
  },

  // Guides
  guides: {
    getAll: async (params = {}) => {
      const res = await apiClient.get('/guides', { params });
      return res.data;
    },
    getById: async (id) => {
      const res = await apiClient.get(`/guides/${id}`);
      return res.data;
    },
    updateStatus: async (id, data) => {
      const res = await apiClient.patch(`/guides/${id}/status`, data);
      return res.data;
    },
    updatePricing: async (id, data) => {
      const res = await apiClient.patch(`/guides/${id}/pricing`, data);
      return res.data;
    }
  },

  // Tours
  tours: {
    getAll: async (params = {}) => {
      const res = await apiClient.get('/tours', { params });
      return res.data;
    },
    getById: async (id) => {
      const res = await apiClient.get(`/tours/${id}`);
      return res.data;
    },
    getByGuide: async (guideId) => {
      const res = await apiClient.get(`/tours/guide/${guideId}`);
      return res.data;
    },
    create: async (data) => {
      const res = await apiClient.post('/tours', data);
      return res.data;
    },
    update: async (id, data) => {
      const res = await apiClient.put(`/tours/${id}`, data);
      return res.data;
    },
    updateStatus: async (id, status, moderationNotes = '') => {
      const res = await apiClient.patch(`/tours/${id}/status`, { status, moderationNotes });
      return res.data;
    },
    duplicate: async (id) => {
      const res = await apiClient.post(`/tours/${id}/duplicate`);
      return res.data;
    },
    delete: async (id) => {
      const res = await apiClient.delete(`/tours/${id}`);
      return res.data;
    },
    addReview: async (id, review) => {
      const res = await apiClient.post(`/tours/${id}/reviews`, review);
      return res.data;
    }
  },

  // Bookings
  bookings: {
    getAll: async (params = {}) => {
      const res = await apiClient.get('/bookings', { params });
      return res.data;
    },
    create: async (data) => {
      const res = await apiClient.post('/bookings', data);
      return res.data;
    },
    updateStatus: async (id, status) => {
      const res = await apiClient.patch(`/bookings/${id}/status`, { status });
      return res.data;
    }
  },

  // Fair Price Shield
  fairPrice: {
    calculate: async (payload) => {
      const res = await apiClient.post('/fair-price/calculate', payload);
      return res.data;
    },
    check: async (payload) => {
      const res = await apiClient.post('/fair-price/check', payload);
      return res.data;
    },
    getBenchmarks: async () => {
      const res = await apiClient.get('/fair-price/benchmarks');
      return res.data;
    }
  },

  // Scam Reports
  reports: {
    createScamReport: async (payload) => {
      const res = await apiClient.post('/reports/scam', payload);
      return res.data;
    },
    getScamReports: async () => {
      const res = await apiClient.get('/reports/scam');
      return res.data;
    }
  },

  // AI Planner
  planner: {
    generate: async (payload) => {
      const res = await apiClient.post('/planner/generate', payload);
      return res.data;
    }
  },

  // Campus Ambassador Program
  campusAmbassador: {
    register: async (payload) => {
      const res = await apiClient.post('/campus-ambassador/register', payload);
      return res.data;
    },
    getDashboard: async () => {
      const res = await apiClient.get('/campus-ambassador/dashboard');
      return res.data;
    },
    getReferrals: async () => {
      const res = await apiClient.get('/campus-ambassador/referrals');
      return res.data;
    },
    trackClick: async (referralCode) => {
      const res = await apiClient.post('/campus-ambassador/referral/click', { referralCode });
      return res.data;
    },
    submitVerification: async (payload) => {
      const res = await apiClient.post('/campus-ambassador/verification/submit', payload);
      return res.data;
    },
    getEvents: async () => {
      const res = await apiClient.get('/campus-ambassador/events');
      return res.data;
    },
    upgradeLocalHost: async () => {
      const res = await apiClient.post('/campus-ambassador/upgrade-local-host');
      return res.data;
    },
    getAdminAmbassadors: async () => {
      const res = await apiClient.get('/campus-ambassador/admin/ambassadors');
      return res.data;
    },
    adminVerify: async (userId, payload) => {
      const res = await apiClient.patch(`/campus-ambassador/admin/verify/${userId}`, payload);
      return res.data;
    }
  }
};

export default api;
