<script lang="ts">
  import { Badge } from "$lib/components/ui/badge";

  export let label: string;
  export let value: string;
  export let tone: "default" | "accent" | "warm" | "danger" = "default";

  const toneByVariant = {
    accent: "accent",
    danger: "destructive",
    default: "outline",
    warm: "warm",
  } as const;
</script>

<article class="rounded-[24px] border bg-card/80 p-4 shadow-sm">
  <Badge variant={toneByVariant[tone]}>{label}</Badge>
  <strong class="mt-3 block text-2xl font-semibold tracking-tight">{value}</strong>
</article>
