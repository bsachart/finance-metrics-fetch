<script lang="ts">
  export let active = false;
  export let type: "button" | "submit" = "button";
</script>

<button class:active class="button-root" {type}>
  <slot />
</button>

<style>
  .button-root {
    border: 1px solid var(--color-border);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.72);
    color: var(--color-ink);
    cursor: pointer;
    padding: 0.7rem 1rem;
    transition:
      transform 140ms ease,
      border-color 140ms ease,
      background 140ms ease;
  }

  .button-root:hover {
    transform: translateY(-1px);
    border-color: rgba(19, 33, 47, 0.24);
  }

  .active {
    background: var(--color-ink);
    color: white;
  }
</style>
