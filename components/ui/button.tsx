import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-sm border border-transparent bg-clip-padding font-mono text-label font-medium tracking-[0.08em] whitespace-nowrap uppercase transition-[color,background-color,border-color,transform,opacity] duration-150 outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-45 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "border-primary bg-primary text-primary-foreground hover:bg-primary/88",
        outline:
          "border-hairline-strong bg-transparent text-ink hover:border-ink/40 hover:bg-raised aria-expanded:border-ink/40 aria-expanded:bg-raised",
        secondary:
          "border-hairline bg-raised text-ink hover:border-hairline-strong hover:bg-field",
        ghost:
          "border-transparent text-ink-muted hover:bg-raised hover:text-ink aria-expanded:bg-raised aria-expanded:text-ink",
        destructive:
          "border-danger/40 bg-transparent text-danger hover:border-danger/55 hover:bg-danger/10 focus-visible:ring-danger/60",
        link: "border-transparent p-0 text-ink underline decoration-hairline-strong underline-offset-4 hover:decoration-ink",
      },
      size: {
        default:
          "h-11 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 md:h-10",
        xs: "h-8 gap-1.5 rounded-xs px-2.5 text-micro has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-11 gap-1.5 px-3 text-micro has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 md:h-9 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 px-5 text-label has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-11 md:size-10",
        "icon-xs": "size-8 rounded-xs [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-11 md:size-9 [&_svg:not([class*='size-'])]:size-4",
        "icon-lg": "size-12 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
