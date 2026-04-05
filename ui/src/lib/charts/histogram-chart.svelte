<script lang="ts">
  import type { HistogramBucket } from "$data/types";

  export let buckets: HistogramBucket[] = [];
  export let label: string;

  const chartHeight = 240;
  const chartWidth = 640;
  const chartPadding = {
    bottom: 40,
    left: 12,
    right: 12,
    top: 12,
  };

  $: maxCount = Math.max(...buckets.map((bucket) => bucket.count), 1);
  $: innerHeight = chartHeight - chartPadding.top - chartPadding.bottom;
  $: innerWidth = chartWidth - chartPadding.left - chartPadding.right;
  $: barWidth = buckets.length > 0 ? innerWidth / buckets.length : innerWidth;
  $: labelStep = Math.max(1, Math.ceil(buckets.length / 6));
  $: visibleTicks = buckets.filter((_, index) => index % labelStep === 0);

  function barHeight(count: number): number {
    return maxCount === 0 ? 0 : (count / maxCount) * innerHeight;
  }

  function formatBucketValue(value: number): string {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: value >= 1000 ? 0 : 2,
      notation: value >= 10000 ? "compact" : "standard",
    }).format(value);
  }
</script>

<section class="histogram-root">
  <div class="panel-header">
    <div>
      <h3 class="section-title">{label}</h3>
      <p class="section-copy">Distribution derived from the published market history.</p>
    </div>
  </div>

  {#if buckets.length === 0}
    <p class="empty-copy">No histogram data is available for this symbol.</p>
  {:else}
    <div class="chart-wrap">
      <svg
        aria-label={label}
        class="histogram-svg"
        preserveAspectRatio="none"
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      >
        <defs>
          <linearGradient id="histogram-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#0f766e"></stop>
            <stop offset="100%" stop-color="#13212f"></stop>
          </linearGradient>
        </defs>

        <line
          class="axis-line"
          x1={chartPadding.left}
          x2={chartWidth - chartPadding.right}
          y1={chartHeight - chartPadding.bottom}
          y2={chartHeight - chartPadding.bottom}
        />

        {#each buckets as bucket, index}
          {@const height = barHeight(bucket.count)}
          {@const x = chartPadding.left + index * barWidth}
          {@const y = chartHeight - chartPadding.bottom - height}

          <rect
            class="bar"
            height={Math.max(height, 2)}
            rx="6"
            ry="6"
            width={Math.max(barWidth - 4, 2)}
            x={x + 2}
            y={height > 0 ? y : chartHeight - chartPadding.bottom - 2}
          >
            <title>
              {formatBucketValue(bucket.start)} to {formatBucketValue(bucket.end)}: {bucket.count}
            </title>
          </rect>
        {/each}

        {#each visibleTicks as bucket, tickIndex}
          {@const bucketIndex = tickIndex * labelStep}
          {@const x = chartPadding.left + bucketIndex * barWidth + barWidth / 2}
          <text class="tick-label" text-anchor="middle" x={x} y={chartHeight - 12}>
            {formatBucketValue(bucket.start)}
          </text>
        {/each}
      </svg>
    </div>
  {/if}
</section>

<style>
  .histogram-root {
    border: 1px solid var(--color-border);
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.7);
    padding: 1rem;
  }

  .chart-wrap {
    width: 100%;
    overflow-x: auto;
  }

  .histogram-svg {
    display: block;
    height: 260px;
    min-width: 100%;
    width: 100%;
  }

  .axis-line {
    stroke: rgba(19, 33, 47, 0.18);
    stroke-width: 1;
  }

  .bar {
    fill: url(#histogram-gradient);
    stroke: rgba(19, 33, 47, 0.06);
  }

  .tick-label {
    fill: var(--color-muted-ink);
    font-size: 11px;
  }

  .empty-copy {
    color: var(--color-muted-ink);
    margin: 0;
  }
</style>
