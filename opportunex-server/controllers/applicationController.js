import { validationResult } from 'express-validator';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import YouthProfile from '../models/YouthProfile.js';
import { sendEmail, emailTemplates } from '../utils/sendEmail.js';
import { sendSMS, smsTemplates } from '../utils/sendSMS.js';
import User from '../models/User.js';

// @desc    Apply to a job
// @route   POST /api/applications
// @access  Private (Youth)
export const applyToJob = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { job: jobId, coverLetter, cv } = req.body;

    // Check if job exists and is open
    const job = await Job.findById(jobId).populate('employer');
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (job.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'This job is no longer accepting applications',
      });
    }

    // Check if application deadline has passed
    if (job.applicationDeadline && new Date() > job.applicationDeadline) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline has passed',
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this job',
      });
    }

    // Get youth profile CV if not provided
    let finalCV = cv;
    if (!finalCV) {
      const youthProfile = await YouthProfile.findOne({ user: req.user.id });
      finalCV = youthProfile?.cv || '';
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
      coverLetter,
      cv: finalCV,
    });

    // Update job applications count
    job.applicationsCount += 1;
    await job.save();

    // Send email to applicant
    const applicant = await User.findById(req.user.id);
    await sendEmail({
      email: applicant.email,
      subject: 'Application Submitted',
      html: emailTemplates.applicationReceived(job.title, applicant.firstName),
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting application',
      error: error.message,
    });
  }
};

// @desc    Get youth's own applications
// @route   GET /api/applications/my-applications
// @access  Private (Youth)
export const getMyApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { applicant: req.user.id };
    if (status) query.status = status;

    const applications = await Application.find(query)
      .populate({
        path: 'job',
        populate: {
          path: 'employer',
          select: 'firstName lastName avatar',
        },
      })
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Application.countDocuments(query);

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message,
    });
  }
};

// @desc    Get all applications for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer - job owner)
export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status, page = 1, limit = 20 } = req.query;

    // Check if job exists and user is the owner
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these applications',
      });
    }

    const query = { job: jobId };
    if (status) query.status = status;

    const applications = await Application.find(query)
      .populate({
        path: 'applicant',
        select: 'firstName lastName avatar email phone',
      })
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get youth profiles for each applicant
    const applicationsWithProfiles = await Promise.all(
      applications.map(async (app) => {
        const youthProfile = await YouthProfile.findOne({ user: app.applicant._id }).lean();
        return {
          ...app,
          youthProfile,
        };
      })
    );

    const count = await Application.countDocuments(query);

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      applications: applicationsWithProfiles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching job applications',
      error: error.message,
    });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Employer)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, employerNotes, interviewDate, interviewDetails } = req.body;

    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('applicant');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check if user is the job owner
    if (application.job.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application',
      });
    }

    // Update application
    application.status = status;
    if (employerNotes) application.employerNotes = employerNotes;
    if (interviewDate) application.interviewDate = interviewDate;
    if (interviewDetails) application.interviewDetails = interviewDetails;

    await application.save();

    // Send email + SMS notification to applicant
    await sendEmail({
      email: application.applicant.email,
      subject: 'Application Status Update',
      html: emailTemplates.applicationStatusUpdate(application.job.title, status),
    });

    if (application.applicant.phone) {
      sendSMS(
        application.applicant.phone,
        smsTemplates.applicationStatusUpdate(application.job.title, status)
      ).catch(() => {}); // fire-and-forget, don't block response
    }

    res.json({
      success: true,
      message: 'Application updated successfully',
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating application',
      error: error.message,
    });
  }
};

// @desc    Withdraw application
// @route   DELETE /api/applications/:id
// @access  Private (Youth - applicant)
export const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check if user is the applicant
    if (application.applicant.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to withdraw this application',
      });
    }

    // Can't withdraw if already accepted or interviewed
    if (['accepted', 'interviewed'].includes(application.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot withdraw application at this stage',
      });
    }

    await application.deleteOne();

    // Update job applications count
    const job = await Job.findById(application.job);
    if (job) {
      job.applicationsCount -= 1;
      await job.save();
    }

    res.json({
      success: true,
      message: 'Application withdrawn successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error withdrawing application',
      error: error.message,
    });
  }
};

// @desc    Get single application details
// @route   GET /api/applications/:id
// @access  Private
export const getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('applicant', '-password');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check authorization (applicant or job owner)
    const isApplicant = application.applicant._id.toString() === req.user.id;
    const isJobOwner = application.job.employer.toString() === req.user.id;

    if (!isApplicant && !isJobOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application',
      });
    }

    // Get youth profile if user is employer
    let youthProfile;
    if (isJobOwner) {
      youthProfile = await YouthProfile.findOne({ user: application.applicant._id });
    }

    res.json({
      success: true,
      application,
      ...(youthProfile && { youthProfile }),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching application',
      error: error.message,
    });
  }
};
