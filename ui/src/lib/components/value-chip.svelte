<script lang="ts">
  export let label: string;
  export let value: string;
  export let tone: "default" | "accent" | "warm" | "danger" = "default";
</script>

<article class:accent={tone === "accent"} class:danger={tone === "danger"} class:warm={tone === "warm"} class="chip-root">
  <p>{label}</p>
  <strong>{value}</strong>
</article>

<style>
  .chip-root {
    padding: 1rem;
    border-radius: 20px;
    border: 1px solid var(--color-border);
    background: rgba(255, 255, 255, 0.72);
  }

  p {
    margin: 0 0 0.5rem;
    color: var(--color-muted-ink);
    font-size: 0.84rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  strong {
    font-size: 1.05rem;
  }

  .accent {
    border-color: rgba(15, 118, 110, 0.24);
    background: rgba(15, 118, 110, 0.08);
  }

  .warm {
    border-color: rgba(191, 107, 52, 0.26);
    background: rgba(191, 107, 52, 0.08);
  }

  .danger {
    border-color: rgba(180, 35, 24, 0.24);
    background: rgba(180, 35, 24, 0.08);
  }
</style>
