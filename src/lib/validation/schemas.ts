import { z } from 'zod';

/** Route params are user input. Ids are seeded slugs, so keep them boring. */
export const idParam = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9-]+$/, 'must be a lowercase slug');

export const personIdParams = z.object({ personId: idParam });
export const skillIdParams = z.object({ skillId: idParam });
