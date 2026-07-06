# UISpec v1

UISpec is the structured representation of a user interface design.

It is implementation-independent and serves as the contract between ARIA and Codex.

---

# Document Structure

A UISpec consists of:

```text
Metadata
Design Summary
Purpose
User Context
User Goals
Information Architecture
Layout
Sections
Components
User Flows
Actions
States
Permissions
Responsive Rules
Accessibility
Implementation Notes
```

---

# 1. Metadata

```yaml
name:
version:
created:
updated:
author:
```

---

# 2. Design Summary

High-level understanding of the page.

```yaml
purpose:
primaryUser:
primaryGoal:
complexity:
keyDesignPrinciple:
```

---

# 3. Purpose

One sentence describing why the page exists.

---

# 4. User Context

Defines who is using the page.

* primaryUser
* secondaryUsers
* usageFrequency

---

# 5. User Goals

What users are trying to achieve.

---

# 6. Information Architecture

Logical grouping of information.

Not layout yet.

---

# 7. Layout

High-level structure only.

Example:

* Top Bar
* Main Content
* Sidebar
* Footer

---

# 8. Sections

Functional grouping of UI content.

Each section includes:

* Purpose
* Content
* Priority

---

# 9. Components

Reusable UI concepts.

Examples:

* Table
* Card
* Timeline
* Video Player
* Tabs

---

# 10. User Flows

Step-by-step interaction patterns.

---

# 11. Actions

All possible user operations.

Categorized:

* Primary
* Secondary
* Dangerous

---

# 12. States

Must include:

* Loading
* Empty
* Error
* Offline
* Permission Denied

---

# 13. Permissions

Role-based access rules.

---

# 14. Responsive Rules

Defines behavior across screen sizes:

* Desktop
* Tablet
* Mobile

---

# 15. Accessibility

* Keyboard navigation
* Screen reader support
* Focus order
* Contrast requirements

---

# 16. Implementation Notes

Optional technical constraints.

Not design decisions.

---

# Core Rule

UISpec must be sufficient for implementation **without additional design decisions**.
