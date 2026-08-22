import 'server-only';
import neo4j, { Driver, Neo4jError } from 'neo4j-driver';
import { getEnv } from '@/server/config/env';
import { AppError, ErrorCode } from '@/lib/errors/app-error';

/**
 * Connection lifecycle
 * ────────────────────
 *   getDriver() ──► globalThis cache ──► neo4j.driver(...)   (once per process)
 *        │                                    │
 *        └── survives Next dev HMR ───────────┘
 *
 *   readQuery() ──► driver.executeQuery(...)  (opens, runs, RETRIES, closes)
 *        │
 *        └── any throw ──► toAppError() ──► one of six codes
 *
 * Reads use executeQuery so a transient failure — a serverless instance waking
 * with a dead socket — is retried instead of surfacing as DATABASE_UNAVAILABLE.
 * The seed opens an explicit session and closes it in `finally`, because it
 * needs one atomic write transaction (see scripts/seed.ts).
 */

const globalForNeo4j = globalThis as unknown as { skillPathDriver?: Driver };

export function getDriver(): Driver {
  if (globalForNeo4j.skillPathDriver) return globalForNeo4j.skillPathDriver;

  const env = getEnv();
  const driver = neo4j.driver(env.COGNODB_URI, neo4j.auth.basic(env.COGNODB_USERNAME, env.COGNODB_PASSWORD), {
    // Serverless: several instances each holding a pool can exhaust a small
    // instance's connection cap, so keep each pool tight.
    maxConnectionPoolSize: 5,
    connectionAcquisitionTimeout: 10_000,
    // proficiency/strength come back as JS numbers rather than driver Integers.
    disableLosslessIntegers: true,
  });

  globalForNeo4j.skillPathDriver = driver;
  return driver;
}

/** Runs a read query and returns plain row objects. Every call is parameterized. */
export async function readQuery<T>(cypher: string, params: Record<string, unknown> = {}): Promise<T[]> {
  try {
    const { records } = await getDriver().executeQuery(cypher, params, { routing: neo4j.routing.READ });
    return records.map((record) => record.toObject() as T);
  } catch (error) {
    throw toAppError(error);
  }
}

/** Like readQuery, but a missing row is a NOT_FOUND rather than an empty array. */
export async function readOne<T>(cypher: string, params: Record<string, unknown>, notFoundMessage: string): Promise<T> {
  const rows = await readQuery<T>(cypher, params);
  if (rows.length === 0) throw new AppError(ErrorCode.NOT_FOUND, notFoundMessage);
  return rows[0];
}

/**
 * The single place an unknown throw becomes one of the six codes. Routes call
 * errorResponse() with the result; the original cause never leaves the server.
 */
export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error;

  if (error instanceof Neo4jError) {
    const code = error.code ?? '';
    if (code === neo4j.error.SERVICE_UNAVAILABLE || code === neo4j.error.SESSION_EXPIRED) {
      return new AppError(ErrorCode.DATABASE_UNAVAILABLE, 'The skills database is not responding right now.', {
        cause: error,
      });
    }
    if (code.startsWith('Neo.ClientError')) {
      return new AppError(ErrorCode.QUERY_FAILED, 'That request could not be completed.', { cause: error });
    }
    return new AppError(ErrorCode.QUERY_FAILED, 'That request could not be completed.', { cause: error });
  }

  // Driver connection refusals surface as plain Errors before a session exists.
  if (error instanceof Error && /ECONNREFUSED|ENOTFOUND|ETIMEDOUT/.test(error.message)) {
    return new AppError(ErrorCode.DATABASE_UNAVAILABLE, 'The skills database is not responding right now.', {
      cause: error,
    });
  }

  return new AppError(ErrorCode.UNKNOWN_ERROR, 'Something went wrong.', { cause: error });
}
