import express from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getMyCourses,
  markLessonComplete,
  getCourseProgress,
  rateCourse,
  getRecommendedCourses,
  getCertificate,
} from '../controllers/courseController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getCourses);

// Protected routes (Youth) - MUST come before /:id route
router.get('/user/my-courses', protect, restrictTo('youth'), getMyCourses);
router.get('/user/recommended', protect, restrictTo('youth'), getRecommendedCourses);
router.post('/:id/enroll', protect, restrictTo('youth'), enrollInCourse);
router.post('/:id/lessons/:lessonId/complete', protect, restrictTo('youth'), markLessonComplete);
router.get('/:id/progress', protect, restrictTo('youth'), getCourseProgress);
router.post('/:id/rate', protect, restrictTo('youth'), rateCourse);
router.get('/:id/certificate', protect, restrictTo('youth'), getCertificate);

// Admin routes
router.post('/', protect, restrictTo('admin'), createCourse);
router.put('/:id', protect, restrictTo('admin'), updateCourse);
router.delete('/:id', protect, restrictTo('admin'), deleteCourse);

// Public route - MUST come after specific routes to avoid conflicts
router.get('/:id', getCourseById);

export default router;
