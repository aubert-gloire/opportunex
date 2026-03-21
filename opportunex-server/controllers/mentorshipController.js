import { validationResult } from 'express-validator';
import MentorshipSession from '../models/MentorshipSession.js';
import User from '../models/User.js';
import YouthProfile from '../models/YouthProfile.js';
import { sendEmail, emailTemplates } from '../utils/sendEmail.js';
import { sendSMS, smsTemplates } from '../utils/sendSMS.js';

// @desc    Get available mentors
// @route   GET /api/mentorship/mentors
// @access  Private
export const getMentors = async (req, res) => {
  try {
    const { expertise, search, page = 1, limit = 20 } = req.query;

    // For MVP, employers can be mentors
    const query = { role: 'employer', isActive: true };

    const mentors = await User.find(query)
      .select('firstName lastName avatar email')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      mentors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching mentors',
      error: error.message,
    });
  }
};

// @desc    Request a mentorship session
// @route   POST /api/mentorship/request
// @access  Private (Youth)
export const requestMentorship = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { mentor, topic, scheduledAt, duration, notes } = req.body;

    // Check if mentor exists
    const mentorUser = await User.findById(mentor);
    if (!mentorUser) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found',
      });
    }

    // Create mentorship session with auto-generated Jitsi meeting link (free, no key needed)
    const session = await MentorshipSession.create({
      mentor,
      mentee: req.user.id,
      topic,
      scheduledAt,
      duration: duration || 60,
      notes,
      status: 'pending',
    });

    // Auto-assign a Jitsi Meet room — completely free, works instantly
    session.meetingLink = `https://meet.jit.si/opportunex-${session._id}`;
    await session.save();

    // Send email to mentor
    const mentee = await User.findById(req.user.id);
    await sendEmail({
      email: mentorUser.email,
      subject: 'New Mentorship Request',
      html: emailTemplates.mentorshipRequest(
        mentee.firstName + ' ' + mentee.lastName,
        topic,
        new Date(scheduledAt).toLocaleString()
      ),
    });

    res.status(201).json({
      success: true,
      message: 'Mentorship request sent successfully',
      session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error requesting mentorship',
      error: error.message,
    });
  }
};

// @desc    Get user's mentorship sessions
// @route   GET /api/mentorship/my-sessions
// @access  Private
export const getMySessions = async (req, res) => {
  try {
    const { status, role, page = 1, limit = 10 } = req.query;

    const query = {};

    // Filter by role (as mentor or mentee)
    if (role === 'mentor') {
      query.mentor = req.user.id;
    } else if (role === 'mentee') {
      query.mentee = req.user.id;
    } else {
      // Both mentor and mentee sessions
      query.$or = [{ mentor: req.user.id }, { mentee: req.user.id }];
    }

    if (status) query.status = status;

    const sessions = await MentorshipSession.find(query)
      .populate('mentor', 'firstName lastName avatar email')
      .populate('mentee', 'firstName lastName avatar email')
      .sort('-scheduledAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await MentorshipSession.countDocuments(query);

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      sessions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sessions',
      error: error.message,
    });
  }
};

// @desc    Update mentorship session
// @route   PUT /api/mentorship/:id
// @access  Private
export const updateSession = async (req, res) => {
  try {
    const session = await MentorshipSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    // Check authorization (mentor or mentee)
    const isMentor = session.mentor.toString() === req.user.id;
    const isMentee = session.mentee.toString() === req.user.id;

    if (!isMentor && !isMentee) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this session',
      });
    }

    const previousStatus = session.status;

    // Update allowed fields based on role
    if (req.body.status) session.status = req.body.status;
    if (req.body.meetingLink && isMentor) session.meetingLink = req.body.meetingLink;
    if (req.body.mentorNotes && isMentor) session.mentorNotes = req.body.mentorNotes;
    if (req.body.menteeNotes && isMentee) session.menteeNotes = req.body.menteeNotes;
    if (req.body.scheduledAt) session.scheduledAt = req.body.scheduledAt;

    await session.save();

    // Notify mentee by SMS when mentor confirms the session
    if (req.body.status === 'confirmed' && previousStatus !== 'confirmed') {
      const [menteeUser, mentorUser] = await Promise.all([
        User.findById(session.mentee).select('phone').lean(),
        User.findById(session.mentor).select('firstName lastName').lean(),
      ]);
      if (menteeUser?.phone && mentorUser) {
        sendSMS(
          menteeUser.phone,
          smsTemplates.mentorshipConfirmed(
            `${mentorUser.firstName} ${mentorUser.lastName}`,
            session.topic,
            session.scheduledAt
          )
        ).catch(() => {});
      }
    }

    res.json({
      success: true,
      message: 'Session updated successfully',
      session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating session',
      error: error.message,
    });
  }
};

// @desc    Submit feedback for a session
// @route   POST /api/mentorship/:id/feedback
// @access  Private
export const submitFeedback = async (req, res) => {
  try {
    const { rating, feedback } = req.body;

    const session = await MentorshipSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    // Only mentee can submit feedback
    if (session.mentee.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the mentee can submit feedback',
      });
    }

    // Session must be completed
    if (session.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only submit feedback for completed sessions',
      });
    }

    session.rating = rating;
    session.feedback = feedback;
    await session.save();

    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting feedback',
      error: error.message,
    });
  }
};

// @desc    Cancel mentorship session
// @route   DELETE /api/mentorship/:id
// @access  Private
export const cancelSession = async (req, res) => {
  try {
    const session = await MentorshipSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      });
    }

    // Check authorization
    const isMentor = session.mentor.toString() === req.user.id;
    const isMentee = session.mentee.toString() === req.user.id;

    if (!isMentor && !isMentee) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this session',
      });
    }

    // Can't cancel completed sessions
    if (session.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed sessions',
      });
    }

    session.status = 'cancelled';
    await session.save();

    res.json({
      success: true,
      message: 'Session cancelled successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling session',
      error: error.message,
    });
  }
};
