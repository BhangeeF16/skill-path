import type { Importance, PrerequisiteStep, Role, Tool } from '@/types/domain';

/** Shape of a role row: the catalog columns plus the domain projection. */
export interface RoleRow {
  id: string;
  title: string;
  level: string;
  domainId: string | null;
  domainName: string | null;
}

export interface ToolRow {
  id: string;
  name: string;
  category: string;
  type: string;
  suitableFor: string;
}

export interface PrerequisiteRow {
  id: string;
  name: string;
  depth: number;
  strength: number | null;
  tools: ToolRow[];
}

export function toRole(row: RoleRow): Role {
  return {
    id: row.id,
    title: row.title,
    level: row.level,
    domain: row.domainId && row.domainName ? { id: row.domainId, name: row.domainName } : null,
  };
}

export function toTool(row: ToolRow): Tool {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    type: row.type,
    suitableFor: row.suitableFor,
  };
}

const IMPORTANCE_RANK: Record<Importance, number> = { core: 1, important: 2, supporting: 3 };

export function importanceRank(importance: Importance): number {
  return IMPORTANCE_RANK[importance] ?? 99;
}

/**
 * Ordering is enforced here rather than in Cypher. The variable-length
 * traversal would need an ORDER BY over a list comprehension, and CognoDB
 * parity for that is unverified — sorting the mapped rows is equivalent and
 * has no dialect risk.
 *
 * Deepest first, because that is the order you learn them in.
 */
export function toPrerequisiteSteps(rows: PrerequisiteRow[]): PrerequisiteStep[] {
  return rows
    .map((row) => ({
      id: row.id,
      name: row.name,
      depth: row.depth,
      strength: row.strength ?? 0,
      tools: (row.tools ?? []).map(toTool).sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => b.depth - a.depth || b.strength - a.strength || a.name.localeCompare(b.name));
}
