<script lang="ts">
  import { Card } from "$lib/components/ui/card";

  export let title: string;
  export let message: string;
</script>

<Card class="space-y-3 rounded-[28px] border bg-card/90 p-6 shadow-[0_18px_50px_rgba(18,26,33,0.12)]">
  <h2 class="font-heading text-2xl font-semibold tracking-tight">{title}</h2>
  <p class="max-w-2xl text-muted-foreground">{message}</p>
</Card>
