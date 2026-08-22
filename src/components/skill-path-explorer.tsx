'use client';

import { useEffect, useState } from 'react';
import { asUiError, getJson, type Async } from '@/lib/api-client';
import { EmptyCard, ErrorCard, LoadingCard } from '@/components/states';
import { RoleSelectors } from '@/components/role-selectors';
import { SkillDetailPanel } from '@/components/skill-detail-panel';
import { SkillPathView } from '@/components/skill-path-view';
import type { Profile, Role, SkillPath } from '@/types/domain';

interface ProfilesResponse {
  roles: Role[];
  profiles: Profile[];
}

/**
 * Holds the two async operations the screen needs — the selectors, and the
 * skill path itself — so each renders its own loading, empty, and error state
 * without the other one blanking out.
 */
export function SkillPathExplorer() {
  const [options, setOptions] = useState<Async<ProfilesResponse>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [path, setPath] = useState<Async<SkillPath> | null>(null);
  const [personId, setPersonId] = useState<string | null>(null);
  const [currentRoleId, setCurrentRoleId] = useState('');
  const [targetRoleId, setTargetRoleId] = useState('');
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getJson<ProfilesResponse>('/api/profiles')
      .then((data) => {
        if (!cancelled) setOptions({ status: 'ready', data });
      })
      .catch((caught) => {
        if (!cancelled) setOptions({ status: 'error', error: asUiError(caught) });
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  useEffect(() => {
    if (!personId) return;
    let cancelled = false;

    getJson<SkillPath>(`/api/skill-path/${personId}`)
      .then((data) => {
        if (!cancelled) setPath({ status: 'ready', data });
      })
      .catch((caught) => {
        if (!cancelled) setPath({ status: 'error', error: asUiError(caught) });
      });

    return () => {
      cancelled = true;
    };
  }, [personId, attempt]);

  function retryOptions() {
    setOptions({ status: 'loading' });
    setAttempt((value) => value + 1);
  }

  function retryPath() {
    setPath({ status: 'loading' });
    setAttempt((value) => value + 1);
  }

  function showPath(id: string) {
    setSelectedSkillId(null);
    setPath({ status: 'loading' });
    setPersonId(id);
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
          profiles={options.data.profiles}
          currentRoleId={currentRoleId}
          targetRoleId={targetRoleId}
          onCurrentRoleChange={setCurrentRoleId}
          onTargetRoleChange={setTargetRoleId}
          onSubmit={showPath}
        />
      ) : null}

      {path?.status === 'loading' ? <LoadingCard label="Walking the graph…" /> : null}
      {path?.status === 'error' ? <ErrorCard error={path.error} onRetry={retryPath} /> : null}

      {path?.status === 'ready' ? (
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <SkillPathView path={path.data} selectedSkillId={selectedSkillId} onSelectSkill={setSelectedSkillId} />
          {selectedSkillId ? (
            <SkillDetailPanel skillId={selectedSkillId} onClose={() => setSelectedSkillId(null)} />
          ) : (
            <EmptyCard title="Pick a skill" hint="Select a gap to see its prerequisite path and tools." />
          )}
        </div>
      ) : null}
    </div>
  );
}
