<script lang="ts">
  import Card from "$components/ui/card.svelte";

  import type { PublishedStatus } from "$data/types";

  export let status: PublishedStatus;

  const toneByStatus = {
    failure: "danger",
    partial_failure: "warm",
    success: "accent",
  } as const;
</script>

<Card>
  <div class="panel-header">
    <div>
      <h2 class="section-title">Refresh status</h2>
      <p class="section-copy">
        Latest repository snapshot from {new Date(status.finished_at).toLocaleString()}.
      </p>
    </div>
    <span class={`status-pill ${toneByStatus[status.status as keyof typeof toneByStatus] ?? "default"}`}>
      {status.status.replace("_", " ")}
    </span>
  </div>

  <div class="status-grid">
    <div>
      <dt>Refreshed symbols</dt>
      <dd>{status.refreshed_symbols.join(", ") || "None"}</dd>
    </div>
    <div>
      <dt>Failed symbols</dt>
      <dd>{status.failed_symbols.join(", ") || "None"}</dd>
    </div>
  </div>

  {#if status.messages.length > 0}
    <ul>
      {#each status.messages as message}
        <li>{message}</li>
      {/each}
    </ul>
  {/if}
</Card>

<style>
  .status-grid {
    display: grid;
    gap: 0.8rem;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  dt {
    color: var(--color-muted-ink);
    font-size: 0.84rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  dd {
    margin: 0.35rem 0 0;
    font-weight: 600;
  }

  ul {
    margin: 1rem 0 0;
    padding-left: 1rem;
    color: var(--color-muted-ink);
  }

  .status-pill {
    border-radius: 999px;
    padding: 0.45rem 0.8rem;
    border: 1px solid var(--color-border);
    background: rgba(255, 255, 255, 0.7);
    text-transform: capitalize;
  }

  .accent {
    background: rgba(15, 118, 110, 0.1);
    border-color: rgba(15, 118, 110, 0.28);
  }

  .warm {
    background: rgba(191, 107, 52, 0.1);
    border-color: rgba(191, 107, 52, 0.28);
  }

  .danger {
    background: rgba(180, 35, 24, 0.1);
    border-color: rgba(180, 35, 24, 0.28);
  }
</style>
