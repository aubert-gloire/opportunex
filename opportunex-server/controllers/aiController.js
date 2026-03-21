import * as aiService from '../services/aiService.js';
import YouthProfile from '../models/YouthProfile.js';
import User from '../models/User.js';

// @desc    Generate job description
// @route   POST /api/ai/job-description
// @access  Private (Employer, Admin)
export const generateJobDescription = async (req, res) => {
  try {
    const { title, type, sector, requirements, skills } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Job title is required' });
    }

    const description = await aiService.generateJobDescription(title, type, sector, requirements, skills);

    if (!description) {
      return res.status(503).json({ success: false, message: 'AI service not configured. Add GEMINI_API_KEY to .env' });
    }

    res.json({ success: true, description });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error generating description', error: error.message });
  }
};

// @desc    Generate cover letter for a job application
// @route   POST /api/ai/cover-letter
// @access  Private (Youth)
export const generateCoverLetter = async (req, res) => {
  try {
    const { jobTitle, companyName } = req.body;

    if (!jobTitle) {
      return res.status(400).json({ success: false, message: 'Job title is required' });
    }

    const [profile, user] = await Promise.all([
      YouthProfile.findOne({ user: req.user.id }).lean(),
      User.findById(req.user.id).select('firstName lastName').lean(),
    ]);

    const candidate = {
      firstName: user?.firstName || 'Candidate',
      ...profile,
    };

    const coverLetter = await aiService.generateCoverLetter(jobTitle, companyName, candidate);

    if (!coverLetter) {
      return res.status(503).json({ success: false, message: 'AI service not configured. Add GEMINI_API_KEY to .env' });
    }

    res.json({ success: true, coverLetter });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error generating cover letter', error: error.message });
  }
};

// @desc    Get interview prep questions for a position
// @route   POST /api/ai/interview-prep
// @access  Private (Youth)
export const getInterviewPrep = async (req, res) => {
  try {
    const { jobTitle, skills } = req.body;

    if (!jobTitle) {
      return res.status(400).json({ success: false, message: 'Job title is required' });
    }

    const questions = await aiService.getInterviewQuestions(jobTitle, skills);

    if (!questions) {
      return res.status(503).json({ success: false, message: 'AI service not configured. Add GEMINI_API_KEY to .env' });
    }

    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error generating interview prep', error: error.message });
  }
};

// @desc    Get personalised career tips for youth
// @route   GET /api/ai/career-tips
// @access  Private (Youth)
export const getCareerTips = async (req, res) => {
  try {
    const profile = await YouthProfile.findOne({ user: req.user.id }).lean();

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Complete your profile to get career tips' });
    }

    const tips = await aiService.getCareerTips(profile);

    if (!tips) {
      return res.status(503).json({ success: false, message: 'AI service not configured. Add GEMINI_API_KEY to .env' });
    }

    res.json({ success: true, tips });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error generating career tips', error: error.message });
  }
};

// @desc    Explain a concept to a learner (AI tutor)
// @route   POST /api/ai/explain-concept
// @access  Private (Youth)
export const explainConcept = async (req, res) => {
  try {
    const { concept, courseTitle, lessonTitle } = req.body;

    if (!concept) {
      return res.status(400).json({ success: false, message: 'Concept is required' });
    }

    const explanation = await aiService.explainConcept(concept, courseTitle, lessonTitle);

    if (!explanation) {
      return res.status(503).json({ success: false, message: 'AI service not configured' });
    }

    res.json({ success: true, explanation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error explaining concept', error: error.message });
  }
};

// @desc    Generate mentorship session agenda
// @route   POST /api/ai/mentorship-agenda
// @access  Private
export const getMentorshipAgenda = async (req, res) => {
  try {
    const { topic, duration } = req.body;

    if (!topic) {
      return res.status(400).json({ success: false, message: 'Session topic is required' });
    }

    const agenda = await aiService.generateMentorshipAgenda(topic, duration);

    if (!agenda) {
      return res.status(503).json({ success: false, message: 'AI service not configured' });
    }

    res.json({ success: true, agenda });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error generating agenda', error: error.message });
  }
};

// @desc    Generate post-session summary
// @route   POST /api/ai/session-summary
// @access  Private
export const getSessionSummary = async (req, res) => {
  try {
    const { topic, mentorNotes, menteeNotes } = req.body;

    if (!topic) {
      return res.status(400).json({ success: false, message: 'Topic is required' });
    }

    const summary = await aiService.generateSessionSummary(topic, mentorNotes, menteeNotes);

    if (!summary) {
      return res.status(503).json({ success: false, message: 'AI service not configured' });
    }

    res.json({ success: true, summary });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error generating summary', error: error.message });
  }
};

// @desc    Get CV improvement feedback
// @route   GET /api/ai/cv-feedback
// @access  Private (Youth)
export const getCVFeedback = async (req, res) => {
  try {
    const profile = await YouthProfile.findOne({ user: req.user.id }).lean();

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    const feedback = await aiService.getCVFeedback(profile);

    if (!feedback) {
      return res.status(503).json({ success: false, message: 'AI service not configured. Add GEMINI_API_KEY to .env' });
    }

    res.json({ success: true, feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error generating CV feedback', error: error.message });
  }
};
