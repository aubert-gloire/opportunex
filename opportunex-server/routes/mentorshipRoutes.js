import express from 'express';
import {
  getMentors,
  requestMentorship,
  getMySessions,
  updateSession,
  submitFeedback,
  cancelSession,
} from '../controllers/mentorshipController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import { mentorshipValidator } from '../utils/validators.js';

const router = express.Router();

// All protected routes
router.get('/mentors', protect, getMentors);
router.post('/request', protect, authorize('youth'), mentorshipValidator, requestMentorship);
router.get('/my-sessions', protect, getMySessions);
router.put('/:id', protect, updateSession);
router.post('/:id/feedback', protect, submitFeedback);
router.delete('/:id', protect, cancelSession);

export default router;
