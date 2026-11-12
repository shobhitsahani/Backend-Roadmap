"use client";

import { PaletteIcon } from "lucide-react";

import { useTheme } from "@/components/theme/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { themeOptionLabels } from "@/lib/theme/config";
import { themes, themeNames, type ThemeName } from "@/lib/theme/tokens";
import { cn } from "@/lib/utils";

function ThemeSwatch({ theme }: { theme: ThemeName }) {
  const tokens = themes[theme];

  return (
    <span
      aria-hidden="true"
      className="block h-9 w-12 shrink-0 overflow-hidden rounded-xs border"
      style={{
        backgroundColor: tokens.base.bg,
        borderColor: tokens.base.border,
      }}
    >
      <span
        className="flex h-2.5 items-center gap-0.5 px-1"
        style={{
          backgroundColor: tokens.base.surface1,
          borderBottom: `1px solid ${tokens.base.border}`,
        }}
      >
        <span
          className="size-1 rounded-full"
          style={{ backgroundColor: tokens.base.brand }}
        />
        <span className="h-px w-3" style={{ backgroundColor: tokens.base.textFaint }} />
      </span>
      <span className="flex gap-1 p-1">
        <span
          className="h-4 w-1"
          style={{ backgroundColor: tokens.tracks.backend.accent }}
        />
        <span
          className="h-4 w-1"
          style={{ backgroundColor: tokens.tracks["ai-engineer"].accent }}
        />
        <span
          className="ml-auto h-4 w-5 rounded-[1px]"
          style={{ backgroundColor: tokens.base.surface2 }}
        />
      </span>
    </span>
  );
}

export function ThemePicker({ className }: { className?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const activeTheme = theme === "system" ? resolvedTheme : theme;
  const activeLabel = themeOptionLabels[activeTheme];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Theme: ${activeLabel}. Change theme`}
            title="Change theme"
            data-testid="theme-picker-trigger"
            className={cn("text-ink-muted hover:text-ink", className)}
          />
        }
      >
        <PaletteIcon aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-64 p-1.5">
        <div className="px-2 py-1.5 font-mono text-micro tracking-[0.12em] text-ink-subtle uppercase">
          Theme
        </div>
        <DropdownMenuRadioGroup
          value={activeTheme}
          onValueChange={(value) => setTheme(value as ThemeName)}
        >
          {themeNames.map((name) => (
            <DropdownMenuRadioItem
              key={name}
              value={name}
              data-testid={`theme-option-${name}`}
              className="items-center gap-3 py-2 pr-8 pl-1.5"
            >
              <ThemeSwatch theme={name} />
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-body leading-tight">{themeOptionLabels[name]}</span>
                <span className="font-mono text-micro leading-tight tracking-[0.06em] text-ink-subtle uppercase">
                  {themes[name].description}
                </span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Kept for the old import path while the picker rolls out. */
export function ThemeToggle({ className }: { className?: string }) {
  return <ThemePicker className={className} />;
}
