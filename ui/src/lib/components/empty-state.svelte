<script lang="ts">
  import { Card } from "$lib/components/ui/card";

  export let title: string;
  export let message: string;
</script>

<Card className="space-y-3">
  <h2 class="text-2xl font-semibold tracking-tight">{title}</h2>
  <p class="max-w-2xl text-muted-foreground">{message}</p>
</Card>
