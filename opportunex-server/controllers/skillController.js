import { validationResult } from 'express-validator';
import SkillTest from '../models/SkillTest.js';
import SkillResult from '../models/SkillResult.js';
import YouthProfile from '../models/YouthProfile.js';

// @desc    Get available skill tests
// @route   GET /api/skills/tests
// @access  Private
export const getSkillTests = async (req, res) => {
  try {
    const { category, difficulty, page = 1, limit = 20 } = req.query;

    const query = { isActive: true };
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const tests = await SkillTest.find(query)
      .select('-questions.correctAnswer') // Don't send correct answers
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await SkillTest.countDocuments(query);

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      tests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching skill tests',
      error: error.message,
    });
  }
};

// @desc    Get a specific skill test
// @route   GET /api/skills/tests/:id
// @access  Private
export const getSkillTest = async (req, res) => {
  try {
    const test = await SkillTest.findById(req.params.id)
      .select('-questions.correctAnswer'); // Don't send correct answers

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found',
      });
    }

    if (!test.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This test is not currently available',
      });
    }

    res.json({
      success: true,
      test,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching test',
      error: error.message,
    });
  }
};

// @desc    Submit test answers and get results
// @route   POST /api/skills/tests/:id/submit
// @access  Private (Youth)
export const submitTest = async (req, res) => {
  try {
    const { answers, timeTaken } = req.body; // answers = [{ questionIndex, selectedAnswer }]

    const test = await SkillTest.findById(req.params.id);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found',
      });
    }

    // Check if user has taken this test recently (within 7 days)
    const recentResult = await SkillResult.findOne({
      user: req.user.id,
      test: test._id,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    if (recentResult) {
      return res.status(400).json({
        success: false,
        message: 'You can retake this test after 7 days',
      });
    }

    // Calculate score
    let score = 0;
    const totalPoints = test.totalPoints;
    const gradedAnswers = [];

    answers.forEach((answer) => {
      const question = test.questions[answer.questionIndex];
      const isCorrect = question.correctAnswer === answer.selectedAnswer;

      if (isCorrect) {
        score += question.points;
      }

      gradedAnswers.push({
        questionIndex: answer.questionIndex,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
      });
    });

    const percentage = Math.round((score / totalPoints) * 100);
    const passed = percentage >= test.passingScore;

    // Determine badge
    let badge = null;
    if (passed) {
      if (test.difficulty === 'beginner') badge = 'beginner';
      else if (test.difficulty === 'intermediate') badge = 'intermediate';
      else if (test.difficulty === 'advanced') badge = 'advanced';
    }

    // Create skill result
    const result = await SkillResult.create({
      user: req.user.id,
      test: test._id,
      score,
      totalPoints,
      percentage,
      passed,
      badge,
      answers: gradedAnswers,
      timeTaken,
    });

    // Update test stats
    test.timesAttempted += 1;
    test.averageScore = ((test.averageScore * (test.timesAttempted - 1)) + percentage) / test.timesAttempted;
    await test.save();

    // If passed, add to youth profile verified skills
    if (passed) {
      const youthProfile = await YouthProfile.findOne({ user: req.user.id });
      if (youthProfile) {
        // Check if skill already verified
        const skillExists = youthProfile.verifiedSkills.some(
          (vs) => vs.skill === test.title
        );

        if (!skillExists) {
          youthProfile.verifiedSkills.push({
            skill: test.title,
            score: percentage,
            verifiedAt: new Date(),
            badge,
          });
          await youthProfile.save();
        }
      }
    }

    res.json({
      success: true,
      message: passed ? 'Congratulations! You passed the test.' : 'Test completed. Keep practicing!',
      result: {
        score,
        totalPoints,
        percentage,
        passed,
        badge,
        correctAnswers: gradedAnswers.filter(a => a.isCorrect).length,
        totalQuestions: test.questions.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting test',
      error: error.message,
    });
  }
};

// @desc    Get user's skill test results
// @route   GET /api/skills/my-results
// @access  Private (Youth)
export const getMyResults = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const results = await SkillResult.find({ user: req.user.id })
      .populate('test', 'title category difficulty')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await SkillResult.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching results',
      error: error.message,
    });
  }
};

// @desc    Create a skill test
// @route   POST /api/skills/tests
// @access  Private (Admin)
export const createSkillTest = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const test = await SkillTest.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Skill test created successfully',
      test,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating skill test',
      error: error.message,
    });
  }
};

// @desc    Update skill test
// @route   PUT /api/skills/tests/:id
// @access  Private (Admin)
export const updateSkillTest = async (req, res) => {
  try {
    const test = await SkillTest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found',
      });
    }

    res.json({
      success: true,
      message: 'Test updated successfully',
      test,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating test',
      error: error.message,
    });
  }
};

// @desc    Delete/deactivate skill test
// @route   DELETE /api/skills/tests/:id
// @access  Private (Admin)
export const deleteSkillTest = async (req, res) => {
  try {
    const test = await SkillTest.findById(req.params.id);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found',
      });
    }

    // Deactivate instead of deleting
    test.isActive = false;
    await test.save();

    res.json({
      success: true,
      message: 'Test deactivated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting test',
      error: error.message,
    });
  }
};
