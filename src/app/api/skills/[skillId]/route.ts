import { handle } from '@/server/api/respond';
import { skillIdParams } from '@/lib/validation/schemas';
import { buildSkillDetail } from '@/server/services/skill-detail.service';

export async function GET(_request: Request, context: { params: Promise<{ skillId: string }> }) {
  return handle(skillIdParams, await context.params, ({ skillId }) => buildSkillDetail(skillId));
}
