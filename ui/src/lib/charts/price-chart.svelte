<script lang="ts">
  import {
    CandlestickSeries,
    HistogramSeries,
    createChart,
    type IChartApi,
    type ISeriesApi,
  } from "lightweight-charts";
  import { onDestroy, onMount } from "svelte";

  import {
    buildCandlestickSeries,
    buildNormalizedQuoteVolumeSeries,
    formatVolumeAxisValue,
    getVolumeScale,
  } from "$data/market";
  import type { MarketPoint } from "$data/types";

  export let points: MarketPoint[] = [];

  let host: HTMLDivElement;
  let chart: IChartApi | null = null;
  let priceSeries: ISeriesApi<"Candlestick"> | null = null;
  let volumeSeries: ISeriesApi<"Histogram"> | null = null;

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

    const panes = chart.panes();
    panes[0]?.setStretchFactor(0.7);
    panes[1]?.setStretchFactor(0.3);

    syncSeries();
  }

  function syncSeries(): void {
    if (!chart || !priceSeries || !volumeSeries) {
      return;
    }

    const volumeScale = getVolumeScale(points);

    priceSeries.setData(buildCandlestickSeries(points));
    volumeSeries.applyOptions({
      priceFormat: {
        formatter: (value: number) => formatVolumeAxisValue(value, volumeScale),
        minMove: 0.01,
        type: "custom",
      },
    });
    volumeSeries.setData(buildNormalizedQuoteVolumeSeries(points, volumeScale));
    chart.timeScale().fitContent();
  }

  onMount(setupChart);

  $: if (chart && priceSeries && volumeSeries) {
    points;
    syncSeries();
  }

  onDestroy(() => {
    chart?.remove();
    chart = null;
    priceSeries = null;
    volumeSeries = null;
  });
</script>

<div bind:this={host} class="chart-root"></div>

<style>
  .chart-root {
    height: 560px;
    width: 100%;
  }
</style>
