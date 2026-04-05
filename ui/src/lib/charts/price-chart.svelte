<script lang="ts">
  import { createChart, LineSeries, type IChartApi } from "lightweight-charts";
  import { onDestroy, onMount } from "svelte";

  import { buildPriceSeries } from "$data/market";
  import type { MarketPoint } from "$data/types";

  export let points: MarketPoint[] = [];
  export let overlayPoints: MarketPoint[] = [];

  let host: HTMLDivElement;
  let chart: IChartApi | null = null;

  function renderChart(): void {
    if (!chart) {
      return;
    }

    chart.remove();
    chart = null;
    setupChart();
  }

  function setupChart(): void {
    if (!host) {
      return;
    }

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

    const priceSeries = chart.addSeries(LineSeries, {
      color: "#0f766e",
      lineWidth: 2,
      title: "Close",
    });
    priceSeries.setData(buildPriceSeries(points));

    if (overlayPoints.length > 0) {
      const vixSeries = chart.addSeries(LineSeries, {
        color: "#bf6b34",
        lineWidth: 2,
        priceScaleId: "",
        title: "VIX",
      });
      vixSeries.setData(buildPriceSeries(overlayPoints));
    }

    chart.timeScale().fitContent();
  }

  onMount(() => {
    setupChart();
  });

  $: if (chart) {
    renderChart();
  }

  onDestroy(() => {
    chart?.remove();
  });
</script>

<div bind:this={host} class="chart-root"></div>

<style>
  .chart-root {
    height: 360px;
    width: 100%;
  }
</style>
