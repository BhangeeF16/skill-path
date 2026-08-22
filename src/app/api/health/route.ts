import { NextResponse } from 'next/server';
import { errorResponse } from '@/server/api/respond';
import { readQuery } from '@/server/graph/driver';
import { HEALTH } from '@/server/repositories/cypher';

/**
 * Answers one question: can this process reach the graph right now? Env
 * validation is lazy, so a misconfigured deployment surfaces here as
 * CONFIGURATION_ERROR rather than as a mystery 500 on a page.
 */
export async function GET() {
  try {
    await readQuery(HEALTH);
    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    return errorResponse(error);
  }
}
