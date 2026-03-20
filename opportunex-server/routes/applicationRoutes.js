import express from 'express';
import {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
  getApplication,
} from '../controllers/applicationController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import { applicationValidator } from '../utils/validators.js';

const router = express.Router();

// Youth routes
router.post('/', protect, authorize('youth'), applicationValidator, applyToJob);
router.get('/my-applications', protect, authorize('youth'), getMyApplications);
router.delete('/:id', protect, authorize('youth'), withdrawApplication);

// Employer routes
router.get('/job/:jobId', protect, authorize('employer'), getJobApplications);
router.put('/:id/status', protect, authorize('employer'), updateApplicationStatus);

// Shared routes
router.get('/:id', protect, getApplication);

export default router;
