import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionIndex: { type: Number, required: true },
  answer: { type: String, required: true },
  isCorrect: { type: Boolean },          // set for MCQ / true-false
  pointsEarned: { type: Number, default: 0 },
  aiFeedback: { type: String, default: '' },  // set for open-ended
}, { _id: false });

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    answers: [answerSchema],
    score: { type: Number, default: 0 },        // percentage 0-100
    totalPointsEarned: { type: Number, default: 0 },
    passed: { type: Boolean, default: false },
    aiGraded: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['submitted', 'graded'],
      default: 'submitted',
    },
  },
  { timestamps: true }
);

submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

const AssignmentSubmission = mongoose.model('AssignmentSubmission', submissionSchema);
export default AssignmentSubmission;
