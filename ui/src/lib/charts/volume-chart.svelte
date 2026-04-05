<script lang="ts">
  import { AreaSeries, createChart, type IChartApi } from "lightweight-charts";
  import { onDestroy, onMount } from "svelte";

  import { buildQuoteVolumeSeries } from "$data/market";
  import type { MarketPoint } from "$data/types";

  export let points: MarketPoint[] = [];

  let host: HTMLDivElement;
  let chart: IChartApi | null = null;

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

    const series = chart.addSeries(AreaSeries, {
      lineColor: "#13212f",
      lineWidth: 2,
      topColor: "rgba(19, 33, 47, 0.28)",
      bottomColor: "rgba(19, 33, 47, 0.02)",
      title: "Quote volume",
    });
    series.setData(buildQuoteVolumeSeries(points));
    chart.timeScale().fitContent();
  }

  function rerender(): void {
    chart?.remove();
    chart = null;
    setupChart();
  }

  onMount(setupChart);

  $: if (chart) {
    rerender();
  }

  onDestroy(() => {
    chart?.remove();
  });
</script>

<div bind:this={host} class="chart-root"></div>

<style>
  .chart-root {
    height: 280px;
    width: 100%;
  }
</style>
