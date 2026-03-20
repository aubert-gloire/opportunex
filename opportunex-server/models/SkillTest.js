import mongoose from 'mongoose';

const skillTestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Test title is required'],
    trim: true,
  },
  category: {
    type: String,
    enum: ['Technical', 'Soft Skills', 'Business', 'Language', 'Other'],
    default: 'Technical',
  },
  description: {
    type: String,
    maxlength: 500,
    trim: true,
  },
  questions: [{
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      validate: [arrayLimit, 'Must have between 2 and 6 options'],
    },
    correctAnswer: {
      type: Number,
      required: true,
      min: 0,
    },
    points: {
      type: Number,
      default: 1,
      min: 1,
    },
  }],
  duration: {
    type: Number, // Minutes
    required: true,
    min: 5,
    max: 180,
  },
  passingScore: {
    type: Number, // Percentage
    required: true,
    min: 0,
    max: 100,
    default: 70,
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  timesAttempted: {
    type: Number,
    default: 0,
  },
  averageScore: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

function arrayLimit(val) {
  return val.length >= 2 && val.length <= 6;
}

// Calculate total points for the test
skillTestSchema.virtual('totalPoints').get(function () {
  return this.questions.reduce((sum, q) => sum + q.points, 0);
});

// Ensure virtuals are included in JSON
skillTestSchema.set('toJSON', { virtuals: true });
skillTestSchema.set('toObject', { virtuals: true });

const SkillTest = mongoose.model('SkillTest', skillTestSchema);

export default SkillTest;
