<script lang="ts">
  export let padded = true;
</script>

<div class:card-padding={padded} class="panel card-root">
  <slot />
</div>

<style>
  .card-root {
    overflow: hidden;
  }

  .card-padding {
    padding: 1.2rem;
  }
</style>
