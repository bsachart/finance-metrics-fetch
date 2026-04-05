<!--
Sync Impact Report
- Version change: 1.0.0 -> 1.1.0
- Modified principles:
  - II. Atomic Pull Requests -> II. Atomic And Small Pull Requests
- Added sections:
  - None
- Removed sections:
  - None
- Templates requiring updates:
  - ✅ updated: .specify/templates/plan-template.md
  - ✅ updated: .specify/templates/tasks-template.md
- Follow-up TODOs:
  - None
-->
# Finance Metrics Fetch Constitution

## Core Principles

### I. Simplicity Through Deep Modules
The codebase MUST reduce complexity, not relocate it. Each module MUST expose a
small, stable interface and hide operational detail behind it. New abstractions
MUST be introduced only when they make the system easier to understand, test,
and change. Shallow wrappers, speculative layers, and configuration surfaces
that do not buy meaningful leverage are prohibited.

### II. Atomic And Small Pull Requests
Each pull request MUST contain exactly one commit and represent one logical
change. Changes SHOULD be kept as small as practical because small changes are
easier to review, verify, and reason about. Work MUST be sliced so that review,
rollback, and correctness checks stay simple. If a change cannot be explained
clearly as one unit of value, it MUST be split before merge.

### III. Verification Before Completion
No change is complete until it has been verified through command-line
execution, automated tests, build checks, or another reproducible validation
step appropriate to the change. Output inspection alone is insufficient.
Verification evidence MUST be recorded in the related plan, task, or pull
request context.

### IV. Professional Clarity
Code, specifications, plans, tasks, and commit messages MUST be concise,
precise, and professionally written. Names MUST communicate intent. Comments
MUST add information that is not obvious from the code. Vague wording,
redundant commentary, and low-signal documentation are prohibited.

### V. High-Leverage Delivery
Planning and implementation MUST prioritize the highest-impact, lowest-effort
work that moves the product forward. The default is the simplest solution that
meets the current need. Teams MUST prefer incremental delivery, explicit scope
control, and direct solutions over premature generalization.

## Repository Boundaries

The constitution defines enduring engineering principles only. Product scope,
technology choices, UI direction, integrations, and data-source decisions MUST
live in feature specifications, implementation plans, or other project
documentation such as `README.md` and `spec.md`. The constitution MUST remain
short, stable, and technology-agnostic.

## Delivery Workflow

- Every feature plan MUST include a constitution check that explains how the
  design preserves simplicity, keeps scope high-leverage, and defines
  verification.
- Every task list MUST include explicit verification work, even when automated
  tests are not the primary validation mechanism.
- Reviewers MUST reject changes that add complexity without a clear payoff,
  blur module boundaries, are larger than necessary for one logical change, or
  violate the single-commit pull request rule.

## Governance

This constitution overrides conflicting local habits and informal process. Any
amendment MUST be documented, reviewed for downstream template impact, and
recorded with a semantic version change:

- MAJOR: removes or materially redefines a governing principle
- MINOR: adds a principle or materially expands governance
- PATCH: clarifies wording without changing intent

Every compliance review MUST confirm that:

- the change remains simple at the interface level and deep in implementation
- the change is no larger than necessary to deliver one logical unit of value
- the pull request contains exactly one commit
- verification has been executed and documented
- documentation is concise, precise, and current

**Version**: 1.1.0 | **Ratified**: 2026-04-05 | **Last Amended**: 2026-04-05
