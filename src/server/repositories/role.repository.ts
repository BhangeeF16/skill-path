import { readQuery } from '@/server/graph/driver';
import * as Q from './cypher';
import { toRole, type RoleRow } from './mappers';
import type { Role } from '@/types/domain';

/** Every role in the graph, ordered by domain then title. */
export async function listRoles(): Promise<Role[]> {
  const rows = await readQuery<RoleRow>(Q.ROLES);
  return rows.map(toRole);
}
