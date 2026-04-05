# Research: Command Center Finder

## Decision: Use one top-level finder instead of separate search, filters, and bottom list

**Rationale**: The dashboard currently asks users to scan multiple zones before
they can analyze the chart. One finder surface reduces navigation complexity
and returns more of the page to the chart.

**Alternatives considered**:

- Keep the current search plus filter row plus bottom list: preserves the same
  multi-zone cognitive load.
- Move browsing to a separate route: increases navigation overhead for a task
  that should remain in the active analytical workspace.

## Decision: Implement the finder as an opaque modal rather than a new route

**Rationale**: A local overlay keeps users anchored in the current chart
context, feels faster, prevents background clutter from competing with the finder,
and avoids routing complexity or extra persistence needs.

**Alternatives considered**:

- Full modal route transition: too heavy for simple ticker switching.
- Inline expandable list with no overlay: still leaves too much permanent page clutter.

## Decision: Show finder change cues as percentages, not absolute moves

**Rationale**: Percentage change compares meaningfully across tickers with very
different prices, while absolute moves do not.

**Alternatives considered**:

- Keep raw absolute changes: less useful for cross-symbol scanning.
- Show both raw and percentage changes: denser but noisier than needed for quick discovery.

## Decision: Collapse refresh issues into a header indicator

**Rationale**: Large success-state status boxes steal space from the chart. A
small indicator next to `Data as of` preserves context without creating a footer block.

**Alternatives considered**:

- Keep the footer status card: too heavy in the common healthy state.
- Hide all status entirely: removes useful signal when refreshes actually fail.

## Decision: Keep finder result summaries tied to the active timeframe

**Rationale**: Search results and the main chart must describe the same period
or users lose trust in the analytical context.

**Alternatives considered**:

- Fixed sparkline windows inside finder rows: easier to compute but misleading.
- No row-level trend summary: quieter but loses useful density in the finder.

## Decision: Promote active ticker and latest price into the main ticker header

**Rationale**: Once lower-page ticker browsing is removed, the reclaimed space
should strengthen the primary analytical context, not fill with new chrome.

**Alternatives considered**:

- Keep the current smaller heading: misses a high-leverage clarity improvement.
- Add more summary cards: reintroduces the visual competition the feature is trying to remove.

## Decision: Simplify the legend and tooltip using data-first hierarchy

**Rationale**: Static legend chips and all-caps tooltip section labels create
visual noise. A plain legend and a tighter tooltip keep the user’s attention on
the actual values.

**Alternatives considered**:

- Keep pill legend chips: misleadingly button-like.
- Keep explicit tooltip section headers: easy to implement but too heavy for the data density required.

## Decision: Add a keyboard shortcut for the finder

**Rationale**: `Cmd+K` or `Ctrl+K` matches analytical-tool expectations and
reduces the distance between intent and action without adding another visible control.

**Alternatives considered**:

- Mouse-only trigger: functional but slower and less tool-like.
- Multiple shortcuts: more power but unnecessary for the current slice.
