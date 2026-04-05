# Research: Simplified Market UI

## Decision: Generate a published asset manifest during UI packaging

Rationale: A static site cannot reliably enumerate available files at runtime,
so the cleanest way to avoid hardcoded symbol and index lists is to scan
`data/market/` and `data/constituents/` during `ui/scripts/copy-data.mjs` and
write a small manifest alongside the copied assets. The UI can then load one
stable JSON document to discover what is actually published.

Alternatives considered:
- Load only `config/tickers.json`: rejected because it cannot prove which files
  are actually published and would drift when data files are missing.
- Hardcode known indices in the UI: rejected because it repeats source truth and
  makes future index additions unnecessarily expensive.

## Decision: Extend repository config with explicit index metadata

Rationale: Symbols already have labels and roles in `config/tickers.json`; index
views need the same kind of human-readable metadata. Adding a small `indices`
section keeps labels, descriptions, and enablement in one maintained source
while the asset manifest confirms availability.

Alternatives considered:
- Infer index labels from filenames only: rejected because filenames are useful
  identifiers but poor user-facing labels.
- Add a separate `config/indices.json`: rejected because it introduces an extra
  config surface without enough value.

## Decision: Replace the line-plus-area market stack with one combined chart using candlesticks plus a lower volume pane

Rationale: The user explicitly wants an OHLC-style chart rather than a simple
line chart and wants price plus nominal volume on the same chart. Lightweight
Charts supports candlestick and histogram series across panes, so the change can
stay within the current library and avoid new charting dependencies.

Alternatives considered:
- Keep the existing line chart and add more metrics around it: rejected because
  it does not satisfy the user-visible requirement.
- Introduce a new charting library: rejected because it adds complexity without
  a clear payoff for this slice.

## Decision: Keep histograms but remove the dedicated distribution tab

Rationale: Histograms remain useful secondary context, but the old extra tab adds
navigation weight. Keeping them in the main market-analysis flow preserves the
capability while simplifying the interface.

Alternatives considered:
- Remove histograms entirely: rejected because the user explicitly asked to keep
  them.
- Keep the existing distribution tab: rejected because it conflicts with the
  simplification goal.

## Decision: Remove `fetched_at` from published CSV outputs and track constituent history with dated snapshot files

Rationale: Per-row fetch timestamps cause noisy repository diffs without
changing the actual dataset meaning. Removing them keeps CSV schemas stable, and
dated snapshot files preserve the historical audit trail in a much cleaner way.

Alternatives considered:
- Keep `fetched_at` but hide it in the UI: rejected because it still creates
  useless repository churn.
- Keep only the latest constituent file with no history: rejected because the
  user explicitly wants a per-day constituent log.
