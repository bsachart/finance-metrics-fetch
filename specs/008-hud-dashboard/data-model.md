# Data Model: HUD-Centric Dashboard

## HUD State

- Purpose: Represents the current market values shown in the stable HUD.
- Fields:
  - `source`
  - `dateLabel`
  - `open`
  - `high`
  - `low`
  - `close`
  - `dollarVolume`
  - `vix`
- Validation:
  - `source` resolves to either latest-bar or hovered-bar context
  - missing `vix` does not break the rest of the HUD
  - values remain renderable when the chart has only one visible bar

## HUD Field

- Purpose: Represents one displayable item inside the HUD strip.
- Fields:
  - `key`
  - `label`
  - `value`
  - `tone`
- Validation:
  - labels stay compact and consistent
  - tones remain stable for the same semantic field across updates

## Chart Scale Context

- Purpose: Represents axis ownership and display padding for the chart.
- Fields:
  - `priceAxisSide`
  - `indicatorAxisSide`
  - `pricePadding`
  - `dateLabelFormat`
- Validation:
  - price remains on the left axis
  - indicator and volume reading stay on the right side
  - padding prevents plotted bars from touching chart borders

## Workspace Control Zone

- Purpose: Represents the aligned control cluster in the ticker workspace.
- Fields:
  - `finderTrigger`
  - `timeframeSelection`
  - `barSelection`
  - `vixToggle`
  - `hud`
- Validation:
  - all controls align to the same content margins
  - the finder trigger remains inside the workspace container
  - the HUD stays below the configuration controls
