<script lang="ts">
  import {
    CandlestickSeries,
    HistogramSeries,
    LineSeries,
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
    ohlc: string;
    volume: string;
    vix: string;
  } | null;

  const inkColor = "#13212f";
  const vixColor = "#7c5cff";

  let wrapper: HTMLDivElement;
  let host: HTMLDivElement;
  let chart: IChartApi | null = null;
  let priceSeries: ISeriesApi<"Candlestick"> | null = null;
  let volumeSeries: ISeriesApi<"Histogram"> | null = null;
  let vixSeries: ISeriesApi<"Line"> | null = null;
  let hoverState: HoverState = null;
  let mounted = false;

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

    const showVixPane = showVix && vixPoints.length > 0;
    chart = createChart(host, {
      autoSize: true,
      crosshair: {
        horzLine: {
          labelBackgroundColor: vixColor,
        },
        mode: 3,
        vertLine: {
          labelBackgroundColor: inkColor,
        },
      },
      layout: {
        attributionLogo: false,
        background: { color: "transparent" },
        panes: {
          separatorColor: "rgba(19, 33, 47, 0.12)",
          separatorHoverColor: "rgba(19, 33, 47, 0.18)",
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
        downColor: "#f43f5e",
        borderVisible: false,
        wickDownColor: "#f43f5e",
        upColor: "#0f766e",
        wickUpColor: "#0f766e",
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
      showVixPane ? 2 : 1,
    );

    vixSeries = showVixPane
      ? chart.addSeries(
          LineSeries,
          {
            color: vixColor,
            crosshairMarkerBorderColor: vixColor,
            crosshairMarkerBackgroundColor: "#ffffff",
            crosshairMarkerRadius: 4,
            lastValueVisible: false,
            lineWidth: 2,
            priceLineVisible: false,
            priceScaleId: "left",
            title: "VIX",
          },
          1,
        )
      : null;

    const panes = chart.panes();
    panes[0]?.setStretchFactor(showVixPane ? 0.56 : 0.72);
    if (showVixPane) {
      panes[1]?.setStretchFactor(0.16);
      panes[2]?.setStretchFactor(0.28);
    } else {
      panes[1]?.setStretchFactor(0.28);
    }

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
    const hasVix = showVix && vixPoints.length > 0;

    priceSeries.setData(buildCandlestickSeries(points));
    volumeSeries.applyOptions({
      priceFormat: {
        formatter: (value: number) => formatVolumeAxisValue(value, volumeScale),
        minMove: 0.01,
        type: "custom",
      },
    });
    volumeSeries.setData(buildNormalizedQuoteVolumeSeries(points, volumeScale));
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
      ohlc: `O ${formatNumber(candle.open)}  H ${formatNumber(candle.high)}  L ${formatNumber(candle.low)}  C ${formatNumber(candle.close)}`,
      volume: `Dollar volume ${formatNumber(volume.value)}${getVolumeScale(points).suffix ? ` ${getVolumeScale(points).suffix}` : ""}`,
      vix: vixValue
        ? `VIX ${formatNumber(vixValue)}`
        : showVix && vixPoints.length > 0
          ? "VIX unavailable"
          : "",
    };
  }

  function formatNumber(value: number): string {
    return value.toLocaleString("en-US", {
      maximumFractionDigits: value >= 100 ? 2 : 2,
      minimumFractionDigits: 0,
    });
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

<div bind:this={wrapper} class="chart-shell">
  <div class="chart-legend">
    <span class="legend-item">
      <span class="legend-swatch legend-swatch-price"></span>
      Price
    </span>
    {#if showVix && vixPoints.length > 0}
      <span class="legend-item">
        <span class="legend-swatch legend-swatch-vix"></span>
        VIX
      </span>
    {/if}
    <span class="legend-item">
      <span class="legend-swatch legend-swatch-volume"></span>
      Dollar volume
    </span>
  </div>

  {#if hoverState}
    <div class="chart-tooltip">
      <p class="chart-tooltip-date">{hoverState.date}</p>
      <p>{hoverState.ohlc}</p>
      <p>{hoverState.volume}</p>
      {#if hoverState.vix}
        <p class="chart-tooltip-vix">{hoverState.vix}</p>
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
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(19, 33, 47, 0.12);
    border-radius: 999px;
    color: #13212f;
    display: inline-flex;
    font-size: 0.75rem;
    font-weight: 500;
    gap: 0.45rem;
    padding: 0.3rem 0.65rem;
  }

  .legend-swatch {
    border-radius: 999px;
    display: inline-block;
    height: 0.55rem;
    width: 0.55rem;
  }

  .legend-swatch-price {
    background: #0f766e;
  }

  .legend-swatch-vix {
    background: #7c5cff;
  }

  .legend-swatch-volume {
    background: rgba(15, 118, 110, 0.62);
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

  .chart-tooltip-date {
    font-weight: 600;
  }

  .chart-tooltip-vix {
    color: #7c5cff;
    font-weight: 600;
  }
</style>
