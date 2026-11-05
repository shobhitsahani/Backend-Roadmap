"use client";

import { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";

const demoItems = [
  "What happens when you type a URL",
  "Client-server architecture",
  "HTTP / DNS / IP / Ports / Servers",
] as const;

export function DemoChecklist() {
  const [done, setDone] = useState<boolean[]>([true, false, false]);

  return (
    <div className="flex flex-col">
      {demoItems.map((item, index) => (
        <label
          key={item}
          className="group flex min-h-11 cursor-pointer items-center gap-3 border-b border-hairline py-2.5 last:border-b-0"
        >
          <Checkbox
            checked={done[index]}
            onCheckedChange={(checked) => {
              setDone((current) =>
                current.map((value, itemIndex) =>
                  itemIndex === index ? checked : value,
                ),
              );
            }}
          />
          <span className="font-sans text-body text-ink-muted transition-colors group-hover:text-ink">
            {item}
          </span>
        </label>
      ))}
    </div>
  );
}
