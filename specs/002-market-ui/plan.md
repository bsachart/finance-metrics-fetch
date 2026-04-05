# Implementation Plan: Market Data UI

**Branch**: `[002-market-ui]` | **Date**: 2026-04-05 | **Spec**: [spec.md](/home/bog/Documents/finance_metrics_fetch/specs/002-market-ui/spec.md)
**Input**: Feature specification from `/specs/002-market-ui/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See
`.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a static UI in `ui/` that packages the repository's published `data/`
artifacts into a GitHub Pages site and lets users browse market history, quote
volume, VIX context, and constituent reference data without a backend.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x, SvelteKit on Node.js 20+  
**Primary Dependencies**: SvelteKit, `@sveltejs/adapter-static`, `shadcn-svelte`, Lightweight Charts, Papa Parse for CSV parsing  
**Storage**: Static repository files copied from `data/` and `config/tickers.json` into the UI build  
**Testing**: Vitest, `svelte-check`, and static production builds  
**Target Platform**: Static GitHub Pages site, desktop and mobile browsers  
**Project Type**: Static web application  
**Performance Goals**: Initial page becomes interactive in under 10 seconds on typical broadband, symbol switches update visible views in under 2 seconds  
**Constraints**: No runtime backend, must consume repository data, must live under `ui/`, must remain small enough for one reviewable feature branch  
**Scale/Scope**: Single dashboard route, current configured symbols, two constituent datasets, daily market histories in the low tens of thousands of rows

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Does the design preserve simple public interfaces and place complexity inside
  deep modules rather than scattering it across layers?
- Yes. Parsing, packaging, and derived-series logic will live in a few focused modules,
  while page components consume simple typed view models.
- Is the planned scope the smallest high-leverage slice that delivers visible
  value without speculative abstraction?
- Yes. This slice adds one static dashboard route and uses existing repository data.
- Is the planned change small enough to review and validate confidently as one
  logical unit of value?
- Yes. It is a single UI feature that consumes the already-finished fetch pipeline.
- Can the implementation land as one logical change in one pull request with
  exactly one commit?
- Yes. All work stays within the UI feature plus minimal workflow/doc updates.
- What command-line verification, build, or automated test steps will prove the
  change works before completion?
- `cd ui && npm run check`
- `cd ui && npm run test`
- `cd ui && npm run build`
- Are documentation and naming expectations clear enough to keep the result
  concise and professional?
- Yes. Naming will follow the existing repository style, and docs will stay focused on
  using the site and deploying it to GitHub Pages.

## Project Structure

### Documentation (this feature)

```text
specs/002-market-ui/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
config/
data/
src/
tests/
.github/workflows/
ui/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   ├── data/
│   │   ├── charts/
│   │   └── state/
│   └── routes/
├── static/
├── tests/
└── package.json
```

**Structure Decision**: Use the existing Python project as-is and add a separate
static UI app in `ui/`. Keep data-production concerns in Python and keep UI-only
parsing, packaging, and derived display logic inside the `ui/src/lib/` modules.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
