import { getPrerequisites, getSkill, getSupportingTools } from '@/server/repositories/career-path.repository';
import type { SkillDetail } from '@/types/domain';

/** One skill, its prerequisite chain (deepest first), and the tools that support it. */
export async function buildSkillDetail(skillId: string): Promise<SkillDetail> {
  const [skill, prerequisites, tools] = await Promise.all([
    getSkill(skillId),
    getPrerequisites(skillId),
    getSupportingTools(skillId),
  ]);

  return { skill, prerequisites, tools };
}
