import express from 'express';
import {
  getTours,
  getTour,
  getTourBySlug,
  createTour,
  updateTour,
  deleteTour,
  getFeaturedTours
} from '../controllers/tour.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/featured', getFeaturedTours);
router.get('/slug/:slug', getTourBySlug);
router.get('/:id', getTour);
router.get('/', getTours);

// Admin routes
router.post('/', protect, authorize('admin'), createTour);
router.put('/:id', protect, authorize('admin'), updateTour);
router.delete('/:id', protect, authorize('admin'), deleteTour);

export default router;

