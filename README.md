# ARIA

**AI Requirements & Interface Architect**

ARIA is an AI-powered design orchestrator that bridges the gap between product requirements and frontend implementation.

Instead of asking a coding model to both *design* and *implement* a user interface, ARIA separates those responsibilities into a structured workflow.

## Vision

Modern coding models are excellent software engineers, but they are not always reliable UX or UI designers.

ARIA exists to answer questions like:

* What should this page contain?
* What is the user's primary goal?
* How should information be organized?
* Which actions should be primary or secondary?
* How should the layout adapt across screen sizes?

The output is a structured **UI Specification (UISpec)** that any coding model can implement consistently.

## Philosophy

**Design before implementation.**

A well-defined specification produces more consistent code, reduces iteration, and makes UI development predictable.

ARIA does **not** replace coding models.

Instead, it works alongside them.

```text
Feature Request
        │
        ▼
      ARIA
Requirements Analysis
UX Design
UI Specification
Figma Guidance
        │
        ▼
Approved UISpec
        │
        ▼
     Codex
Implementation
        │
        ▼
Running Application
        │
        ▼
      ARIA
UI Review
Design Validation
```

## Core Responsibilities

ARIA is responsible for:

* Understanding business requirements
* Clarifying ambiguous requirements
* Defining user goals
* Designing page layouts
* Establishing information hierarchy
* Producing reusable UI specifications
* Maintaining consistency with the design system
* Reviewing implemented interfaces

ARIA is **not** responsible for:

* Writing production frontend code
* Choosing implementation frameworks
* Refactoring application logic
* Replacing frontend engineers

Those responsibilities belong to implementation-focused coding models such as Codex.

## Repository Structure

```
aria/

├── prompts/
│   analyst.md
│   designer.md
│   reviewer.md
│
├── schemas/
│   uispec-v1.md
│
├── design-system/
│   principles.md
│   components.md
│
├── examples/
│   camera-detail.md
│   camera-list.md
│
└── README.md
```

## Development Roadmap

### v0.1 — Foundation

* Define ARIA's responsibilities
* Create the UISpec schema
* Define design principles
* Build prompt templates
* Produce example page specifications

### v0.2 — Design Workflow

* Improve layout generation
* Add reusable design patterns
* Add Figma-oriented output
* Expand component guidance

### v0.3 — Validation

* Review implemented pages
* Compare implementation with UISpec
* Identify inconsistencies
* Recommend design improvements

### Future Vision

ARIA aims to become a reusable design layer between human intent and AI implementation.

In the future, multiple coding models, design tools, and review systems should be able to consume the same UISpec without changing the development workflow.

## License

This project is currently under active development.
The specification, prompts, and design methodology are expected to evolve as ARIA matures.
