# Research: Market Data UI

## Decision: Use SvelteKit with static generation in `ui/`

**Rationale**: The project needs a static site that can be published to GitHub
Pages and read repository-hosted data files without a backend. SvelteKit keeps
the routing and page composition simple while still allowing a fully static build.

**Alternatives considered**:

- Plain Svelte with Vite: workable, but less structured for route-level data loading
  and static deployment configuration.
- A server-rendered app: rejected because the feature must work on GitHub Pages
  without a runtime backend.

## Decision: Use `@sveltejs/adapter-static` and a GitHub Pages deployment workflow

**Rationale**: GitHub Pages deploys static artifacts well, and `adapter-static`
aligns with the requirement that the UI runs without a backend after publication.

**Alternatives considered**:

- Commit built assets into the repository: rejected because it mixes source and build
  output and makes reviews noisier.
- Host the UI elsewhere: rejected because GitHub Pages is the desired default target.

## Decision: Read from `/data` through build-time copies into the UI app

**Rationale**: The Python pipeline already commits stable CSV and JSON artifacts in
the repository. Copying those files into the static app's public assets keeps the UI
simple and avoids introducing cross-origin or runtime path assumptions.

**Alternatives considered**:

- Fetch external APIs directly from the browser: rejected because the feature must use
  published repository data, not live providers.
- Parse files from outside the app directory at runtime: rejected because GitHub Pages
  deployment should package all required assets into the site artifact.

## Decision: Use Lightweight Charts for time-series views and browser-side transforms for histograms

**Rationale**: Lightweight Charts is a good fit for price and overlay time-series
visualization. Histogram views can be derived from the published market history in the
browser, which avoids introducing another preprocessing layer.

**Alternatives considered**:

- Use a general charting framework for all views: rejected because the project already
  prefers Lightweight Charts for market-history display.
- Precompute all histogram bins in the Python pipeline: rejected for this slice because
  the UI can derive them cheaply from the published data and stay decoupled from the
  fetch pipeline.

## Decision: Use `shadcn-svelte` as the component system, starting from the chosen preset direction

**Rationale**: The project already chose `shadcn-svelte` and provided a preset URL for
the visual starting point. Reusing that design direction keeps the UI aligned with the
existing project intent while still allowing a small, reviewable implementation.

**Alternatives considered**:

- Build raw components from scratch: rejected because it adds avoidable UI plumbing.
- Introduce a different component library: rejected because the stack was already chosen.

## Decision: Keep the first UI slice read-only and file-driven

**Rationale**: A read-only static site is the smallest high-leverage increment that
turns the existing data pipeline into something directly explorable. It keeps complexity
inside parsing and view modules rather than scattering it across network layers.

**Alternatives considered**:

- Add filtering APIs or editable saved views: rejected as out of scope for the first UI slice.
