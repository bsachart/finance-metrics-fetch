# Research: Simplify Chart Layout

## Decision: Keep one chart component and add VIX as an optional overlay inside it

Rationale: The user wants VIX always available by default but hideable. The
smallest solution is to extend the existing chart component so it can render the
selected ticker plus an optional VIX line, instead of keeping a separate VIX
card or creating a second chart.

Alternatives considered:
- Keep the separate VIX context section: rejected because it adds another block
  and splits one analytical task across two areas.
- Render VIX on a separate chart: rejected because it adds visual and code
  duplication.

## Decision: Split navigation into Tickers and Market Constituents

Rationale: The current `Market` and `Indices` split still mixes ticker choice,
chart analysis, and constituent browsing in one tall page. A clearer top-level
split gives each task its own simpler workspace.

Alternatives considered:
- Keep the current market/indices tabs and just restyle them: rejected because
  it leaves the current conceptual mixing in place.
- Add more nested tabs: rejected because it increases navigation depth.

## Decision: Move the chart above status and secondary information

Rationale: The chart is the main job to be done. Putting it first shortens the
path from page load to analysis and allows supporting details to become lighter
secondary content.

Alternatives considered:
- Keep the current order and shrink the header only: rejected because it still
  leaves the primary workspace below several cards.
- Remove status entirely: rejected because refresh status still has value as a
  secondary panel.

## Decision: Simplify by removing duplicate market framing rather than adding new summary sections

Rationale: The current route repeats context in the hero, summary chips, VIX
section, and chart heading. The better simplification is to keep a compact page
title, one top chart workspace, and one secondary status area.

Alternatives considered:
- Replace the removed sections with new compact cards: rejected because it
  preserves the same structural complexity under different visuals.
- Introduce new layout-only wrapper components: rejected because it spreads the
  same behavior across more files.

