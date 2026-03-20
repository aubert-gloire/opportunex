import express from 'express';
import {
  submitReview,
  getReviewsForUser,
  getMyReviews,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import { reviewValidator } from '../utils/validators.js';

const router = express.Router();

// All protected routes
router.post('/', protect, authorize('youth'), reviewValidator, submitReview);
router.get('/target/:userId', protect, getReviewsForUser);
router.get('/my-reviews', protect, getMyReviews);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;
