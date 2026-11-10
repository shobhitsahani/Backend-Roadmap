import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-xs border px-1.5 py-0.5 font-mono text-micro font-medium tracking-[0.08em] whitespace-nowrap uppercase transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/60 has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "border-hairline-strong bg-raised text-ink",
        secondary: "border-transparent bg-raised text-ink-muted",
        destructive: "border-phase-4/30 bg-phase-4/10 text-phase-4",
        outline: "border-hairline text-ink-muted",
        ghost: "border-transparent text-ink-muted",
        "phase-1": "border-phase-1/30 bg-phase-1/10 text-phase-1",
        "phase-2": "border-phase-2/30 bg-phase-2/10 text-phase-2",
        "phase-3": "border-phase-3/30 bg-phase-3/10 text-phase-3",
        "phase-4": "border-phase-4/30 bg-phase-4/10 text-phase-4",
        "phase-5": "border-phase-5/30 bg-phase-5/10 text-phase-5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants };
