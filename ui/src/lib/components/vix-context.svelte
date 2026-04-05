<script lang="ts">
  import { summarizeMarket } from "$data/market";
  import type { MarketPoint } from "$data/types";

  export let symbol: string | null;
  export let points: MarketPoint[];

  const summary = summarizeMarket(points);
</script>

<section class="context-root">
  <p class="eyebrow">Volatility context</p>
  {#if symbol && summary}
    <h3>{symbol} closed at {summary.latestClose.toFixed(2)}</h3>
    <p>
      Last observation on {summary.latestDate}. This series is shown as the market stress
      context alongside the selected asset.
    </p>
  {:else}
    <h3>No VIX context available</h3>
    <p>The published dataset did not include a usable volatility series.</p>
  {/if}
</section>

<style>
  .context-root {
    border: 1px solid var(--color-border);
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.72);
    padding: 1rem 1.1rem;
  }

  h3 {
    margin: 0.8rem 0 0.35rem;
  }

  p:last-child {
    margin: 0;
    color: var(--color-muted-ink);
    line-height: 1.5;
  }
</style>
