import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['subscription', 'job_posting', 'skill_test', 'transaction_fee'],
    required: true,
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 0,
  },
  currency: {
    type: String,
    default: 'RWF',
  },
  method: {
    type: String,
    enum: ['momo', 'airtel_money', 'card', 'bank'],
    default: 'momo',
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  reference: {
    type: String, // Payment gateway reference
    trim: true,
  },
  transactionId: {
    type: String, // Flutterwave transaction ID
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  metadata: {
    subscriptionPlan: String,
    subscriptionDuration: String,
    jobId: mongoose.Schema.Types.ObjectId,
  },
}, {
  timestamps: true,
});

// Index for querying payments
paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ reference: 1 });
paymentSchema.index({ transactionId: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
