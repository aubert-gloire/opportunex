import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  target: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  targetType: {
    type: String,
    enum: ['employer', 'mentor'],
    required: true,
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    maxlength: 500,
    trim: true,
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Compound index to prevent duplicate reviews
reviewSchema.index({ reviewer: 1, target: 1 }, { unique: true });

// Index for querying reviews
reviewSchema.index({ target: 1, targetType: 1, isVisible: 1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
