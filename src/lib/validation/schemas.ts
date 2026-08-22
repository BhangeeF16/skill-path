import { z } from 'zod';

/** Route params are user input. Ids are seeded slugs, so keep them boring. */
export const idParam = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9-]+$/, 'must be a lowercase slug');

export const personIdParams = z.object({ personId: idParam });
export const skillIdParams = z.object({ skillId: idParam });
export const transitionParams = z.object({ currentRoleId: idParam, targetRoleId: idParam });

/**
 * `?have=skill-python,skill-sql` — the skills the visitor ticked. Capped
 * because it is unauthenticated input that becomes a Cypher list parameter,
 * and the graph holds far fewer skills than the cap anyway.
 */
export const haveSkillIds = z
  .string()
  .optional()
  .transform((value) => (value ? value.split(',').filter(Boolean) : []))
  .pipe(z.array(idParam).max(100, 'too many skills'));
