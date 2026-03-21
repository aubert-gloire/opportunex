import Assignment from '../models/Assignment.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import Course from '../models/Course.js';
import * as aiService from '../services/aiService.js';

// @desc    Get assignments for a specific lesson
// @route   GET /api/assignments/course/:courseId/lesson/:lessonId
// @access  Private (Youth)
export const getLessonAssignments = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;

    const assignments = await Assignment.find({ course: courseId, lessonId });

    // Check if student already submitted each assignment
    const submissionsMap = {};
    if (assignments.length > 0) {
      const submissions = await AssignmentSubmission.find({
        student: req.user.id,
        assignment: { $in: assignments.map((a) => a._id) },
      });
      submissions.forEach((s) => {
        submissionsMap[s.assignment.toString()] = s;
      });
    }

    const assignmentsWithSubmission = assignments.map((a) => ({
      ...a.toObject(),
      submission: submissionsMap[a._id.toString()] || null,
    }));

    res.json({ success: true, assignments: assignmentsWithSubmission });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching assignments', error: error.message });
  }
};

// @desc    Submit answers for an assignment
// @route   POST /api/assignments/:id/submit
// @access  Private (Youth)
export const submitAssignment = async (req, res) => {
  try {
    const { answers } = req.body; // [{ questionIndex, answer }]

    const assignment = await Assignment.findById(req.params.id).populate('course', 'title');
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    // Prevent duplicate submission
    const existing = await AssignmentSubmission.findOne({
      assignment: assignment._id,
      student: req.user.id,
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already submitted this assignment' });
    }

    const gradedAnswers = [];
    let totalPointsEarned = 0;

    for (const answer of answers) {
      const question = assignment.questions[answer.questionIndex];
      if (!question) continue;

      const gradedAnswer = {
        questionIndex: answer.questionIndex,
        answer: answer.answer,
        pointsEarned: 0,
        isCorrect: null,
        aiFeedback: '',
      };

      if (question.type === 'multiple-choice' || question.type === 'true-false') {
        // Auto-grade objective questions
        const correct = answer.answer.trim().toLowerCase() === question.correctAnswer?.trim().toLowerCase();
        gradedAnswer.isCorrect = correct;
        gradedAnswer.pointsEarned = correct ? question.points : 0;
      } else {
        // Open-ended: AI grades
        try {
          const aiResult = await aiService.gradeOpenAnswer(
            question.text,
            answer.answer,
            assignment.course?.title || ''
          );
          gradedAnswer.pointsEarned = Math.round((aiResult.score / 100) * question.points);
          gradedAnswer.aiFeedback = aiResult.feedback;
          gradedAnswer.isCorrect = aiResult.score >= 60;
        } catch {
          // Fallback: give partial credit
          gradedAnswer.pointsEarned = Math.round(question.points * 0.5);
          gradedAnswer.aiFeedback = 'Answer noted. Manual review may apply.';
        }
      }

      totalPointsEarned += gradedAnswer.pointsEarned;
      gradedAnswers.push(gradedAnswer);
    }

    const scorePercent = assignment.totalPoints > 0
      ? Math.round((totalPointsEarned / assignment.totalPoints) * 100)
      : 0;

    const submission = await AssignmentSubmission.create({
      assignment: assignment._id,
      student: req.user.id,
      answers: gradedAnswers,
      totalPointsEarned,
      score: scorePercent,
      passed: scorePercent >= assignment.passingScore,
      aiGraded: gradedAnswers.some((a) => a.aiFeedback),
      status: 'graded',
    });

    res.status(201).json({
      success: true,
      message: 'Assignment submitted and graded',
      submission,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error submitting assignment', error: error.message });
  }
};

// @desc    Get my submissions across a course
// @route   GET /api/assignments/my-submissions/:courseId
// @access  Private (Youth)
export const getMySubmissions = async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId });
    const submissions = await AssignmentSubmission.find({
      student: req.user.id,
      assignment: { $in: assignments.map((a) => a._id) },
    }).populate('assignment');

    res.json({ success: true, submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching submissions', error: error.message });
  }
};

// @desc    Create assignment manually (Admin)
// @route   POST /api/assignments
// @access  Private (Admin)
export const createAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.create(req.body);
    res.status(201).json({ success: true, assignment });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error creating assignment', error: error.message });
  }
};

// @desc    Generate assignment using AI
// @route   POST /api/assignments/generate
// @access  Private (Admin)
export const generateAIAssignment = async (req, res) => {
  try {
    const { courseId, lessonId, courseTitle, lessonTitle, lessonContent } = req.body;

    if (!courseId || !lessonId) {
      return res.status(400).json({ success: false, message: 'courseId and lessonId are required' });
    }

    const questions = await aiService.generateAssignmentQuestions(
      courseTitle || 'Course',
      lessonTitle || 'Lesson',
      lessonContent || ''
    );

    if (!questions) {
      return res.status(503).json({ success: false, message: 'AI service not configured' });
    }

    const assignment = await Assignment.create({
      course: courseId,
      lessonId,
      lessonTitle: lessonTitle || '',
      title: `${lessonTitle || 'Lesson'} — Assessment`,
      description: `AI-generated assessment for: ${lessonTitle || 'this lesson'}`,
      questions,
      aiGenerated: true,
    });

    res.status(201).json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error generating assignment', error: error.message });
  }
};

// @desc    Delete assignment (Admin)
// @route   DELETE /api/assignments/:id
// @access  Private (Admin)
export const deleteAssignment = async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    await AssignmentSubmission.deleteMany({ assignment: req.params.id });
    res.json({ success: true, message: 'Assignment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting assignment', error: error.message });
  }
};
