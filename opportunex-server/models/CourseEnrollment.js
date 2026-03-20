import mongoose from 'mongoose';

const courseEnrollmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    status: {
      type: String,
      enum: ['enrolled', 'in-progress', 'completed', 'dropped'],
      default: 'enrolled',
    },
    progress: {
      type: Number,
      default: 0, // Percentage (0-100)
    },
    completedLessons: [{
      lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      completedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    currentLesson: {
      type: Number, // Lesson index
      default: 0,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    certificateIssued: {
      type: Boolean,
      default: false,
    },
    certificateUrl: {
      type: String,
      default: '',
    },
    rating: {
      score: {
        type: Number,
        min: 1,
        max: 5,
      },
      review: {
        type: String,
      },
      ratedAt: {
        type: Date,
      },
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure a user can only enroll once per course
courseEnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

// Update progress percentage based on completed lessons
courseEnrollmentSchema.methods.updateProgress = async function () {
  const course = await mongoose.model('Course').findById(this.course);
  if (course && course.lessons.length > 0) {
    const completionPercentage = (this.completedLessons.length / course.lessons.length) * 100;
    this.progress = Math.round(completionPercentage);

    // Update status
    if (this.progress === 100 && this.status !== 'completed') {
      this.status = 'completed';
      this.completedAt = new Date();
    } else if (this.progress > 0 && this.status === 'enrolled') {
      this.status = 'in-progress';
    }

    await this.save();
  }
};

const CourseEnrollment = mongoose.model('CourseEnrollment', courseEnrollmentSchema);

export default CourseEnrollment;
