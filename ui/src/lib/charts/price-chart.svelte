<script lang="ts">
  import {
    CandlestickSeries,
    HistogramSeries,
    LineSeries,
    createChart,
    type IChartApi,
    type ISeriesApi,
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

  let host: HTMLDivElement;
  let chart: IChartApi | null = null;
  let priceSeries: ISeriesApi<"Candlestick"> | null = null;
  let volumeSeries: ISeriesApi<"Histogram"> | null = null;
  let vixSeries: ISeriesApi<"Line"> | null = null;

  function setupChart(): void {
    if (!host) {
      return;
    }

    host.replaceChildren();

    chart = createChart(host, {
      autoSize: true,
      crosshair: {
        mode: 3,
      },
      layout: {
        attributionLogo: false,
        background: { color: "transparent" },
        textColor: "#13212f",
      },
      leftPriceScale: {
        borderVisible: false,
        visible: showVix && vixPoints.length > 0,
      },
      rightPriceScale: {
        borderVisible: false,
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
      1,
    );

    vixSeries = chart.addSeries(
      LineSeries,
      {
        color: "#7c5cff",
        crosshairMarkerBorderColor: "#7c5cff",
        crosshairMarkerBackgroundColor: "#ffffff",
        crosshairMarkerRadius: 4,
        lastValueVisible: showVix,
        lineWidth: 2,
        priceLineVisible: false,
        priceScaleId: "left",
        title: "",
      },
      0,
    );

    const panes = chart.panes();
    panes[0]?.setStretchFactor(0.7);
    panes[1]?.setStretchFactor(0.3);

    syncSeries();
  }

  function syncSeries(): void {
    if (!chart || !priceSeries || !volumeSeries || !vixSeries) {
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
    vixSeries.applyOptions({
      lastValueVisible: hasVix,
      title: "",
      visible: hasVix,
    });
    vixSeries.setData(hasVix ? buildPriceSeries(vixPoints) : []);
    chart.applyOptions({
      leftPriceScale: {
        borderVisible: false,
        visible: hasVix,
      },
    });
    chart.timeScale().fitContent();
  }

  onMount(setupChart);

  $: if (chart && priceSeries && volumeSeries && vixSeries) {
    points;
    vixPoints;
    showVix;
    syncSeries();
  }

  onDestroy(() => {
    chart?.remove();
    chart = null;
    priceSeries = null;
    volumeSeries = null;
    vixSeries = null;
  });
</script>

<div bind:this={host} class="chart-root"></div>

<style>
  .chart-root {
    height: 520px;
    width: 100%;
  }
</style>
