# SkillPath — Technical Design Document (TDD)

## 1. Technical Objective

Build a small modular-monolith web application backed by CognoDB using the official Neo4j driver and openCypher.

The system should make graph traversal the central application capability.

## 2. Proposed Stack

- Next.js
- TypeScript
- Tailwind CSS
- Official Neo4j JavaScript driver
- CognoDB Cloud
- Node.js runtime
- Zod for boundary validation
- Vitest for unit/integration tests
- Playwright for critical browser flows

The implementation should avoid adding libraries where native platform capabilities are sufficient.

## 3. Architecture

```text
src/
  app/                    # Next.js routes/pages
  components/             # reusable UI
  features/
    career-path/          # user-facing skill path feature
    roles/                # role discovery
    skills/               # skill exploration
  server/
    config/               # environment validation
    graph/                # driver + session management
    repositories/         # graph query access
    services/             # domain/application logic
  lib/
    validation/
    errors/
  types/
```

## 4. Modular Monolith Principles

- UI components do not execute Cypher.
- API/application services do not construct UI responses from raw database records without mapping.
- Repository modules own Cypher.
- Configuration owns environment parsing.
- Domain/application services combine multiple graph queries when necessary.
- Query parameters are always passed separately from Cypher strings.
- Graph-specific details should not leak throughout the UI.

## 5. Graph Connection

Environment variables:

```text
COGNODB_URI
COGNODB_USERNAME
COGNODB_PASSWORD
```

The driver should be initialized once per server process where appropriate.

Every request should use a session obtained from the driver and close it in a `finally` block.

Errors must be mapped into safe application errors. Credentials and connection strings must never be returned to clients.

## 6. Repository Interfaces

Example conceptual interfaces:

```ts
interface RoleRepository {
  listRoles(): Promise<Role[]>
  getRole(id: string): Promise<Role | null>
}

interface PersonRepository {
  getPerson(id: string): Promise<Person | null>
  getCurrentRole(personId: string): Promise<Role | null>
  getTargetRole(personId: string): Promise<Role | null>
  getSkills(personId: string): Promise<PersonSkill[]>
}

interface CareerPathRepository {
  getTargetRequirements(personId: string): Promise<TargetRequirement[]>
  getSkillGaps(personId: string): Promise<SkillGap[]>
  getPrerequisiteTools(personId: string): Promise<PrerequisiteToolPath[]>
}
```

## 7. Query Design

All queries are parameterized.

Bad:

```ts
`MATCH (p:Person {id: '${personId}'}) RETURN p`
```

Good:

```ts
session.run(
  `MATCH (p:Person {id: $personId}) RETURN p`,
  { personId }
)
```

## 8. Core Queries

### Q1 — Current role

```cypher
MATCH (p:Person {id: $personId})-[:WORKING_AS]->(role:Role)
RETURN role
```

### Q2 — Target role

```cypher
MATCH (p:Person {id: $personId})-[:TARGETING_TO]->(role:Role)
RETURN role
```

### Q3 — Current skills

```cypher
MATCH (p:Person {id: $personId})-[h:HAS_SKILL]->(skill:Skill)
RETURN skill, h.proficiency AS proficiency
```

### Q4 — Target requirements

```cypher
MATCH (p:Person {id: $personId})-[:TARGETING_TO]->(role:Role)
MATCH (skill:Skill)-[r:REQUIRED_BY]->(role)
RETURN skill, r.importance AS importance
```

### Q5 — Skill gaps

```cypher
MATCH (p:Person {id: $personId})-[:TARGETING_TO]->(role:Role)
MATCH (required:Skill)-[r:REQUIRED_BY]->(role)
WHERE NOT (p)-[:HAS_SKILL]->(required)
RETURN required, r.importance AS importance
```

### Q6 — Matching skills

```cypher
MATCH (p:Person {id: $personId})-[:TARGETING_TO]->(role:Role)
MATCH (skill:Skill)-[:REQUIRED_BY]->(role)
WHERE (p)-[:HAS_SKILL]->(skill)
RETURN skill
```

### Q7 — Prerequisites

```cypher
MATCH (missing:Skill {id: $skillId})
MATCH (prerequisite:Skill)-[r:PREREQUISITE_FOR*1..3]->(missing)
RETURN prerequisite, r
```

### Q8 — Supporting tools

```cypher
MATCH (skill:Skill {id: $skillId})
MATCH (tool:Tool)-[s:SUPPORTS]->(skill)
RETURN tool, s.type AS type, s.suitableFor AS suitableFor
```

### Q9 — Multi-hop path

```cypher
MATCH (p:Person {id: $personId})-[:TARGETING_TO]->(role:Role)
MATCH (missing:Skill)-[:REQUIRED_BY]->(role)
MATCH path=(prerequisite:Skill)-[:PREREQUISITE_FOR*1..3]->(missing)
MATCH (tool:Tool)-[:SUPPORTS]->(prerequisite)
RETURN missing, prerequisite, tool, path
```

## 9. Error Handling

Error categories:
- `CONFIGURATION_ERROR`
- `DATABASE_UNAVAILABLE`
- `QUERY_FAILED`
- `NOT_FOUND`
- `VALIDATION_ERROR`
- `UNKNOWN_ERROR`

Client-facing errors must be actionable but must not reveal database credentials, stack traces, or internal driver details.

## 10. Loading and Empty States

Every graph-backed screen needs:
- Initial loading skeleton.
- Empty state.
- Error state.
- Retry action where applicable.

## 11. Seed Strategy

Seed data should include:
- 1 demo person.
- Multiple domains.
- Multiple roles at different seniority levels.
- 20–40 skills.
- 10–20 tools.
- Meaningful prerequisite chains.
- Cross-domain relationships.
- A realistic current-to-target transition.

Seed script must be deterministic and safe to rerun.

## 12. Data Integrity

Recommended uniqueness identifiers:
- `Person.id`
- `Role.id`
- `Domain.id`
- `Skill.id`
- `Tool.id`

Avoid duplicate nodes through stable IDs and `MERGE`.

## 13. Security

- `.env` ignored by Git.
- Environment values only on server.
- No CognoDB URI/password in browser bundles.
- Validate route parameters.
- Parameterize all Cypher.
- Limit returned graph data to what the UI needs.

## 14. Performance

The dataset is intentionally small enough for CognoDB free tier.

Performance practices:
- Return projections instead of entire nodes when possible.
- Bound prerequisite traversal depth.
- Avoid unbounded variable-length traversals.
- Reuse the driver.
- Keep result sets small.
- Add indexes/constraints supported by CognoDB where appropriate.

## 15. Testing

### Unit
- Skill-gap calculation mapping.
- Importance ordering.
- Response mapping.
- Validation.

### Integration
- Repository queries against a configured test database.

### E2E
- Select roles.
- Generate path.
- View gap.
- Open skill.
- View prerequisite/tools.
- Simulate database error.

## 16. Deployment

The application can be deployed on a free-tier Node-compatible platform.

Required environment variables must be configured in the hosting platform.

The CognoDB instance remains running for evaluator access.
