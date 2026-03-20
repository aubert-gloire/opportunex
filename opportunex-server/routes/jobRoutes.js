import express from 'express';
import {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getMyPostings,
  getRecommendedJobs,
} from '../controllers/jobController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import { jobValidator } from '../utils/validators.js';

const router = express.Router();

// Public routes
router.get('/', getJobs);
router.get('/:id', getJob);

// Protected routes
router.get('/recommended', protect, authorize('youth'), getRecommendedJobs);
router.get('/my-postings', protect, authorize('employer'), getMyPostings);

// Employer-only routes
router.post('/', protect, authorize('employer'), jobValidator, createJob);
router.put('/:id', protect, authorize('employer'), updateJob);
router.delete('/:id', protect, authorize('employer'), deleteJob);

export default router;
