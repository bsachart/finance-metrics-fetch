<script lang="ts">
  import {
    AreaSeries,
    createChart,
    type IChartApi,
    type ISeriesApi,
  } from "lightweight-charts";
  import { onDestroy, onMount } from "svelte";

  import { buildQuoteVolumeSeries } from "$data/market";
  import type { MarketPoint } from "$data/types";

  export let points: MarketPoint[] = [];

  let host: HTMLDivElement;
  let chart: IChartApi | null = null;
  let volumeSeries: ISeriesApi<"Area"> | null = null;

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

    volumeSeries = chart.addSeries(AreaSeries, {
      lineColor: "#13212f",
      lineWidth: 2,
      topColor: "rgba(19, 33, 47, 0.28)",
      bottomColor: "rgba(19, 33, 47, 0.02)",
      title: "Quote volume",
    });
    syncSeries();
  }

  function syncSeries(): void {
    if (!chart || !volumeSeries) {
      return;
    }

    volumeSeries.setData(buildQuoteVolumeSeries(points));
    chart.timeScale().fitContent();
  }

  onMount(setupChart);

  $: if (chart && volumeSeries) {
    points;
    syncSeries();
  }

  onDestroy(() => {
    chart?.remove();
    chart = null;
    volumeSeries = null;
  });
</script>

<div bind:this={host} class="chart-root"></div>

<style>
  .chart-root {
    height: 280px;
    width: 100%;
  }
</style>
