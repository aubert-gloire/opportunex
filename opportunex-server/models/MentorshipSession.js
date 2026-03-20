import mongoose from 'mongoose';

const mentorshipSessionSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mentee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  topic: {
    type: String,
    required: [true, 'Session topic is required'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['one-on-one', 'group', 'workshop'],
    default: 'one-on-one',
  },
  scheduledAt: {
    type: Date,
    required: [true, 'Schedule date/time is required'],
  },
  duration: {
    type: Number, // Minutes
    default: 60,
    min: 15,
    max: 240,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  meetingLink: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    maxlength: 1000,
  },
  mentorNotes: {
    type: String,
    maxlength: 500,
  },
  menteeNotes: {
    type: String,
    maxlength: 500,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  feedback: {
    type: String,
    maxlength: 500,
  },
}, {
  timestamps: true,
});

// Index for querying sessions
mentorshipSessionSchema.index({ mentor: 1, status: 1 });
mentorshipSessionSchema.index({ mentee: 1, status: 1 });
mentorshipSessionSchema.index({ scheduledAt: 1 });

const MentorshipSession = mongoose.model('MentorshipSession', mentorshipSessionSchema);

export default MentorshipSession;
