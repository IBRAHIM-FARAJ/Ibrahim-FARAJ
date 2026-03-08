import express from 'express';
import { login, getUsers } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/users', verifyToken, getUsers);

export default router;
