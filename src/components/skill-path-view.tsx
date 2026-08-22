import type { Importance, Role, SkillGap, SkillPath } from '@/types/domain';
import { EmptyCard } from '@/components/states';

const ORDER: Importance[] = ['core', 'important', 'supporting'];

const GROUP_LABEL: Record<Importance, string> = {
  core: 'Core — the role does not exist without these',
  important: 'Important — expected of a strong candidate',
  supporting: 'Supporting — rounds out the profile',
};

const BADGE: Record<Importance, string> = {
  core: 'bg-red-500/15 text-red-700 dark:text-red-300',
  important: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  supporting: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
};

export function SkillPathView({
  path,
  selectedSkillId,
  onSelectSkill,
}: {
  path: SkillPath;
  selectedSkillId: string | null;
  onSelectSkill: (skillId: string) => void;
}) {
  return (
    <div className="space-y-8">
      <TransitionHeader path={path} />
      <Coverage
        matching={path.matchingSkills.length}
        required={path.targetRequirements.length}
        coverage={path.coverage}
      />

      <section>
        <h2 className="mb-3 text-lg font-semibold">
          {path.gaps.length === 0 ? 'No gaps' : `${path.gaps.length} skills to close`}
        </h2>

        {path.gaps.length === 0 ? (
          <EmptyCard
            title="You already hold every skill this role requires."
            hint="Pick a further target role to see a longer path."
          />
        ) : (
          <div className="space-y-6">
            {ORDER.map((importance) => {
              const group = path.gaps.filter((gap) => gap.importance === importance);
              if (group.length === 0) return null;

              return (
                <div key={importance}>
                  <h3 className="mb-2 text-sm font-medium uppercase tracking-wide opacity-60">
                    {GROUP_LABEL[importance]}
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {group.map((gap) => (
                      <GapCard
                        key={gap.id}
                        gap={gap}
                        selected={gap.id === selectedSkillId}
                        onSelect={() => onSelectSkill(gap.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <MatchingSkills path={path} />
    </div>
  );
}

function TransitionHeader({ path }: { path: SkillPath }) {
  return (
    <header className="rounded-xl border border-black/10 p-6 dark:border-white/15">
      <p className="text-sm opacity-70">{path.person.name}</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <RoleBlock role={path.currentRole} caption="Today" />
        <span aria-hidden className="text-2xl opacity-40">
          &rarr;
        </span>
        <RoleBlock role={path.targetRole} caption="Target" />
      </div>
    </header>
  );
}

function RoleBlock({ role, caption }: { role: Role; caption: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide opacity-50">{caption}</p>
      <p className="text-xl font-semibold">{role.title}</p>
      {role.domain ? (
        <span className="mt-1 inline-block rounded-full bg-black/[0.06] px-2.5 py-0.5 text-xs dark:bg-white/10">
          {role.domain.name}
        </span>
      ) : null}
    </div>
  );
}

function Coverage({ matching, required, coverage }: { matching: number; required: number; coverage: number }) {
  const percent = Math.round(coverage * 100);

  return (
    <section>
      <div className="mb-1.5 flex items-baseline justify-between text-sm">
        <span className="font-medium">Requirements already met</span>
        <span className="opacity-70">
          {matching} of {required} ({percent}%)
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Requirements already met"
        className="h-2.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/15"
      >
        <div className="h-full rounded-full bg-emerald-500 transition-[width]" style={{ width: `${percent}%` }} />
      </div>
    </section>
  );
}

function GapCard({ gap, selected, onSelect }: { gap: SkillGap; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`rounded-xl border p-4 text-left transition-colors ${
        selected
          ? 'border-foreground/40 bg-black/[0.04] dark:bg-white/[0.06]'
          : 'border-black/10 hover:bg-black/[0.02] dark:border-white/15 dark:hover:bg-white/[0.03]'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium">{gap.name}</span>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${BADGE[gap.importance]}`}>
          {gap.importance}
        </span>
      </div>
      <p className="mt-2 text-sm opacity-75">{explain(gap)}</p>
      <p className="mt-2 text-xs opacity-60">
        {gap.prerequisites.length === 0
          ? 'No prerequisites — you can start on it directly.'
          : `${gap.prerequisites.length} prerequisite${gap.prerequisites.length === 1 ? '' : 's'} to clear first`}
      </p>
    </button>
  );
}

/**
 * The sentence is written here, from the facts the service returned. Nothing is
 * generated: same graph, same words, every time.
 */
function explain(gap: SkillGap): string {
  const base = `${gap.reason.targetRoleTitle} lists ${gap.name} as a ${gap.reason.importance} requirement.`;
  return gap.reason.startWith ? `${base} Start with ${gap.reason.startWith}.` : base;
}

function MatchingSkills({ path }: { path: SkillPath }) {
  if (path.matchingSkills.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">What already counts</h2>
      <div className="flex flex-wrap gap-2">
        {path.matchingSkills.map((skill) => (
          <span
            key={skill.id}
            className="rounded-full bg-emerald-500/12 px-3 py-1 text-sm text-emerald-800 dark:text-emerald-300"
          >
            {skill.name}
          </span>
        ))}
      </div>
    </section>
  );
}
