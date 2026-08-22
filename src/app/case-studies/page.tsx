import type { Metadata } from 'next';
import Link from 'next/link';
import { EmptyCard, ErrorCard } from '@/components/states';
import { pageError } from '@/server/api/respond';
import { listProfiles } from '@/server/repositories/person.repository';
import type { Profile } from '@/types/domain';

export const metadata: Metadata = { title: 'Case studies · SkillPath' };

/**
 * Read at request time, not build time. Without this the graph query runs
 * during `next build` and the result is baked in — so a build machine with no
 * database would ship a prerendered error card, and a re-seed would not show
 * up until the next deploy.
 */
export const dynamic = 'force-dynamic';

/**
 * The three seeded Person nodes, shown as worked examples. Same traversal as
 * the explorer, with one person's actual skills as the baseline instead of
 * their current role's requirements — so the two pages together show what the
 * HAS_SKILL edge changes.
 */
export default async function CaseStudies() {
  let profiles: Profile[];

  try {
    profiles = await listProfiles();
  } catch (error) {
    return (
      <Shell>
        <ErrorCard error={pageError(error)} />
      </Shell>
    );
  }

  return (
    <Shell>
      {profiles.length === 0 ? (
        <EmptyCard title="No case studies in the graph yet." hint="Run the seed, then reload this page." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => (
            <Link
              key={profile.personId}
              href={`/case-studies/${profile.personId}`}
              className="rounded-xl border border-black/10 p-5 transition-colors hover:bg-black/[0.02] dark:border-white/15 dark:hover:bg-white/[0.03]"
            >
              <p className="font-medium">{profile.personName}</p>
              <p className="mt-3 text-xs uppercase tracking-wide opacity-50">Today</p>
              <p className="text-sm">{profile.currentRole.title}</p>
              <p className="mt-2 text-xs uppercase tracking-wide opacity-50">Target</p>
              <p className="text-sm">{profile.targetRole.title}</p>
            </Link>
          ))}
        </div>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-10">
        <Link href="/" className="text-sm underline opacity-70 hover:opacity-100">
          &larr; Back to the explorer
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Case studies</h1>
        <p className="mt-2 max-w-2xl opacity-70">
          Three people mid-transition. Each one runs the same comparison as the explorer, but against the skills
          they actually hold rather than what their current role assumes.
        </p>
      </header>

      {children}
    </main>
  );
}
