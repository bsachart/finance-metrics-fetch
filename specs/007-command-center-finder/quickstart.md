# Quickstart: Command Center Finder

## 1. Verify the unified finder

1. Run `cd ui && npm run build`.
2. Open the ticker workspace.
3. Confirm the old bottom ticker list and separate filter row are gone.
4. Open the ticker finder from the header trigger.
5. Switch among `All`, `S&P 500`, and `Nasdaq-100`.
6. Search for a ticker, select it, and confirm the finder closes.
7. Confirm the background is visually blocked by the modal instead of bleeding through behind the results.

## 2. Verify keyboard shortcut behavior

1. Open the ticker workspace.
2. Press `Cmd+K` on macOS or `Ctrl+K` on another keyboard.
3. Confirm the ticker finder opens immediately.
4. Use arrow keys to move through results and press `Enter` to select a ticker.
5. Confirm normal typing still works when focus is already inside a text input.

## 3. Verify header and chart emphasis

1. Select several tickers from the finder.
2. Confirm the header updates to show the active ticker and latest published price.
3. Confirm the chart occupies more vertical space than the prior layout.

## 4. Verify synchronized finder trend summaries

1. Change the active timeframe.
2. Reopen the finder.
3. Confirm result-row trend summaries reflect the new timeframe.
4. Confirm the finder `Change` column is shown as a percentage.

## 5. Verify chart readability

1. Hover the chart.
2. Confirm the tooltip emphasizes the latest price first and uses compact OHLC, `Vol`, and VIX lines.
3. Confirm the legend appears as plain chart reference instead of pill-shaped controls.
4. Confirm VIX uses its own pane and right-side scale with matching line, tooltip, and axis color.
5. Confirm the grid remains light and dashed.

## 6. Verify status behavior

1. Load a healthy success-state snapshot.
2. Confirm no empty failure section or placeholder failure text is shown.
3. Confirm any refresh issue is represented only by the small indicator beside `Data as of`.

## 7. Verify repository checks

1. Run `cd ui && npm run check`.
2. Run `cd ui && npm run test`.
3. Run `cd ui && npm run build`.
