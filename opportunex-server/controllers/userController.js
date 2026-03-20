import User from '../models/User.js';
import YouthProfile from '../models/YouthProfile.js';
import EmployerProfile from '../models/EmployerProfile.js';
import cloudinary from '../config/cloudinary.js';

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

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'opportunex/avatars',
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Update user avatar
    const user = await User.findById(req.user.id);
    user.avatar = result.secure_url;
    await user.save();

    res.json({
      success: true,
      message: 'Avatar updated successfully',
      avatar: result.secure_url,
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

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'opportunex/cvs',
          resource_type: 'raw',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Update youth profile
    const profile = await YouthProfile.findOneAndUpdate(
      { user: req.user.id },
      { cv: result.secure_url },
      { new: true }
    );

    res.json({
      success: true,
      message: 'CV uploaded successfully',
      cv: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading CV',
      error: error.message,
    });
  }
};
