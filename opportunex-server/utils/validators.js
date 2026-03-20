import { body, param, query } from 'express-validator';

export const registerValidator = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['youth', 'employer']).withMessage('Role must be either youth or employer'),
];

export const loginValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const jobValidator = [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('description').trim().notEmpty().withMessage('Job description is required'),
  body('type').isIn(['full-time', 'part-time', 'internship', 'contract']).withMessage('Invalid job type'),
  body('sector').optional().trim(),
  body('location').optional().trim(),
];

export const applicationValidator = [
  body('job').isMongoId().withMessage('Valid job ID is required'),
  body('coverLetter').optional().trim().isLength({ max: 1000 }).withMessage('Cover letter too long'),
];

export const skillTestValidator = [
  body('title').trim().notEmpty().withMessage('Test title is required'),
  body('category').optional().trim(),
  body('questions').isArray({ min: 1 }).withMessage('At least one question is required'),
  body('duration').isInt({ min: 5, max: 180 }).withMessage('Duration must be between 5 and 180 minutes'),
  body('passingScore').isInt({ min: 0, max: 100 }).withMessage('Passing score must be between 0 and 100'),
];

export const mentorshipValidator = [
  body('mentor').isMongoId().withMessage('Valid mentor ID is required'),
  body('topic').trim().notEmpty().withMessage('Topic is required'),
  body('scheduledAt').isISO8601().withMessage('Valid date and time is required'),
  body('duration').optional().isInt({ min: 15, max: 240 }).withMessage('Duration must be between 15 and 240 minutes'),
];

export const reviewValidator = [
  body('target').isMongoId().withMessage('Valid target user ID is required'),
  body('targetType').isIn(['employer', 'mentor']).withMessage('Target type must be employer or mentor'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ max: 500 }).withMessage('Comment too long'),
];

export const idParamValidator = [
  param('id').isMongoId().withMessage('Invalid ID format'),
];
