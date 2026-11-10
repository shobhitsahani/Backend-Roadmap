"use client";

import React, { useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import { CheckIcon } from "lucide-react";
import { useReducedMotion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { topicStatusLabel } from "@/lib/format";
import { topicProgress } from "@/lib/progress";
import { useUiStore } from "@/store/ui-store";
import type { Topic } from "@/types/roadmap";

type TopicNodeData = {
  topic: Topic;
  phaseOrder: number;
};

type TopicNodeProps = {
  id: string;
  data: TopicNodeData;
};

export function TopicNode({ data }: TopicNodeProps) {
  const { topic, phaseOrder } = data;
  const openTopic = useUiStore((state) => state.openTopic);
  const reduceMotion = useReducedMotion();
  const progress = topicProgress(topic);
  const done = topic.status === "done";

  const handleClick = useCallback(() => {
    openTopic(topic.id);
  }, [openTopic, topic.id]);

  return (
    <div
      className="relative w-[280px]"
      style={{ "--node-accent": `var(--phase-${phaseOrder})` } as React.CSSProperties}
    >
      <Handle
        id="target-top"
        type="target"
        position={Position.Top}
        isConnectable={false}
        className="size-1! min-h-0! min-w-0! border-0! bg-transparent!"
      />
      <Handle
        id="target-left"
        type="target"
        position={Position.Left}
        isConnectable={false}
        className="size-1! min-h-0! min-w-0! border-0! bg-transparent!"
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleClick}
        className={cn(
          "flex h-auto min-h-[130px] w-full flex-col items-stretch justify-start rounded-sm border p-4 text-left font-sans tracking-normal whitespace-normal normal-case shadow-sm transition-colors duration-150",
          done
            ? "border-[var(--node-accent)] bg-[color-mix(in_oklch,var(--node-accent)_10%,transparent)]"
            : "border-hairline bg-panel hover:border-hairline-strong",
          reduceMotion ? "duration-0" : "",
        )}
      >
        <span className="sr-only">Open topic · </span>
        <div className="mb-1 flex w-full items-start justify-between gap-2">
          <span className="font-mono text-caption text-ink-subtle tabular-nums">
            {String(phaseOrder).padStart(2, "0")}.{String(topic.order).padStart(2, "0")}
          </span>
          <Badge
            variant={
              `phase-${phaseOrder}` as "phase-1" | "phase-2" | "phase-3" | "phase-4"
            }
          >
            {done ? "Done" : topicStatusLabel(topic.status)}
          </Badge>
        </div>
        <div className="w-full min-w-0">
          <h3 className="line-clamp-2 font-display text-body leading-tight font-semibold tracking-[-0.01em] text-ink">
            {topic.title}
          </h3>
        </div>
        <div className="mt-3 flex w-full items-center gap-3">
          <span className="relative flex size-2 shrink-0 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-[color-mix(in_oklch,var(--node-accent)_40%,transparent)]" />
            <span className="size-1.5 rounded-full bg-[var(--node-accent)]" />
          </span>
          <span className="font-mono text-micro tracking-[0.08em] uppercase tabular-nums">
            {progress.completedSubtopics} / {progress.totalSubtopics}
          </span>
          {done ? (
            <CheckIcon aria-hidden="true" className="ml-auto size-3.5 shrink-0" />
          ) : null}
        </div>
      </Button>
      <Handle
        id="source-right"
        type="source"
        position={Position.Right}
        isConnectable={false}
        className="size-1! min-h-0! min-w-0! border-0! bg-transparent!"
      />
      <Handle
        id="source-bottom"
        type="source"
        position={Position.Bottom}
        isConnectable={false}
        className="size-1! min-h-0! min-w-0! border-0! bg-transparent!"
      />
    </div>
  );
}
