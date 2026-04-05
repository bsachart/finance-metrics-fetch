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
    type Time,
  } from "lightweight-charts";
  import { onDestroy, onMount } from "svelte";

  import {
    buildCandlestickSeries,
    buildChartHudState,
    buildNormalizedQuoteVolumeSeries,
    buildPriceSeries,
    formatChartAxisDate,
    formatChartHudDate,
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
  const tickMarkFormatter: TickMarkFormatter = (time: Time) => formatAxisDate(time);
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
  let mounted = false;

  $: sortedPoints = sortPoints(points);
  $: sortedVixPoints = sortPoints(vixPoints);
  $: showVixPane = showVix && sortedVixPoints.length > 0;
  $: showAnalyticsPane = showVolume || showVixPane;
  $: vixColor = getVixColor(sortedVixPoints);
  $: pointByDate = new Map(sortedPoints.map((point) => [point.date, point]));
  $: vixPointByDate = new Map(sortedVixPoints.map((point) => [point.date, point]));
  $: latestHudState = buildChartHudState(
    sortedPoints.at(-1) ?? null,
    showVixPane ? (sortedVixPoints.at(-1) ?? null) : null,
    "latest",
  );

  function setupChart(): void {
    if (!host) {
      return;
    }

    chart?.remove();
    chart = null;
    priceSeries = null;
    volumeSeries = null;
    vixSeries = null;

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

    volumeSeries = showVolume
      ? chart.addSeries(
          HistogramSeries,
          {
            base: 0,
            lastValueVisible: false,
            priceFormat: {
              formatter: (value: number) => formatVolumeAxisValue(value, getVolumeScale(sortedPoints)),
              minMove: 0.01,
              type: "custom",
            },
            priceLineVisible: false,
            priceScaleId: "right",
          },
          1,
        )
      : null;

    vixSeries = showVixPane
      ? chart.addSeries(
          AreaSeries,
          {
            crosshairMarkerBorderColor: vixColor,
            crosshairMarkerBackgroundColor: "#ffffff",
            crosshairMarkerRadius: 4,
            lastValueVisible: false,
            lineColor: vixColor,
            lineWidth: 2,
            priceLineVisible: false,
            priceScaleId: "left",
            topColor: withOpacity(vixColor, 0.16),
            bottomColor: withOpacity(vixColor, 0.04),
            autoscaleInfoProvider: vixAutoscaleInfoProvider,
          },
          1,
        )
      : null;

    const panes = chart.panes();
    panes[0]?.setStretchFactor(showAnalyticsPane ? 0.76 : 1);
    panes[1]?.setStretchFactor(showAnalyticsPane ? 0.24 : 0);

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

    if (showVixPane && panes[1]) {
      chart.priceScale("left", 1).applyOptions({
        borderVisible: false,
        scaleMargins: {
          top: 0.1,
          bottom: 0,
        },
        textColor: vixColor,
        visible: true,
      });
    } else if (panes[1]) {
      chart.priceScale("left", 1).applyOptions({
        borderVisible: false,
        visible: false,
      });
    }

    if (panes[1]) {
      chart.priceScale("right", 1).applyOptions({
        borderVisible: false,
        scaleMargins: {
          top: 0.2,
          bottom: 0,
        },
        textColor: volumeColor,
        visible: showVolume,
      });
    }

    syncSeries();
    chart.subscribeCrosshairMove(handleCrosshairMove);
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
      vixSeries?.setData([]);
    }

    chart.timeScale().fitContent();
    onHudChange(latestHudState);
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

    onHudChange(
      buildChartHudState(
        point,
        showVixPane ? (vixPointByDate.get(dateKey) ?? null) : null,
        "hover",
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

  function formatAxisDate(time: Time): string {
    const dateKey = toDateKey(time);
    if (!dateKey) {
      return "";
    }

    return formatChartAxisDate(dateKey);
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

  onMount(() => {
    mounted = true;
    setupChart();
  });

  $: if (mounted) {
    points;
    vixPoints;
    showVolume;
    showVix;
    setupChart();
  }

  onDestroy(() => {
    chart?.remove();
    chart = null;
    priceSeries = null;
    volumeSeries = null;
    vixSeries = null;
    mounted = false;
  });
</script>

<div class="chart-shell">
  <div bind:this={host} class="chart-root"></div>
</div>

<style>
  .chart-shell {
    position: relative;
  }

  .chart-root {
    height: 600px;
    width: 100%;
  }
</style>
