# Research: Config-Driven Market Fetch

## Decision: Manage the Python project with `uv`

**Rationale**: `uv` provides project environments, dependency locking, Python
version management, and script execution in one tool, which keeps the Python
side of the repository simple and fast. It aligns with the request to use `uv`
and reduces setup friction for both local work and GitHub Actions.

**Alternatives considered**:

- `pip` plus `venv`: workable, but more manual and less consistent
- Poetry: capable, but broader than needed for this small repository

## Decision: Enforce typed Python modules with Ruff as the default quality tool

**Rationale**: Typed Python interfaces make config parsing, dataset schemas, and
source boundaries easier to review and safer to change. Ruff covers linting and
formatting in one fast tool and integrates cleanly with `pyproject.toml`.

**Alternatives considered**:

- Untyped Python scripts: simpler at first, but weaker contracts for evolving
  data pipelines
- Separate Black and Flake8 setup: more moving parts for little additional
  value in this scope

## Decision: Use Polars for dataframe transformation and file generation

**Rationale**: The feature explicitly forbids pandas and only needs columnar
transforms, derived fields, and file export. Polars is a strong fit for these
dataset operations and keeps the processing layer focused.

**Alternatives considered**:

- pandas: rejected by requirement
- Pure Python row-by-row transforms: simpler for tiny data, but less clear once
  quote-volume derivation and output normalization grow

## Decision: Fetch Wikipedia constituent lists through HTML parsing rather than a dataframe HTML reader

**Rationale**: The project must avoid pandas-based dataframe handling. Parsing
the relevant tables from HTML and normalizing them into typed records keeps the
dependency surface narrow and respects the Polars-only dataframe rule.

**Alternatives considered**:

- `pandas.read_html`: convenient, but violates the dataframe constraint
- Third-party unofficial APIs: adds avoidable source dependency risk

## Decision: Publish the UI as a static SvelteKit site deployed with GitHub Pages via GitHub Actions

**Rationale**: GitHub Pages is a static hosting service and GitHub recommends
GitHub Actions for deployment workflows. A static SvelteKit build fits this
model well and keeps the published site simple, inexpensive, and repository
native.

**Alternatives considered**:

- Commit built assets to `gh-pages`: workable, but noisier and less controlled
- Server-rendered hosting: unnecessary complexity for a read-only data viewer

## Decision: Treat published datasets as explicit frontend artifacts

**Rationale**: The frontend should consume stable, publish-ready JSON files
rather than re-deriving values from raw CSV in the browser. This keeps the
interface between the Python pipeline and static UI small and predictable.

**Alternatives considered**:

- Load CSV directly in the browser: possible, but pushes normalization into the
  UI and weakens the module boundary
- Bundle all source data into app code: unnecessary rebuild coupling

## Decision: Use one refresh workflow with scheduled and manual triggers

**Rationale**: The feature requires unattended and manual refresh runs. One
workflow with both trigger modes reduces duplication while preserving clear
operational behavior.

**Alternatives considered**:

- Separate schedule and manual workflows: more files with little added value

## Sources

- uv docs: https://docs.astral.sh/uv/
- Ruff docs: https://docs.astral.sh/ruff/
- Ruff installation: https://docs.astral.sh/ruff/installation/
- Ruff configuration: https://docs.astral.sh/ruff/configuration/
- GitHub Pages overview: https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages?apiVersion=2022-11-28
- GitHub Pages custom workflows: https://docs.github.com/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- GitHub Pages publishing source: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site?apiVersion=2022-11-28
- shadcn-svelte installation: https://www.shadcn-svelte.com/docs/installation
- chosen shadcn-svelte preset: https://www.shadcn-svelte.com/create/preview-02?preset=b78QWyu5vU
- Lightweight Charts docs: https://tradingview.github.io/lightweight-charts/
