import express from 'express';
import {
  getTourReviews,
  createReview,
  updateReview,
  deleteReview
} from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/tour/:tourId', getTourReviews);
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;

