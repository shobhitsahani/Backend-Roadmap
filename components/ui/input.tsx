import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-sm border border-input bg-panel px-3 py-2 font-sans text-body text-ink transition-[border-color,box-shadow,background-color] duration-150 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-mono file:text-caption file:font-medium file:text-ink placeholder:text-ink-subtle hover:border-ink/30 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-raised disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 md:h-10 md:text-body",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
