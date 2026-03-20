import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
}, { _id: false });

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    default: '',
  },
  duration: {
    type: Number, // Duration in minutes
    required: true,
  },
  content: {
    type: String, // Text content or additional materials
    default: '',
  },
  resources: [resourceSchema],
  order: {
    type: Number,
    required: true,
  },
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructor: {
      name: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
        default: '',
      },
      bio: {
        type: String,
        default: '',
      },
    },
    category: {
      type: String,
      required: true,
      enum: ['Technical', 'Business', 'Soft Skills', 'Design', 'Marketing', 'Finance', 'Other'],
    },
    sector: {
      type: String,
      required: true,
      enum: ['Technology', 'Finance', 'Hospitality', 'Engineering', 'Business', 'Healthcare', 'Education', 'Other'],
    },
    level: {
      type: String,
      required: true,
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: 0, // 0 means free
    },
    currency: {
      type: String,
      default: 'RWF',
    },
    lessons: [lessonSchema],
    totalDuration: {
      type: Number, // Total minutes of all lessons
      default: 0,
    },
    skills: [{
      type: String,
      trim: true,
    }],
    prerequisites: [{
      type: String,
    }],
    learningOutcomes: [{
      type: String,
    }],
    isPublished: {
      type: Boolean,
      default: false,
    },
    enrollmentCount: {
      type: Number,
      default: 0,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    certificate: {
      enabled: {
        type: Boolean,
        default: true,
      },
      passingPercentage: {
        type: Number,
        default: 80,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Calculate total duration before saving
courseSchema.pre('save', function (next) {
  if (this.lessons && this.lessons.length > 0) {
    this.totalDuration = this.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
  }
  next();
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
