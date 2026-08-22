import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

/**
 * Integration test. Needs the database from docker-compose.yml running and
 * .env.local filled in.
 *
 * MERGE is only idempotent if every pattern merges on identity alone. This runs
 * the seed twice and asserts the graph did not grow — the one check that fails
 * the moment someone writes `MERGE (a)-[:REL {prop: x}]->(b)`.
 */
function runSeed(): { nodes: number; relationships: number } {
  const output = execFileSync('npx', ['tsx', 'scripts/seed.ts'], {
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });

  const match = output.match(/Seed complete\. (\d+) nodes, (\d+) relationships\./);
  if (!match) throw new Error(`Seed did not report counts. Output:\n${output}`);

  return { nodes: Number(match[1]), relationships: Number(match[2]) };
}

describe('seed', () => {
  it('creates the same graph however many times it runs', () => {
    const first = runSeed();
    const second = runSeed();

    expect(first.nodes).toBeGreaterThan(0);
    expect(first.relationships).toBeGreaterThan(0);
    expect(second).toEqual(first);
  }, 120_000);
});
