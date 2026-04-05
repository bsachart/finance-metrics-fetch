# Implementation Plan: Config-Driven Market Fetch

**Branch**: `001-config-market-fetch` | **Date**: 2026-04-05 | **Spec**: [spec.md](/home/bog/Documents/finance_metrics_fetch/specs/001-config-market-fetch/spec.md)
**Input**: Feature specification from `/specs/001-config-market-fetch/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See
`.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a config-driven market-data pipeline that refreshes Yahoo Finance OHLCV
history and Wikipedia constituent datasets, stores those outputs as repository
friendly files, and emits stable artifacts for later consumers. Implementation
uses typed Python modules for fetch and transform work, `uv` for Python project
management, and `ruff` for linting and formatting.

## Technical Context

**Language/Version**: Python 3.12 with type hints  
**Primary Dependencies**: uv, Ruff, Polars, yfinance, requests, Beautiful Soup  
**Storage**: Versioned plain files in repository directories (JSON and CSV)  
**Testing**: pytest, command-line smoke checks, Ruff lint/format checks  
**Target Platform**: GitHub Actions on Linux and local command-line execution  
**Project Type**: Typed Python data pipeline  
**Performance Goals**: Daily refresh for configured tickers completes within 10 minutes  
**Constraints**: Use Polars instead of pandas, keep Python code typed, use uv for Python dependency management, use Ruff for linting and formatting, keep changes small and reviewable  
**Scale/Scope**: Initial scope covers a small maintained ticker set, two constituent sources, normalized output artifacts, and repository-managed scheduled refreshes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Simple interfaces and deep modules: Pass. The design separates configuration
  loading, source adapters, dataset normalization, publishable artifact
  generation, and static UI consumption behind small interfaces.
- High-leverage scope: Pass. The first slice focuses on config-driven fetch,
  durable outputs, and one published comparison view rather than broad
  analytics features.
- Small logical change: Pass. The implementation can ship as one feature branch
  centered on repository-managed refresh and publication.
- Single-commit PR feasibility: Pass. The design remains cohesive enough to
  land as one logical commit when implementation is complete.
- Verification defined: Pass. Plan includes typed Python checks, Ruff,
  automated tests, build checks, and workflow smoke validation.
- Documentation clarity: Pass. Naming, contracts, and quickstart are explicit
  and concise.

## Project Structure

### Documentation (this feature)

```text
specs/001-config-market-fetch/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── config-file.md
│   ├── refresh-cli.md
│   └── published-data.md
└── tasks.md
```

### Source Code (repository root)

```text
config/
└── tickers.json

data/
├── market/
├── constituents/
└── status/

src/
└── finance_metrics_fetch/
    ├── __init__.py
    ├── cli.py
    ├── config.py
    ├── errors.py
    ├── models.py
    ├── sources/
    │   ├── yahoo.py
    │   └── wikipedia.py
    ├── transforms/
    │   └── datasets.py
    └── publish/
        └── artifacts.py

tests/
├── integration/
└── unit/

.github/
└── workflows/
```

**Structure Decision**: Use a single repository with a typed Python package for
data refresh, normalization, artifact writing, and scheduled automation. UI and
GitHub Pages work are explicitly deferred to a follow-up feature.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
