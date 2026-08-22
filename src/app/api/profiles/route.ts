import { NextResponse } from 'next/server';
import { errorResponse } from '@/server/api/respond';
import { listProfiles } from '@/server/repositories/person.repository';
import { listRoles } from '@/server/repositories/role.repository';

/** The role selectors: every role in the graph, plus the seeded transitions. */
export async function GET() {
  try {
    const [roles, profiles] = await Promise.all([listRoles(), listProfiles()]);
    return NextResponse.json({ roles, profiles });
  } catch (error) {
    return errorResponse(error);
  }
}
