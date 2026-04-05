# Quickstart: Simplified Market UI

## 1. Refresh and verify published data

```bash
uv run pytest tests/unit/test_constituent_outputs.py tests/integration/test_constituent_outputs.py
```

## 2. Verify the packaged UI data and type checks

```bash
cd ui && npm run check
```

## 3. Run UI tests

```bash
cd ui && npm run test
```

## 4. Build the static dashboard

```bash
cd ui && npm run build
```

## 5. Validate expected user-visible outcomes

1. Open the built site or local dev server.
2. Confirm the default market view shows candlesticks instead of a simple line chart.
3. Confirm nominal volume appears in a lower pane of the same chart component and is visually normalized for readability.
4. Confirm price and nominal-volume histograms are still visible without using a dedicated distribution tab.
5. Confirm constituents are available under a separate indices tab.
6. Confirm unchanged constituent memberships no longer create diffs caused only by `fetched_at`.
7. Confirm a successful refresh writes a dated constituent snapshot such as `data/constituents/history/sp500/2025-07-01.csv`.
