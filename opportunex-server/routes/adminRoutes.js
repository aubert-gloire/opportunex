import express from 'express';
import {
  getAllUsers,
  updateUserStatus,
  verifyEmployer,
  getAnalytics,
  getReports,
  deleteUser,
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';

const router = express.Router();

// All admin-only routes
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.put('/employers/:id/verify', verifyEmployer);
router.get('/analytics', getAnalytics);
router.get('/reports', getReports);
router.delete('/users/:id', deleteUser);

export default router;
