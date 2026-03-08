import express from 'express';
import { getSamples, createSample, updateSampleStatus } from '../controllers/sampleController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getSamples);
router.post('/', createSample);
router.put('/:id', updateSampleStatus);

export default router;
