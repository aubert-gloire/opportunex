import express from 'express';
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  changePassword,
  getPublicProfile,
  uploadCV,
  searchTalent,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/avatar', protect, uploadSingle('avatar'), uploadAvatar);
router.put('/change-password', protect, changePassword);

// Employer talent search
router.get('/talent', protect, authorize('employer', 'admin'), searchTalent);

router.get('/:id/public', protect, getPublicProfile);

// Youth-only routes
router.put('/cv', protect, authorize('youth'), uploadSingle('cv'), uploadCV);

export default router;
