import Course from '../models/Course.js';
import CourseEnrollment from '../models/CourseEnrollment.js';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res) => {
  try {
    const { category, sector, level, search, isFree } = req.query;

    const filter = { isPublished: true };

    if (category) filter.category = category;
    if (sector) filter.sector = sector;
    if (level) filter.level = level;
    if (isFree === 'true') filter.price = 0;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const courses = await Course.find(filter)
      .sort({ createdAt: -1 })
      .select('-lessons'); // Don't send full lesson content in list view

    res.json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message,
    });
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check if user is enrolled (if authenticated)
    let enrollment = null;
    if (req.user) {
      enrollment = await CourseEnrollment.findOne({
        user: req.user._id,
        course: course._id,
      });
    }

    res.json({
      success: true,
      course,
      enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching course',
      error: error.message,
    });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Admin only)
export const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating course',
      error: error.message,
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Admin only)
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.json({
      success: true,
      message: 'Course updated successfully',
      course,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating course',
      error: error.message,
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Admin only)
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check if anyone is enrolled
    const enrollmentCount = await CourseEnrollment.countDocuments({ course: course._id });
    if (enrollmentCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete course. ${enrollmentCount} students are enrolled.`,
      });
    }

    await course.deleteOne();

    res.json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting course',
      error: error.message,
    });
  }
};

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private (Youth only)
export const enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course || !course.isPublished) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or not available',
      });
    }

    // Check if already enrolled
    const existingEnrollment = await CourseEnrollment.findOne({
      user: req.user._id,
      course: course._id,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course',
      });
    }

    // Create enrollment
    const enrollment = await CourseEnrollment.create({
      user: req.user._id,
      course: course._id,
    });

    // Increment enrollment count
    course.enrollmentCount += 1;
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      enrollment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error enrolling in course',
      error: error.message,
    });
  }
};

// @desc    Get user's enrolled courses
// @route   GET /api/courses/my-courses
// @access  Private (Youth)
export const getMyCourses = async (req, res) => {
  try {
    const enrollments = await CourseEnrollment.find({ user: req.user._id })
      .populate('course')
      .sort({ lastAccessedAt: -1 });

    res.json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching enrolled courses',
      error: error.message,
    });
  }
};

// @desc    Mark lesson as complete
// @route   POST /api/courses/:id/lessons/:lessonId/complete
// @access  Private (Youth)
export const markLessonComplete = async (req, res) => {
  try {
    const enrollment = await CourseEnrollment.findOne({
      user: req.user._id,
      course: req.params.id,
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'You are not enrolled in this course',
      });
    }

    // Check if lesson is already completed
    const alreadyCompleted = enrollment.completedLessons.some(
      (lesson) => lesson.lessonId.toString() === req.params.lessonId
    );

    if (!alreadyCompleted) {
      enrollment.completedLessons.push({
        lessonId: req.params.lessonId,
        completedAt: new Date(),
      });
    }

    // Update last accessed
    enrollment.lastAccessedAt = new Date();

    // Update progress
    await enrollment.updateProgress();

    res.json({
      success: true,
      message: 'Lesson marked as complete',
      enrollment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error marking lesson complete',
      error: error.message,
    });
  }
};

// @desc    Get course progress
// @route   GET /api/courses/:id/progress
// @access  Private (Youth)
export const getCourseProgress = async (req, res) => {
  try {
    const enrollment = await CourseEnrollment.findOne({
      user: req.user._id,
      course: req.params.id,
    }).populate('course');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'You are not enrolled in this course',
      });
    }

    res.json({
      success: true,
      enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching progress',
      error: error.message,
    });
  }
};

// @desc    Rate a course
// @route   POST /api/courses/:id/rate
// @access  Private (Youth)
export const rateCourse = async (req, res) => {
  try {
    const { score, review } = req.body;

    if (!score || score < 1 || score > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating score must be between 1 and 5',
      });
    }

    const enrollment = await CourseEnrollment.findOne({
      user: req.user._id,
      course: req.params.id,
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'You must be enrolled to rate this course',
      });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Update enrollment rating
    const hadPreviousRating = enrollment.rating && enrollment.rating.score;
    const previousScore = hadPreviousRating ? enrollment.rating.score : 0;

    enrollment.rating = {
      score,
      review: review || '',
      ratedAt: new Date(),
    };
    await enrollment.save();

    // Update course rating
    if (hadPreviousRating) {
      // Update existing rating
      const totalScore = course.rating.average * course.rating.count;
      const newTotalScore = totalScore - previousScore + score;
      course.rating.average = newTotalScore / course.rating.count;
    } else {
      // New rating
      const totalScore = course.rating.average * course.rating.count + score;
      course.rating.count += 1;
      course.rating.average = totalScore / course.rating.count;
    }

    await course.save();

    res.json({
      success: true,
      message: 'Course rated successfully',
      enrollment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error rating course',
      error: error.message,
    });
  }
};

// @desc    Get recommended courses based on user profile
// @route   GET /api/courses/recommended
// @access  Private (Youth)
export const getRecommendedCourses = async (req, res) => {
  try {
    const YouthProfile = (await import('../models/YouthProfile.js')).default;
    const profile = await YouthProfile.findOne({ user: req.user._id });

    if (!profile) {
      // Return popular courses if no profile
      const courses = await Course.find({ isPublished: true })
        .sort({ enrollmentCount: -1 })
        .limit(6)
        .select('-lessons');

      return res.json({
        success: true,
        count: courses.length,
        courses,
      });
    }

    // Find courses matching user's preferred sectors and skills
    const courses = await Course.find({
      isPublished: true,
      $or: [
        { sector: { $in: profile.preferredSectors || [] } },
        { skills: { $in: profile.skills || [] } },
      ],
    })
      .sort({ enrollmentCount: -1, 'rating.average': -1 })
      .limit(6)
      .select('-lessons');

    res.json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recommended courses',
      error: error.message,
    });
  }
};
