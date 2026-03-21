import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: {
    type: String,
    enum: ['multiple-choice', 'open-ended', 'true-false'],
    default: 'open-ended',
  },
  options: [{ type: String }],      // MCQ choices
  correctAnswer: { type: String },  // MCQ / true-false
  points: { type: Number, default: 10 },
}, { _id: false });

const assignmentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    lessonId: { type: String, required: true },   // lesson subdocument _id
    lessonTitle: { type: String, default: '' },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    questions: [questionSchema],
    totalPoints: { type: Number, default: 0 },
    passingScore: { type: Number, default: 70 },  // percentage
    aiGenerated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Recalculate total points before saving
assignmentSchema.pre('save', function (next) {
  if (this.questions?.length) {
    this.totalPoints = this.questions.reduce((sum, q) => sum + (q.points || 10), 0);
  }
  next();
});

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;
