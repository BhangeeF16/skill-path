import { getCurrentRole, getPerson, getPersonSkills, getTargetRole } from '@/server/repositories/person.repository';
import { getMatchingSkills, getSkillPath, getTargetRequirements } from '@/server/repositories/career-path.repository';
import {
  getRole,
  getRoleRequirements,
  getRoleTransitionPath,
  getSharedRequirements,
} from '@/server/repositories/role.repository';
import type { Person, PersonSkill, RequiredSkill, Role, Skill, SkillGap, SkillPath } from '@/types/domain';

/**
 * Two entry points, one composition.
 *
 *   buildRoleTransition(currentRoleId, targetRoleId) ─┐
 *                                                     ├─► composeSkillPath() ─► SkillPath
 *   buildSkillPath(personId) ─────────────────────────┘
 *
 * They differ only in the baseline they subtract from the target's
 * requirements: the current role's own requirements, or one person's skills.
 *
 * The composition is deterministic: it does arithmetic and ordering on graph
 * facts, and nothing else. No clock, no randomness, no model.
 */
export interface SkillPathInputs {
  person: Person | null;
  currentRole: Role;
  targetRole: Role;
  currentSkills: PersonSkill[];
  targetRequirements: RequiredSkill[];
  matchingSkills: Skill[];
  gaps: SkillGap[];
}

export function composeSkillPath(inputs: SkillPathInputs): SkillPath {
  const required = inputs.targetRequirements.length;
  const coverage = required === 0 ? 1 : inputs.matchingSkills.length / required;

  return {
    ...inputs,
    coverage,
  };
}

/**
 * The main flow: how anyone in the current role reaches the target role. No
 * Person is involved, so the baseline is what the current role already
 * requires — a Frontend Engineer is assumed to know what Frontend Engineer
 * asks for, and the path shows only what the target adds on top.
 */
export async function buildRoleTransition(currentRoleId: string, targetRoleId: string): Promise<SkillPath> {
  // Resolved first so an unknown id reports "we could not find that role"
  // rather than an empty path that reads like a missing seed.
  const [currentRole, targetRole] = await Promise.all([getRole(currentRoleId), getRole(targetRoleId)]);

  const [targetRequirements, matchingSkills, gaps] = await Promise.all([
    getRoleRequirements(targetRoleId),
    getSharedRequirements(currentRoleId, targetRoleId),
    getRoleTransitionPath(currentRoleId, targetRoleId, targetRole.title),
  ]);

  return composeSkillPath({
    person: null,
    currentRole,
    targetRole,
    currentSkills: [],
    targetRequirements,
    matchingSkills,
    gaps,
  });
}

/** The case-study flow: one seeded person's own transition. */
export async function buildSkillPath(personId: string): Promise<SkillPath> {
  // Resolved first so an unknown id reports "we could not find that profile"
  // rather than whichever of the parallel queries happened to reject first.
  const person = await getPerson(personId);

  const [currentRole, targetRole, currentSkills, targetRequirements, matchingSkills] = await Promise.all([
    getCurrentRole(personId),
    getTargetRole(personId),
    getPersonSkills(personId),
    getTargetRequirements(personId),
    getMatchingSkills(personId),
  ]);

  // Needs the target role title for each gap's reason, so it runs after.
  const gaps = await getSkillPath(personId, targetRole.title);

  return composeSkillPath({
    person,
    currentRole,
    targetRole,
    currentSkills,
    targetRequirements,
    matchingSkills,
    gaps,
  });
}
