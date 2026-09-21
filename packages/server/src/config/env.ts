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
   const invalidKeys = [...new Set(parsed.error.issues.map((issue) => issue.path.join('.')))];
   console.error(
      `Invalid environment variables: ${invalidKeys.join(', ')}. Set them in your hosting environment or local .env file and restart.`
   );
   process.exit(1);
}

export const env = parsed.data;
export type Env = z.infer<typeof envSchema>;
