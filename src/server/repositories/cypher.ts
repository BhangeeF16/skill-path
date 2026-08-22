/**
 * Every Cypher statement in the application lives here. Nothing outside this
 * folder writes Cypher, and every statement takes its user input as a $param.
 *
 * Q-numbers refer to documents/08-Cypher-Queries.md. Where a shipped statement
 * differs from the published catalog, the delta is noted above it and explained
 * in the README.
 */

/** Q01 — liveness. */
export const HEALTH = `RETURN 1 AS ok`;

/**
 * Q02 — current role.
 * Delta from catalog: OPTIONAL MATCH on BELONGS_TO so the UI can show the
 * role's domain. Without it, Domain is seeded and never read.
 */
export const CURRENT_ROLE = `
MATCH (p:Person {id: $personId})-[:WORKING_AS]->(role:Role)
OPTIONAL MATCH (role)-[:BELONGS_TO]->(domain:Domain)
RETURN role.id AS id, role.title AS title, role.level AS level,
       domain.id AS domainId, domain.name AS domainName
`;

/** Q03 — target role. Same BELONGS_TO delta as Q02. */
export const TARGET_ROLE = `
MATCH (p:Person {id: $personId})-[:TARGETING_TO]->(role:Role)
OPTIONAL MATCH (role)-[:BELONGS_TO]->(domain:Domain)
RETURN role.id AS id, role.title AS title, role.level AS level,
       domain.id AS domainId, domain.name AS domainName
`;

/** Q04 — the person's current skills. */
export const PERSON_SKILLS = `
MATCH (p:Person {id: $personId})-[h:HAS_SKILL]->(skill:Skill)
RETURN skill.id AS id,
       skill.name AS name,
       skill.description AS description,
       h.proficiency AS proficiency
ORDER BY skill.name
`;

/** Q05 — what the target role requires. */
export const TARGET_REQUIREMENTS = `
MATCH (p:Person {id: $personId})-[:TARGETING_TO]->(role:Role)
MATCH (skill:Skill)-[r:REQUIRED_BY]->(role)
RETURN skill.id AS id,
       skill.name AS name,
       r.importance AS importance
ORDER BY skill.name
`;

/** Q06 — requirements the person already meets. */
export const MATCHING_SKILLS = `
MATCH (p:Person {id: $personId})-[:TARGETING_TO]->(role:Role)
MATCH (skill:Skill)-[:REQUIRED_BY]->(role)
WHERE (p)-[:HAS_SKILL]->(skill)
RETURN skill.id AS id, skill.name AS name
ORDER BY skill.name
`;

/** Q07 — requirements the person is missing. */
export const SKILL_GAPS = `
MATCH (p:Person {id: $personId})-[:TARGETING_TO]->(role:Role)
MATCH (skill:Skill)-[r:REQUIRED_BY]->(role)
WHERE NOT (p)-[:HAS_SKILL]->(skill)
RETURN skill.id AS id,
       skill.name AS name,
       r.importance AS importance
ORDER BY
  CASE r.importance
    WHEN 'core' THEN 1
    WHEN 'important' THEN 2
    ELSE 3
  END,
  skill.name
`;

/** Q10 — tools that support a skill. */
export const SUPPORTING_TOOLS = `
MATCH (skill:Skill {id: $skillId})
MATCH (tool:Tool)-[s:SUPPORTS]->(skill)
RETURN tool.id AS id,
       tool.name AS name,
       tool.category AS category,
       s.type AS type,
       s.suitableFor AS suitableFor
ORDER BY tool.name
`;

/**
 * Q09 flattened. The catalog returns a raw `path`, which cannot cross the
 * repository boundary and carries no ordering. This aggregates the same
 * traversal into one row per prerequisite: shallowest depth wins, strength is
 * taken from the edge leaving the prerequisite, and its tools come along so the
 * detail panel is one round trip.
 */
export const PREREQUISITES = `
MATCH (skill:Skill {id: $skillId})
OPTIONAL MATCH path = (prereq:Skill)-[:PREREQUISITE_FOR*1..3]->(skill)
WITH prereq,
     min(length(path)) AS depth,
     max(relationships(path)[0].strength) AS strength
WHERE prereq IS NOT NULL
OPTIONAL MATCH (tool:Tool)-[sup:SUPPORTS]->(prereq)
WITH prereq, depth, strength,
     collect(DISTINCT CASE WHEN tool IS NULL THEN null ELSE {
       id: tool.id, name: tool.name, category: tool.category,
       type: sup.type, suitableFor: sup.suitableFor
     } END) AS tools
RETURN prereq.id AS id, prereq.name AS name, depth, strength, tools
ORDER BY depth DESC, strength DESC, prereq.name
`;

/** One skill, for the detail panel header. */
export const SKILL_BY_ID = `
MATCH (skill:Skill {id: $skillId})
RETURN skill.id AS id, skill.name AS name, skill.description AS description
`;

/**
 * The composed skill path — gaps, their prerequisite chains, and the tools for
 * each prerequisite, in one traversal.
 *
 * Q12 demonstrates this shape but uses required MATCHes, so a gap with no
 * prerequisites, or a prerequisite with no tool, drops out of the result
 * entirely. Every MATCH after the gap is OPTIONAL here for that reason.
 * Prerequisites the person already holds are excluded — no point telling
 * someone to learn Python when they know Python.
 *
 *   Person ──TARGETING_TO──► Role ◄──REQUIRED_BY── Skill (missing)
 *                                                    ▲
 *                                     PREREQUISITE_FOR*1..3
 *                                                    │
 *                                    Skill (prereq) ◄──SUPPORTS── Tool
 */
export const SKILL_PATH = `
MATCH (p:Person {id: $personId})-[:TARGETING_TO]->(target:Role)
MATCH (missing:Skill)-[req:REQUIRED_BY]->(target)
WHERE NOT (p)-[:HAS_SKILL]->(missing)

OPTIONAL MATCH path = (prereq:Skill)-[:PREREQUISITE_FOR*1..3]->(missing)
WHERE NOT (p)-[:HAS_SKILL]->(prereq)

WITH missing, req, prereq,
     min(length(path)) AS depth,
     max(relationships(path)[0].strength) AS strength

OPTIONAL MATCH (tool:Tool)-[sup:SUPPORTS]->(prereq)

WITH missing, req, prereq, depth, strength,
     collect(DISTINCT CASE WHEN tool IS NULL THEN null ELSE {
       id: tool.id, name: tool.name, category: tool.category,
       type: sup.type, suitableFor: sup.suitableFor
     } END) AS tools

WITH missing, req,
     collect(CASE WHEN prereq IS NULL THEN null ELSE {
       id: prereq.id, name: prereq.name, depth: depth, strength: strength, tools: tools
     } END) AS prerequisites

RETURN missing.id AS id,
       missing.name AS name,
       req.importance AS importance,
       prerequisites
ORDER BY
  CASE req.importance
    WHEN 'core' THEN 1
    WHEN 'important' THEN 2
    ELSE 3
  END,
  missing.name
`;

/**
 * Not in the catalog. The explorer answers "how do I get from role A to role
 * B?" for any pair, with no Person involved, so the baseline is what the
 * current role already requires rather than what one seeded person happens to
 * know. Same traversal as SKILL_PATH with that one substitution.
 *
 *   Role (current) ◄──REQUIRED_BY── Skill        (the baseline, excluded)
 *   Role (target)  ◄──REQUIRED_BY── Skill (missing)
 *                                     ▲
 *                      PREREQUISITE_FOR*1..3
 *                                     │
 *                     Skill (prereq) ◄──SUPPORTS── Tool
 */
export const ROLE_TRANSITION_PATH = `
MATCH (current:Role {id: $currentRoleId})
MATCH (target:Role {id: $targetRoleId})
MATCH (missing:Skill)-[req:REQUIRED_BY]->(target)
WHERE NOT (missing)-[:REQUIRED_BY]->(current)

OPTIONAL MATCH path = (prereq:Skill)-[:PREREQUISITE_FOR*1..3]->(missing)
WHERE NOT (prereq)-[:REQUIRED_BY]->(current)

WITH missing, req, prereq,
     min(length(path)) AS depth,
     max(relationships(path)[0].strength) AS strength

OPTIONAL MATCH (tool:Tool)-[sup:SUPPORTS]->(prereq)

WITH missing, req, prereq, depth, strength,
     collect(DISTINCT CASE WHEN tool IS NULL THEN null ELSE {
       id: tool.id, name: tool.name, category: tool.category,
       type: sup.type, suitableFor: sup.suitableFor
     } END) AS tools

WITH missing, req,
     collect(CASE WHEN prereq IS NULL THEN null ELSE {
       id: prereq.id, name: prereq.name, depth: depth, strength: strength, tools: tools
     } END) AS prerequisites

RETURN missing.id AS id,
       missing.name AS name,
       req.importance AS importance,
       prerequisites
ORDER BY
  CASE req.importance
    WHEN 'core' THEN 1
    WHEN 'important' THEN 2
    ELSE 3
  END,
  missing.name
`;

/** Not in the catalog. What one role requires, independent of any Person. */
export const ROLE_REQUIREMENTS = `
MATCH (skill:Skill)-[r:REQUIRED_BY]->(:Role {id: $roleId})
RETURN skill.id AS id,
       skill.name AS name,
       r.importance AS importance
ORDER BY skill.name
`;

/** Not in the catalog. Requirements both roles share — the head start. */
export const SHARED_REQUIREMENTS = `
MATCH (skill:Skill)-[:REQUIRED_BY]->(:Role {id: $targetRoleId})
WHERE (skill)-[:REQUIRED_BY]->(:Role {id: $currentRoleId})
RETURN skill.id AS id, skill.name AS name
ORDER BY skill.name
`;

/** Not in the catalog. One role, for the transition header. */
export const ROLE_BY_ID = `
MATCH (role:Role {id: $roleId})
OPTIONAL MATCH (role)-[:BELONGS_TO]->(domain:Domain)
RETURN role.id AS id, role.title AS title, role.level AS level,
       domain.id AS domainId, domain.name AS domainName
`;

/**
 * Not in the catalog. The three seeded Person nodes, shown on the case studies
 * page as worked examples of the same traversal.
 */
export const PROFILES = `
MATCH (p:Person)-[:WORKING_AS]->(current:Role)
MATCH (p)-[:TARGETING_TO]->(target:Role)
OPTIONAL MATCH (current)-[:BELONGS_TO]->(currentDomain:Domain)
OPTIONAL MATCH (target)-[:BELONGS_TO]->(targetDomain:Domain)
RETURN p.id AS personId,
       p.name AS personName,
       current.id AS currentRoleId,
       current.title AS currentRoleTitle,
       current.level AS currentRoleLevel,
       currentDomain.id AS currentDomainId,
       currentDomain.name AS currentDomainName,
       target.id AS targetRoleId,
       target.title AS targetRoleTitle,
       target.level AS targetRoleLevel,
       targetDomain.id AS targetDomainId,
       targetDomain.name AS targetDomainName
ORDER BY p.name
`;

/** Not in the catalog. Roles grouped by the domain they belong to. */
export const ROLES = `
MATCH (role:Role)
OPTIONAL MATCH (role)-[:BELONGS_TO]->(domain:Domain)
RETURN role.id AS id, role.title AS title, role.level AS level,
       domain.id AS domainId, domain.name AS domainName
ORDER BY coalesce(domain.name, ''), role.title
`;

/** One person. */
export const PERSON = `
MATCH (p:Person {id: $personId})
RETURN p.id AS id, p.name AS name
`;
