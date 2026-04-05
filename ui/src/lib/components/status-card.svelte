<script lang="ts">
  import { Badge } from "$lib/components/ui/badge";
  import { Card } from "$lib/components/ui/card";

  import type { PublishedStatus } from "$data/types";

  export let status: PublishedStatus;

  const toneByStatus = {
    failure: "destructive",
    partial_failure: "warm",
    success: "accent",
  } as const;
</script>

<Card className="space-y-5">
  <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
    <div>
      <h2 class="text-3xl font-semibold tracking-tight">Refresh status</h2>
      <p class="mt-2 text-base text-muted-foreground">
        Latest repository snapshot from {new Date(status.finished_at).toLocaleString()}.
      </p>
    </div>
    <Badge variant={toneByStatus[status.status as keyof typeof toneByStatus] ?? "outline"}>
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
