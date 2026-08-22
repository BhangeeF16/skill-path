import { useEffect, useState } from 'react';
import { asUiError, getJson, type Async } from '@/lib/api-client';
import { ErrorCard, LoadingCard } from '@/components/states';
import type { PrerequisiteStep, SkillDetail, Tool } from '@/types/domain';

/**
 * The prerequisite chain as a readable vertical path — deepest first, because
 * that is the order you would learn it in. Each step names the tools that help.
 */
export function SkillDetailPanel({ skillId, onClose }: { skillId: string; onClose: () => void }) {
  const [state, setState] = useState<Async<SkillDetail>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    getJson<SkillDetail>(`/api/skills/${skillId}`)
      .then((data) => {
        if (!cancelled) setState({ status: 'ready', data });
      })
      .catch((caught) => {
        if (!cancelled) setState({ status: 'error', error: asUiError(caught) });
      });

    return () => {
      cancelled = true;
    };
  }, [skillId, attempt]);

  function retry() {
    setState({ status: 'loading' });
    setAttempt((value) => value + 1);
  }

  const detail = state.status === 'ready' ? state.data : null;

  return (
    <aside className="rounded-xl border border-black/10 p-6 dark:border-white/15">
      <div className="mb-4 flex items-start justify-between gap-4">
        <h2 className="text-lg font-semibold">{detail?.skill.name ?? 'Skill path'}</h2>
        <button type="button" onClick={onClose} className="text-sm underline opacity-70 hover:opacity-100">
          Close
        </button>
      </div>

      {state.status === 'loading' ? <LoadingCard label="Tracing the prerequisite chain…" /> : null}
      {state.status === 'error' ? <ErrorCard error={state.error} onRetry={retry} /> : null}

      {detail ? (
        <div className="space-y-6">
          <p className="text-sm opacity-75">{detail.skill.description}</p>

          <div>
            <h3 className="mb-3 text-sm font-medium uppercase tracking-wide opacity-60">Learn in this order</h3>
            {detail.prerequisites.length === 0 ? (
              <p className="text-sm opacity-70">Nothing gates this skill. Start on it directly.</p>
            ) : (
              <ol>
                {detail.prerequisites.map((step) => (
                  <Step key={step.id} step={step} />
                ))}
                <li className="flex gap-4">
                  <Rail last />
                  <div className="pb-1">
                    <p className="font-medium">{detail.skill.name}</p>
                    <p className="text-xs opacity-60">The skill you are closing</p>
                  </div>
                </li>
              </ol>
            )}
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium uppercase tracking-wide opacity-60">Tools that help</h3>
            {detail.tools.length === 0 ? (
              <p className="text-sm opacity-70">No tools recorded for this skill.</p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {detail.tools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </aside>
  );
}

function Step({ step }: { step: PrerequisiteStep }) {
  return (
    <li className="flex gap-4">
      <Rail />
      <div className="pb-5">
        <p className="font-medium">{step.name}</p>
        <p className="text-xs opacity-60">
          {step.depth === 1 ? 'Directly unlocks the next step' : `${step.depth} steps away`} · strength{' '}
          {step.strength.toFixed(1)}
        </p>
        {step.tools.length > 0 ? (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {step.tools.map((tool) => (
              <span key={tool.id} className="rounded-full bg-black/[0.06] px-2 py-0.5 text-xs dark:bg-white/10">
                {tool.name}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </li>
  );
}

/** The dot-and-line spine of the vertical path. */
function Rail({ last = false }: { last?: boolean }) {
  return (
    <div className="flex w-3 shrink-0 flex-col items-center">
      <span className={`mt-1.5 h-3 w-3 rounded-full ${last ? 'bg-emerald-500' : 'bg-foreground/40'}`} />
      {last ? null : <span className="w-px flex-1 bg-foreground/20" />}
    </div>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <div className="rounded-lg border border-black/10 p-3 dark:border-white/15">
      <p className="font-medium">{tool.name}</p>
      <p className="mt-0.5 text-xs opacity-60">
        {tool.category} · {tool.type} · good for {tool.suitableFor}
      </p>
    </div>
  );
}
