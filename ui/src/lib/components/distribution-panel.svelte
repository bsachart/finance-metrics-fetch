<script lang="ts">
  import HistogramChart from "$charts/histogram-chart.svelte";
  import { buildPriceHistogram, buildQuoteVolumeHistogram } from "$data/histograms";
  import type { MarketPoint } from "$data/types";

  export let points: MarketPoint[] = [];
</script>

<div class="distribution-grid">
  <HistogramChart buckets={buildPriceHistogram(points)} label="Price histogram" />
  <HistogramChart
    buckets={buildQuoteVolumeHistogram(points)}
    label="Quote volume histogram"
  />
</div>

<style>
  .distribution-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
</style>
