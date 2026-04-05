# Feature Specification: Market Data UI

**Feature Branch**: `002-market-ui`  
**Created**: 2026-04-05  
**Status**: Draft  
**Input**: User description: "Build a UI page under ui/ that reads the published /data artifacts and presents price, quote volume, VIX context, and constituent reference views for GitHub Pages."

**Note**: Keep this document focused on user-visible behavior and scope.
Implementation choices, stack details, and internal architecture belong in
`plan.md` or a companion project spec when they are not externally visible.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Explore Market History (Priority: P1)

A visitor opens the site and can inspect each tracked symbol using historical price,
nominal quote volume, and VIX context derived from the published dataset.

**Why this priority**: This is the primary user-facing value of the project and turns
the fetched datasets into an immediately useful view.

**Independent Test**: Can be fully tested by opening the static site against the
checked-in `data/` files, selecting a symbol, and confirming that price history,
quote volume history, and VIX context all render from local published data.

**Acceptance Scenarios**:

1. **Given** the site is opened with valid published market files, **When** the user
   lands on the page, **Then** the default symbol view shows historical price data,
   quote volume data, and the latest refresh status.
2. **Given** multiple symbols are available in published data, **When** the user
   switches symbols, **Then** the charts and summary values update to the selected
   symbol without requiring a new data fetch.
3. **Given** VIX data is available in published data, **When** the user inspects a
   symbol history, **Then** the interface shows the symbol history in the same view as
   VIX context so the user can compare them over the same period.

---

### User Story 2 - Inspect Distributions (Priority: P2)

A visitor can inspect histogram-style views that reveal how quote volume and price
levels are distributed over the published history for a selected symbol.

**Why this priority**: The project emphasizes nominal volume and price context, and
distribution views make those relationships easier to interpret than raw tables alone.

**Independent Test**: Can be fully tested by opening the static site, selecting a
symbol, toggling to the distribution view, and confirming that histogram views render
from existing published data without server-side processing.

**Acceptance Scenarios**:

1. **Given** a symbol with sufficient market history, **When** the user opens the
   distribution view, **Then** the interface shows a histogram for quote volume and a
   histogram for price values for that symbol.
2. **Given** the user changes the selected symbol, **When** the distribution view is
   active, **Then** both histograms recalculate from the selected symbol's published
   dataset.

---

### User Story 3 - Browse Constituents (Priority: P3)

A visitor can browse the published S&P 500 and Nasdaq-100 constituent files from the
same static site.

**Why this priority**: Constituent lists are part of the published dataset and should
be accessible from the same UI, but they are secondary to the market-history views.

**Independent Test**: Can be fully tested by opening the static site and confirming
that both published constituent datasets can be opened and browsed without any live
fetch or backend service.

**Acceptance Scenarios**:

1. **Given** the constituent files are present in `data/constituents`, **When** the
   user opens the constituents section, **Then** the site shows both index lists with
   their published fields.
2. **Given** the user chooses an index list, **When** they browse or filter the list,
   **Then** the site updates the displayed rows using the published constituent data.

---

### Edge Cases

- What happens when one or more expected files under `data/` are missing?
- How does the site communicate that published data is stale or that the last refresh failed?
- How does the site behave when a selected symbol is present in the config but missing a market file?
- What happens when a dataset is large enough that the full history cannot be comfortably shown at once?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a static user interface that can be hosted on
  GitHub Pages.
- **FR-002**: The system MUST read its market-history and constituent content from the
  published files under `data/` that are stored in the repository.
- **FR-003**: The system MUST present a selectable view of all published symbols that
  have market-history files available.
- **FR-004**: The system MUST show historical price data for the selected symbol.
- **FR-005**: The system MUST show historical nominal quote volume for the selected
  symbol.
- **FR-006**: The system MUST show VIX history alongside the selected symbol history
  when published VIX data is available.
- **FR-007**: The system MUST expose at least one histogram-style view for price data
  and one histogram-style view for quote volume data for the selected symbol.
- **FR-008**: The system MUST display the latest published refresh status, including
  whether the last refresh succeeded and which symbols were refreshed.
- **FR-009**: The system MUST provide access to the published S&P 500 and Nasdaq-100
  constituent datasets.
- **FR-010**: The system MUST make missing-data and refresh-failure states visible to
  the user instead of failing silently.
- **FR-011**: The system MUST work without a runtime backend service after the site has
  been published.

### Key Entities *(include if feature involves data)*

- **Published Market History**: Historical daily records for one tracked symbol,
  including date, OHLC values, share volume, and nominal quote volume.
- **Published Refresh Status**: The latest refresh summary, including timestamps,
  success state, refreshed symbols, failures, and source messages.
- **Published Constituents List**: A reference dataset for one index containing symbol,
  company name, sector metadata, source URL, and fetch timestamp.
- **UI Selection State**: The currently selected symbol, active view, and any
  constituent-list filters used while browsing the static page.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new visitor can open the published site and reach a populated market
  view from repository data in under 10 seconds on a typical broadband connection.
- **SC-002**: Switching between any two published symbols updates the visible market
  view in under 2 seconds without contacting a backend service.
- **SC-003**: 100% of published symbols with valid market files appear as selectable
  options in the UI.
- **SC-004**: Both published constituent datasets are viewable from the same static site.

## Assumptions

- The fetch pipeline remains responsible for producing and committing the files under
  `data/`.
- The static UI may transform published files in the browser or during the site build,
  but it will not fetch live market data from external providers.
- GitHub Pages is the primary hosting target for this slice.
- Authentication, user accounts, and personalized saved views are out of scope.

## Out of Scope

- Live market-data fetching from the browser
- Editing ticker configuration or refresh schedules from the UI
- Server-side APIs or a persistent backend for this slice
