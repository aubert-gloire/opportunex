import express from 'express';
import {
  subscribe,
  payForJobPosting,
  getMyPayments,
  handleWebhook,
  getPayment,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';

const router = express.Router();

// Employer routes
router.post('/subscribe', protect, authorize('employer'), subscribe);
router.post('/job-posting', protect, authorize('employer'), payForJobPosting);

// User routes
router.get('/my-payments', protect, getMyPayments);
router.get('/:id', protect, getPayment);

// Public webhook route (for Flutterwave)
router.post('/webhook', handleWebhook);

export default router;
