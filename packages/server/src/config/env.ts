import 'dotenv/config';
import * as z from 'zod';

const envSchema = z.object({
   PORT: z.coerce.number().int().positive().default(5000),
   LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
   NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
   FRONTEND_URL: z.string().url(),
   DATABASE_URL: z.string().url(),
   JWT_SECRET: z.string().min(10, 'JWT secret must be at least 10 chars'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
   console.error('Invalid environment variables. Fix the values in your .env file and restart.');
   process.exit(1);
}

export const env = parsed.data;
export type Env = z.infer<typeof envSchema>;
