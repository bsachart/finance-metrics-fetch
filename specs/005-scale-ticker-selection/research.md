# Research: Scalable Ticker Selection

## Decision: Prefer search-first selection over a larger card grid

**Rationale**: Large card grids scale poorly in both scan time and vertical
space. A search-first control reduces cognitive load and lets users reach any
symbol directly without expanding the dashboard framing.

**Alternatives considered**:

- Larger paginated card grids: still visually noisy and scroll-heavy.
- A full secondary route for ticker browsing: adds navigation complexity for a
  problem that can stay inside the current workspace.

## Decision: Use recently viewed tickers as the first quick-access watchlist

**Rationale**: Recently viewed symbols give immediate utility without requiring
  a larger saved-portfolio feature or extra UI for explicit watchlist
  management. This keeps the feature high-leverage and small.

**Alternatives considered**:

- Explicit favorites only: adds more controls before the search experience is fixed.
- No quick-access context: forces users to repeat the same search work.

## Decision: Use published index memberships as compact ticker filters

**Rationale**: `S&P 500` and `Nasdaq-100` are already meaningful categories in
  the repository and require no new taxonomy work. They provide useful
  progressive disclosure while keeping the interface simple.

**Alternatives considered**:

- Sector filters: would require new classification logic for non-constituent symbols.
- Role filters only: less useful for larger lists of normal equities.

## Decision: Show compact trend indicators in result rows only when data is available

**Rationale**: Miniature trend indicators add high information density to the
  compact list, but they should degrade cleanly when a symbol lacks enough
  history. Making them optional preserves usability without introducing failure states.

**Alternatives considered**:

- Require a trend indicator for every row: too brittle for sparse or partial data.
- Omit trend indicators entirely: loses a high-value scanning cue for larger universes.

## Decision: Keep chart controls and market workspace stable after ticker selection

**Rationale**: The current chart workspace was recently simplified. This
feature should improve discovery without reopening unrelated layout churn.

**Alternatives considered**:

- Reworking the entire route again: too large for this slice.
- Splitting ticker browsing into a new standalone panel: adds surface area without clear payoff.

## Decision: Treat VIX as contextual overlay information with stronger grounding

**Rationale**: VIX should remain visually secondary to the selected ticker while
still becoming easy to read. Grounding it with a zero baseline, filled area,
and shared hover context communicates magnitude without forcing users to hunt
across competing chart elements.

**Alternatives considered**:

- Leaving VIX as a thin floating line: too easy to lose against the chart.
- Making VIX the primary chart series: inverts the dashboard’s main task.
