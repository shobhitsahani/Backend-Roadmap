"use client";

import type { NodeProps } from "@xyflow/react";

type PhaseHeaderData = {
  order: number;
  title: string;
};

export function PhaseHeaderNode({ data }: NodeProps) {
  const { order, title } = data as unknown as PhaseHeaderData;

  return (
    <div className="w-[280px] select-none">
      <p className="font-mono text-micro tracking-[0.14em] text-ink-subtle uppercase">
        Phase {String(order).padStart(2, "0")}
      </p>
      <p className="mt-1 font-display text-title-sm leading-tight font-semibold tracking-[-0.02em] text-ink">
        {title}
      </p>
    </div>
  );
}
