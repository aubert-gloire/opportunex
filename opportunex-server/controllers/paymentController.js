import Payment from '../models/Payment.js';
import EmployerProfile from '../models/EmployerProfile.js';
import Job from '../models/Job.js';

const FLW_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;
const FLW_BASE = 'https://api.flutterwave.com/v3';

// Subscription pricing (RWF)
const SUBSCRIPTION_PRICES = { basic: 20000, premium: 50000 };
const JOB_POSTING_PRICE = 5000;

// Helper: verify a Flutterwave transaction by ID
const verifyFlutterwaveTransaction = async (transactionId) => {
  const response = await fetch(`${FLW_BASE}/transactions/${transactionId}/verify`, {
    headers: { Authorization: `Bearer ${FLW_SECRET_KEY}` },
  });
  return response.json();
};

// Helper: activate employer subscription after confirmed payment
const activateSubscription = async (payment) => {
  const employerProfile = await EmployerProfile.findOne({ user: payment.user });
  if (!employerProfile) return;

  const duration = payment.metadata?.subscriptionDuration || 'monthly';
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + (duration === 'yearly' ? 12 : 1));

  employerProfile.subscription = {
    plan: payment.metadata.subscriptionPlan,
    startDate: new Date(),
    endDate,
    isActive: true,
  };
  await employerProfile.save();
};

// @desc    Create a pending payment record (called before Flutterwave popup opens)
// @route   POST /api/payments/subscribe
// @access  Private (Employer)
export const subscribe = async (req, res) => {
  try {
    const { plan, duration = 'monthly', paymentMethod = 'momo' } = req.body;

    if (!['basic', 'premium'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Invalid subscription plan' });
    }

    const amount = SUBSCRIPTION_PRICES[plan];
    const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);

    const payment = await Payment.create({
      user: req.user.id,
      type: 'subscription',
      amount,
      currency: 'RWF',
      method: paymentMethod,
      status: 'pending',
      description: `${planLabel} Plan Subscription`,
      metadata: { subscriptionPlan: plan, subscriptionDuration: duration },
    });

    // Use payment ID as the Flutterwave tx_ref
    payment.reference = payment._id.toString();
    await payment.save();

    res.json({
      success: true,
      txRef: payment.reference,
      amount,
      payment: { id: payment._id },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating payment', error: error.message });
  }
};

// @desc    Create a pending job posting payment record
// @route   POST /api/payments/job-posting
// @access  Private (Employer)
export const payForJobPosting = async (req, res) => {
  try {
    const { jobId, paymentMethod = 'momo' } = req.body;

    const payment = await Payment.create({
      user: req.user.id,
      type: 'job_posting',
      amount: JOB_POSTING_PRICE,
      currency: 'RWF',
      method: paymentMethod,
      status: 'pending',
      description: 'Job Posting Payment',
      metadata: { jobId },
    });

    payment.reference = payment._id.toString();
    await payment.save();

    res.json({
      success: true,
      txRef: payment.reference,
      amount: JOB_POSTING_PRICE,
      payment: { id: payment._id },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating payment', error: error.message });
  }
};

// @desc    Verify payment after Flutterwave inline callback fires
// @route   POST /api/payments/verify
// @access  Private
export const verifyPayment = async (req, res) => {
  try {
    const { transactionId, txRef } = req.body;

    const payment = await Payment.findOne({ reference: txRef, user: req.user.id });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    // Already confirmed
    if (payment.status === 'completed') {
      return res.json({ success: true, status: 'completed', payment });
    }

    if (!FLW_SECRET_KEY || FLW_SECRET_KEY.startsWith('your_')) {
      // No key — simulate (development only)
      payment.status = 'completed';
      payment.transactionId = `SIM-${Date.now()}`;
      await payment.save();
      if (payment.type === 'subscription') await activateSubscription(payment);
      if (payment.type === 'job_posting' && payment.metadata?.jobId) {
        await Job.findByIdAndUpdate(payment.metadata.jobId, { status: 'active' });
      }
      return res.json({ success: true, status: 'completed', payment });
    }

    // Verify with Flutterwave
    const flwData = await verifyFlutterwaveTransaction(transactionId);

    if (flwData.status === 'success' && flwData.data?.status === 'successful') {
      const { amount, currency, id: flwId } = flwData.data;

      if (amount < payment.amount || currency !== payment.currency) {
        payment.status = 'failed';
        await payment.save();
        return res.status(400).json({ success: false, message: 'Payment amount mismatch' });
      }

      payment.status = 'completed';
      payment.transactionId = String(flwId);
      await payment.save();

      if (payment.type === 'subscription') await activateSubscription(payment);
      if (payment.type === 'job_posting' && payment.metadata?.jobId) {
        await Job.findByIdAndUpdate(payment.metadata.jobId, { status: 'active' });
      }

      return res.json({ success: true, status: 'completed', payment });
    }

    payment.status = 'failed';
    await payment.save();
    res.json({ success: false, status: 'failed', message: 'Payment not successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error verifying payment', error: error.message });
  }
};

// @desc    Flutterwave webhook (optional backup)
// @route   POST /api/payments/webhook
// @access  Public
export const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['verif-hash'];
    if (!signature || signature !== process.env.FLUTTERWAVE_SECRET_HASH) {
      return res.status(401).json({ success: false, message: 'Invalid signature' });
    }

    const payload = req.body;
    if (payload.event === 'charge.completed' && payload.data.status === 'successful') {
      const { tx_ref, id: flwId } = payload.data;
      const payment = await Payment.findOne({ reference: tx_ref });

      if (payment && payment.status !== 'completed') {
        payment.status = 'completed';
        payment.transactionId = String(flwId);
        await payment.save();
        if (payment.type === 'subscription') await activateSubscription(payment);
        if (payment.type === 'job_posting' && payment.metadata?.jobId) {
          await Job.findByIdAndUpdate(payment.metadata.jobId, { status: 'active' });
        }
      }
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Webhook error' });
  }
};

// @desc    Get user's payment history
// @route   GET /api/payments/my-payments
// @access  Private
export const getMyPayments = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const query = { user: req.user.id };
    if (status) query.status = status;
    if (type) query.type = type;

    const payments = await Payment.find(query)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Payment.countDocuments(query);
    res.json({ success: true, count, totalPages: Math.ceil(count / limit), currentPage: Number(page), payments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching payments', error: error.message });
  }
};

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private
export const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    if (payment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching payment', error: error.message });
  }
};
