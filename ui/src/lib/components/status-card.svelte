<script lang="ts">
  import { Badge } from "$lib/components/ui/badge";
  import { Card } from "$lib/components/ui/card";

  import type { PublishedStatus } from "$data/types";

  export let status: PublishedStatus;

  const toneByStatusClass = {
    failure: "border-red-200 bg-red-50 text-red-800",
    partial_failure: "border-amber-200 bg-amber-50 text-amber-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  } as const;
</script>

<Card class="space-y-5 rounded-[28px] border bg-card/90 p-6 shadow-[0_18px_50px_rgba(18,26,33,0.12)]">
  <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
    <div>
      <h2 class="font-heading text-3xl font-semibold tracking-tight">Refresh status</h2>
      <p class="mt-2 text-base text-muted-foreground">
        Latest repository snapshot from {new Date(status.finished_at).toLocaleString()}.
      </p>
    </div>
    <Badge
      class={toneByStatusClass[status.status as keyof typeof toneByStatusClass] ?? ""}
      variant="outline"
    >
      {status.status.replace("_", " ")}
    </Badge>
  </div>

  <div class="grid gap-4 md:grid-cols-2">
    <div>
      <dt class="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        Refreshed symbols
      </dt>
      <dd class="mt-2 text-2xl font-semibold">
        {status.refreshed_symbols.join(", ") || "None"}
      </dd>
    </div>
    <div>
      <dt class="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        Failed symbols
      </dt>
      <dd class="mt-2 text-2xl font-semibold">{status.failed_symbols.join(", ") || "None"}</dd>
    </div>
  </div>

  {#if status.messages.length > 0}
    <ul class="list-disc space-y-1 pl-5 text-muted-foreground">
      {#each status.messages as message}
        <li>{message}</li>
      {/each}
    </ul>
  {/if}
</Card>
