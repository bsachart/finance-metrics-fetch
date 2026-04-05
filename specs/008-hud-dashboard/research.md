# Research: HUD-Centric Dashboard

## Decision: Replace floating tooltip and legend with one persistent HUD

**Rationale**: A fixed HUD removes hover jitter, keeps the chart canvas cleaner,
and gives users one stable place to read the current bar data.

**Alternatives considered**:

- Keep the floating tooltip and only restyle it: still leaves moving chrome over the chart.
- Keep both HUD and tooltip: duplicates the same information and adds noise.

## Decision: Keep the ticker finder inside the workspace control zone

**Rationale**: The finder influences the ticker chart directly, so it should be
grouped with the other chart controls instead of floating in the page header.

**Alternatives considered**:

- Leave the finder in the global header: creates broken visual rhythm and makes
  the workspace feel disconnected.
- Move finder into a separate sidebar: adds another scan zone with little payoff.

## Decision: Keep price on the left and move non-price reading to the right side

**Rationale**: Price is the primary chart reading. Indicators and volume should
not imply they share the same numeric scale as the candles.

**Alternatives considered**:

- Keep mixed scale treatment in one pane: easier to wire but easier to misread.
- Remove VIX or volume from the chart entirely: too much analytical value lost.

## Decision: Use compact HUD labels with semantic color rather than heavy titles

**Rationale**: The HUD should read like one precise data strip, not a stack of
mini-cards or section blocks.

**Alternatives considered**:

- Use fully written labels for every field: clearer initially but noisier over time.
- Remove labels completely: too ambiguous for some fields, especially when VIX is hidden.

## Decision: Keep status as one subtle header indicator

**Rationale**: The healthy path should not consume vertical space. The header
already owns `Data as of`, so that is the right home for health context.

**Alternatives considered**:

- Reintroduce a footer or body card: visually heavy in the common success case.
- Hide all status: reduces trust when something actually fails.
