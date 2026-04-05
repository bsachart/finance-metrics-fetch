# Feature Specification: Config-Driven Market Fetch

**Feature Branch**: `001-config-market-fetch`  
**Created**: 2026-04-05  
**Status**: Draft  
**Input**: User description: "Setup the python script to fetch constituents and OHLCV for some tickers defined in a config file. Use Polars if you have to deal with dataframes, not pandas."

**Note**: Keep this document focused on user-visible behavior and scope.
Implementation choices, stack details, and internal architecture belong in
`plan.md` or a companion project spec when they are not externally visible.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Refresh Configured Market Datasets (Priority: P1)

As a market-data user, I want the system to read a maintained ticker list and
refresh historical datasets for those symbols, so I always have current files
for analysis without editing code.

**Why this priority**: Without reliable, config-driven dataset refreshes, the
project cannot deliver any useful market data or support repeatable updates.

**Independent Test**: Can be fully tested by defining a small ticker list,
running a refresh, and confirming that updated historical files and constituent
files are produced for the configured scope.

**Acceptance Scenarios**:

1. **Given** a valid ticker configuration, **When** a refresh is run,
   **Then** the system produces historical OHLCV datasets for each configured
   ticker.
2. **Given** a successful refresh, **When** index constituent data is gathered,
   **Then** the system produces current S&P 500 and Nasdaq-100 constituent
   files from Wikipedia.

---

### User Story 2 - Access Constituents As Reference Data (Priority: P2)

As a market-data user, I want current constituent lists available as plain
files, so I can inspect or reuse the latest index membership outside the chart
view.

**Why this priority**: Constituents are secondary to the primary market-history
workflow, but they provide important supporting reference data and downstream
consumers for later features.

**Independent Test**: Can be fully tested by retrieving the generated
constituent files after a refresh and confirming they contain current entries
for both supported indexes.

**Acceptance Scenarios**:

1. **Given** a completed refresh, **When** a user opens the constituent output,
   **Then** the user can access current S&P 500 constituents in a repository
   friendly file format.
2. **Given** a completed refresh, **When** a user opens the constituent output,
   **Then** the user can access current Nasdaq-100 constituents in a repository
   friendly file format.

### Edge Cases

- What happens when the ticker configuration includes duplicates?
- How does the system handle an invalid or delisted ticker symbol?
- What happens when one source refresh succeeds and another fails in the same
  run?
- How does the system behave when a source returns no rows for a configured
  ticker?
- What happens when the Wikipedia page structure changes and one constituent
  list cannot be extracted?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST read the set of tracked tickers from a maintained
  configuration file rather than from hardcoded values.
- **FR-002**: The system MUST fetch historical OHLCV data from Yahoo Finance for
  every configured ticker.
- **FR-003**: The system MUST derive quote volume for every fetched row so users
  can compare nominal trading activity with price history.
- **FR-004**: The system MUST fetch current S&P 500 constituent data from
  Wikipedia.
- **FR-005**: The system MUST fetch current Nasdaq-100 constituent data from
  Wikipedia.
- **FR-006**: The system MUST persist refreshed market-history datasets in plain
  files suitable for repository storage and later web publication.
- **FR-007**: The system MUST persist constituent datasets in a repository
  friendly plain-file format.
- **FR-008**: The system MUST support unattended refresh runs and manually
  triggered refresh runs.
- **FR-009**: The system MUST publish a web-accessible view of the refreshed
  datasets.
- **FR-010**: The published market view MUST let users inspect price history,
  quote-volume history, and VIX context for configured tickers.
- **FR-011**: The published market view MUST use the latest successful refresh
  output available at publication time.
- **FR-012**: The system MUST report refresh failures in a way that makes it
  clear which source or ticker did not update successfully.
- **FR-013**: The system MUST avoid replacing the last successful output for a
  dataset with an empty result unless the empty result is explicitly valid.

### Key Entities *(include if feature involves data)*

- **Ticker Configuration**: The maintained list of ticker symbols that defines
  which historical market datasets are refreshed and published.
- **Ticker History Dataset**: Historical OHLCV records plus derived quote volume
  for one configured ticker over time.
- **Constituent Dataset**: The current member list for a supported index,
  captured from Wikipedia in a plain-file format.
- **Refresh Run Result**: The recorded outcome of one refresh attempt,
  including which datasets updated successfully and which failed.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can add or remove a tracked ticker by editing only the
  configuration file and see that change reflected in the next successful
  refresh.
- **SC-002**: 100% of successful refresh runs produce current plain-file outputs
  for all configured ticker histories and both supported constituent datasets.
- **SC-003**: A user can inspect the generated market and constituent files for
  configured tickers within 30 seconds of a successful refresh completing.
- **SC-004**: Constituent outputs are written with a stable schema so downstream
  consumers can parse them without per-run format changes.
- **SC-005**: When a refresh partially fails, the user can identify the failed
  source or ticker from the reported run outcome without reading source code.

## Assumptions

- The first release targets repository maintainers and analysts who are
  comfortable editing a simple configuration file.
- The system refreshes daily historical data rather than intraday or real-time
  data.
- VIX context is treated as one of the configured market datasets fetched and
  persisted alongside the other configured symbols.
- Existing repository workflows will run refreshes and commit the resulting
  data artifacts.

## Out of Scope

- Real-time streaming prices or intraday updates
- Portfolio tracking, alerts, or trade execution features
- A browser UI, charting layer, or GitHub Pages deployment
- Historical backtesting or strategy simulation
