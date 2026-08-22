# SkillPath — Coding Agent Project Rules

## Mission

Build a small, production-quality take-home application demonstrating genuine graph data modeling and engineering judgment.

## Non-negotiables

1. Use CognoDB through the official Neo4j driver.
2. Use parameterized Cypher.
3. Never commit secrets.
4. Keep database access server-side.
5. Preserve the five-node graph model unless a change is explicitly justified.
6. Preserve relationship semantics.
7. Keep graph queries readable.
8. Include loading, empty, and error states.
9. Prefer maintainability over cleverness.
10. Do not introduce unnecessary abstractions.

## Graph Contract

Nodes:

- Person
- Role
- Domain
- Skill
- Tool

Relationships:

- WORKING_AS
- TARGETING_TO
- HAS_SKILL
- BELONGS_TO
- REQUIRED_BY
- PREREQUISITE_FOR
- SUPPORTS

## Code Conventions

- TypeScript strict mode.
- Explicit domain types.
- Validate external input at boundaries.
- Keep Cypher in repository/query modules.
- Map Neo4j records into application types.
- Use meaningful variable names.
- Avoid `any`.
- Avoid hidden global mutable state.
- Prefer small functions.
- Handle resources in `finally`.
- Add comments only where intent is not obvious.

## UI Conventions

- Responsive.
- Accessible.
- Clear hierarchy.
- No excessive animation.
- No decorative graph visualization when a simpler path view communicates better.
- Every async view has loading/error/empty states.

## Data Rules

- IDs are stable.
- Seed script is deterministic and rerunnable.
- Relationships should represent meaningful domain facts.
- Do not add fake complexity just to increase graph size.

## Query Rules

- Parameterize user input.
- Bound variable-length traversals.
- Return projections rather than entire graph objects when possible.
- Avoid N+1 graph queries where a reasonable traversal can answer the question.
- Add a comment/documentation entry for every query that demonstrates a key assignment requirement.

## Definition of Done

A feature is done when:

- It works against CognoDB.
- It has typed inputs/outputs.
- It handles failure.
- It has tests where appropriate.
- It does not expose secrets.
- It is reflected in documentation.
- The UI remains coherent.
  s
