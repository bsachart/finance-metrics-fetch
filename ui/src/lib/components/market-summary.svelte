<script lang="ts">
  import ValueChip from "$components/value-chip.svelte";

  import type { SummaryMetric } from "$data/types";

  export let metrics: SummaryMetric[];
</script>

<div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
  {#each metrics as metric}
    <ValueChip {...metric} />
  {/each}
</div>
