import { describe, expect, it } from 'vitest';
import { composeSkillPath } from '@/server/services/skill-path.service';
import type { Person, PersonSkill, RequiredSkill, Role, Skill, SkillGap } from '@/types/domain';

/**
 * composeSkillPath is the whole calculation, minus the database. Fixtures in,
 * numbers out — no driver, no clock, no model.
 */

const person: Person = { id: 'person-avery', name: 'Avery Shah' };

const role = (id: string, title: string): Role => ({ id, title, level: 'senior', domain: null });

const skill = (id: string, name: string): Skill => ({ id, name, description: '' });

const held = (id: string, name: string, proficiency: number): PersonSkill => ({
  ...skill(id, name),
  proficiency,
});

const required = (id: string, name: string, importance: RequiredSkill['importance']): RequiredSkill => ({
  id,
  name,
  importance,
});

const gap = (id: string, name: string): SkillGap => ({
  id,
  name,
  importance: 'core',
  prerequisites: [],
  reason: { targetRoleTitle: 'Senior AI Engineer', importance: 'core', startWith: null },
});

const base = {
  person,
  currentRole: role('role-senior-backend-engineer', 'Senior Backend Engineer'),
  targetRole: role('role-senior-ai-engineer', 'Senior AI Engineer'),
  currentSkills: [held('skill-python', 'Python', 4)],
  matchingSkills: [skill('skill-python', 'Python')],
  gaps: [gap('skill-machine-learning', 'Machine Learning')],
};

describe('composeSkillPath', () => {
  it('reports coverage as met requirements over total requirements', () => {
    const result = composeSkillPath({
      ...base,
      targetRequirements: [
        required('skill-python', 'Python', 'core'),
        required('skill-machine-learning', 'Machine Learning', 'core'),
        required('skill-statistics', 'Statistics', 'core'),
        required('skill-mlops', 'MLOps', 'important'),
      ],
    });

    expect(result.coverage).toBe(0.25);
    expect(result.gaps).toHaveLength(1);
  });

  it('treats a role with no requirements as fully covered rather than dividing by zero', () => {
    const result = composeSkillPath({ ...base, targetRequirements: [], matchingSkills: [], gaps: [] });

    expect(result.coverage).toBe(1);
    expect(Number.isNaN(result.coverage)).toBe(false);
  });

  it('passes graph facts through untouched, so the same graph always renders the same screen', () => {
    const inputs = { ...base, targetRequirements: [required('skill-python', 'Python', 'core')] };

    expect(composeSkillPath(inputs)).toEqual(composeSkillPath(inputs));
    expect(composeSkillPath(inputs).gaps[0].reason.targetRoleTitle).toBe('Senior AI Engineer');
  });
});
