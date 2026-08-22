import Link from 'next/link';
import { ErrorCard } from '@/components/states';
import { PathWithDetail } from '@/components/path-with-detail';
import { personIdParams } from '@/lib/validation/schemas';
import { pageError } from '@/server/api/respond';
import { buildSkillPath } from '@/server/services/skill-path.service';
import type { SkillPath } from '@/types/domain';

/** In Next 16 dynamic params arrive as a Promise and must be awaited. */
export default async function CaseStudy({ params }: { params: Promise<{ personId: string }> }) {
  let path: SkillPath;

  try {
    // Route params are user input even on a page, so they go through the same
    // schema the API route uses.
    const { personId } = personIdParams.parse(await params);
    path = await buildSkillPath(personId);
  } catch (error) {
    return (
      <Shell>
        <ErrorCard error={pageError(error)} />
      </Shell>
    );
  }

  return (
    <Shell>
      <PathWithDetail path={path} />
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link href="/case-studies" className="mb-8 inline-block text-sm underline opacity-70 hover:opacity-100">
        &larr; All case studies
      </Link>
      {children}
    </main>
  );
}
