import { handle } from '@/server/api/respond';
import { personIdParams } from '@/lib/validation/schemas';
import { buildSkillPath } from '@/server/services/skill-path.service';

/** In Next 16 dynamic params arrive as a Promise and must be awaited. */
export async function GET(_request: Request, context: { params: Promise<{ personId: string }> }) {
  return handle(personIdParams, await context.params, ({ personId }) => buildSkillPath(personId));
}
