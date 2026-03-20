import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
  },
  requirements: [{
    type: String,
    trim: true,
  }],
  requiredSkills: [{
    type: String,
    trim: true,
  }],
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'internship', 'contract'],
    required: [true, 'Job type is required'],
  },
  sector: {
    type: String,
    enum: ['Technology', 'Finance', 'Hospitality', 'Engineering', 'Business', 'Healthcare', 'Education', 'Manufacturing', 'Agriculture', 'Other'],
  },
  location: {
    type: String,
    default: 'Kigali',
  },
  isRemote: {
    type: Boolean,
    default: false,
  },
  salaryRange: {
    min: {
      type: Number,
      min: 0,
    },
    max: {
      type: Number,
      min: 0,
    },
    currency: {
      type: String,
      default: 'RWF',
    },
  },
  applicationDeadline: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'filled'],
    default: 'open',
  },
  applicationsCount: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Index for search optimization
jobSchema.index({ title: 'text', description: 'text' });
jobSchema.index({ sector: 1, status: 1 });
jobSchema.index({ employer: 1, status: 1 });

// Auto-close jobs past deadline
jobSchema.pre('save', function (next) {
  if (this.applicationDeadline && new Date() > this.applicationDeadline && this.status === 'open') {
    this.status = 'closed';
  }
  next();
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
