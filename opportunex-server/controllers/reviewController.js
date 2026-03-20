import { validationResult } from 'express-validator';
import Review from '../models/Review.js';
import User from '../models/User.js';

// @desc    Submit a review
// @route   POST /api/reviews
// @access  Private (Youth)
export const submitReview = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { target, targetType, rating, comment, isAnonymous } = req.body;

    // Check if target user exists
    const targetUser = await User.findById(target);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify target type matches user role
    if (targetType === 'employer' && targetUser.role !== 'employer') {
      return res.status(400).json({
        success: false,
        message: 'Target user is not an employer',
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      reviewer: req.user.id,
      target,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this user',
      });
    }

    // Create review
    const review = await Review.create({
      reviewer: req.user.id,
      target,
      targetType,
      rating,
      comment,
      isAnonymous: isAnonymous || false,
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting review',
      error: error.message,
    });
  }
};

// @desc    Get reviews for a specific user
// @route   GET /api/reviews/target/:userId
// @access  Private
export const getReviewsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const query = {
      target: userId,
      isVisible: true,
    };

    const reviews = await Review.find(query)
      .populate('reviewer', 'firstName lastName avatar')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Hide reviewer info for anonymous reviews
    const processedReviews = reviews.map((review) => {
      if (review.isAnonymous) {
        return {
          ...review,
          reviewer: {
            firstName: 'Anonymous',
            lastName: '',
            avatar: '',
          },
        };
      }
      return review;
    });

    const count = await Review.countDocuments(query);

    // Calculate average rating
    const ratingStats = await Review.aggregate([
      { $match: { target: userId, isVisible: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratings: {
            $push: '$rating',
          },
        },
      },
    ]);

    const stats = ratingStats[0] || {
      averageRating: 0,
      totalReviews: 0,
    };

    // Count ratings distribution
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (stats.ratings) {
      stats.ratings.forEach((rating) => {
        ratingDistribution[rating]++;
      });
    }

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      reviews: processedReviews,
      stats: {
        averageRating: Math.round(stats.averageRating * 10) / 10,
        totalReviews: stats.totalReviews,
        ratingDistribution,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message,
    });
  }
};

// @desc    Get user's own reviews (reviews they wrote)
// @route   GET /api/reviews/my-reviews
// @access  Private
export const getMyReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const reviews = await Review.find({ reviewer: req.user.id })
      .populate('target', 'firstName lastName avatar role')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Review.countDocuments({ reviewer: req.user.id });

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message,
    });
  }
};

// @desc    Update own review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Check if user is the reviewer
    if (review.reviewer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review',
      });
    }

    // Update allowed fields
    if (req.body.rating) review.rating = req.body.rating;
    if (req.body.comment !== undefined) review.comment = req.body.comment;
    if (req.body.isAnonymous !== undefined) review.isAnonymous = req.body.isAnonymous;

    await review.save();

    res.json({
      success: true,
      message: 'Review updated successfully',
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating review',
      error: error.message,
    });
  }
};

// @desc    Delete own review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Check if user is the reviewer
    if (review.reviewer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review',
      });
    }

    await review.deleteOne();

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message,
    });
  }
};
