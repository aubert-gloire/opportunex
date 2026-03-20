import express from 'express';
import {
  getSkillTests,
  getSkillTest,
  submitTest,
  getMyResults,
  createSkillTest,
  updateSkillTest,
  deleteSkillTest,
} from '../controllers/skillController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import { skillTestValidator } from '../utils/validators.js';

const router = express.Router();

// User routes
router.get('/tests', protect, getSkillTests);
router.get('/tests/:id', protect, getSkillTest);
router.post('/tests/:id/submit', protect, authorize('youth'), submitTest);
router.get('/my-results', protect, authorize('youth'), getMyResults);

// Admin routes
router.post('/tests', protect, authorize('admin'), skillTestValidator, createSkillTest);
router.put('/tests/:id', protect, authorize('admin'), updateSkillTest);
router.delete('/tests/:id', protect, authorize('admin'), deleteSkillTest);

export default router;
