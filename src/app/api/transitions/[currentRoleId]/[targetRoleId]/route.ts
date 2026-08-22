import { handle } from '@/server/api/respond';
import { transitionParams } from '@/lib/validation/schemas';
import { buildRoleTransition } from '@/server/services/skill-path.service';

/** In Next 16 dynamic params arrive as a Promise and must be awaited. */
export async function GET(
  _request: Request,
  context: { params: Promise<{ currentRoleId: string; targetRoleId: string }> },
) {
  return handle(transitionParams, await context.params, ({ currentRoleId, targetRoleId }) =>
    buildRoleTransition(currentRoleId, targetRoleId),
  );
}
