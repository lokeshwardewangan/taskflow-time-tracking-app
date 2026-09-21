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

export const improveTaskSchema = z
   .strictObject({
      title: z.string().trim().max(200).default(''),
      description: z.string().trim().max(4000).default(''),
   })
   .refine((value) => value.title.length > 0 || value.description.length > 0, {
      message: 'Provide a title or description to improve',
      path: ['title'],
   });

// Keep the provider schema simple; enforce content limits after parsing as well.
export const taskSuggestionSchema = z.strictObject({
   title: z.string(),
   description: z.string(),
});

export const improvedTaskSchema = z.strictObject({
   title: z.string().trim().min(1).max(200),
   description: z.string().trim().min(1).max(4000),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ImproveTaskInput = z.infer<typeof improveTaskSchema>;
export type ImprovedTask = z.infer<typeof improvedTaskSchema>;
