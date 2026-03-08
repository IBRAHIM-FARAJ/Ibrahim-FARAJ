import express from 'express';
import { getDashboardStats, getHistory } from '../controllers/dashboardController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/stats', getDashboardStats);
router.get('/history', getHistory);

export default router;
