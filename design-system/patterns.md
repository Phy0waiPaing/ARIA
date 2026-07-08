# ARIA Design Patterns

This document defines reusable, framework-agnostic UX patterns for ARIA artifacts.

Patterns describe design intent. They should not require a specific frontend library.

## Pattern Rules

ARIA patterns should:

- Support a clear user goal.
- Be reusable across projects.
- Preserve accessibility expectations.
- Be described independently from implementation frameworks.
- Leave room for target projects to use their existing components.

ARIA patterns should not:

- Introduce decorative layout without user value.
- Override project-specific design systems.
- Require production architecture choices.
- Hide unresolved product decisions.

## Common Patterns

### Data Table

Use for dense, comparable records.

Expected considerations:

- Primary entity and row meaning.
- Default sorting.
- Filtering and search.
- Pagination or virtualization expectations.
- Empty and error states.
- Row-level and bulk actions.
- Responsive behavior when columns do not fit.

### Filter Bar

Use when users need to narrow a dataset before acting.

Expected considerations:

- Most important filters.
- Default filter state.
- Clear/reset behavior.
- Saved or recent filters, when relevant.
- Mobile layout.

### Detail Panel

Use when users need more context without losing the current list or workflow.

Expected considerations:

- Trigger.
- Content priority.
- Dismiss behavior.
- Relationship to the source item.
- Keyboard and focus behavior.

### Confirmation Dialog

Use for destructive, irreversible, or high-impact actions.

Expected considerations:

- Clear consequence.
- Primary and cancel actions.
- Recovery path, if available.
- Required typed confirmation, when risk is high.

### Empty State

Use when an interface has no data to show.

Expected considerations:

- Why the state is empty.
- Whether the user can fix it.
- Primary next action.
- Permission or setup constraints.

### Permission State

Use when a user cannot access content or actions.

Expected considerations:

- What is unavailable.
- Why access is limited.
- Whether a request path exists.
- Which visible actions remain useful.
