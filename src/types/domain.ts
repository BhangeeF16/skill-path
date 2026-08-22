/**
 * Application types. Repositories map Neo4j driver records into these; nothing
 * raw from the driver crosses the repository boundary.
 */

export type Importance = 'core' | 'important' | 'supporting';

export interface Domain {
  id: string;
  name: string;
}

export interface Role {
  id: string;
  title: string;
  level: string;
  domain: Domain | null;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
}

/** A skill the person holds, with how well they hold it (1-5). */
export interface PersonSkill extends Skill {
  proficiency: number;
}

/** A skill the target role requires, with how badly it needs it. */
export interface RequiredSkill {
  id: string;
  name: string;
  importance: Importance;
}

export interface Tool {
  id: string;
  name: string;
  category: string;
  /** SUPPORTS.type — e.g. 'library', 'platform'. */
  type: string;
  /** SUPPORTS.suitableFor — e.g. 'learning', 'production'. */
  suitableFor: string;
}

/** One PREREQUISITE_FOR hop, flattened out of a variable-length path. */
export interface PrerequisiteStep {
  id: string;
  name: string;
  /** Hops from this prerequisite to the skill it unlocks. 1 = direct. */
  depth: number;
  strength: number;
  tools: Tool[];
}

/**
 * A required skill the person does not have, plus everything the graph knows
 * about how to close it. `reason` carries facts, not prose — the UI writes the
 * sentence (see README, "Explainability").
 */
export interface SkillGap {
  id: string;
  name: string;
  importance: Importance;
  prerequisites: PrerequisiteStep[];
  reason: {
    targetRoleTitle: string;
    importance: Importance;
    /** Deepest prerequisite — where to start learning. Null if none exist. */
    startWith: string | null;
  };
}

export interface Person {
  id: string;
  name: string;
}

/** A seeded career transition, used to populate the role selectors. */
export interface Profile {
  personId: string;
  personName: string;
  currentRole: Role;
  targetRole: Role;
}

export interface SkillPath {
  person: Person;
  currentRole: Role;
  targetRole: Role;
  currentSkills: PersonSkill[];
  targetRequirements: RequiredSkill[];
  matchingSkills: Skill[];
  gaps: SkillGap[];
  /** matchingSkills.length / targetRequirements.length, 0-1. */
  coverage: number;
}

/** Prerequisites and tools for one skill, for the detail panel. */
export interface SkillDetail {
  skill: Skill;
  prerequisites: PrerequisiteStep[];
  tools: Tool[];
}
