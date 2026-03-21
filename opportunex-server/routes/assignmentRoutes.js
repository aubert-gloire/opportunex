import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import {
  getLessonAssignments,
  submitAssignment,
  getMySubmissions,
  createAssignment,
  generateAIAssignment,
  deleteAssignment,
} from '../controllers/assignmentController.js';

const router = express.Router();

router.use(protect);

// Youth routes
router.get('/course/:courseId/lesson/:lessonId', getLessonAssignments);
router.post('/:id/submit',                       restrictTo('youth'), submitAssignment);
router.get('/my-submissions/:courseId',          restrictTo('youth'), getMySubmissions);

// Admin routes
router.post('/',          restrictTo('admin'), createAssignment);
router.post('/generate',  restrictTo('admin'), generateAIAssignment);
router.delete('/:id',     restrictTo('admin'), deleteAssignment);

export default router;
