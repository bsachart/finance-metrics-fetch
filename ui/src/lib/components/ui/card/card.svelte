<script lang="ts">
  import { cn } from "$lib/utils";

  export let className = "";
  export let padded = true;
</script>

<div
  class={cn(
    "bg-card/90 text-card-foreground rounded-[28px] border shadow-[0_18px_50px_rgba(18,26,33,0.12)] backdrop-blur",
    padded && "p-6",
    className,
  )}
>
  <slot />
</div>
