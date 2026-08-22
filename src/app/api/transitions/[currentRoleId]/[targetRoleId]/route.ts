import { handle } from '@/server/api/respond';
import { haveSkillIds, transitionParams } from '@/lib/validation/schemas';
import { buildRoleTransition } from '@/server/services/skill-path.service';

/**
 * In Next 16 dynamic params arrive as a Promise and must be awaited.
 *
 * `?have=skill-python,skill-sql` widens the baseline with skills the visitor
 * says they already hold. It is parsed before `handle` so a malformed list
 * fails as a VALIDATION_ERROR like any other bad input.
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ currentRoleId: string; targetRoleId: string }> },
) {
  const have = new URL(request.url).searchParams.get('have') ?? undefined;

  return handle(transitionParams, await context.params, ({ currentRoleId, targetRoleId }) =>
    buildRoleTransition(currentRoleId, targetRoleId, haveSkillIds.parse(have)),
  );
}
