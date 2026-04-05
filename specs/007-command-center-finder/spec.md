# Feature Specification: Command Center Finder

**Feature Branch**: `007-command-center-finder`  
**Created**: 2026-04-05  
**Status**: Draft  
**Input**: User description: "Here is the summary of the major changes required to hit that Ousterhout-level of simple, precise, and concise design: merge finder, filters, and list into one persistent Ticker Finder at the top; remove the separate Published Tickers list and filter row; make the finder open a modal or dropdown organized by All, S&P 500, and Nasdaq-100 tabs; use the reclaimed space for a larger chart; keep timeframe synchronized across the main chart, VIX, and finder sparklines; replace pill legend chips with a clean text-only legend; keep VIX on its own right-side scale with consistent semantic color; group tooltip data hierarchically; only show status when there is an actual problem; display the selected ticker name and live price in the reclaimed header area; add Cmd+K or Ctrl+K to open the finder; and keep dashed airy grid lines. Go through the planning, tasks, and implementation phases too."

**Note**: Keep this document focused on user-visible behavior and scope.
Implementation choices, stack details, and internal architecture belong in
`plan.md` or a companion project spec when they are not externally visible.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Open one command-center finder for all ticker navigation (Priority: P1)

As a dashboard user, I want one persistent ticker finder to handle search,
filtering, and ticker switching so I do not have to scan multiple disconnected
selection surfaces.

**Why this priority**: This is the central simplification. If ticker discovery
still lives in separate controls and list areas, the dashboard keeps the same
multi-zone cognitive load.

**Independent Test**: Can be fully tested by opening the finder from the top
bar, switching tabs, searching for a symbol, selecting it, and confirming the
ticker workspace updates without using a separate filter row or bottom list.

**Acceptance Scenarios**:

1. **Given** the ticker workspace is visible, **When** the user opens the
   ticker finder from the header trigger or `Cmd+K` / `Ctrl+K`, **Then**
   search, filter tabs, recent picks, and results are available in one modal surface.
2. **Given** the finder is open, **When** the user switches among `All`,
   `S&P 500`, and `Nasdaq-100`, **Then** the visible result set updates inside
   the finder without changing the main workspace layout.
3. **Given** a result is visible in the finder, **When** the user selects it,
   **Then** the active ticker changes and the finder closes.
4. **Given** the user is in the ticker workspace, **When** they press `Cmd+K`
   or `Ctrl+K`, **Then** the ticker finder opens immediately with the search field focused.
5. **Given** the finder is open, **When** the user presses arrow keys and `Enter`,
   **Then** they can move through the visible results and select one without leaving the keyboard.

---

### User Story 2 - See one coherent market header and chart context (Priority: P2)

As a dashboard user, I want the top of the ticker workspace to show the active
ticker, current price, and one larger chart so the page reads like a focused
analysis surface.

**Why this priority**: Once navigation is simplified, the next highest-value
improvement is using the reclaimed space to make the actual market context more readable.

**Independent Test**: Can be tested by selecting different tickers, confirming
the header reflects the selected symbol and latest price, and confirming the
chart has more vertical space than before.

**Acceptance Scenarios**:

1. **Given** a ticker is selected, **When** the ticker workspace renders,
   **Then** the active symbol and its latest published price are shown in the
   main ticker header area while the chart remains the dominant visual surface.
2. **Given** the user switches to another ticker, **When** the workspace
   updates, **Then** the header content updates to the new ticker without stale labels.
3. **Given** the command-center finder replaces the old bottom list and filter
   row, **When** the chart renders, **Then** the chart has visibly more space
   in the main workspace.

---

### User Story 3 - Read chart context without redundant or deceptive UI (Priority: P3)

As a dashboard user, I want the chart legend, tooltip, VIX scale, and status
surfaces to remain truthful and quiet so the data is easier to trust and parse.

**Why this priority**: These refinements matter, but the dashboard still works
without every polish item if the command-center finder and main header are already improved.

**Independent Test**: Can be tested by hovering the chart, enabling VIX,
reading the legend, and confirming only actionable status surfaces remain.

**Acceptance Scenarios**:

1. **Given** the chart shows a legend, **When** the user reads it, **Then**
   it appears as plain chart reference rather than as a dormant control.
2. **Given** the user hovers the chart, **When** tooltip content appears,
   **Then** the tooltip emphasizes the latest price first, keeps OHLC compact,
   and uses minimal labeling for volume and VIX.
3. **Given** VIX is visible, **When** the user scans the chart, **Then** VIX
   reads from its own right-side scale with the same color identity in the line
   and tooltip label.
4. **Given** the dashboard is in a healthy success state, **When** the page
   renders, **Then** it does not show empty failure sections or placeholder status text.
5. **Given** the dashboard has refresh issues, **When** the page renders,
   **Then** the issue is summarized as a small status indicator near `Data as of` rather than as a large footer card.

### Edge Cases

- What happens when the user opens the finder and no results match the current query?
- How does the finder behave when an index tab has no matching symbols in the current published snapshot?
- What happens when the active ticker has market history but not enough recent points for a meaningful finder sparkline?
- How does the chart header behave if the active ticker has no latest close in the published snapshot?
- What happens when keyboard shortcut focus is inside an input that should keep receiving typed characters?
- What happens when a user opens the finder on a narrow screen and needs keyboard navigation without a visible close button?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST replace the separate ticker filter row and bottom
  published-ticker list with one persistent top-level ticker finder workflow.
- **FR-002**: The system MUST provide ticker search and index-based browsing in
  the same finder surface.
- **FR-003**: The system MUST organize finder result browsing with `All`,
  `S&P 500`, and `Nasdaq-100` views when those datasets are available.
- **FR-004**: The system MUST allow users to open the ticker finder from a
  visible top-level trigger in the dashboard header.
- **FR-005**: The system MUST allow users to open the ticker finder with
  `Cmd+K` on macOS and `Ctrl+K` on other keyboards.
- **FR-006**: The system MUST close the finder after a ticker selection and
  update the active ticker workspace immediately.
- **FR-006a**: The system MUST render the finder as an opaque modal overlay so
  background dashboard content does not visually bleed through.
- **FR-006b**: The system MUST focus the finder search field automatically when
  the modal opens.
- **FR-006c**: The system MUST support arrow-key result navigation and `Enter`
  selection while the modal is open.
- **FR-007**: The system MUST keep timeframe state synchronized across the main
  chart and the trend summaries shown inside the finder.
- **FR-008**: The system MUST reclaim the vertical space removed with the old
  filter row and bottom list so the chart occupies more of the primary workspace.
- **FR-009**: The system MUST show the active ticker symbol and latest published
  price prominently in the ticker workspace header.
- **FR-010**: The system MUST update the active ticker header immediately when
  the user selects a different symbol.
- **FR-011**: The system MUST render the chart legend as simple visual
  reference rather than as pill-shaped pseudo-controls.
- **FR-012**: The system MUST keep tooltip content grouped into price, volume,
  and indicator sections.
- **FR-013**: The system MUST present the latest price as the visual focus of
  the tooltip and keep OHLC details compact rather than stacked under heavy headings.
- **FR-013a**: The system MUST show change in the finder as a percentage rather
  than as an absolute point move.
- **FR-014**: The system MUST display VIX against its own right-side scale when visible.
- **FR-015**: The system MUST use the same visual identity for the VIX line,
  VIX tooltip label, and VIX scale text.
- **FR-016**: The system MUST keep tooltip labeling concise by using compact
  labels such as `Vol` and by avoiding redundant all-caps section headings.
- **FR-017**: The system MUST keep the chart grid visually light and dashed.
- **FR-018**: The system MUST suppress empty success-state failure UI and only
  show status surfaces when they communicate active issues or useful current state.
- **FR-018a**: The system MUST not render a large refresh-issues card in the
  healthy success state.
- **FR-019**: The system MUST continue to work when a finder tab has no results
  by presenting an empty-state message inside the finder rather than breaking navigation.
- **FR-020**: The system MUST preserve local preference restoration for the
  active ticker and recent context when those values remain valid in the current snapshot.

### Key Entities *(include if feature involves data)*

- **Ticker Finder State**: The current open or closed state, query text, active
  browse tab, keyboard highlight position, and visible result set for the unified finder surface.
- **Finder Result Row**: The compact ticker entry shown inside the finder,
  including symbol, label, percentage change cue, and timeframe-aware trend summary.
- **Active Ticker Header**: The currently selected ticker identity shown above
  the chart, including symbol and latest published price.
- **Chart Context State**: The current legend, tooltip groups, VIX scale, and
  status surfaces that make the analytical display readable.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can reach and switch to any published ticker from one
  finder surface without using a separate bottom list or separate filter row.
- **SC-001a**: Users can move through finder results entirely by keyboard and
  select a ticker without touching the mouse.
- **SC-002**: The ticker workspace has fewer primary scan zones than before,
  with ticker navigation concentrated in the top area and analysis concentrated
  in the chart area.
- **SC-003**: Users can identify the active ticker and latest published price
  at a glance after every ticker switch.
- **SC-004**: Users can distinguish chart legend text from actionable controls
  without trial clicks.
- **SC-005**: Users can correctly read tooltip price, volume, and VIX context
  without confusing one group for another.

## Assumptions

- The existing ticker workspace remains the primary scope and the constituents
  workspace stays structurally separate.
- Existing published market history remains the source for active price and
  finder trend summaries.
- The current local-preference model can be extended for finder open-state
  behavior without introducing backend storage.
- A compact modal or dropdown finder is sufficient for the current published
  symbol universe and does not require a new route.

## Out of Scope

- New backend services, live market quotes, or server-synced user preferences.
- Replacing the constituents workspace with the command-center finder.
- Adding portfolio, alerting, or multi-ticker comparison workflows in this feature.
