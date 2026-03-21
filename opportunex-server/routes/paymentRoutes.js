import express from 'express';
import {
  subscribe,
  payForJobPosting,
  getMyPayments,
  handleWebhook,
  getPayment,
  verifyPayment,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';

const router = express.Router();

// Employer routes
router.post('/subscribe',    protect, authorize('employer'), subscribe);
router.post('/job-posting',  protect, authorize('employer'), payForJobPosting);

// Verify after inline payment callback
router.post('/verify',       protect, verifyPayment);

// User routes
router.get('/my-payments',   protect, getMyPayments);
router.get('/:id',           protect, getPayment);

// Flutterwave webhook (optional)
router.post('/webhook', handleWebhook);

export default router;
