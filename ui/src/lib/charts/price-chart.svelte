<script lang="ts">
  import {
    createChart,
    LineSeries,
    type IChartApi,
    type ISeriesApi,
  } from "lightweight-charts";
  import { onDestroy, onMount } from "svelte";

  import { buildPriceSeries } from "$data/market";
  import type { MarketPoint } from "$data/types";

  export let points: MarketPoint[] = [];
  export let overlayPoints: MarketPoint[] = [];

  let host: HTMLDivElement;
  let chart: IChartApi | null = null;
  let priceSeries: ISeriesApi<"Line"> | null = null;
  let vixSeries: ISeriesApi<"Line"> | null = null;

  function setupChart(): void {
    if (!host) {
      return;
    }

    host.replaceChildren();

    chart = createChart(host, {
      autoSize: true,
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

    priceSeries = chart.addSeries(LineSeries, {
      color: "#0f766e",
      lineWidth: 2,
      title: "Close",
    });
    vixSeries = chart.addSeries(LineSeries, {
      color: "#bf6b34",
      lineWidth: 2,
      priceScaleId: "",
      title: "VIX",
    });

    syncSeries();
    chart.timeScale().fitContent();
  }

  function syncSeries(): void {
    if (!chart || !priceSeries || !vixSeries) {
      return;
    }

    priceSeries.setData(buildPriceSeries(points));
    vixSeries.setData(buildPriceSeries(overlayPoints));
    chart.timeScale().fitContent();
  }

  onMount(() => {
    setupChart();
  });

  $: points, overlayPoints;
  $: if (chart && priceSeries && vixSeries) {
    syncSeries();
  }

  onDestroy(() => {
    chart?.remove();
    chart = null;
    priceSeries = null;
    vixSeries = null;
  });
</script>

<div bind:this={host} class="chart-root"></div>

<style>
  .chart-root {
    height: 360px;
    width: 100%;
  }
</style>
