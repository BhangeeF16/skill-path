# SkillPath — UI/UX Design Specification

## 1. Design Direction

SkillPath should feel like a modern developer/career intelligence tool rather than a generic HR dashboard.

Design characteristics:
- Clean
- Technical but approachable
- Information-dense without feeling crowded
- Strong visual hierarchy
- Minimal decoration
- Graph relationships represented visually where useful

## 2. Primary Information Architecture

```text
SkillPath
├── Start
├── Skill Path
│   ├── Overview
│   ├── Skill Gaps
│   └── Learning Paths
└── Skill Explorer
```

For the take-home, a single-page flow with contextual panels is acceptable and preferable to unnecessary navigation.

## 3. Start Screen

Purpose: establish current and target role.

Elements:
- Product name and short value proposition.
- Current role selector.
- Target role selector.
- Optional demo-person selector if multiple seeded personas exist.
- CTA: `Generate Skill Path`.

Example copy:

> From where you are to where you want to be.

> See the skills you already have, the gaps to close, and the tools that can help.

## 4. Skill Path Dashboard

Top summary:
- Current role.
- Target role.
- Number of aligned skills.
- Number of skill gaps.
- Number of prerequisite skills discovered.

Main sections:

### Role transition
```text
Senior Backend Engineer  →  Senior AI Engineer
```

### Skill coverage
Horizontal progress indicator.

### Skill gaps
Cards grouped by importance:
- Core
- Important
- Supporting

### Recommended path
Ordered prerequisite sequence.

## 5. Skill Gap Card

Each card contains:
- Skill name.
- Importance badge.
- Why it matters.
- Current state: `Missing`.
- Prerequisites count.
- Tool count.
- CTA: `Explore`.

Example:

```text
Machine Learning
CORE

Required by Senior AI Engineer

You don't currently have this skill.

Prerequisites  2
Tools          3

[Explore skill]
```

## 6. Skill Detail Panel

Show:
- Skill description.
- Why target role needs it.
- Prerequisites.
- Supporting tools.
- Suitable level for each tool.
- Relationship explanation.

Example:

```text
Machine Learning

Required by:
Senior AI Engineer

Prerequisites
→ Statistics
→ Linear Algebra

Tools
→ Python       implementation
→ scikit-learn practice
```

## 7. Learning Path Visualization

Represent prerequisite ordering as a simple vertical graph:

```text
Statistics
    ↓
Machine Learning
    ↓
Deep Learning
```

Avoid a complex force-directed graph as the primary UI. It looks impressive but can become difficult to read.

A compact relationship visualization is better for a career-planning product.

## 8. Tool Recommendations

Tool cards:
- Tool name.
- Category/type.
- Suitable level.
- Supported skill.
- Optional external link if included in seed data.

Example:

```text
PyTorch
Framework / Library
Suitable for: Intermediate+

Supports:
Deep Learning

[Explore]
```

## 9. Loading States

Use skeletons for:
- Role selectors.
- Summary statistics.
- Skill cards.
- Detail panel.

Avoid blank screens and generic spinners.

## 10. Empty States

Examples:

No skills:
> No skills have been added to this profile yet.

No prerequisites:
> This skill has no prerequisite relationships in the current knowledge graph.

No tools:
> No supporting tools are currently mapped to this skill.

## 11. Error State

Database unavailable:

> We couldn't load your Skill Path right now.

> The graph database is temporarily unavailable. Please try again.

Actions:
- `Retry`
- `Back`

Do not expose connection URI, driver errors, or stack traces.

## 12. Responsive Design

Desktop:
- Two-column dashboard.
- Left: gap/path.
- Right: contextual detail.

Tablet:
- Stacked panels.

Mobile:
- Single-column cards.
- Sticky bottom/inline CTA where useful.

## 13. Accessibility

- Keyboard navigable controls.
- Visible focus state.
- Semantic headings.
- Labels for selectors.
- Do not rely on color alone for importance.
- Minimum readable text size.
- Adequate contrast.

## 14. Visual System

Use Tailwind CSS.

Typography:
- Clean sans-serif.
- Strong hierarchy between role names, skill names, and metadata.

Components:
- Cards
- Badges
- Selects/comboboxes
- Progress indicators
- Breadcrumb/context labels
- Buttons
- Skeletons
- Alerts
- Side panel/dialog

Avoid:
- excessive gradients
- decorative 3D graphs
- dense tables as the primary interface
- unnecessary animations

## 15. UX Principle

The user should always be able to answer:

1. Where am I?
2. Where am I going?
3. What am I missing?
4. What should I learn first?
5. What can I use to practice it?
6. Why did the system recommend this?
