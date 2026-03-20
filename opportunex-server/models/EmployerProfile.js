import mongoose from 'mongoose';

const employerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  industry: {
    type: String,
    enum: ['Technology', 'Finance', 'Hospitality', 'Engineering', 'Business', 'Healthcare', 'Education', 'Manufacturing', 'Agriculture', 'Other'],
    trim: true,
  },
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '200+'],
  },
  description: {
    type: String,
    maxlength: 1000,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },
  logo: {
    type: String, // Cloudinary URL
    default: '',
  },
  location: {
    type: String,
    default: 'Kigali',
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium'],
      default: 'free',
    },
    startDate: Date,
    endDate: Date,
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true,
  },
  contactPhone: {
    type: String,
    trim: true,
  },
  tinNumber: {
    type: String, // Rwanda Tax ID
    trim: true,
  },
  isVerifiedEmployer: {
    type: Boolean,
    default: false,
  },
  // Statistics
  totalJobsPosted: {
    type: Number,
    default: 0,
  },
  activeJobsCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Update active jobs count
employerProfileSchema.methods.updateActiveJobsCount = async function () {
  const Job = mongoose.model('Job');
  const count = await Job.countDocuments({
    employer: this.user,
    status: 'open',
  });
  this.activeJobsCount = count;
  await this.save();
};

const EmployerProfile = mongoose.model('EmployerProfile', employerProfileSchema);

export default EmployerProfile;
