<script lang="ts">
  import { Card } from "$lib/components/ui/card";

  import type { PublishedStatus } from "$data/types";

  export let status: PublishedStatus;
</script>

<Card class="space-y-4 rounded-[28px] border bg-card/90 p-5 shadow-[0_18px_50px_rgba(18,26,33,0.12)]">
  <div class="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
    <div>
      <p class="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        Refresh issues
      </p>
      <h2 class="mt-1 font-heading text-xl font-semibold tracking-tight">
        Review the latest published refresh
      </h2>
      <p class="mt-1 text-sm text-muted-foreground">
        {new Date(status.finished_at).toLocaleString()}
      </p>
    </div>
  </div>

  {#if status.failed_symbols.length > 0}
    <div>
      <dt class="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        Failed
      </dt>
      <dd class="mt-2 text-base font-medium">
        {status.failed_symbols.join(", ")}
      </dd>
    </div>
  {/if}

  {#if status.messages.length > 0}
    <p class="text-sm text-muted-foreground">{status.messages.join(" • ")}</p>
  {:else if status.failed_symbols.length === 0}
    <p class="text-sm text-muted-foreground">The latest refresh reported issues without symbol-level failure details.</p>
  {/if}
</Card>
