<script lang="ts">
  import type { HistogramBucket } from "$data/types";

  export let buckets: HistogramBucket[] = [];
  export let label: string;

  $: maxCount = Math.max(...buckets.map((bucket) => bucket.count), 1);
</script>

<section class="histogram-root">
  <div class="panel-header">
    <div>
      <h3 class="section-title">{label}</h3>
      <p class="section-copy">Distribution derived from the published market history.</p>
    </div>
  </div>

  <div class="bars-root">
    {#each buckets as bucket}
      <div class="bar-wrap">
        <div
          class="bar"
          style={`height: ${Math.max(10, (bucket.count / maxCount) * 100)}%`}
          title={`${bucket.start.toFixed(2)} to ${bucket.end.toFixed(2)}: ${bucket.count}`}
        ></div>
        <span>{bucket.start.toFixed(0)}</span>
      </div>
    {/each}
  </div>
</section>

<style>
  .histogram-root {
    border: 1px solid var(--color-border);
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.7);
    padding: 1rem;
  }

  .bars-root {
    display: grid;
    gap: 0.4rem;
    grid-auto-flow: column;
    align-items: end;
    min-height: 220px;
    overflow-x: auto;
    padding-top: 0.5rem;
  }

  .bar-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
    min-width: 28px;
  }

  .bar {
    width: 100%;
    border-radius: 999px 999px 8px 8px;
    background: linear-gradient(180deg, #0f766e 0%, #13212f 100%);
  }

  span {
    color: var(--color-muted-ink);
    font-size: 0.72rem;
  }
</style>
