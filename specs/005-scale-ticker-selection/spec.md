# Feature Specification: Scalable Ticker Selection

**Feature Branch**: `005-scale-ticker-selection`  
**Created**: 2026-04-05  
**Status**: Draft  
**Input**: User description: "If you scale to 100 tickers, the current "card-based" approach will collapse, creating a wall of noise that obscures the actual data. To follow Ousterhout’s principle of reducing complexity, you must move from "browsing a list" to "searching and filtering." ... Do the planning, tasks and implementation phases too."

**Note**: Keep this document focused on user-visible behavior and scope.
Implementation choices, stack details, and internal architecture belong in
`plan.md` or a companion project spec when they are not externally visible.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Find a ticker quickly (Priority: P1)

As a dashboard user, I want to search for a ticker from a single compact control
so I can reach any published symbol without scanning a large grid.

**Why this priority**: Search-first discovery is the core scalability fix. If
users cannot reach a ticker quickly, the interface fails once the symbol count grows.

**Independent Test**: Can be fully tested by loading the dashboard with a large
symbol set, typing a partial symbol or company name, selecting a result, and
seeing the chart update without using the old card grid.

**Acceptance Scenarios**:

1. **Given** the dashboard contains many published symbols, **When** the user
   types a partial symbol or label into the ticker search control, **Then**
   matching results are narrowed immediately and displayed in a compact result list.
2. **Given** matching results are shown, **When** the user selects one result,
   **Then** that symbol becomes the active ticker and the market chart updates.
3. **Given** the current active ticker is stored locally, **When** the user
   revisits the dashboard, **Then** the same active ticker is restored if it is
   still available in the published snapshot.
4. **Given** the user changes the active ticker, **When** the dashboard updates,
   **Then** the market-history title reflects the newly selected symbol immediately.

---

### User Story 2 - Keep recent context visible (Priority: P2)

As a dashboard user, I want a small watchlist of recent or pinned tickers so I
can switch among the symbols I care about without repeating the same search.

**Why this priority**: Once search is in place, the next highest-leverage
improvement is reducing repeat work for commonly revisited tickers.

**Independent Test**: Can be tested by selecting multiple symbols, confirming
they appear in the quick-access watchlist, and switching between them from the
watchlist without opening the search results.

**Acceptance Scenarios**:

1. **Given** the user has opened several tickers, **When** the dashboard
   renders the quick-access watchlist, **Then** it shows a compact list of the
   most recently viewed tickers with the active ticker clearly highlighted.
2. **Given** a ticker appears in the quick-access watchlist, **When** the user
   selects it, **Then** the dashboard updates the active ticker immediately.
3. **Given** the user has a stored watchlist, **When** the dashboard reloads,
   **Then** the watchlist order is restored from local preferences for symbols
   that still exist in the published snapshot.

---

### User Story 3 - Filter and scan the full universe (Priority: P3)

As a dashboard user, I want compact filtering and scanning tools for the full
published ticker universe so I can narrow the list before choosing a symbol.

**Why this priority**: This improves the browsing fallback when users do not
know the exact ticker and need light structure around the search space.

**Independent Test**: Can be tested by applying an index-membership filter,
loading the filtered compact list, and selecting a symbol from the filtered results.

**Acceptance Scenarios**:

1. **Given** the dashboard has published index constituent data, **When** the
   user applies a filter such as `All`, `S&P 500`, or `Nasdaq-100`, **Then**
   the ticker result set is reduced to symbols that match that filter.
2. **Given** the filtered result list is visible, **When** the user scans it,
   **Then** each row shows compact identifying context without the oversized card layout.
3. **Given** a symbol has enough published history to summarize recent trend,
   **When** it appears in the compact result list, **Then** the row includes a
   miniature trend indicator that helps the user compare symbols quickly.
4. **Given** the market chart is visible, **When** the user compares price
   movement with trading activity, **Then** the volume pane uses a quieter
   visual treatment than the price series.
5. **Given** VIX is visible as chart context, **When** the user scans the chart,
   **Then** VIX reads as a grounded overlay indicator with a clear baseline,
   synchronized hover context, and stronger legibility than a thin floating line.

### Edge Cases

- What happens when the search query returns no matches?
- How does the dashboard behave when a stored active ticker or watchlist item is
  no longer present in the published snapshot?
- How does filtering behave for symbols that are not part of the available
  index constituent datasets?
- What happens when a symbol has too little history to render a meaningful
  miniature trend indicator?
- What happens when the latest repository status has no failures to report?
- What happens when VIX is unavailable for the selected timeframe or aggregation?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST replace the primary ticker card grid with a
  search-first ticker selection workflow suitable for at least 100 published symbols.
- **FR-002**: The system MUST provide a persistent ticker search control that
  matches against ticker symbols and ticker labels.
- **FR-003**: The system MUST present search matches in a compact selectable list
  that identifies the symbol and label for each result.
- **FR-004**: The system MUST update the active market chart when the user
  selects a ticker from search results, the quick-access watchlist, or the
  compact full-result list.
- **FR-005**: The system MUST display the active ticker prominently near the top
  of the ticker workspace so users always know which symbol is loaded.
- **FR-006**: The system MUST ensure the market-history title and related
  header context always reflect the currently selected ticker.
- **FR-007**: The system MUST present timeframe and bar controls as one coherent
  control area with clear visual hierarchy, with timeframe emphasized as the
  primary chart-selection control.
- **FR-008**: The system MUST keep the VIX toggle inside the chart-control area
  while visually distinguishing it from timeframe and bar controls.
- **FR-009**: The system MUST maintain a compact quick-access watchlist of
  recently viewed tickers and persist that watchlist in local preferences.
- **FR-010**: The system MUST persist the active ticker and any quick-access
  watchlist state in local preferences and ignore stored values that are no
  longer valid in the current published snapshot.
- **FR-011**: The system MUST provide compact ticker filters that include `All`,
  `S&P 500`, and `Nasdaq-100` when those index constituent datasets are available.
- **FR-012**: The system MUST ensure filtered results include only symbols that
  match the active filter, while symbols outside available filters remain
  discoverable through the `All` filter and direct search.
- **FR-013**: The system MUST present the browsable ticker universe in a compact
  list or table layout instead of large cards.
- **FR-014**: The system MUST include a small trend indicator for result rows
  when enough published market history exists to derive one.
- **FR-015**: The system MUST clearly distinguish the active ticker from all
  other quick-access or result items.
- **FR-016**: The system MUST preserve the existing market chart workflow after
  selection, including timeframe, aggregation, and VIX controls.
- **FR-017**: The system MUST use a quieter, non-red-green visual treatment for
  volume so price direction remains the primary source of red-green emphasis.
- **FR-018**: The system MUST move the latest successful refresh timestamp into
  compact top-level ticker workspace context.
- **FR-019**: The system MUST suppress failure UI when there are no failures and
  surface compact failure context only when that information adds value.
- **FR-020**: The system MUST render VIX as a contextual indicator rather than
  a competing primary series.
- **FR-021**: The system MUST anchor the visible VIX scale to a zero baseline.
- **FR-022**: The system MUST use a filled VIX area treatment with a stronger
  stroke so the indicator remains readable against chart grid lines.
- **FR-023**: The system MUST display VIX values in the chart hover context
  alongside the active ticker values when VIX is visible.
- **FR-024**: The system MUST use threshold-based color emphasis so elevated VIX
  levels become visually distinct before users read exact values.
- **FR-025**: The system MUST reduce the visual dominance of price candles when
  VIX is toggled on so VIX can be read as the current focus indicator.
- **FR-026**: The system MUST continue to work when constituent datasets are
  missing by falling back to `All` and direct search without blocking ticker selection.

### Key Entities *(include if feature involves data)*

- **Ticker Search Entry**: A published symbol candidate shown in search and scan
  interfaces, including symbol, label, filter membership, quick-access state,
  and summary trend metadata.
- **Quick-Access Watchlist**: The ordered set of recently viewed or pinned
  ticker symbols kept for fast switching in the ticker workspace.
- **Ticker Filter**: A compact grouping control that narrows the searchable or
  browsable symbol universe by membership in published index datasets.
- **VixIndicatorState**: The derived chart context for VIX, including visible
  values, threshold state, baseline anchoring, and the current display style.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can reach any published ticker in at most 5 keystrokes and 1 selection from the search control.
- **SC-002**: The ticker selection area remains usable without vertical scrolling
  on a common laptop viewport when 100 published symbols are available.
- **SC-003**: At least 90% of switching actions among recently viewed tickers can
  be completed directly from the quick-access watchlist without reopening search.
- **SC-004**: Users can distinguish the active ticker, current filter, and
  available quick-access context at a glance without interpreting a large card grid.
- **SC-005**: Users can identify the latest successful refresh time without
  scrolling to a bottom-of-page status block.
- **SC-006**: Users can distinguish whether volatility is elevated from the chart
  alone without relying solely on tooltip values.

## Assumptions

- Published market history remains the source of truth for which symbols can be selected.
- Existing local preference storage can be extended to include watchlist and filter state.
- Index constituent datasets already present in the repository are the basis for
  ticker filters in this feature.
- The initial watchlist behavior will default to recently viewed tickers rather
  than a larger portfolio-management feature.
- The latest successful refresh timestamp remains useful summary context even
  when detailed status UI is suppressed.
- A single elevated-volatility threshold is sufficient for the first version of
  VIX emphasis in this feature.

## Out of Scope

- User-managed portfolios, alerts, or server-synced watchlists.
- Sector-level taxonomy beyond the index-based filters already described.
- Replacing the constituent browsing workspace in this feature.
