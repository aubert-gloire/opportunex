import mongoose from 'mongoose';

const skillResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SkillTest',
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0,
  },
  totalPoints: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  passed: {
    type: Boolean,
    required: true,
  },
  badge: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  answers: [{
    questionIndex: {
      type: Number,
      required: true,
    },
    selectedAnswer: {
      type: Number,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
  }],
  completedAt: {
    type: Date,
    default: Date.now,
  },
  timeTaken: {
    type: Number, // Seconds
  },
}, {
  timestamps: true,
});

// Index for querying user's results
skillResultSchema.index({ user: 1, test: 1 });
skillResultSchema.index({ user: 1, passed: 1 });

const SkillResult = mongoose.model('SkillResult', skillResultSchema);

export default SkillResult;
