import express from 'express';
import { createAssignment, getAssignments } from '../controllers/assignmentController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getAssignments);
router.post('/', createAssignment);

export default router;
