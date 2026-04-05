<script lang="ts">
  export let value = "";
  export let placeholder = "";
</script>

<input bind:value {placeholder} class="input-root" />

<style>
  .input-root {
    width: 100%;
    border: 1px solid var(--color-border);
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.75);
    padding: 0.85rem 1rem;
    color: var(--color-ink);
  }

  .input-root:focus {
    outline: 2px solid rgba(15, 118, 110, 0.16);
    border-color: rgba(15, 118, 110, 0.35);
  }
</style>
