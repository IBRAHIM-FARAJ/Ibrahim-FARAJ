import express from 'express';
import { getSamples, createSample, updateSample, deleteSample, updateSampleStatus, getTeams } from '../controllers/sampleController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getSamples);
router.post('/', createSample);
router.put('/:id', updateSample);
router.delete('/:id', deleteSample);
router.put('/:id/status', updateSampleStatus); // changed to /status to differentiate
router.get('/teams/all', getTeams);

export default router;
