import { z } from 'zod';
import { AppError, ErrorCode } from '@/lib/errors/app-error';

const schema = z.object({
  COGNODB_URI: z.string().min(1).regex(/^bolt(\+s|\+ssc)?:\/\//, 'must be a bolt:// or bolt+s:// URI'),
  COGNODB_USERNAME: z.string().min(1),
  COGNODB_PASSWORD: z.string().min(1),
});

export type Env = z.infer<typeof schema>;

let cached: Env | null = null;

/**
 * Validated on first database use, not at module load. Parsing at import time
 * would run during `next build`, which has no credentials on a fresh clone.
 */
export function getEnv(): Env {
  if (cached) return cached;

  const result = schema.safeParse(process.env);
  if (!result.success) {
    // Names only, never values — this string can reach a server log.
    const missing = result.error.issues.map((i) => i.path.join('.')).join(', ');
    throw new AppError(
      ErrorCode.CONFIGURATION_ERROR,
      'The database connection is not configured. Copy .env.example to .env.local and fill it in.',
      { cause: new Error(`Invalid environment variables: ${missing}`) },
    );
  }

  cached = result.data;
  return cached;
}
