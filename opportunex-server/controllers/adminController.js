import User from '../models/User.js';
import YouthProfile from '../models/YouthProfile.js';
import EmployerProfile from '../models/EmployerProfile.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Payment from '../models/Payment.js';
import MentorshipSession from '../models/MentorshipSession.js';
import SkillTest from '../models/SkillTest.js';

// @desc    Get all users with filters
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res) => {
  try {
    const { role, isActive, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
};

// @desc    Update user status (activate/deactivate)
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
export const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own status',
      });
    }

    user.isActive = isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: error.message,
    });
  }
};

// @desc    Verify employer account
// @route   PUT /api/admin/employers/:id/verify
// @access  Private (Admin)
export const verifyEmployer = async (req, res) => {
  try {
    const employerProfile = await EmployerProfile.findOne({ user: req.params.id });

    if (!employerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Employer profile not found',
      });
    }

    employerProfile.isVerifiedEmployer = true;
    await employerProfile.save();

    res.json({
      success: true,
      message: 'Employer verified successfully',
      employerProfile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying employer',
      error: error.message,
    });
  }
};

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
export const getAnalytics = async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments();
    const totalYouth = await User.countDocuments({ role: 'youth' });
    const totalEmployers = await User.countDocuments({ role: 'employer' });
    const activeUsers = await User.countDocuments({ isActive: true });
    const verifiedEmployers = await EmployerProfile.countDocuments({ isVerifiedEmployer: true });

    // Job statistics
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'open' });
    const filledJobs = await Job.countDocuments({ status: 'filled' });

    // Application statistics
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'pending' });
    const acceptedApplications = await Application.countDocuments({ status: 'accepted' });

    // Mentorship statistics
    const totalMentorshipSessions = await MentorshipSession.countDocuments();
    const completedSessions = await MentorshipSession.countDocuments({ status: 'completed' });

    // Skill test statistics
    const totalSkillTests = await SkillTest.countDocuments({ isActive: true });

    // Payment statistics
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Growth statistics (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newUsersLast30Days = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });
    const newJobsLast30Days = await Job.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });
    const newApplicationsLast30Days = await Application.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Top sectors
    const topSectors = await Job.aggregate([
      { $group: { _id: '$sector', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Top universities (from youth profiles)
    const topUniversities = await YouthProfile.aggregate([
      { $group: { _id: '$university', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      success: true,
      analytics: {
        users: {
          total: totalUsers,
          youth: totalYouth,
          employers: totalEmployers,
          active: activeUsers,
          verifiedEmployers,
          newLast30Days: newUsersLast30Days,
        },
        jobs: {
          total: totalJobs,
          active: activeJobs,
          filled: filledJobs,
          newLast30Days: newJobsLast30Days,
        },
        applications: {
          total: totalApplications,
          pending: pendingApplications,
          accepted: acceptedApplications,
          newLast30Days: newApplicationsLast30Days,
        },
        mentorship: {
          total: totalMentorshipSessions,
          completed: completedSessions,
        },
        skillTests: {
          total: totalSkillTests,
        },
        revenue: {
          total: totalRevenue[0]?.total || 0,
          thisMonth: monthlyRevenue[0]?.total || 0,
        },
        topSectors: topSectors.map((s) => ({ sector: s._id, count: s.count })),
        topUniversities: topUniversities.map((u) => ({ university: u._id, count: u.count })),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message,
    });
  }
};

// @desc    Get reports (detailed analytics by date range)
// @route   GET /api/admin/reports
// @access  Private (Admin)
export const getReports = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    // User growth over time
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            role: '$role',
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Job postings over time
    const jobGrowth = await Job.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Application conversion rates
    const applicationStats = await Application.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      reports: {
        period: {
          start,
          end,
        },
        userGrowth,
        jobGrowth,
        applicationStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating reports',
      error: error.message,
    });
  }
};

// @desc    Delete user (with cascade)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
      });
    }

    // Delete associated profile
    if (user.role === 'youth') {
      await YouthProfile.deleteOne({ user: user._id });
      await Application.deleteMany({ applicant: user._id });
      await MentorshipSession.deleteMany({ mentee: user._id });
    } else if (user.role === 'employer') {
      await EmployerProfile.deleteOne({ user: user._id });
      await Job.deleteMany({ employer: user._id });
      await MentorshipSession.deleteMany({ mentor: user._id });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message,
    });
  }
};
