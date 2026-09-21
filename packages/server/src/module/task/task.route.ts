import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { getTasks, getTaskById, createTask, updateTask, deleteTask } from './task.controller.js';

const router = Router();

// Protect all task routes
router.use(requireAuth);

router.get('/', getTasks);
router.post('/', createTask);
router.get('/:id', getTaskById);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
