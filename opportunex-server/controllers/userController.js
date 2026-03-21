import path from 'path';
import fs from 'fs';
import User from '../models/User.js';
import YouthProfile from '../models/YouthProfile.js';
import EmployerProfile from '../models/EmployerProfile.js';

// Base URL for locally served upload files
const uploadBaseUrl = (req) =>
  `${req.protocol}://${req.get('host')}/uploads`;

// @desc    Search youth talent profiles (employers)
// @route   GET /api/users/talent
// @access  Private (Employer)
export const searchTalent = async (req, res) => {
  try {
    const { search, university, sector, skills, page = 1, limit = 12 } = req.query;

    const profileQuery = {};
    if (university) profileQuery.university = university;
    if (sector) profileQuery.preferredSectors = sector;
    if (skills) {
      profileQuery.$or = [
        { skills: new RegExp(skills, 'i') },
        { 'verifiedSkills.skill': new RegExp(skills, 'i') },
      ];
    }

    if (search) {
      const matchingUsers = await User.find({
        role: 'youth',
        isActive: true,
        $or: [
          { firstName: new RegExp(search, 'i') },
          { lastName: new RegExp(search, 'i') },
        ],
      }).select('_id');
      profileQuery.user = { $in: matchingUsers.map((u) => u._id) };
    }

    const profiles = await YouthProfile.find(profileQuery)
      .populate('user', 'firstName lastName avatar email isActive')
      .sort('-profileCompletionPercentage')
      .limit(Number(limit))
      .skip((page - 1) * Number(limit));

    const active = profiles.filter((p) => p.user?.isActive);
    const count = await YouthProfile.countDocuments(profileQuery);

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      candidates: active.map((p) => ({
        _id: p.user._id,
        firstName: p.user.firstName,
        lastName: p.user.lastName,
        avatar: p.user.avatar,
        email: p.user.email,
        university: p.university,
        major: p.major,
        location: p.location,
        bio: p.bio,
        skills: p.skills,
        verifiedSkills: p.verifiedSkills,
        profileCompletionPercentage: p.profileCompletionPercentage,
        cv: p.cv,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error searching talent', error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    let profile;
    if (user.role === 'youth') {
      profile = await YouthProfile.findOne({ user: user._id }).populate('user', '-password');
    } else if (user.role === 'employer') {
      profile = await EmployerProfile.findOne({ user: user._id }).populate('user', '-password');
    }

    res.json({
      success: true,
      user,
      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Update user basic info
    if (req.body.firstName) user.firstName = req.body.firstName;
    if (req.body.lastName) user.lastName = req.body.lastName;
    if (req.body.phone) user.phone = req.body.phone;

    await user.save();

    // Update role-specific profile
    let profile;
    if (user.role === 'youth') {
      profile = await YouthProfile.findOneAndUpdate(
        { user: user._id },
        { $set: req.body },
        { new: true, runValidators: true }
      );
    } else if (user.role === 'employer') {
      profile = await EmployerProfile.findOneAndUpdate(
        { user: user._id },
        { $set: req.body },
        { new: true, runValidators: true }
      );
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user,
      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message,
    });
  }
};

// @desc    Upload/update avatar
// @route   PUT /api/users/avatar
// @access  Private
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image',
      });
    }

    const avatarUrl = `${uploadBaseUrl(req)}/avatars/${req.file.filename}`;

    // Delete old avatar file if it was a local upload
    const user = await User.findById(req.user.id);
    if (user.avatar && user.avatar.includes('/uploads/avatars/')) {
      const oldPath = path.join(
        path.dirname(new URL(import.meta.url).pathname),
        '..',
        'uploads',
        'avatars',
        path.basename(user.avatar)
      );
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    user.avatar = avatarUrl;
    await user.save();

    res.json({
      success: true,
      message: 'Avatar updated successfully',
      avatar: avatarUrl,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading avatar',
      error: error.message,
    });
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: error.message,
    });
  }
};

// @desc    Get public profile of a user
// @route   GET /api/users/:id/public
// @access  Private
export const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    let profile;
    if (user.role === 'youth') {
      profile = await YouthProfile.findOne({ user: user._id });
    } else if (user.role === 'employer') {
      profile = await EmployerProfile.findOne({ user: user._id });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        role: user.role,
      },
      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message,
    });
  }
};

// @desc    Upload CV (Youth only)
// @route   PUT /api/users/cv
// @access  Private (Youth)
export const uploadCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    const cvUrl = `${uploadBaseUrl(req)}/cvs/${req.file.filename}`;

    // Delete old CV file if it was a local upload
    const existingProfile = await YouthProfile.findOne({ user: req.user.id });
    if (existingProfile?.cv && existingProfile.cv.includes('/uploads/cvs/')) {
      const oldPath = path.join(
        path.dirname(new URL(import.meta.url).pathname),
        '..',
        'uploads',
        'cvs',
        path.basename(existingProfile.cv)
      );
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const profile = await YouthProfile.findOneAndUpdate(
      { user: req.user.id },
      { cv: cvUrl },
      { new: true }
    );

    res.json({
      success: true,
      message: 'CV uploaded successfully',
      cv: cvUrl,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading CV',
      error: error.message,
    });
  }
};
