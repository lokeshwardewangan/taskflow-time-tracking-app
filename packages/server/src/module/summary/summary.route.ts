import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import { getDailySummary } from './summary.controller';

const router = Router();

// Protect endpoints securely
router.use(requireAuth);
router.get('/daily', getDailySummary);

export default router;
