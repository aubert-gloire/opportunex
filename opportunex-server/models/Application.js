import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  coverLetter: {
    type: String,
    maxlength: 1000,
    trim: true,
  },
  cv: {
    type: String, // Cloudinary URL - can override profile CV
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'interviewed', 'accepted', 'rejected'],
    default: 'pending',
  },
  employerNotes: {
    type: String,
    maxlength: 500,
  },
  interviewDate: {
    type: Date,
  },
  interviewDetails: {
    location: String,
    meetingLink: String,
    notes: String,
  },
}, {
  timestamps: true,
});

// Compound index to prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

// Index for querying
applicationSchema.index({ applicant: 1, status: 1 });
applicationSchema.index({ job: 1, status: 1 });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
