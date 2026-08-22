import { readOne, readQuery } from '@/server/graph/driver';
import * as Q from './cypher';
import { toRole, toSkillGaps, type RoleRow, type SkillPathRow } from './mappers';
import type { RequiredSkill, Role, Skill, SkillGap } from '@/types/domain';

/** Every role in the graph, ordered by domain then title. */
export async function listRoles(): Promise<Role[]> {
  const rows = await readQuery<RoleRow>(Q.ROLES);
  return rows.map(toRole);
}

export async function getRole(roleId: string): Promise<Role> {
  const row = await readOne<RoleRow>(Q.ROLE_BY_ID, { roleId }, 'We could not find that role.');
  return toRole(row);
}

/** What a role requires, independent of anyone holding it. */
export async function getRoleRequirements(roleId: string): Promise<RequiredSkill[]> {
  return readQuery<RequiredSkill>(Q.ROLE_REQUIREMENTS, { roleId });
}

/**
 * Requirements the baseline already covers: required by both roles, or ticked
 * by the visitor. These are the head start.
 */
export async function getCoveredRequirements(
  currentRoleId: string,
  targetRoleId: string,
  haveSkillIds: string[],
): Promise<Skill[]> {
  const rows = await readQuery<{ id: string; name: string }>(Q.COVERED_REQUIREMENTS, {
    currentRoleId,
    targetRoleId,
    haveSkillIds,
  });
  return rows.map((row) => ({ ...row, description: '' }));
}

/** Gaps between two roles, with prerequisite chains and tools, in one traversal. */
export async function getRoleTransitionPath(
  currentRoleId: string,
  targetRoleId: string,
  targetRoleTitle: string,
  haveSkillIds: string[],
): Promise<SkillGap[]> {
  const rows = await readQuery<SkillPathRow>(Q.ROLE_TRANSITION_PATH, {
    currentRoleId,
    targetRoleId,
    haveSkillIds,
  });
  return toSkillGaps(rows, targetRoleTitle);
}
