"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogDescription } from "@/components/ui/dialog";

const shortcuts: Array<{ keys: string; description: string }> = [
  { keys: "⌘ K", description: "Toggle the command palette" },
  { keys: "1 / 2 / 3", description: "Go to Roadmap / Field log / Timeline" },
  { keys: "?", description: "Show this shortcut help" },
  { keys: "↑ ↓", description: "Move through palette results" },
  { keys: "Enter", description: "Run the highlighted command" },
  { keys: "Esc", description: "Close the palette or any panel" },
];

export function ShortcutsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
          <DialogDescription>
            Field-manual controls. Keys are ignored while typing in an input.
          </DialogDescription>
        </DialogHeader>
        <dl className="flex flex-col border-t border-hairline">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.keys}
              className="flex min-h-11 items-center justify-between gap-6 border-b border-hairline py-1.5"
            >
              <dt className="font-sans text-body text-ink-muted">
                {shortcut.description}
              </dt>
              <dd className="shrink-0 rounded-xs border border-hairline px-1.5 py-0.5 font-mono text-micro tracking-[0.08em] text-ink">
                {shortcut.keys}
              </dd>
            </div>
          ))}
        </dl>
      </DialogContent>
    </Dialog>
  );
}
