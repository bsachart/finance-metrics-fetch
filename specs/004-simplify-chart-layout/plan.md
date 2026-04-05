# Implementation Plan: Simplify Chart Layout

**Branch**: `[004-simplify-chart-layout]` | **Date**: 2026-04-05 | **Spec**: [spec.md](/home/bog/Documents/finance_metrics_fetch/specs/004-simplify-chart-layout/spec.md)
**Input**: Feature specification from `/specs/004-simplify-chart-layout/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See
`.specify/templates/plan-template.md` for the execution workflow.

## Summary

Simplify the static dashboard by moving the market chart to the top of the
ticker workflow, shrinking the page framing, turning VIX into a default-on
optional overlay instead of a separate section, and splitting ticker analysis
from constituent browsing with clearer top-level navigation.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x and Svelte 5 for the static UI, YAML for GitHub Actions workflow updates  
**Primary Dependencies**: SvelteKit, `@sveltejs/adapter-static`, Lightweight Charts, shadcn-svelte tabs/card primitives  
**Storage**: Versioned repository files under `data/` and `config/tickers.json`, copied into the static UI at build time  
**Testing**: `npm run check`, `npm run test`, `npm run build` in `ui/` plus targeted workflow validation by YAML diff review  
**Target Platform**: Static GitHub Pages dashboard on desktop and mobile browsers, plus GitHub-hosted Actions runners  
**Project Type**: Static web application with repository-hosted workflow automation  
**Performance Goals**: Main chart and its controls remain visible in the first viewport; symbol or tab switches update visible content without introducing additional page loads  
**Constraints**: No backend, no new data schema changes, preserve existing lookback and aggregation controls, keep navigation and component boundaries simpler than the current page  
**Scale/Scope**: One dashboard route, one chart component, a small set of shared UI components, and two workflow files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Does the design preserve simple public interfaces and place complexity inside
  deep modules rather than scattering it across layers?
- Yes. The route becomes thinner by delegating chart-series composition to the
  existing market data module and one chart component, while removing separate
  summary sections rather than adding new wrappers.
- Is the planned scope the smallest high-leverage slice that delivers visible
  value without speculative abstraction?
- Yes. The work only reorganizes the current dashboard and workflow config; it
  does not add new data types, pages, or charting libraries.
- Is the planned change small enough to review and validate confidently as one
  logical unit of value?
- Yes. The branch remains one dashboard simplification change plus workflow
  maintenance needed to keep deployment working.
- Can the implementation land as one logical change in one pull request with
  exactly one commit?
- Yes. The branch will be squashed before merge to satisfy the constitution.
- What command-line verification, build, or automated test steps will prove the
  change works before completion?
- `cd ui && npm run check`
- `cd ui && npm run test`
- `cd ui && npm run build`
- Are documentation and naming expectations clear enough to keep the result
  concise and professional?
- Yes. The UI will use shorter labels such as `Tickers`, `Market Constituents`,
  and `Show VIX`, and the README will stay aligned with the workflow behavior.

## Project Structure

### Documentation (this feature)

```text
specs/004-simplify-chart-layout/
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
.github/
└── workflows/
    ├── deploy-ui.yml
    └── refresh-data.yml
specs/
└── 004-simplify-chart-layout/
ui/
├── src/
│   ├── lib/
│   │   ├── charts/
│   │   ├── components/
│   │   └── data/
│   └── routes/
└── tests/
```

**Structure Decision**: Keep the change inside the existing static UI route,
shared market-data helpers, and workflow files. Prefer simplifying the route
composition over creating more component layers.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
