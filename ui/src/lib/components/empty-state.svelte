<script lang="ts">
  import Card from "$components/ui/card.svelte";

  export let title: string;
  export let message: string;
</script>

<Card>
  <h2 class="section-title">{title}</h2>
  <p class="section-copy">{message}</p>
</Card>
