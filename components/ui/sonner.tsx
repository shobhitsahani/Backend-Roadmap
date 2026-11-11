"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

import { useTheme } from "@/components/theme/theme-provider";
import { isDarkTheme } from "@/lib/theme/config";

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      theme={isDarkTheme(resolvedTheme) ? "dark" : "light"}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--panel)",
          "--normal-text": "var(--ink)",
          "--normal-border": "var(--hairline-strong)",
          "--border-radius": "var(--radius-sm)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "font-sans",
          actionButton:
            "bg-ink! text-canvas! font-mono text-micro font-medium not-italic tracking-[0.08em] uppercase rounded-xs px-2.5 py-1.5",
          closeButton: "bg-panel! text-ink! border-hairline-strong! text-micro",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
