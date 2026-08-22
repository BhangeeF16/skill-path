# SkillPath — Product Requirements Document (PRD)

## 1. Product Overview

**SkillPath** is a graph-powered career transition application. A user identifies their current role, target role, and current skills. The application uses a CognoDB graph to determine the skill gap between the user's current capabilities and the requirements of the target role, then traverses prerequisite and tool relationships to recommend a practical learning path.

The product deliberately focuses on **career skill progression**, not projects, job listings, courses, or generic career advice.

## 2. Assignment Context

This product is designed for the Wexa AI CognoDB take-home assignment.

Required capabilities:
- CognoDB as the graph data layer.
- Official Neo4j driver over Bolt.
- Thoughtful graph model with nodes, typed relationships, and relationship properties.
- Realistic seed data.
- Parameterized Cypher queries.
- At least one 2+ hop traversal.
- At least one query that is awkward in a relational database.
- Functional web application with polished UX.
- Graceful database failure handling.
- Hosted demo and screen recording.
- README containing model diagram, setup, queries, and screenshots.

## 3. Problem

Career transitions are commonly represented as lists of job titles and skills. This makes it difficult to answer relationship-heavy questions such as:
- Which skills does a target role require that a person does not currently have?
- Which existing skills partially overlap with the target?
- What prerequisite skills should be learned first?
- Which tools support those missing skills?
- How does a current role connect to a target role through a sequence of skills?

## 4. Product Goal

Turn a current role + target role + current skill profile into a graph-derived **Skill Path**.

## 5. Target User

Primary user:
- A software/technology professional exploring a move from one role to another.

Secondary/demo persona:
- A technical professional who wants to understand the skill requirements and practical learning sequence for a target role.

## 6. Core User Journey

1. Open SkillPath.
2. Select current role.
3. Select target role.
4. Review current skills.
5. Generate Skill Path.
6. See matched skills and gaps.
7. Inspect prerequisite chains for gaps.
8. Inspect tools that support the missing skills.
9. Understand recommended learning order.

## 7. Functional Requirements

### FR-01 Role selection
The user must be able to select a current role and a target role from graph-backed data.

### FR-02 Current skill profile
The user must be able to view their current skills and proficiency values.

### FR-03 Skill gap analysis
The application must calculate target-role skills that are absent from the user's current skill profile.

### FR-04 Skill overlap
The application must identify skills shared between the user's current profile and target role.

### FR-05 Prerequisite traversal
For missing skills, the application must traverse prerequisite relationships to identify upstream skills.

### FR-06 Tool recommendations
For a selected skill, the application must show tools connected through `SUPPORTS`.

### FR-07 Explainability
The UI must show why a skill is considered a gap and how a recommendation was derived from the graph.

### FR-08 Error handling
The application must show a useful error state when CognoDB is unreachable or a query fails.

### FR-09 Empty states
The application must handle roles with no requirements, users with no skills, and skills with no associated tools/prerequisites.

## 8. Non-Functional Requirements

- Secrets must come from environment variables.
- No secrets committed to Git.
- All Cypher queries must be parameterized.
- Clear application layering.
- Responsive UI.
- Accessible contrast and readable typography.
- Loading states for graph operations.
- Database connections must be reused through a driver/session strategy appropriate to the selected stack.
- Seed data must be reproducible.

## 9. Scope

### In scope
- Person
- Role
- Domain
- Skill
- Tool
- Current role
- Target role
- Current skill proficiency
- Role skill requirements
- Skill prerequisites
- Tool recommendations
- Graph exploration
- Seed data
- Hosted demo

### Out of scope
- Projects
- Job boards
- Job application tracking
- Courses
- Certifications
- Salaries
- Recruiter workflows
- AI-generated career advice
- Social profiles
- External labor-market data

## 10. Success Criteria

A reviewer should be able to:
1. Understand the graph model within two minutes.
2. Run the app against CognoDB.
3. Select a current and target role.
4. See a meaningful skill gap.
5. Follow at least one multi-hop prerequisite/tool path.
6. Understand why graph traversal is useful.
7. Inspect maintainable, parameterized code.

## 11. Graph Model

### Nodes
- `Person`
- `Role`
- `Domain`
- `Skill`
- `Tool`

### Relationships

| From | Relationship | To | Properties |
|---|---|---|---|
| Person | `WORKING_AS` | Role | `since` |
| Person | `TARGETING_TO` | Role | none |
| Person | `HAS_SKILL` | Skill | `proficiency` |
| Role | `BELONGS_TO` | Domain | none |
| Skill | `REQUIRED_BY` | Role | `importance` |
| Skill | `PREREQUISITE_FOR` | Skill | `strength` |
| Tool | `SUPPORTS` | Skill | `type`, `suitableFor` |

## 12. Proficiency Scale

`HAS_SKILL.proficiency`:
- 1 — Awareness
- 2 — Beginner
- 3 — Intermediate
- 4 — Advanced
- 5 — Expert

The initial product uses proficiency as a representation of the user's current skill level. Target role requirements use `importance` rather than a required numeric proficiency.

## 13. Product Principles

- Graph-first, not relational data forced into a graph.
- Small domain model.
- Explainable recommendations.
- Relationship properties carry meaningful semantics.
- No unnecessary entities.
- Every UI recommendation should be traceable to graph relationships.
