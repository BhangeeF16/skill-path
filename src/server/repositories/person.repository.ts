import { readOne, readQuery } from '@/server/graph/driver';
import * as Q from './cypher';
import { toRole, type RoleRow } from './mappers';
import type { Person, PersonSkill, Profile, Role } from '@/types/domain';

export async function getPerson(personId: string): Promise<Person> {
  return readOne<Person>(Q.PERSON, { personId }, 'We could not find that profile.');
}

export async function getCurrentRole(personId: string): Promise<Role> {
  const row = await readOne<RoleRow>(Q.CURRENT_ROLE, { personId }, 'That profile has no current role.');
  return toRole(row);
}

export async function getTargetRole(personId: string): Promise<Role> {
  const row = await readOne<RoleRow>(Q.TARGET_ROLE, { personId }, 'That profile has no target role.');
  return toRole(row);
}

export async function getPersonSkills(personId: string): Promise<PersonSkill[]> {
  return readQuery<PersonSkill>(Q.PERSON_SKILLS, { personId });
}

interface ProfileRow {
  personId: string;
  personName: string;
  currentRoleId: string;
  currentRoleTitle: string;
  currentRoleLevel: string;
  currentDomainId: string | null;
  currentDomainName: string | null;
  targetRoleId: string;
  targetRoleTitle: string;
  targetRoleLevel: string;
  targetDomainId: string | null;
  targetDomainName: string | null;
}

/**
 * The career transitions the graph actually holds. Role selection is scoped to
 * these: picking a current role filters the target list to transitions a seeded
 * Person represents, and the chosen pair resolves to a personId server-side.
 */
export async function listProfiles(): Promise<Profile[]> {
  const rows = await readQuery<ProfileRow>(Q.PROFILES);
  return rows.map((row) => ({
    personId: row.personId,
    personName: row.personName,
    currentRole: toRole({
      id: row.currentRoleId,
      title: row.currentRoleTitle,
      level: row.currentRoleLevel,
      domainId: row.currentDomainId,
      domainName: row.currentDomainName,
    }),
    targetRole: toRole({
      id: row.targetRoleId,
      title: row.targetRoleTitle,
      level: row.targetRoleLevel,
      domainId: row.targetDomainId,
      domainName: row.targetDomainName,
    }),
  }));
}
