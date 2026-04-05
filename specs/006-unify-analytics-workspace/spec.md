# Feature Specification: Unified Analytics Workspace

**Feature Branch**: `006-unify-analytics-workspace`  
**Created**: 2026-04-05  
**Status**: Draft  
**Input**: User description: "To synthesize all feedback into a cohesive, John Ousterhout-inspired design approach for the market dashboard: make timeframe state global so chart and ticker-table sparklines always stay synchronized; rename the table trend header to reflect the active timeframe; improve VIX and volume visual decoupling by making VIX instantly identifiable by color, keeping a dedicated volatility axis and grounded baseline, and ensuring the line remains readable over other marks; restructure tooltip information into clear price, volume, and indicator groups; remove redundant or noisy status and chart labels; simplify grid treatment and only show problem alerts when something is actually wrong; preserve sparkline integrity with consistent change colors and baseline-safe rendering; keep the interface simpler, lower-noise, and more unified as an analytical tool rather than a collection of widgets. Do the full specify, plan, tasks, and implementation workflow."

**Note**: Keep this document focused on user-visible behavior and scope.
Implementation choices, stack details, and internal architecture belong in
`plan.md` or a companion project spec when they are not externally visible.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Analyze the active ticker with one coherent timeframe (Priority: P1)

As a dashboard user, I want one timeframe choice to control the full ticker
workspace so the chart, tooltip context, and trend summaries all describe the
same period.

**Why this priority**: The active timeframe is the main mental model for the
dashboard. If the main chart and supporting trend summaries drift apart, the
workspace becomes misleading.

**Independent Test**: Can be fully tested by loading the ticker workspace,
changing the timeframe, and confirming that the main chart and published-ticker
trend summaries all update to the same window without conflicting labels.

**Acceptance Scenarios**:

1. **Given** the ticker workspace is visible, **When** the user changes the
   active timeframe, **Then** the main chart refreshes to that timeframe and
   every published-ticker trend summary reflects the same period.
2. **Given** the published-ticker list shows trend summaries, **When** the
   timeframe changes, **Then** the trend column label makes the active
   timeframe explicit.
3. **Given** the user changes the timeframe, **When** the dashboard rerenders,
   **Then** no conflicting timeframe context remains visible in the chart area
   or ticker list.

---

### User Story 2 - Read price, volume, and VIX without visual conflict (Priority: P2)

As a dashboard user, I want price, volume, and VIX to remain visually distinct
so I can compare market action and volatility without chart clutter.

**Why this priority**: Once timeframe context is coherent, the next highest
value improvement is removing chart ambiguity and making VIX instantly legible.

**Independent Test**: Can be tested by enabling VIX, hovering the chart, and
confirming that price, volume, and VIX each have clear scale, color, and
tooltip context without hiding one another.

**Acceptance Scenarios**:

1. **Given** VIX is visible, **When** the user scans the chart, **Then** the
   VIX series, its axis text, and its tooltip label all share the same visual
   identity.
2. **Given** VIX is visible over the lower chart context, **When** volume bars
   and VIX overlap vertically, **Then** the VIX remains readable and is not
   visually swallowed by the bars.
3. **Given** the user hovers any timestamp on the chart, **When** the tooltip
   appears, **Then** price data, volume, and indicator data are grouped into
   clearly separate sections.
4. **Given** the lower chart context includes volatility, **When** the user
   interprets magnitude, **Then** the volatility scale remains grounded to a
   visible zero baseline.
5. **Given** the chart shows a legend, **When** the user scans it, **Then**
   the legend does not look like a dormant button and uses the same colors as
   the chart series it names.

---

### User Story 3 - Work in a quieter, lower-noise dashboard (Priority: P3)

As a dashboard user, I want non-essential labels, status text, and visual
scaffolding reduced so the data remains the hero of the page.

**Why this priority**: Noise reduction improves cognitive ease, but the product
still delivers value without every visual cleanup item in place.

**Independent Test**: Can be tested by viewing success and failure states,
confirming that only meaningful alerts remain, and checking that the chart area
no longer contains redundant labels or heavy grid treatment.

**Acceptance Scenarios**:

1. **Given** there are no refresh failures, **When** the dashboard renders,
   **Then** it does not show placeholder failure text or redundant status boxes.
2. **Given** the chart is visible, **When** the user reads the main workspace,
   **Then** redundant indicator labels are removed and the grid no longer
   dominates the data.
3. **Given** ticker trend summaries are visible, **When** the user compares
   rows, **Then** positive and negative trend cues are consistent between the
   numeric change and the sparkline.

### Edge Cases

- What happens when a timeframe change leaves too little data to render a
  meaningful sparkline or chart segment?
- How does the chart behave when VIX data is unavailable for the active symbol
  window even though price and volume are available?
- What happens when there are refresh warnings but no failed symbols?
- How does the tooltip behave when one data block is missing for a hovered date?
- What happens when a ticker list row has flat performance over the active timeframe?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST treat the selected timeframe as shared workspace
  state for the active ticker chart and the published-ticker trend summaries.
- **FR-002**: The system MUST update published-ticker sparkline summaries when
  the active timeframe changes.
- **FR-003**: The system MUST label the published-ticker trend column so the
  active timeframe is obvious to the user.
- **FR-004**: The system MUST preserve a single coherent chart-control area in
  which timeframe remains the primary control.
- **FR-005**: The system MUST render VIX with a dedicated visual identity that
  is consistent across the plotted series, axis text, and tooltip label.
- **FR-006**: The system MUST ensure the VIX series remains readable even when
  displayed in the same lower analytical context as volume.
- **FR-007**: The system MUST display VIX against its own visible scale rather
  than implying that it shares the price scale.
- **FR-008**: The system MUST anchor the volatility display to a visible zero baseline.
- **FR-009**: The system MUST present tooltip content in separate visual groups
  for price data, volume, and indicator data.
- **FR-010**: The system MUST avoid static legend elements that visually imply
  click behavior when no click behavior exists.
- **FR-011**: The system MUST use consistent trend coloring between a ticker
  row’s numeric change cue and its sparkline direction cue.
- **FR-012**: The system MUST ensure sparklines remain visually trustworthy and
  do not exaggerate small movement through misleading scaling.
- **FR-013**: The system MUST reduce the visual dominance of chart scaffolding
  so grid treatment supports reading rather than competing with data.
- **FR-014**: The system MUST remove redundant indicator or status labels when
  the chart itself already communicates the same information.
- **FR-015**: If a chart legend is shown, the system MUST render it as simple
  non-button visual reference rather than as pill-shaped controls.
- **FR-016**: The system MUST suppress placeholder failure language such as
  `None` when there is no actionable failure to show.
- **FR-017**: The system MUST continue to surface refresh or failure context
  when there is an actual issue requiring attention.
- **FR-018**: The system MUST continue to function when any one of price,
  volume, or VIX is unavailable for part of the selected timeframe by degrading
  gracefully instead of breaking the workspace.

### Key Entities *(include if feature involves data)*

- **Active Timeframe Context**: The shared period selection that drives the main
  chart and all ticker-list trend summaries.
- **Ticker Trend Summary**: The compact row-level signal for a ticker,
  including change direction, sparkline, and the timeframe context it reflects.
- **Indicator Tooltip Block**: The grouped hover content for one hovered date,
  broken into price, volume, and indicator sections.
- **Volatility Display State**: The visible VIX presentation, including its
  dedicated scale, baseline, and color identity.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: When users change timeframe, the main chart and ticker-list trend
  summaries update to the new window in one interaction with no contradictory
  timeframe label remaining on screen.
- **SC-002**: In usability review, users can correctly identify which visual
  elements represent price, volume, and VIX without reading explanatory body text.
- **SC-003**: Users can read a hovered point’s price, volume, and VIX values
  from one tooltip without confusing one block for another.
- **SC-004**: The default success-state ticker workspace contains no placeholder
  failure text and no redundant status box that adds no new information.
- **SC-005**: Users can compare ticker-row trend cues across the active list
  without at least one row appearing directionally inconsistent with its sparkline.

## Assumptions

- The current ticker workspace remains the primary surface for this feature and
  the constituent workspace stays out of scope except where shared controls or labels overlap.
- The existing published market history remains sufficient to derive ticker-row
  trend summaries for most listed symbols.
- The current dashboard already has a tooltip and chart control surface that
  can be refined rather than replaced wholesale.
- Recent local preference behavior remains valid and does not need new storage
  concepts beyond the existing timeframe and view state.

## Out of Scope

- Replacing the constituent-browsing workflow.
- Adding new external data sources, indicators beyond VIX, or server-backed user settings.
- Introducing portfolio management, alerting, or collaborative features.
