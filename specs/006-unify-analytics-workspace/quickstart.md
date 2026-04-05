# Quickstart: Unified Analytics Workspace

## 1. Verify shared timeframe behavior

1. Run `cd ui && npm run build`.
2. Open the dashboard ticker workspace.
3. Change the timeframe.
4. Confirm the main chart updates to the new timeframe.
5. Confirm the ticker-table trend header reflects the active timeframe.
6. Confirm ticker-row sparklines and change summaries update to the same period.

## 2. Verify VIX readability

1. Enable VIX in the ticker workspace.
2. Confirm VIX uses one consistent color across the plotted series, axis text,
   and tooltip label.
3. Confirm VIX remains readable above the lower-pane context and does not blend
   into volume bars.
4. Confirm the volatility pane still shows a visible zero baseline.
5. Confirm any visible legend reads as plain chart reference, not as a dormant button.

## 3. Verify tooltip grouping

1. Hover the chart at several dates.
2. Confirm tooltip content is grouped into price, volume, and indicator sections.
3. Confirm missing data in one group does not break the other groups.

## 4. Verify noise reduction

1. Load the dashboard when status is healthy.
2. Confirm no placeholder failure text such as `None` is shown.
3. Confirm redundant indicator labels are removed from the chart area.
4. Confirm the grid treatment is visually lighter than before.

## 5. Verify trend consistency

1. Compare several ticker rows with positive and negative movement.
2. Confirm the row-level change cue and sparkline direction use consistent semantics.
3. Confirm flat or sparse rows degrade gracefully without misleading spikes.

## 6. Verify repository checks

1. Run `cd ui && npm run check`.
2. Run `cd ui && npm run test`.
3. Run `cd ui && npm run build`.
