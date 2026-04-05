# Quickstart: Scalable Ticker Selection

## 1. Verify search-first selection

1. Run `cd ui && npm run build`.
2. Open the dashboard.
3. Confirm the ticker workspace no longer uses the large card grid as the primary selector.
4. Type part of a symbol or company name into the ticker search control.
5. Confirm the compact result list narrows immediately.
6. Select a result and confirm the market chart updates to the chosen ticker.

## 2. Verify recently viewed quick access

1. Select several different tickers from the search results.
2. Confirm a compact `Recently viewed` strip appears with those symbols.
3. Select a ticker from that strip.
4. Confirm the market chart switches without reopening search.
5. Reload the page and confirm the recent strip is restored for still-valid symbols.

## 3. Verify filter behavior

1. Open the ticker workspace.
2. Apply `S&P 500`, `Nasdaq-100`, and `All`.
3. Confirm the compact result list updates for each filter.
4. Confirm symbols outside the index datasets remain discoverable under `All`.

## 4. Verify compact list scanning

1. Review the compact ticker list with many symbols available.
2. Confirm each row shows symbol and label in a compact form.
3. Confirm rows with enough history show a small trend indicator.
4. Confirm the active ticker is visually distinct from other rows.

## 5. Verify calmer chart context

1. Toggle VIX on in the ticker workspace.
2. Confirm the VIX presentation is easier to follow than a thin floating line.
3. Confirm the VIX scale is grounded from zero.
4. Confirm the hover context shows both ticker values and VIX values together.
5. Confirm volume bars use a quieter palette than price candles.

## 6. Verify repository checks

1. Run `cd ui && npm run check`.
2. Run `cd ui && npm run test`.
3. Run `cd ui && npm run build`.
