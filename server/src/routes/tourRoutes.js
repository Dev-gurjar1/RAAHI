import express from 'express';
import {
  getTours,
  getTourById,
  createTour,
  updateTour,
  updateTourStatus,
  duplicateTour,
  deleteTour,
  getGuideTours,
  addTourReview
} from '../controllers/tourController.js';

const router = express.Router();

router.get('/', getTours);
router.get('/guide/:guideId', getGuideTours);
router.get('/:id', getTourById);
router.post('/', createTour);
router.put('/:id', updateTour);
router.patch('/:id/status', updateTourStatus);
router.post('/:id/duplicate', duplicateTour);
router.delete('/:id', deleteTour);
router.post('/:id/reviews', addTourReview);

export default router;
