import express from 'express';
import {
  registerAmbassador,
  getAmbassadorDashboard,
  getAmbassadorReferrals,
  trackReferralClick,
  submitStudentVerification,
  getCampusEvents,
  upgradeToLocalHost,
  getAdminAmbassadors,
  adminUpdateVerification
} from '../controllers/campusAmbassadorController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerAmbassador);
router.post('/referral/click', trackReferralClick);
router.get('/events', getCampusEvents);

// Protected ambassador routes
router.get('/dashboard', protect, getAmbassadorDashboard);
router.get('/referrals', protect, getAmbassadorReferrals);
router.post('/verification/submit', protect, submitStudentVerification);
router.post('/upgrade-local-host', protect, upgradeToLocalHost);

// Admin review routes (Admin only)
router.get('/admin/ambassadors', protect, authorize('admin'), getAdminAmbassadors);
router.patch('/admin/verify/:userId', protect, authorize('admin'), adminUpdateVerification);

export default router;
