/**
 * Idempotent seed. Safe to run any number of times: every node and relationship
 * is MERGEd on its identity only, with properties applied via SET afterwards.
 *
 * The trap this avoids: `MERGE (p)-[:HAS_SKILL {proficiency: 3}]->(s)` matches
 * on the property, so changing a 3 to a 4 creates a SECOND edge. Identity in
 * the pattern, properties in the SET — always.
 *
 * Run: npm run seed
 */
import 'dotenv/config';
import { config as loadEnv } from 'dotenv';
import neo4j from 'neo4j-driver';
import {
  DOMAINS,
  PERSONS,
  PREREQUISITES,
  ROLES,
  ROLE_REQUIREMENTS,
  SKILLS,
  TOOLS,
  TOOL_SUPPORTS,
} from './seed-data';

loadEnv({ path: '.env.local', override: true });

const uri = process.env.COGNODB_URI;
const username = process.env.COGNODB_USERNAME;
const password = process.env.COGNODB_PASSWORD;

if (!uri || !username || !password) {
  console.error('Missing COGNODB_URI / COGNODB_USERNAME / COGNODB_PASSWORD. Copy .env.example to .env.local.');
  process.exit(1);
}

const CONSTRAINTS = ['Person', 'Role', 'Domain', 'Skill', 'Tool'].map(
  (label) => `CREATE CONSTRAINT ${label.toLowerCase()}_id_unique IF NOT EXISTS
              FOR (n:${label}) REQUIRE n.id IS UNIQUE`,
);

const STATEMENTS: { cypher: string; params: Record<string, unknown> }[] = [
  {
    cypher: `UNWIND $rows AS row
             MERGE (d:Domain {id: row.id})
             SET d.name = row.name`,
    params: { rows: DOMAINS },
  },
  {
    cypher: `UNWIND $rows AS row
             MERGE (r:Role {id: row.id})
             SET r.title = row.title, r.level = row.level
             WITH r, row
             MATCH (d:Domain {id: row.domainId})
             MERGE (r)-[:BELONGS_TO]->(d)`,
    params: { rows: ROLES },
  },
  {
    cypher: `UNWIND $rows AS row
             MERGE (s:Skill {id: row.id})
             SET s.name = row.name, s.description = row.description`,
    params: { rows: SKILLS },
  },
  {
    cypher: `UNWIND $rows AS row
             MERGE (t:Tool {id: row.id})
             SET t.name = row.name, t.category = row.category`,
    params: { rows: TOOLS },
  },
  {
    cypher: `UNWIND $rows AS row
             MATCH (skill:Skill {id: row.skillId})
             MATCH (role:Role {id: row.roleId})
             MERGE (skill)-[r:REQUIRED_BY]->(role)
             SET r.importance = row.importance`,
    params: { rows: ROLE_REQUIREMENTS },
  },
  {
    cypher: `UNWIND $rows AS row
             MATCH (from:Skill {id: row.fromId})
             MATCH (to:Skill {id: row.toId})
             MERGE (from)-[r:PREREQUISITE_FOR]->(to)
             SET r.strength = row.strength`,
    params: { rows: PREREQUISITES },
  },
  {
    cypher: `UNWIND $rows AS row
             MATCH (tool:Tool {id: row.toolId})
             MATCH (skill:Skill {id: row.skillId})
             MERGE (tool)-[s:SUPPORTS]->(skill)
             SET s.type = row.type, s.suitableFor = row.suitableFor`,
    params: { rows: TOOL_SUPPORTS },
  },
  {
    cypher: `UNWIND $rows AS row
             MERGE (p:Person {id: row.id})
             SET p.name = row.name
             WITH p, row
             MATCH (current:Role {id: row.currentRoleId})
             MERGE (p)-[w:WORKING_AS]->(current)
             SET w.since = row.since
             WITH p, row
             MATCH (target:Role {id: row.targetRoleId})
             MERGE (p)-[:TARGETING_TO]->(target)`,
    params: { rows: PERSONS },
  },
  {
    cypher: `UNWIND $rows AS person
             UNWIND person.skills AS skill
             MATCH (p:Person {id: person.id})
             MATCH (s:Skill {id: skill.skillId})
             MERGE (p)-[h:HAS_SKILL]->(s)
             SET h.proficiency = skill.proficiency`,
    params: { rows: PERSONS },
  },
];

const COUNTS = `
MATCH (n) WITH count(n) AS nodes
MATCH ()-[r]->() RETURN nodes, count(r) AS relationships
`;

async function main() {
  const driver = neo4j.driver(uri!, neo4j.auth.basic(username!, password!), { disableLosslessIntegers: true });
  const session = driver.session({ defaultAccessMode: neo4j.session.WRITE });

  try {
    // Constraint DDL is the one statement whose dialect support is unverified
    // on CognoDB. A missing constraint makes the seed slower, not wrong.
    for (const cypher of CONSTRAINTS) {
      try {
        await session.run(cypher);
      } catch (error) {
        console.warn(`Skipped a uniqueness constraint: ${(error as Error).message}`);
      }
    }

    // One transaction: a partial graph is worse than no graph.
    await session.executeWrite(async (tx) => {
      for (const statement of STATEMENTS) {
        await tx.run(statement.cypher, statement.params);
      }
    });

    const result = await session.run(COUNTS);
    const { nodes, relationships } = result.records[0].toObject();
    console.log(`Seed complete. ${nodes} nodes, ${relationships} relationships.`);
    console.log('Run it again — the counts should not move.');
  } finally {
    await session.close();
    await driver.close();
  }
}

main().catch((error) => {
  console.error('Seed failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
