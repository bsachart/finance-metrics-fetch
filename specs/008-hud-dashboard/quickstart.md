# Quickstart: HUD-Centric Dashboard

## 1. Verify HUD default state

1. Run `cd ui && npm run build`.
2. Open the ticker workspace.
3. Confirm the HUD appears below the control row.
4. Confirm the HUD shows the latest available bar data without hovering the chart.

## 2. Verify HUD hover behavior

1. Move the cursor across different bars in the chart.
2. Confirm the HUD updates to the hovered bar values.
3. Move the cursor away from the chart.
4. Confirm the HUD returns to the latest available bar values.

## 3. Verify clean chart canvas

1. Confirm the chart no longer shows the floating legend.
2. Confirm the chart no longer shows the standard tooltip box.
3. Confirm price reads from the left side and non-price readings from the right side.
4. Confirm candles keep visible space from the top and bottom chart borders.

## 4. Verify layout grouping

1. Confirm `Data as of` remains in the page header.
2. Confirm `Find Ticker` sits inside the ticker workspace card.
3. Confirm `Find Ticker`, the control row, the HUD, and the chart share aligned margins.

## 5. Verify date and status treatment

1. Confirm x-axis labels use the same short month-and-day format.
2. Confirm healthy status uses only the subtle indicator beside `Data as of`.

## 6. Verify repository checks

1. Run `cd ui && npm run check`.
2. Run `cd ui && npm run test`.
3. Run `cd ui && npm run build`.
