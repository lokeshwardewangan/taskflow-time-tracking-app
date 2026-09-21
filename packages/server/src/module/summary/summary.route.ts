import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { getDailySummary } from './summary.controller.js';

const router = Router();

// Protect endpoints securely
router.use(requireAuth);
router.get('/daily', getDailySummary);

export default router;
