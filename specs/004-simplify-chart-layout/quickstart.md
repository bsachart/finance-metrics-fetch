# Quickstart: Simplify Chart Layout

## 1. Verify the ticker-first layout

1. Run `cd ui && npm run build`.
2. Open the built dashboard locally or through the dev server.
3. Confirm the ticker workspace shows the main chart before status cards or
   constituent tables.
4. Confirm the page title is compact rather than a large hero block.

## 2. Verify the VIX overlay behavior

1. Open the `Tickers` section.
2. Select a non-VIX symbol such as `VOO` or `MSFT`.
3. Confirm VIX is visible by default on the chart.
4. Toggle `Show VIX` off and on.
5. Confirm the selected symbol, lookback, and bar period stay unchanged.
6. Select `^VIX` directly and confirm the chart shows the VIX series without a
   duplicate overlay.

## 3. Verify separated navigation

1. Switch from `Tickers` to `Market Constituents`.
2. Confirm the constituent view shows index browsing without ticker chart
   controls in the same workspace.
3. Switch back to `Tickers`.
4. Confirm the previous ticker selections remain intact.
5. Confirm refresh status appears as secondary information below the main
   workspace.

## 4. Verify repository checks

1. Run `cd ui && npm run check`.
2. Run `cd ui && npm run test`.
3. Run `cd ui && npm run build`.
