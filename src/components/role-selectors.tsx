// No 'use client' here: SkillPathExplorer is the one client entry point, and
// everything it imports is already part of that client subtree.
import type { Role } from '@/types/domain';

/**
 * Two selectors, grouped by Domain — the fifth node type earns its place here
 * rather than sitting unread in the graph.
 *
 * Any pair of distinct roles is answerable, because the path is computed from
 * what the two roles require rather than from a person who happens to be
 * making that move.
 */
export function RoleSelectors({
  roles,
  currentRoleId,
  targetRoleId,
  onCurrentRoleChange,
  onTargetRoleChange,
  onSubmit,
}: {
  roles: Role[];
  currentRoleId: string;
  targetRoleId: string;
  onCurrentRoleChange: (id: string) => void;
  onTargetRoleChange: (id: string) => void;
  onSubmit: (currentRoleId: string, targetRoleId: string) => void;
}) {
  const bothChosen = currentRoleId !== '' && targetRoleId !== '';
  const sameRole = bothChosen && currentRoleId === targetRoleId;
  const ready = bothChosen && !sameRole;

  return (
    <section className="rounded-xl border border-black/10 p-6 dark:border-white/15">
      <div className="grid gap-4 sm:grid-cols-2">
        <RoleSelect
          id="current-role"
          label="Where you are now"
          roles={roles}
          value={currentRoleId}
          onChange={onCurrentRoleChange}
        />
        <RoleSelect
          id="target-role"
          label="Where you want to go"
          roles={roles}
          value={targetRoleId}
          onChange={onTargetRoleChange}
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={!ready}
          onClick={() => ready && onSubmit(currentRoleId, targetRoleId)}
          className="rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background disabled:cursor-not-allowed disabled:opacity-40"
        >
          Show the skill path
        </button>
        <p className="text-sm opacity-70">{hint(bothChosen, sameRole)}</p>
      </div>
    </section>
  );
}

function RoleSelect({
  id,
  label,
  roles,
  value,
  onChange,
}: {
  id: string;
  label: string;
  roles: Role[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-black/15 bg-transparent px-3 py-2.5 text-sm dark:border-white/20"
      >
        <option value="">Choose a role…</option>
        {groupByDomain(roles).map(([domainName, domainRoles]) => (
          <optgroup key={domainName} label={domainName}>
            {domainRoles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.title}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}

function hint(bothChosen: boolean, sameRole: boolean) {
  if (sameRole) return 'Pick a different target role.';
  if (bothChosen) return 'Ready.';
  return 'Pick both roles to continue.';
}

/** Roles arrive ordered by domain then title, so insertion order is the order. */
function groupByDomain(roles: Role[]): [string, Role[]][] {
  const groups = new Map<string, Role[]>();

  for (const role of roles) {
    const name = role.domain?.name ?? 'Other';
    const existing = groups.get(name);
    if (existing) existing.push(role);
    else groups.set(name, [role]);
  }

  return [...groups.entries()];
}
