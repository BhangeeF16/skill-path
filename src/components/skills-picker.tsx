// No 'use client' here: SkillPathExplorer is the one client entry point, and
// everything it imports is already part of that client subtree.
import { useState } from 'react';
import type { Skill } from '@/types/domain';

/**
 * Optional. The role you hold implies a floor, not a ceiling — a Data Analyst
 * who already writes Python should not be told to learn Python — so anything
 * ticked here joins the baseline the target role is compared against.
 *
 * Collapsed by default: the honest default is "whatever my role implies", and
 * the picker is a correction, not a required step.
 */
export function SkillsPicker({
  skills,
  selected,
  onToggle,
  onClear,
}: {
  skills: Skill[];
  selected: string[];
  onToggle: (skillId: string) => void;
  onClear: () => void;
}) {
  const [filter, setFilter] = useState('');
  const needle = filter.trim().toLowerCase();
  const visible = needle ? skills.filter((skill) => skill.name.toLowerCase().includes(needle)) : skills;

  return (
    <details className="mt-5 border-t border-black/10 pt-4 dark:border-white/15">
      <summary className="cursor-pointer text-sm font-medium">
        Already know something extra?{' '}
        <span className="font-normal opacity-60">
          {selected.length === 0
            ? 'Optional — tick any skills your current role does not assume.'
            : `${selected.length} selected`}
        </span>
      </summary>

      <div className="mt-4">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder="Filter skills…"
            aria-label="Filter skills"
            className="w-56 rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
          />
          {selected.length > 0 ? (
            <button type="button" onClick={onClear} className="text-sm underline opacity-70 hover:opacity-100">
              Clear all
            </button>
          ) : null}
        </div>

        {visible.length === 0 ? (
          <p className="text-sm opacity-70">No skill matches “{filter}”.</p>
        ) : (
          <ul className="grid max-h-64 gap-x-4 gap-y-1.5 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((skill) => (
              <li key={skill.id}>
                <label className="flex cursor-pointer items-center gap-2 py-0.5 text-sm">
                  <input
                    type="checkbox"
                    checked={selected.includes(skill.id)}
                    onChange={() => onToggle(skill.id)}
                    className="h-4 w-4 shrink-0 accent-current"
                  />
                  <span>{skill.name}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </details>
  );
}
