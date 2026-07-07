# ARIA Component Guidance

This document defines framework-agnostic component guidance for UISpecs.

ARIA may name component concepts, but it should not require a specific frontend library unless the target project already does.

## Component Selection Rules

Use a component when it supports the interface purpose, user goals, or required states.

Avoid components that exist only to make the page feel more elaborate.

Every component in a UISpec should define:

- Purpose.
- Content.
- Behavior.
- States.
- Related actions.

## Navigation

Use navigation when users need to move between major areas or related views.

Specify:

- Current location indicator.
- Primary destination order.
- Behavior on small screens.
- Permission-based visibility.

Avoid adding navigation for one-off actions.

## Tables

Use tables when users need to compare many records across consistent attributes.

Specify:

- Default columns.
- Required columns.
- Optional columns.
- Sort behavior.
- Filter behavior.
- Row actions.
- Empty and loading states.
- Responsive behavior when columns cannot fit.

Avoid tables for content where comparison is not important.

## Forms

Use forms when users need to create or update structured information.

Specify:

- Field groups.
- Required fields.
- Optional fields.
- Validation rules in user-facing terms.
- Save, cancel, and reset behavior.
- Error and success states.

Avoid exposing backend field order if it does not match user workflow.

## Filters and Search

Use filters or search when users need to narrow a larger information set.

Specify:

- Default filter state.
- Available filter controls.
- Clear behavior.
- Empty result behavior.
- Whether filters persist.

Avoid filters that do not map to user decision-making.

## Cards

Use cards when each item is a compact, self-contained summary.

Specify:

- Primary information.
- Secondary information.
- Status display.
- Available item actions.
- Click or selection behavior.

Avoid cards for dense operational data that users need to scan or compare quickly.

## Dialogs

Use dialogs for focused decisions, confirmations, or short workflows that should not replace the current page context.

Specify:

- Trigger.
- Purpose.
- Required content.
- Primary action.
- Secondary action.
- Dismiss behavior.
- Focus behavior.

Dangerous actions should define confirmation text and recovery expectations.

## Status Indicators

Use status indicators when users need to understand condition, availability, progress, or risk.

Specify:

- Status values.
- Labels.
- Meaning.
- Visual priority.
- Non-color cue.
- Update behavior.

Do not rely on color alone.

## Tabs

Use tabs when users switch between sibling views within the same context.

Specify:

- Tab labels.
- Default tab.
- Whether tab state persists.
- Empty state per tab.
- Permission-based tab visibility.

Avoid tabs for sequential workflows; use steps instead.

## Empty States

Empty states should explain what is missing and what the user can do next.

Specify:

- Plain-language message.
- Primary recovery action, if any.
- Secondary guidance, if needed.

Avoid empty states that only say there is no data.

## Error States

Error states should explain what happened, what is affected, and how the user can recover.

Specify:

- User-facing message.
- Recovery action.
- Retry behavior.
- Escalation path, if needed.

Avoid exposing raw technical errors unless the target user needs them.

## Permission States

Permission states should make access limits clear without implying system failure.

Specify:

- Which role is restricted.
- What the user can still see.
- Which actions are hidden or disabled.
- How to request access, if applicable.

Avoid showing dangerous or unavailable actions without explanation.
