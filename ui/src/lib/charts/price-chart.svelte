<script lang="ts">
  import {
    AreaSeries,
    type AutoscaleInfo,
    type AutoscaleInfoProvider,
    CandlestickSeries,
    HistogramSeries,
    LineStyle,
    createChart,
    type IChartApi,
    type MouseEventParams,
    type ISeriesApi,
    type TickMarkFormatter,
    TickMarkType,
    type Time,
  } from "lightweight-charts";
  import { onDestroy, onMount, tick } from "svelte";

  import {
    buildCandlestickSeries,
    buildChartHudState,
    buildNormalizedQuoteVolumeSeries,
    buildPriceSeries,
    formatChartAxisDate,
    formatVolumeAxisValue,
    getVolumeScale,
  } from "$data/market";
  import type { ChartHudState, MarketPoint } from "$data/types";

  export let points: MarketPoint[] = [];
  export let showVolume = true;
  export let showVix = false;
  export let vixPoints: MarketPoint[] = [];
  export let onHudChange: (state: ChartHudState | null) => void = () => {};

  const inkColor = "#13212f";
  const priceColor = "#0f766e";
  const volumeColor = "rgba(59, 130, 246, 0.74)";
  const mutedGridColor = "rgba(19, 33, 47, 0.07)";
  const mutedVixColor = "#7c5cff";
  const elevatedVixColor = "#d97706";
  const elevatedVixThreshold = 20;
  const tickMarkFormatter: TickMarkFormatter = (time: Time, tickMarkType) =>
    formatAxisDate(time, tickMarkType);
  const vixAutoscaleInfoProvider: AutoscaleInfoProvider = (
    original: () => AutoscaleInfo | null,
  ) => {
    const result = original();
    if (result?.priceRange) {
      result.priceRange.minValue = 0;
    }
    return result;
  };

  let host: HTMLDivElement;
  let chart: IChartApi | null = null;
  let priceSeries: ISeriesApi<"Candlestick"> | null = null;
  let volumeSeries: ISeriesApi<"Histogram"> | null = null;
  let vixSeries: ISeriesApi<"Area"> | null = null;
  let hasInitialFit = false;
  let lastDataSignature = "";
  let lastStructureSignature = "";
  let rebuildVersion = 0;
  let rebuilding = false;
  let concealChart = false;

  $: sortedPoints = sortPoints(points);
  $: sortedVixPoints = sortPoints(vixPoints);
  $: showVixPane = showVix && sortedVixPoints.length > 0;
  $: vixColor = getVixColor(sortedVixPoints);
  $: pointByDate = new Map(sortedPoints.map((point) => [point.date, point]));
  $: pointIndexByDate = new Map(sortedPoints.map((point, index) => [point.date, index]));
  $: vixPointByDate = new Map(sortedVixPoints.map((point) => [point.date, point]));
  $: latestHudState = buildChartHudState(
    sortedPoints.at(-1) ?? null,
    showVixPane ? (sortedVixPoints.at(-1) ?? null) : null,
    "latest",
    sortedPoints.at(-2) ?? null,
  );
  $: dataSignature = getDataSignature(sortedPoints);
  $: structureSignature = `${showVolume}-${showVixPane}`;

  function destroyChart(): void {
    chart?.remove();
    chart = null;
    priceSeries = null;
    volumeSeries = null;
    vixSeries = null;
  }

  function getPreservedLogicalRange(preserveLogicalRange: boolean) {
    if (!preserveLogicalRange || !hasInitialFit || dataSignature !== lastDataSignature) {
      return null;
    }

    return chart?.timeScale().getVisibleLogicalRange() ?? null;
  }

  function syncViewport(logicalRange: ReturnType<typeof getPreservedLogicalRange>): void {
    if (!chart) {
      return;
    }

    if (logicalRange) {
      chart.timeScale().setVisibleLogicalRange(logicalRange);
      return;
    }

    chart.timeScale().fitContent();
    hasInitialFit = true;
    lastDataSignature = dataSignature;
  }

  function setupChart(): void {
    if (!host) {
      return;
    }

    chart = createChart(host, {
      autoSize: true,
      crosshair: {
        horzLine: {
          color: "rgba(19, 33, 47, 0.18)",
          labelVisible: false,
          visible: true,
        },
        mode: 3,
        vertLine: {
          color: "rgba(19, 33, 47, 0.18)",
          labelVisible: false,
          visible: true,
        },
      },
      grid: {
        vertLines: {
          color: mutedGridColor,
          style: LineStyle.LargeDashed,
        },
        horzLines: {
          color: mutedGridColor,
          style: LineStyle.LargeDashed,
        },
      },
      layout: {
        attributionLogo: false,
        background: { color: "transparent" },
        panes: {
          separatorColor: "rgba(19, 33, 47, 0.08)",
          separatorHoverColor: "rgba(19, 33, 47, 0.12)",
        },
        textColor: inkColor,
      },
      leftPriceScale: {
        borderVisible: false,
        textColor: inkColor,
        visible: true,
      },
      rightPriceScale: {
        borderVisible: false,
        visible: false,
      },
      timeScale: {
        borderVisible: false,
        tickMarkFormatter,
      },
    });

    priceSeries = chart.addSeries(
      CandlestickSeries,
      {
        downColor: "#f43f5e",
        borderVisible: false,
        priceScaleId: "left",
        wickDownColor: "#f43f5e",
        upColor: priceColor,
        wickUpColor: priceColor,
      },
      0,
    );

    if (showVolume) {
      volumeSeries = createVolumeSeries(chart, sortedPoints);
    }

    if (showVixPane) {
      vixSeries = createVixSeries(chart, vixColor, vixAutoscaleInfoProvider);
    }

    applyPaneOptions();
    syncSeries();

    chart.subscribeCrosshairMove(handleCrosshairMove);
    lastStructureSignature = structureSignature;
  }

  async function rebuildChart(preserveLogicalRange = false): Promise<void> {
    const version = ++rebuildVersion;
    const logicalRange = getPreservedLogicalRange(preserveLogicalRange);

    rebuilding = true;
    await tick();

    if (version !== rebuildVersion || !host) {
      rebuilding = false;
      return;
    }

    concealChart = true;
    destroyChart();
    setupChart();

    if (!chart || version !== rebuildVersion) {
      concealChart = false;
      rebuilding = false;
      return;
    }

    syncViewport(logicalRange);

    requestAnimationFrame(() => {
      if (version !== rebuildVersion || !chart) {
        concealChart = false;
        rebuilding = false;
        return;
      }

      if (logicalRange) {
        syncViewport(logicalRange);
      }

      concealChart = false;
      rebuilding = false;
    });
  }

  function syncSeries(): void {
    if (!chart || !priceSeries) {
      return;
    }

    const volumeScale = getVolumeScale(sortedPoints);

    priceSeries.setData(buildCandlestickSeries(sortedPoints));
    if (volumeSeries) {
      volumeSeries.applyOptions({
        priceFormat: {
          formatter: (value: number) => formatVolumeAxisValue(value, volumeScale),
          minMove: 0.01,
          type: "custom",
        },
      });
      volumeSeries.setData(buildNormalizedQuoteVolumeSeries(sortedPoints, volumeScale));
    }

    if (showVixPane && vixSeries) {
      vixSeries.applyOptions({
        lineColor: vixColor,
        topColor: withOpacity(vixColor, 0.16),
        bottomColor: withOpacity(vixColor, 0.04),
      });
      vixSeries.setData(buildPriceSeries(sortedVixPoints));
    } else if (vixSeries) {
      vixSeries.setData([]);
    }

    const shouldFitContent = !hasInitialFit || dataSignature !== lastDataSignature;
    if (shouldFitContent) {
      chart.timeScale().fitContent();
      hasInitialFit = true;
      lastDataSignature = dataSignature;
    }
    onHudChange(latestHudState);
  }

  function createVolumeSeries(
    chartApi: IChartApi,
    seriesPoints: MarketPoint[],
  ): ISeriesApi<"Histogram"> {
    return chartApi.addSeries(
      HistogramSeries,
      {
        base: 0,
        lastValueVisible: false,
        priceFormat: {
          formatter: (value: number) => formatVolumeAxisValue(value, getVolumeScale(seriesPoints)),
          minMove: 0.01,
          type: "custom",
        },
        priceLineVisible: false,
        priceScaleId: "right",
      },
      1,
    );
  }

  function createVixSeries(
    chartApi: IChartApi,
    color: string,
    autoscaleInfoProvider: AutoscaleInfoProvider,
  ): ISeriesApi<"Area"> {
    return chartApi.addSeries(
      AreaSeries,
      {
        crosshairMarkerBorderColor: color,
        crosshairMarkerBackgroundColor: "#ffffff",
        crosshairMarkerRadius: 4,
        lastValueVisible: false,
        lineColor: color,
        lineWidth: 2,
        priceLineVisible: false,
        priceScaleId: "left",
        topColor: withOpacity(color, 0.16),
        bottomColor: withOpacity(color, 0.04),
        autoscaleInfoProvider,
      },
      1,
    );
  }

  function applyPaneOptions(): void {
    if (!chart) {
      return;
    }

    const panes = chart.panes();
    const hasAnalyticsPane = Boolean(volumeSeries || vixSeries);

    panes[0]?.setStretchFactor(hasAnalyticsPane ? 0.76 : 1);
    if (hasAnalyticsPane) {
      panes[1]?.setStretchFactor(0.24);
    }

    chart.priceScale("left", 0).applyOptions({
      borderVisible: false,
      scaleMargins: {
        top: 0.05,
        bottom: 0.05,
      },
      textColor: inkColor,
      visible: true,
    });
    chart.priceScale("right", 0).applyOptions({
      borderVisible: false,
      visible: false,
    });

    if (panes[1]) {
      if (vixSeries) {
        chart.priceScale("left", 1).applyOptions({
          borderVisible: false,
          scaleMargins: {
            top: 0.1,
            bottom: 0,
          },
          textColor: vixColor,
          visible: true,
        });
      }

      if (volumeSeries) {
        chart.priceScale("right", 1).applyOptions({
          borderVisible: false,
          scaleMargins: {
            top: 0.2,
            bottom: 0,
          },
          textColor: volumeColor,
          visible: true,
        });
      }
    }
  }

  function handleCrosshairMove(param: MouseEventParams<Time>): void {
    if (!priceSeries || !param.time) {
      onHudChange(latestHudState);
      return;
    }

    const dateKey = toDateKey(param.time);
    if (!dateKey) {
      onHudChange(latestHudState);
      return;
    }

    const point = pointByDate.get(dateKey) ?? null;
    if (!point) {
      onHudChange(latestHudState);
      return;
    }

    const pointIndex = pointIndexByDate.get(dateKey) ?? -1;
    const previousPoint = pointIndex > 0 ? sortedPoints[pointIndex - 1] ?? null : null;

    onHudChange(
      buildChartHudState(
        point,
        showVixPane ? (vixPointByDate.get(dateKey) ?? null) : null,
        "hover",
        previousPoint,
      ) ?? latestHudState,
    );
  }

  function sortPoints(series: MarketPoint[]): MarketPoint[] {
    return [...series].sort((left, right) => left.date.localeCompare(right.date));
  }

  function toDateKey(time: Time): string | null {
    if (typeof time === "string") {
      return time;
    }

    if (typeof time === "number") {
      return new Date(time * 1000).toISOString().slice(0, 10);
    }

    return `${time.year}-${String(time.month).padStart(2, "0")}-${String(time.day).padStart(2, "0")}`;
  }

  function formatAxisDate(time: Time, tickMarkType: TickMarkType): string {
    const dateKey = toDateKey(time);
    if (!dateKey) {
      return "";
    }

    return formatChartAxisDate(dateKey, tickMarkType);
  }

  function getVixColor(seriesPoints: MarketPoint[]): string {
    return (seriesPoints.at(-1)?.close ?? 0) >= elevatedVixThreshold
      ? elevatedVixColor
      : mutedVixColor;
  }

  function withOpacity(hexColor: string, opacity: number): string {
    const normalized = hexColor.replace("#", "");
    const red = Number.parseInt(normalized.slice(0, 2), 16);
    const green = Number.parseInt(normalized.slice(2, 4), 16);
    const blue = Number.parseInt(normalized.slice(4, 6), 16);
    return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
  }

  function getDataSignature(seriesPoints: MarketPoint[]): string {
    return [
      seriesPoints[0]?.date ?? "",
      seriesPoints.at(-1)?.date ?? "",
      seriesPoints.length,
    ].join("|");
  }

  onMount(() => {
    void rebuildChart(false);
  });

  $: if (chart) {
    structureSignature;
    if (!rebuilding && structureSignature !== lastStructureSignature) {
      void rebuildChart(true);
    }
  }

  $: if (chart) {
    sortedPoints;
    sortedVixPoints;
    vixColor;
    latestHudState;
    if (!rebuilding && structureSignature === lastStructureSignature) {
      syncSeries();
    }
  }

  onDestroy(() => {
    rebuildVersion += 1;
    destroyChart();
  });
</script>

<div class="chart-shell">
  <div bind:this={host} class:chart-root-hidden={concealChart} class="chart-root"></div>
</div>

<style>
  .chart-shell {
    position: relative;
  }

  .chart-root {
    height: 600px;
    width: 100%;
  }

  .chart-root-hidden {
    visibility: hidden;
  }
</style>
