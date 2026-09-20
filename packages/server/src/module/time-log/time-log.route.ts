import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import { getActiveTimer, startTimer, stopTimer, getLogsByTask } from './time-log.controller';

const router = Router();

// Protect endpoints
router.use(requireAuth);

router.get('/active', getActiveTimer);
router.get('/task/:taskId', getLogsByTask);
router.post('/task/:taskId/start', startTimer);
router.post('/task/:taskId/stop', stopTimer);

export default router;
