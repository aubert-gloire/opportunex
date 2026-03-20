import Payment from '../models/Payment.js';
import EmployerProfile from '../models/EmployerProfile.js';

// Subscription pricing (RWF)
const SUBSCRIPTION_PRICES = {
  basic: 20000,
  premium: 50000,
};

// @desc    Subscribe to employer plan
// @route   POST /api/payments/subscribe
// @access  Private (Employer)
export const subscribe = async (req, res) => {
  try {
    const { plan, duration = 'monthly', paymentMethod = 'momo' } = req.body;

    if (!['basic', 'premium'].includes(plan)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription plan',
      });
    }

    const amount = SUBSCRIPTION_PRICES[plan];

    // Create payment record
    const payment = await Payment.create({
      user: req.user.id,
      type: 'subscription',
      amount,
      currency: 'RWF',
      method: paymentMethod,
      status: 'pending',
      description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Subscription`,
      metadata: {
        subscriptionPlan: plan,
        subscriptionDuration: duration,
      },
    });

    // In production, integrate with Flutterwave here
    // For MVP, simulate payment success
    if (process.env.NODE_ENV === 'development') {
      payment.status = 'completed';
      payment.reference = `REF-${Date.now()}`;
      payment.transactionId = `TXN-${Date.now()}`;
      await payment.save();

      // Update employer subscription
      const employerProfile = await EmployerProfile.findOne({ user: req.user.id });
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + (duration === 'yearly' ? 12 : 1));

      employerProfile.subscription = {
        plan,
        startDate,
        endDate,
        isActive: true,
      };
      await employerProfile.save();
    }

    res.json({
      success: true,
      message: 'Payment initiated successfully',
      payment: {
        id: payment._id,
        amount: payment.amount,
        status: payment.status,
        reference: payment.reference,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing subscription',
      error: error.message,
    });
  }
};

// @desc    Pay for job posting
// @route   POST /api/payments/job-posting
// @access  Private (Employer)
export const payForJobPosting = async (req, res) => {
  try {
    const { jobId, paymentMethod = 'momo' } = req.body;

    const amount = 5000; // RWF per job posting

    const payment = await Payment.create({
      user: req.user.id,
      type: 'job_posting',
      amount,
      currency: 'RWF',
      method: paymentMethod,
      status: 'pending',
      description: 'Job Posting Payment',
      metadata: {
        jobId,
      },
    });

    // Simulate payment in development
    if (process.env.NODE_ENV === 'development') {
      payment.status = 'completed';
      payment.reference = `REF-${Date.now()}`;
      payment.transactionId = `TXN-${Date.now()}`;
      await payment.save();
    }

    res.json({
      success: true,
      message: 'Payment initiated successfully',
      payment: {
        id: payment._id,
        amount: payment.amount,
        status: payment.status,
        reference: payment.reference,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing payment',
      error: error.message,
    });
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

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payments',
      error: error.message,
    });
  }
};

// @desc    Flutterwave webhook
// @route   POST /api/payments/webhook
// @access  Public (Flutterwave)
export const handleWebhook = async (req, res) => {
  try {
    // Verify webhook signature
    const signature = req.headers['verif-hash'];

    if (!signature || signature !== process.env.FLUTTERWAVE_SECRET_HASH) {
      return res.status(401).json({ success: false, message: 'Invalid signature' });
    }

    const payload = req.body;

    // Handle different webhook events
    if (payload.event === 'charge.completed' && payload.data.status === 'successful') {
      const { tx_ref, amount, customer } = payload.data;

      // Find and update payment
      const payment = await Payment.findOne({ reference: tx_ref });

      if (payment) {
        payment.status = 'completed';
        payment.transactionId = payload.data.id;
        await payment.save();

        // If subscription payment, update employer profile
        if (payment.type === 'subscription') {
          const employerProfile = await EmployerProfile.findOne({ user: payment.user });

          if (employerProfile) {
            const startDate = new Date();
            const endDate = new Date();
            const duration = payment.metadata.subscriptionDuration;
            endDate.setMonth(endDate.getMonth() + (duration === 'yearly' ? 12 : 1));

            employerProfile.subscription = {
              plan: payment.metadata.subscriptionPlan,
              startDate,
              endDate,
              isActive: true,
            };
            await employerProfile.save();
          }
        }
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing error',
    });
  }
};

// @desc    Get single payment details
// @route   GET /api/payments/:id
// @access  Private
export const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    // Check if user owns this payment
    if (payment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this payment',
      });
    }

    res.json({
      success: true,
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment',
      error: error.message,
    });
  }
};
