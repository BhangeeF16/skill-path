'use client';

import { useEffect, useState } from 'react';
import { asUiError, getJson, type Async } from '@/lib/api-client';
import { EmptyCard, ErrorCard, LoadingCard } from '@/components/states';
import { PathWithDetail } from '@/components/path-with-detail';
import { RoleSelectors } from '@/components/role-selectors';
import { SkillsPicker } from '@/components/skills-picker';
import type { Role, Skill, SkillPath } from '@/types/domain';

interface Options {
  roles: Role[];
  skills: Skill[];
}

/** The query the path is currently being fetched for. */
interface Transition {
  currentRoleId: string;
  targetRoleId: string;
  have: string[];
}

/**
 * Holds the two async operations the screen needs — the selectors, and the
 * skill path itself — so each renders its own loading, empty, and error state
 * without the other one blanking out.
 */
export function SkillPathExplorer() {
  const [options, setOptions] = useState<Async<Options>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [path, setPath] = useState<Async<SkillPath> | null>(null);
  const [transition, setTransition] = useState<Transition | null>(null);
  const [currentRoleId, setCurrentRoleId] = useState('');
  const [targetRoleId, setTargetRoleId] = useState('');
  const [have, setHave] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getJson<{ roles: Role[] }>('/api/profiles'), getJson<{ skills: Skill[] }>('/api/skills')])
      .then(([roles, skills]) => {
        if (!cancelled) setOptions({ status: 'ready', data: { roles: roles.roles, skills: skills.skills } });
      })
      .catch((caught) => {
        if (!cancelled) setOptions({ status: 'error', error: asUiError(caught) });
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  useEffect(() => {
    if (!transition) return;
    let cancelled = false;

    const query = transition.have.length > 0 ? `?have=${transition.have.join(',')}` : '';

    getJson<SkillPath>(`/api/transitions/${transition.currentRoleId}/${transition.targetRoleId}${query}`)
      .then((data) => {
        if (!cancelled) setPath({ status: 'ready', data });
      })
      .catch((caught) => {
        if (!cancelled) setPath({ status: 'error', error: asUiError(caught) });
      });

    return () => {
      cancelled = true;
    };
  }, [transition, attempt]);

  function retryOptions() {
    setOptions({ status: 'loading' });
    setAttempt((value) => value + 1);
  }

  function retryPath() {
    setPath({ status: 'loading' });
    setAttempt((value) => value + 1);
  }

  function toggleSkill(skillId: string) {
    setHave((current) =>
      current.includes(skillId) ? current.filter((id) => id !== skillId) : [...current, skillId],
    );
  }

  // The ticked skills only take effect on submit, so the path on screen always
  // matches the selections that produced it.
  function showPath(from: string, to: string) {
    setPath({ status: 'loading' });
    setTransition({ currentRoleId: from, targetRoleId: to, have });
  }

  return (
    <div className="space-y-8">
      {options.status === 'loading' ? <LoadingCard label="Loading roles…" /> : null}
      {options.status === 'error' ? <ErrorCard error={options.error} onRetry={retryOptions} /> : null}

      {options.status === 'ready' && options.data.roles.length === 0 ? (
        <EmptyCard title="The graph has no roles yet." hint="Run the seed, then reload this page." />
      ) : null}

      {options.status === 'ready' && options.data.roles.length > 0 ? (
        <RoleSelectors
          roles={options.data.roles}
          currentRoleId={currentRoleId}
          targetRoleId={targetRoleId}
          onCurrentRoleChange={setCurrentRoleId}
          onTargetRoleChange={setTargetRoleId}
          onSubmit={showPath}
        >
          <SkillsPicker
            skills={options.data.skills}
            selected={have}
            onToggle={toggleSkill}
            onClear={() => setHave([])}
          />
        </RoleSelectors>
      ) : null}

      {path?.status === 'loading' ? <LoadingCard label="Walking the graph…" /> : null}
      {path?.status === 'error' ? <ErrorCard error={path.error} onRetry={retryPath} /> : null}

      {path?.status === 'ready' && transition ? (
        <PathWithDetail
          key={`${transition.currentRoleId}-${transition.targetRoleId}-${transition.have.join('.')}`}
          path={path.data}
        />
      ) : null}
    </div>
  );
}
