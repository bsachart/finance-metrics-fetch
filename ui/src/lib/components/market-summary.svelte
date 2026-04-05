<script lang="ts">
  import ValueChip from "$components/value-chip.svelte";

  import type { SummaryMetric } from "$data/types";

  export let metrics: SummaryMetric[];
</script>

<div class="summary-grid">
  {#each metrics as metric}
    <ValueChip {...metric} />
  {/each}
</div>

<style>
  .summary-grid {
    display: grid;
    gap: 0.8rem;
    grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  }
</style>
