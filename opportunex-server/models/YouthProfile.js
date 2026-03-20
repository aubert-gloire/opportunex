import mongoose from 'mongoose';

const youthProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  university: {
    type: String,
    enum: ['University of Rwanda', 'ALU', 'AUCA', 'Other'],
  },
  major: {
    type: String,
    trim: true,
  },
  graduationYear: {
    type: Number,
    min: 2000,
    max: 2030,
  },
  bio: {
    type: String,
    maxlength: 500,
    trim: true,
  },
  skills: [{
    type: String,
    trim: true,
  }],
  verifiedSkills: [{
    skill: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    verifiedAt: {
      type: Date,
      default: Date.now,
    },
    badge: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
  }],
  experience: [{
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: Date,
    description: {
      type: String,
      maxlength: 500,
    },
  }],
  education: [{
    institution: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    field: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: Date,
  }],
  portfolio: [{
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxlength: 300,
    },
    url: String,
    image: String, // Cloudinary URL
  }],
  cv: {
    type: String, // Cloudinary URL
  },
  certificates: [{
    name: {
      type: String,
      required: true,
    },
    url: String,
    issuedBy: String,
    date: Date,
  }],
  mentorshipInterests: [{
    type: String,
    trim: true,
  }],
  availableForWork: {
    type: Boolean,
    default: true,
  },
  preferredSectors: [{
    type: String,
    enum: ['Technology', 'Finance', 'Hospitality', 'Engineering', 'Business', 'Healthcare', 'Education', 'Other'],
  }],
  location: {
    type: String,
    default: 'Kigali',
  },
  profileCompletionPercentage: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Calculate profile completion percentage
youthProfileSchema.methods.calculateCompletionPercentage = function () {
  let score = 0;
  const maxScore = 11;

  if (this.bio) score += 1;
  if (this.university) score += 1;
  if (this.major) score += 1;
  if (this.graduationYear) score += 1;
  if (this.skills && this.skills.length > 0) score += 1;
  if (this.experience && this.experience.length > 0) score += 1;
  if (this.education && this.education.length > 0) score += 1;
  if (this.cv) score += 1;
  if (this.portfolio && this.portfolio.length > 0) score += 1;
  if (this.preferredSectors && this.preferredSectors.length > 0) score += 1;
  if (this.location) score += 1;

  this.profileCompletionPercentage = Math.round((score / maxScore) * 100);
};

// Update completion percentage before save
youthProfileSchema.pre('save', function (next) {
  this.calculateCompletionPercentage();
  next();
});

const YouthProfile = mongoose.model('YouthProfile', youthProfileSchema);

export default YouthProfile;
