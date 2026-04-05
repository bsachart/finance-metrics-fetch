<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";

  import { cn } from "$lib/utils";

  const buttonVariants = tv({
    base: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-11 px-5 py-2",
        lg: "h-12 px-6 py-2.5",
        sm: "h-9 px-4 py-2 text-xs",
      },
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        ghost: "bg-transparent hover:bg-secondary",
        outline: "border bg-card text-card-foreground hover:bg-secondary",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      },
    },
  });

  type Variant = VariantProps<typeof buttonVariants>;

  export let className = "";
  export let type: "button" | "submit" | "reset" = "button";
  export let variant: Variant["variant"] = "default";
  export let size: Variant["size"] = "default";
</script>

<button class={cn(buttonVariants({ size, variant }), className)} {type}>
  <slot />
</button>
