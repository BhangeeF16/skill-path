import type { Importance, PrerequisiteStep, Role, SkillGap, Tool } from '@/types/domain';

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

export interface SkillPathRow {
  id: string;
  name: string;
  importance: Importance;
  prerequisites: PrerequisiteRow[];
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
 * Both skill-path traversals — the person one and the role-to-role one —
 * return the same row shape and differ only in what they treat as the
 * baseline, so they share this mapper.
 *
 * `reason` carries the facts behind each gap, not a sentence; the UI writes
 * the copy. `startWith` is the deepest prerequisite, which is where learning
 * begins.
 */
export function toSkillGaps(rows: SkillPathRow[], targetRoleTitle: string): SkillGap[] {
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
