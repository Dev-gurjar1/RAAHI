import express from 'express';
import { getGuides, getGuideById, updateGuideStatus, updateGuidePricing } from '../controllers/guideController.js';

const router = express.Router();

router.get('/', getGuides);
router.get('/:id', getGuideById);
router.patch('/:id/status', updateGuideStatus);
router.patch('/:id/pricing', updateGuidePricing);

export default router;
