<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";

  import { cn } from "$lib/utils";

  const badgeVariants = tv({
    base: "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.18em]",
    defaultVariants: {
      variant: "outline",
    },
    variants: {
      variant: {
        accent: "border-emerald-200 bg-emerald-50 text-emerald-800",
        destructive: "border-red-200 bg-red-50 text-red-800",
        outline: "border-border bg-background/80 text-muted-foreground",
        secondary: "border-border bg-secondary text-secondary-foreground",
        warm: "border-amber-200 bg-amber-50 text-amber-800",
      },
    },
  });

  type Variant = VariantProps<typeof badgeVariants>;

  export let className = "";
  export let variant: Variant["variant"] = "outline";
</script>

<span class={cn(badgeVariants({ variant }), className)}>
  <slot />
</span>
