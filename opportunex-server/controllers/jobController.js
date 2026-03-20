import { validationResult } from 'express-validator';
import Job from '../models/Job.js';
import EmployerProfile from '../models/EmployerProfile.js';
import YouthProfile from '../models/YouthProfile.js';
import Application from '../models/Application.js';

// @desc    Get all jobs with filters
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
  try {
    const {
      sector,
      type,
      location,
      isRemote,
      skills,
      search,
      status = 'open',
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    // Build query
    const query = { status };

    if (sector) query.sector = sector;
    if (type) query.type = type;
    if (location) query.location = new RegExp(location, 'i');
    if (isRemote !== undefined) query.isRemote = isRemote === 'true';
    if (skills) {
      const skillsArray = skills.split(',');
      query.requiredSkills = { $in: skillsArray };
    }
    if (search) {
      query.$text = { $search: search };
    }

    // Execute query with pagination
    const jobs = await Job.find(query)
      .populate('employer', 'firstName lastName avatar')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get employer profiles for company names
    const jobsWithCompany = await Promise.all(
      jobs.map(async (job) => {
        const employerProfile = await EmployerProfile.findOne({ user: job.employer._id }).lean();
        return {
          ...job,
          companyName: employerProfile?.companyName || 'Company',
          companyLogo: employerProfile?.logo || '',
        };
      })
    );

    // Get total count
    const count = await Job.countDocuments(query);

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      jobs: jobsWithCompany,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message,
    });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employer', 'firstName lastName avatar email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Increment views
    job.views += 1;
    await job.save();

    // Get employer profile
    const employerProfile = await EmployerProfile.findOne({ user: job.employer._id });

    res.json({
      success: true,
      job: {
        ...job.toObject(),
        companyName: employerProfile?.companyName || 'Company',
        companyLogo: employerProfile?.logo || '',
        companyDescription: employerProfile?.description || '',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching job',
      error: error.message,
    });
  }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private (Employer)
export const createJob = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    // Check employer subscription limits
    const employerProfile = await EmployerProfile.findOne({ user: req.user.id });
    const activeJobsCount = await Job.countDocuments({
      employer: req.user.id,
      status: 'open',
    });

    // Subscription limits
    const limits = {
      free: 1,
      basic: 5,
      premium: Infinity,
    };

    if (activeJobsCount >= limits[employerProfile.subscription.plan]) {
      return res.status(403).json({
        success: false,
        message: `You have reached the job posting limit for your ${employerProfile.subscription.plan} plan`,
      });
    }

    // Create job
    const job = await Job.create({
      ...req.body,
      employer: req.user.id,
    });

    // Update employer stats
    employerProfile.totalJobsPosted += 1;
    employerProfile.activeJobsCount += 1;
    await employerProfile.save();

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating job',
      error: error.message,
    });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (Employer - owner)
export const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check ownership
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job',
      });
    }

    job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Job updated successfully',
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating job',
      error: error.message,
    });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer - owner)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check ownership
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job',
      });
    }

    await job.deleteOne();

    // Update employer stats
    if (job.status === 'open') {
      const employerProfile = await EmployerProfile.findOne({ user: req.user.id });
      employerProfile.activeJobsCount -= 1;
      await employerProfile.save();
    }

    res.json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting job',
      error: error.message,
    });
  }
};

// @desc    Get employer's own job postings
// @route   GET /api/jobs/my-postings
// @access  Private (Employer)
export const getMyPostings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { employer: req.user.id };
    if (status) query.status = status;

    const jobs = await Job.find(query)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Job.countDocuments(query);

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching job postings',
      error: error.message,
    });
  }
};

// @desc    Get recommended jobs for youth
// @route   GET /api/jobs/recommended
// @access  Private (Youth)
export const getRecommendedJobs = async (req, res) => {
  try {
    const youthProfile = await YouthProfile.findOne({ user: req.user.id });

    if (!youthProfile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    // Build recommendation query
    const matchCriteria = [];

    // Match by skills
    if (youthProfile.skills && youthProfile.skills.length > 0) {
      matchCriteria.push({
        requiredSkills: { $in: youthProfile.skills },
      });
    }

    // Match by sector
    if (youthProfile.preferredSectors && youthProfile.preferredSectors.length > 0) {
      matchCriteria.push({
        sector: { $in: youthProfile.preferredSectors },
      });
    }

    // Match by location
    if (youthProfile.location) {
      matchCriteria.push({
        $or: [
          { location: new RegExp(youthProfile.location, 'i') },
          { isRemote: true },
        ],
      });
    }

    const jobs = await Job.find({
      status: 'open',
      $or: matchCriteria.length > 0 ? matchCriteria : [{}],
    })
      .populate('employer', 'firstName lastName avatar')
      .sort('-createdAt')
      .limit(20);

    // Get employer profiles
    const jobsWithCompany = await Promise.all(
      jobs.map(async (job) => {
        const employerProf = await EmployerProfile.findOne({ user: job.employer._id }).lean();
        return {
          ...job.toObject(),
          companyName: employerProf?.companyName || 'Company',
          companyLogo: employerProf?.logo || '',
        };
      })
    );

    res.json({
      success: true,
      count: jobsWithCompany.length,
      jobs: jobsWithCompany,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recommended jobs',
      error: error.message,
    });
  }
};
