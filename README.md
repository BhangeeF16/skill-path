# SkillPath

Graph-powered career skill gap analysis. Pick where you are and where you want to be; SkillPath compares the target role's requirements against the skills you hold, then walks the prerequisite graph to say what to learn and in what order.

The calculation is graph traversal and arithmetic. No model is involved, so the same graph always produces the same screen.

## Setup

```bash
npm install
cp .env.example .env.local     # already filled in for the local database
docker compose up -d           # CognoDB stand-in on bolt://localhost:7687
npm run seed
npm run dev
```

Open http://localhost:3000. `GET /api/health` answers whether this process can reach the graph.

### Pointing at CognoDB

Nothing in the code names a vendor. Change three environment variables and restart:

```
COGNODB_URI=bolt+s://<instance-id>.databases.cognodb.cloud
COGNODB_USERNAME=<user>
COGNODB_PASSWORD=<password>
```

Credentials are read on the server only, through `src/server/config/env.ts`. `src/server/graph/driver.ts` imports `server-only`, so any accidental import from a client component fails the build rather than shipping a URI to the browser.

## The graph

```
Person -[:WORKING_AS {since}]-> Role
Person -[:TARGETING_TO]-> Role
Person -[:HAS_SKILL {proficiency}]-> Skill
Role   -[:BELONGS_TO]-> Domain
Skill  -[:REQUIRED_BY {importance}]-> Role
Skill  -[:PREREQUISITE_FOR {strength}]-> Skill
Tool   -[:SUPPORTS {type, suitableFor}]-> Skill
```

Five node types, seven relationship types. `Domain` groups the role selectors and labels each role on screen.

## Structure

Modular monolith. One deployable, four layers, dependencies point one way.

```
src/app/            routes and pages         (HTTP in, JSON or HTML out)
src/components/     UI                       (state machines: loading / ready / empty / error)
src/server/
  api/              request and error shaping
  services/         the calculation          (pure, testable)
  repositories/     the only Cypher          (returns typed objects, never driver records)
  graph/            driver lifecycle and error mapping
  config/           environment validation
src/types/          the shared vocabulary
```

`src/server/repositories/cypher.ts` is the single file containing Cypher. Every statement is parameterized; no user input is ever concatenated into a query.

## Why a graph

Two questions are awkward in SQL and natural here.

**Prerequisite chains are variable-length.** "What gates Deep Learning, transitively?" is one pattern:

```cypher
MATCH path = (prereq:Skill)-[:PREREQUISITE_FOR*1..3]->(skill:Skill {id: $skillId})
```

In SQL that is a recursive CTE per query. Here the depth is a number in the pattern.

**Gap detection is a negated pattern.** "Required by the target role, and not held by this person":

```cypher
MATCH (missing:Skill)-[:REQUIRED_BY]->(target)
WHERE NOT (p)-[:HAS_SKILL]->(missing)
```

## Explainability

Every gap card carries a sentence like *"Senior AI Engineer lists Deep Learning as a core requirement. Start with Statistics."*

The service does not write that sentence. It returns the facts behind it — target role title, importance, the deepest unmet prerequisite — as `SkillGap.reason`, and the UI composes the copy. That keeps prose out of the data layer and makes the sentence a rendering concern rather than a query result.

Ordering is explicit everywhere it is visible: gaps by importance then name, prerequisites deepest-first then by strength then name. Nothing depends on the order the database happened to return.

## Deltas from the query catalog

`documents/08-Cypher-Queries.md` defines Q01–Q12. Three shipped queries differ, deliberately:

| Catalog | Shipped | Why |
| --- | --- | --- |
| Q12 (full skill path) | `SKILL_PATH` in `cypher.ts` | Q12 uses required `MATCH` for prerequisites and tools, so a gap with no prerequisites — or a prerequisite with no tool — disappears from the result, and the gap count stops agreeing with the coverage bar. The shipped query uses `OPTIONAL MATCH` and `collect`. Q12 is preserved verbatim in the catalog as the "why a graph" demonstrator. |
| Q09 (prerequisites) | `PREREQUISITES` + `toPrerequisiteSteps` | Q09 returns a raw path with no `ORDER BY`, which is not deterministic. The shipped query flattens the path to one row per prerequisite with `min(length(path))` as depth; the ordering is applied in the repository mapper. |
| Q02 / Q03 (current and target role) | plus `OPTIONAL MATCH (role)-[:BELONGS_TO]->(domain:Domain)` | Otherwise `Domain` is seeded but never read. The projection feeds the domain chips and the grouped selectors. |

## Seeding

`npm run seed` is idempotent. Every node and relationship is merged on identity only, with properties applied in a following `SET`:

```cypher
MERGE (p)-[h:HAS_SKILL]->(s)
SET h.proficiency = row.proficiency
```

Writing `MERGE (p)-[:HAS_SKILL {proficiency: 3}]->(s)` instead would match on the property, so changing a 3 to a 4 would create a second edge. Run the seed as many times as you like; the counts do not move.

Three seeded transitions:

| Person | Today | Target |
| --- | --- | --- |
| Avery Shah | Senior Backend Engineer | Senior AI Engineer |
| Jordan Meyer | Frontend Engineer | Full Stack Engineer |
| Sam Okafor | Data Analyst | Data Engineer |

The role selectors list every role in the graph. A pair with no seeded profile leaves the button disabled — there is no person to compute a path for.

## Errors

Six codes, one response shape, `{ "error": { "code", "message" } }`:

| Code | Status | Means |
| --- | --- | --- |
| `CONFIGURATION_ERROR` | 500 | Environment variables missing or malformed |
| `DATABASE_UNAVAILABLE` | 503 | Cannot reach the graph |
| `QUERY_FAILED` | 500 | The database rejected the query |
| `NOT_FOUND` | 404 | No such person or skill |
| `VALIDATION_ERROR` | 400 | Bad route parameter |
| `UNKNOWN_ERROR` | 500 | Anything else |

Driver errors, connection URIs, and stack traces are logged on the server and never serialized to the client. The UI keys its copy on the code and only offers *Try again* where retrying can help.

## Tests

```bash
npm test
```

- `tests/skill-path.service.test.ts` — the gap and coverage calculation, no database.
- `tests/seed-idempotency.test.ts` — runs the seed twice and asserts the graph did not grow. Needs the database running.

## API

| Route | Returns |
| --- | --- |
| `GET /api/health` | `{ status: "ok" }` or an error code |
| `GET /api/profiles` | Every role, plus the seeded transitions |
| `GET /api/skill-path/:personId` | The full skill path: roles, held skills, requirements, matches, gaps, coverage |
| `GET /api/skills/:skillId` | One skill, its prerequisite chain, and supporting tools |
