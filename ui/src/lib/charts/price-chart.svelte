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
    type Time,
  } from "lightweight-charts";
  import { onDestroy, onMount } from "svelte";

  import {
    buildCandlestickSeries,
    buildNormalizedQuoteVolumeSeries,
    buildPriceSeries,
    formatVolumeAxisValue,
    getVolumeScale,
  } from "$data/market";
  import type { MarketPoint } from "$data/types";

  export let points: MarketPoint[] = [];
  export let showVix = false;
  export let vixPoints: MarketPoint[] = [];

  type HoverState = {
    date: string;
    priceLines: string[];
    volumeLine: string;
    vixLine: string | null;
  } | null;

  const inkColor = "#13212f";
  const mutedGridColor = "rgba(19, 33, 47, 0.09)";
  const mutedVixColor = "#7c5cff";
  const elevatedVixColor = "#d97706";
  const elevatedVixThreshold = 20;
  const priceLegendColor = "#0f766e";
  const volumeLegendColor = "rgba(59, 130, 246, 0.7)";
  const vixAutoscaleInfoProvider: AutoscaleInfoProvider = (
    original: () => AutoscaleInfo | null,
  ) => {
    const result = original();
    if (result?.priceRange) {
      result.priceRange.minValue = 0;
    }
    return result;
  };

  let wrapper: HTMLDivElement;
  let host: HTMLDivElement;
  let chart: IChartApi | null = null;
  let priceSeries: ISeriesApi<"Candlestick"> | null = null;
  let volumeSeries: ISeriesApi<"Histogram"> | null = null;
  let vixSeries: ISeriesApi<"Area"> | null = null;
  let hoverState: HoverState = null;
  let mounted = false;
  $: showVixPane = showVix && vixPoints.length > 0;
  $: vixColor = getVixColor(vixPoints);

  function setupChart(): void {
    if (!host || !wrapper) {
      return;
    }

    chart?.remove();
    chart = null;
    priceSeries = null;
    volumeSeries = null;
    vixSeries = null;
    hoverState = null;

    chart = createChart(host, {
      autoSize: true,
      crosshair: {
        horzLine: {
          labelBackgroundColor: showVixPane ? vixColor : inkColor,
        },
        mode: 3,
        vertLine: {
          labelBackgroundColor: inkColor,
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
      rightPriceScale: {
        borderVisible: false,
        textColor: inkColor,
      },
      timeScale: {
        borderVisible: false,
      },
    });

    priceSeries = chart.addSeries(
      CandlestickSeries,
      {
        downColor: showVixPane ? "rgba(244, 63, 94, 0.82)" : "#f43f5e",
        borderVisible: false,
        wickDownColor: showVixPane ? "rgba(244, 63, 94, 0.82)" : "#f43f5e",
        upColor: showVixPane ? "rgba(15, 118, 110, 0.82)" : "#0f766e",
        wickUpColor: showVixPane ? "rgba(15, 118, 110, 0.82)" : "#0f766e",
      },
      0,
    );

    volumeSeries = chart.addSeries(
      HistogramSeries,
      {
        base: 0,
        priceFormat: {
          formatter: (value: number) => formatVolumeAxisValue(value, getVolumeScale(points)),
          minMove: 0.01,
          type: "custom",
        },
        priceLineVisible: false,
        title: "Dollar volume",
      },
      1,
    );

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
            title: "VIX",
            autoscaleInfoProvider: vixAutoscaleInfoProvider,
          },
          1,
        )
      : null;

    const panes = chart.panes();
    panes[0]?.setStretchFactor(0.72);
    panes[1]?.setStretchFactor(0.28);

    if (showVixPane) {
      chart.applyOptions({
        leftPriceScale: {
          borderVisible: false,
          textColor: vixColor,
          visible: true,
        },
      });
    } else {
      chart.applyOptions({
        leftPriceScale: {
          borderVisible: false,
          visible: false,
        },
      });
    }

    syncSeries();
    chart.subscribeCrosshairMove(handleCrosshairMove);
  }

  function syncSeries(): void {
    if (!chart || !priceSeries || !volumeSeries) {
      return;
    }

    const volumeScale = getVolumeScale(points);
    const hasVix = showVixPane;

    priceSeries.setData(buildCandlestickSeries(points));
    volumeSeries.applyOptions({
      priceFormat: {
        formatter: (value: number) => formatVolumeAxisValue(value, volumeScale),
        minMove: 0.01,
        type: "custom",
      },
    });
    volumeSeries.setData(buildNormalizedQuoteVolumeSeries(points, volumeScale));
    vixSeries?.applyOptions({
      lineColor: vixColor,
      topColor: withOpacity(vixColor, 0.16),
      bottomColor: withOpacity(vixColor, 0.04),
    });
    vixSeries?.setData(hasVix ? buildPriceSeries(vixPoints) : []);
    chart.timeScale().fitContent();
  }

  function handleCrosshairMove(param: MouseEventParams<Time>): void {
    if (!priceSeries || !volumeSeries || !param.time) {
      hoverState = null;
      return;
    }

    const candle = param.seriesData.get(priceSeries);
    const volume = param.seriesData.get(volumeSeries);
    const vix = vixSeries ? param.seriesData.get(vixSeries) : undefined;

    if (!candle || !("open" in candle) || !volume || !("value" in volume)) {
      hoverState = null;
      return;
    }

    const vixValue =
      vix && "value" in vix && typeof vix.value === "number" ? vix.value : null;

    hoverState = {
      date: formatTime(param.time),
      priceLines: [
        `Open ${formatNumber(candle.open)}`,
        `High ${formatNumber(candle.high)}`,
        `Low ${formatNumber(candle.low)}`,
        `Close ${formatNumber(candle.close)}`,
      ],
      volumeLine: `Dollar volume ${formatNumber(volume.value)}${getVolumeScale(points).suffix ? ` ${getVolumeScale(points).suffix}` : ""}`,
      vixLine:
        vixValue !== null
          ? `VIX ${formatNumber(vixValue)}`
          : showVixPane
            ? "VIX unavailable"
            : null,
    };
  }

  function formatNumber(value: number): string {
    return value.toLocaleString("en-US", {
      maximumFractionDigits: value >= 100 ? 2 : 2,
      minimumFractionDigits: 0,
    });
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

  function formatTime(time: Time): string {
    if (typeof time === "string") {
      return time;
    }

    if (typeof time === "number") {
      return new Date(time * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }

    return `${time.year}-${String(time.month).padStart(2, "0")}-${String(time.day).padStart(2, "0")}`;
  }

  onMount(() => {
    mounted = true;
    setupChart();
  });

  $: if (mounted) {
    points;
    vixPoints;
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

<div bind:this={wrapper} class="chart-shell" style={`--vix-color: ${vixColor};`}>
  <div class="chart-legend">
    <span class="legend-item">
      <span class="legend-swatch" style={`background: ${priceLegendColor};`}></span>
      Price
    </span>
    {#if showVixPane}
      <span class="legend-item">
        <span class="legend-swatch" style={`background: ${vixColor};`}></span>
        VIX
      </span>
    {/if}
    <span class="legend-item">
      <span class="legend-swatch" style={`background: ${volumeLegendColor};`}></span>
      Dollar volume
    </span>
  </div>

  {#if hoverState}
    <div class="chart-tooltip">
      <p class="chart-tooltip-date">{hoverState.date}</p>
      <div class="chart-tooltip-group">
        <p class="chart-tooltip-label">Price</p>
        {#each hoverState.priceLines as line}
          <p>{line}</p>
        {/each}
      </div>
      <div class="chart-tooltip-group">
        <p class="chart-tooltip-label">Volume</p>
        <p>{hoverState.volumeLine}</p>
      </div>
      {#if hoverState.vixLine}
        <div class="chart-tooltip-group">
          <p class="chart-tooltip-label chart-tooltip-vix">Indicator</p>
          <p class="chart-tooltip-vix">{hoverState.vixLine}</p>
        </div>
      {/if}
    </div>
  {/if}

  <div bind:this={host} class="chart-root"></div>
</div>

<style>
  .chart-shell {
    position: relative;
  }

  .chart-root {
    height: 520px;
    width: 100%;
  }

  .chart-legend {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 0.875rem;
    left: 0.75rem;
    pointer-events: none;
    position: absolute;
    top: 0.75rem;
    z-index: 2;
  }

  .legend-item {
    align-items: center;
    color: #13212f;
    display: inline-flex;
    font-size: 0.75rem;
    font-weight: 500;
    gap: 0.45rem;
  }

  .legend-swatch {
    border-radius: 999px;
    display: inline-block;
    height: 0.55rem;
    width: 0.55rem;
  }

  .chart-tooltip {
    background: rgba(255, 255, 255, 0.94);
    border: 1px solid rgba(19, 33, 47, 0.12);
    border-radius: 1rem;
    color: #13212f;
    display: grid;
    gap: 0.2rem;
    max-width: min(34rem, calc(100% - 1.5rem));
    padding: 0.65rem 0.85rem;
    pointer-events: none;
    position: absolute;
    right: 0.75rem;
    top: 0.75rem;
    z-index: 2;
  }

  .chart-tooltip p {
    font-size: 0.75rem;
    line-height: 1.35;
    margin: 0;
  }

  .chart-tooltip-group {
    display: grid;
    gap: 0.15rem;
    padding-top: 0.15rem;
  }

  .chart-tooltip-date {
    font-weight: 600;
  }

  .chart-tooltip-label {
    color: rgba(19, 33, 47, 0.7);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .chart-tooltip-vix {
    color: var(--vix-color, #7c5cff);
    font-weight: 600;
  }
</style>
