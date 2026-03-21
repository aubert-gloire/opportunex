import express from 'express';
import { protect } from '../middleware/auth.js';
import { getExternalJobs, searchYouTubeVideos, searchOpenLibrary } from '../controllers/externalController.js';

const router = express.Router();

router.use(protect);

router.get('/jobs',    getExternalJobs);
router.get('/youtube', searchYouTubeVideos);
router.get('/books',   searchOpenLibrary);

export default router;
