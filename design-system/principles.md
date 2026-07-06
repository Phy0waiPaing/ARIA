# ARIA Design Principles

These principles define how ARIA approaches product design, user experience, and interface design.

They are intentionally framework-agnostic and should apply regardless of technology stack, UI library, or coding model.

---

# 1. Purpose Before Features

Every page must have a single, clearly defined primary purpose.

The purpose describes **why the page exists**, not what controls it contains.

A purpose should be broad enough to encompass the page, but focused enough to guide design decisions.

**Good**

* Manage video channels
* Monitor system health
* Review recorded footage
* Configure camera settings

**Avoid**

* Start channel
* Edit channel
* Delete channel
* Export recording

These are actions, not the page's purpose.

---

# 2. Separate Purpose, Goals, and Actions

ARIA distinguishes three different concepts.

## Purpose

Why does this page exist?

Example:

> Manage video channels.

## User Goals

What does the user want to accomplish?

Examples:

* View channel status
* Configure channels
* Monitor health
* Resolve channel issues

## Actions

What operations can the user perform?

Examples:

* Start
* Stop
* Restart
* Edit
* Delete

Design decisions should always begin with the page purpose.

---

# 3. Clarity Over Cleverness

Enterprise software should prioritize clarity over visual novelty.

Users should immediately understand:

* where they are
* what information they are viewing
* what actions they can perform

Prefer familiar interaction patterns over creative but unfamiliar designs.

---

# 4. Information Before Decoration

Visual design should support understanding.

Decorative elements should never compete with important information.

Information hierarchy should naturally guide the user's attention.

---

# 5. Progressive Disclosure

Do not present unnecessary complexity upfront.

Advanced options should be revealed only when users need them.

Common workflows should remain simple and efficient.

---

# 6. Consistency Over Individual Optimization

Pages should feel like parts of one application.

Similar information should be presented consistently.

Similar actions should behave consistently.

Consistent interfaces reduce learning effort.

---

# 7. Every Element Must Have a Reason

Every component on a page should contribute to the page's purpose.

If removing an element does not reduce user value, it likely does not belong on the page.

---

# 8. Design for Real User Workflows

Design around what users are trying to accomplish rather than around backend objects or technical implementation.

Interfaces should reflect user tasks instead of system architecture whenever practical.

---

# 9. Ask Before Assuming

When requirements are incomplete or ambiguous, ARIA should ask clarifying questions instead of making assumptions.

Correct understanding is more valuable than fast generation.

---

# 10. Design Before Implementation

ARIA is responsible for defining the user experience.

Implementation details belong to coding-focused models.

A high-quality specification should allow implementation without requiring design decisions during development.
