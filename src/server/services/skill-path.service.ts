import { getCurrentRole, getPerson, getPersonSkills, getTargetRole } from '@/server/repositories/person.repository';
import { getMatchingSkills, getSkillPath, getTargetRequirements } from '@/server/repositories/career-path.repository';
import type { Person, PersonSkill, RequiredSkill, Role, Skill, SkillGap, SkillPath } from '@/types/domain';

/**
 *   getPerson ─┐
 *   getCurrentRole ─┤
 *   getTargetRole ──┼─► composeSkillPath() ─► SkillPath
 *   getPersonSkills ┤
 *   getTargetRequirements ┤
 *   getMatchingSkills ────┤
 *   getSkillPath (gaps + prerequisites + tools) ─┘
 *
 * The composition is deterministic: it does arithmetic and ordering on graph
 * facts, and nothing else. No clock, no randomness, no model.
 */
export interface SkillPathInputs {
  person: Person;
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
