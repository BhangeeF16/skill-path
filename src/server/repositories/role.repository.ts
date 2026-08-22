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
 * Requirements the two roles share. In a role-to-role transition these are the
 * head start: the target asks for them and the current role already did.
 */
export async function getSharedRequirements(currentRoleId: string, targetRoleId: string): Promise<Skill[]> {
  const rows = await readQuery<{ id: string; name: string }>(Q.SHARED_REQUIREMENTS, {
    currentRoleId,
    targetRoleId,
  });
  return rows.map((row) => ({ ...row, description: '' }));
}

/** Gaps between two roles, with prerequisite chains and tools, in one traversal. */
export async function getRoleTransitionPath(
  currentRoleId: string,
  targetRoleId: string,
  targetRoleTitle: string,
): Promise<SkillGap[]> {
  const rows = await readQuery<SkillPathRow>(Q.ROLE_TRANSITION_PATH, { currentRoleId, targetRoleId });
  return toSkillGaps(rows, targetRoleTitle);
}
