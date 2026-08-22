'use client';

import { useState } from 'react';
import { EmptyCard } from '@/components/states';
import { SkillDetailPanel } from '@/components/skill-detail-panel';
import { SkillPathView } from '@/components/skill-path-view';
import type { SkillPath } from '@/types/domain';

/**
 * A rendered path plus the detail panel for whichever gap is selected. Shared
 * by the explorer and the case studies, which differ only in how the path was
 * computed.
 *
 * Callers that swap the path should pass a `key` so the selection resets with
 * it — a skill selected for one transition means nothing in the next.
 */
export function PathWithDetail({ path }: { path: SkillPath }) {
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
      <SkillPathView path={path} selectedSkillId={selectedSkillId} onSelectSkill={setSelectedSkillId} />
      {selectedSkillId ? (
        <SkillDetailPanel skillId={selectedSkillId} onClose={() => setSelectedSkillId(null)} />
      ) : (
        <EmptyCard title="Pick a skill" hint="Select a gap to see its prerequisite path and tools." />
      )}
    </div>
  );
}
