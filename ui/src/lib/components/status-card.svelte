<script lang="ts">
  import { Card } from "$lib/components/ui/card";

  import type { PublishedStatus } from "$data/types";

  export let status: PublishedStatus;

  const previewLimit = 6;

  $: refreshedPreview = status.refreshed_symbols.slice(0, previewLimit);
  $: refreshedOverflow = Math.max(status.refreshed_symbols.length - previewLimit, 0);
</script>

<Card class="space-y-4 rounded-[28px] border bg-card/90 p-5 shadow-[0_18px_50px_rgba(18,26,33,0.12)]">
  <div class="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
    <div>
      <p class="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        Repository status
      </p>
      <h2 class="mt-1 font-heading text-xl font-semibold tracking-tight">Data last updated</h2>
      <p class="mt-1 text-sm text-muted-foreground">
        {new Date(status.finished_at).toLocaleString()}
      </p>
    </div>

    <p class="text-sm text-muted-foreground">
      {status.failed_symbols.length === 0 ? "No symbol refresh failures." : `${status.failed_symbols.length} symbol refresh failures.`}
    </p>
  </div>

  <div class="grid gap-4 md:grid-cols-2">
    <div>
      <dt class="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        Refreshed
      </dt>
      <dd class="mt-2 flex flex-wrap gap-2">
        {#if refreshedPreview.length > 0}
          {#each refreshedPreview as symbol}
            <span class="rounded-full border bg-background/80 px-3 py-1 text-sm font-medium">
              {symbol}
            </span>
          {/each}
          {#if refreshedOverflow > 0}
            <span class="rounded-full border border-dashed bg-background/60 px-3 py-1 text-sm text-muted-foreground">
              +{refreshedOverflow} more
            </span>
          {/if}
        {:else}
          <span class="text-sm text-muted-foreground">None</span>
        {/if}
      </dd>
    </div>
    <div>
      <dt class="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        Failed
      </dt>
      <dd class="mt-2 text-base font-medium">
        {status.failed_symbols.join(", ") || "None"}
      </dd>
    </div>
  </div>

  {#if status.messages.length > 0}
    <p class="text-sm text-muted-foreground">{status.messages.join(" • ")}</p>
  {/if}
</Card>
