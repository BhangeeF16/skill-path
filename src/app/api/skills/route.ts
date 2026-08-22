import { NextResponse } from 'next/server';
import { errorResponse } from '@/server/api/respond';
import { listSkills } from '@/server/repositories/career-path.repository';

/** Every skill, for the "what do you already know" picker. */
export async function GET() {
  try {
    return NextResponse.json({ skills: await listSkills() });
  } catch (error) {
    return errorResponse(error);
  }
}
