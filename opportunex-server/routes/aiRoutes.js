import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import {
  generateJobDescription,
  generateCoverLetter,
  getInterviewPrep,
  getCareerTips,
  getCVFeedback,
  explainConcept,
  getMentorshipAgenda,
  getSessionSummary,
} from '../controllers/aiController.js';

const router = express.Router();

router.use(protect);

router.post('/job-description',   restrictTo('employer', 'admin'), generateJobDescription);
router.post('/cover-letter',      restrictTo('youth'),             generateCoverLetter);
router.post('/interview-prep',    restrictTo('youth'),             getInterviewPrep);
router.get('/career-tips',        restrictTo('youth'),             getCareerTips);
router.get('/cv-feedback',        restrictTo('youth'),             getCVFeedback);
router.post('/explain-concept',   restrictTo('youth'),             explainConcept);
router.post('/mentorship-agenda',                                  getMentorshipAgenda);
router.post('/session-summary',                                    getSessionSummary);

export default router;
