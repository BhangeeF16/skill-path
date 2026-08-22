import { readOne, readQuery } from '@/server/graph/driver';
import * as Q from './cypher';
import {
  toPrerequisiteSteps,
  toSkillGaps,
  toTool,
  type PrerequisiteRow,
  type SkillPathRow,
  type ToolRow,
} from './mappers';
import type { PrerequisiteStep, RequiredSkill, Skill, SkillGap, Tool } from '@/types/domain';

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

/** Every skill, for the "what do you already know" picker. */
export async function listSkills(): Promise<Skill[]> {
  return readQuery<Skill>(Q.SKILLS);
}

/** Gaps with their prerequisite chains and tools, in one traversal. */
export async function getSkillPath(personId: string, targetRoleTitle: string): Promise<SkillGap[]> {
  const rows = await readQuery<SkillPathRow>(Q.SKILL_PATH, { personId });
  return toSkillGaps(rows, targetRoleTitle);
}
