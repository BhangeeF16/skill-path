# SkillPath — Cypher Query Catalog

All application queries must use parameters.

## Health

```cypher
RETURN 1 AS ok
```

## Current Role

```cypher
MATCH (p:Person {id: $personId})-[:WORKING_AS]->(role:Role)
RETURN role.id AS id, role.title AS title, role.level AS level
```

## Target Role

```cypher
MATCH (p:Person {id: $personId})-[:TARGETING_TO]->(role:Role)
RETURN role.id AS id, role.title AS title, role.level AS level
```

## Current Skills

```cypher
MATCH (p:Person {id: $personId})-[h:HAS_SKILL]->(skill:Skill)
RETURN skill.id AS id,
       skill.name AS name,
       skill.description AS description,
       h.proficiency AS proficiency
ORDER BY skill.name
```

## Target Requirements

```cypher
MATCH (p:Person {id: $personId})-[:TARGETING_TO]->(role:Role)
MATCH (skill:Skill)-[r:REQUIRED_BY]->(role)
RETURN skill.id AS id,
       skill.name AS name,
       r.importance AS importance
ORDER BY skill.name
```

## Matching Skills

```cypher
MATCH (p:Person {id: $personId})-[:TARGETING_TO]->(role:Role)
MATCH (skill:Skill)-[:REQUIRED_BY]->(role)
WHERE (p)-[:HAS_SKILL]->(skill)
RETURN skill.id AS id, skill.name AS name
ORDER BY skill.name
```

## Missing Skills

```cypher
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
```

## Direct Prerequisites

```cypher
MATCH (skill:Skill {id: $skillId})
MATCH (prerequisite:Skill)-[r:PREREQUISITE_FOR]->(skill)
RETURN prerequisite.id AS id,
       prerequisite.name AS name,
       r.strength AS strength
ORDER BY r.strength DESC
```

## Prerequisite Chain

```cypher
MATCH path=(prerequisite:Skill)-[:PREREQUISITE_FOR*1..3]->(skill:Skill {id: $skillId})
RETURN path
```

## Supporting Tools

```cypher
MATCH (skill:Skill {id: $skillId})
MATCH (tool:Tool)-[s:SUPPORTS]->(skill)
RETURN tool.id AS id,
       tool.name AS name,
       tool.category AS category,
       s.type AS type,
       s.suitableFor AS suitableFor
ORDER BY tool.name
```

## Skill → Prerequisite → Tool

```cypher
MATCH (target:Skill {id: $skillId})
MATCH (prerequisite:Skill)-[:PREREQUISITE_FOR]->(target)
MATCH (tool:Tool)-[:SUPPORTS]->(prerequisite)
RETURN prerequisite.name AS prerequisite,
       tool.name AS tool,
       tool.category AS category
ORDER BY prerequisite, tool
```

## End-to-End Multi-Hop

```cypher
MATCH (p:Person {id: $personId})
      -[:TARGETING_TO]->(targetRole:Role)

MATCH (missing:Skill)-[:REQUIRED_BY]->(targetRole)

WHERE NOT (p)-[:HAS_SKILL]->(missing)

MATCH path=
      (prerequisite:Skill)
      -[:PREREQUISITE_FOR*1..3]->
      (missing)

MATCH (tool:Tool)-[:SUPPORTS]->(prerequisite)

RETURN
  missing.id AS missingSkillId,
  missing.name AS missingSkill,
  prerequisite.id AS prerequisiteId,
  prerequisite.name AS prerequisite,
  tool.id AS toolId,
  tool.name AS tool,
  path
ORDER BY missingSkill, prerequisite, tool
```

This query demonstrates why the graph is useful: the application crosses several relationship types and variable-length prerequisite edges in one traversal.
