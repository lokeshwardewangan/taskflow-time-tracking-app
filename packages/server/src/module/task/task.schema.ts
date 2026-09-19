import { z } from 'zod';

export const createTaskSchema = z.object({
   title: z.string().min(1, 'Title is required').max(200),
   description: z.string().optional(),
   status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional().default('PENDING'),
});

export const updateTaskSchema = z.object({
   title: z.string().min(1).max(200).optional(),
   description: z.string().nullable().optional(),
   status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
});

export const aiGenerateTaskSchema = z.object({
   prompt: z.string().min(3, 'Prompt is required for AI generation'),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type AIGenerateTaskInput = z.infer<typeof aiGenerateTaskSchema>;
