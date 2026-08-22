import { readOne, readQuery } from '@/server/graph/driver';
import * as Q from './cypher';
import {
  importanceRank,
  toPrerequisiteSteps,
  toTool,
  type PrerequisiteRow,
  type ToolRow,
} from './mappers';
import type { Importance, PrerequisiteStep, RequiredSkill, Skill, SkillGap, Tool } from '@/types/domain';

export async function getTargetRequirements(personId: string): Promise<RequiredSkill[]> {
  return readQuery<RequiredSkill>(Q.TARGET_REQUIREMENTS, { personId });
}

export async function getMatchingSkills(personId: string): Promise<Skill[]> {
  const rows = await readQuery<{ id: string; name: string }>(Q.MATCHING_SKILLS, { personId });
  return rows.map((row) => ({ ...row, description: '' }));
}

export async function getSkillGaps(personId: string): Promise<RequiredSkill[]> {
  return readQuery<RequiredSkill>(Q.SKILL_GAPS, { personId });
}

export async function getPrerequisites(skillId: string): Promise<PrerequisiteStep[]> {
  const rows = await readQuery<PrerequisiteRow>(Q.PREREQUISITES, { skillId });
  return toPrerequisiteSteps(rows);
}

export async function getSupportingTools(skillId: string): Promise<Tool[]> {
  const rows = await readQuery<ToolRow>(Q.SUPPORTING_TOOLS, { skillId });
  return rows.map(toTool);
}

export async function getSkill(skillId: string): Promise<Skill> {
  return readOne<Skill>(Q.SKILL_BY_ID, { skillId }, 'We could not find that skill.');
}

interface SkillPathRow {
  id: string;
  name: string;
  importance: Importance;
  prerequisites: PrerequisiteRow[];
}

/**
 * Gaps with their prerequisite chains and tools, in one traversal.
 *
 * `reason` carries the facts behind each gap, not a sentence — the UI writes
 * the copy. `startWith` is the deepest prerequisite, which is where learning
 * begins.
 */
export async function getSkillPath(personId: string, targetRoleTitle: string): Promise<SkillGap[]> {
  const rows = await readQuery<SkillPathRow>(Q.SKILL_PATH, { personId });

  return rows
    .map((row) => {
      const prerequisites = toPrerequisiteSteps(row.prerequisites ?? []);
      return {
        id: row.id,
        name: row.name,
        importance: row.importance,
        prerequisites,
        reason: {
          targetRoleTitle,
          importance: row.importance,
          startWith: prerequisites.length > 0 ? prerequisites[0].name : null,
        },
      };
    })
    .sort((a, b) => importanceRank(a.importance) - importanceRank(b.importance) || a.name.localeCompare(b.name));
}
