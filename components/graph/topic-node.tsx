"use client";

import React, { useCallback } from "react";
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
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={cn(
        "h-full min-h-[130px] w-full min-w-[220px] rounded-sm border border-transparent bg-panel p-4 text-left shadow-sm transition-colors duration-150",
        done
          ? `border-[var(--phase-${phaseOrder})] bg-phase-${phaseOrder}/10`
          : "border-hairline hover:border-hairline-strong",
        reduceMotion ? "duration-0" : "",
      )}
    >
      <span className="sr-only">Open topic · </span>
      <div className="mb-1 flex items-start justify-between gap-2">
        <span className="font-mono text-caption text-ink-subtle tabular-nums">
          {String(phaseOrder).padStart(2, "0")}.{String(topic.order).padStart(2, "0")}
        </span>
        <Badge
          variant={`phase-${phaseOrder}` as "phase-1" | "phase-2" | "phase-3" | "phase-4"}
        >
          {done ? "Done" : topicStatusLabel(topic.status)}
        </Badge>
      </div>
      <div className="min-w-0">
        <h3 className="line-clamp-2 font-display text-body leading-tight font-semibold tracking-[-0.01em] text-ink">
          {topic.title}
        </h3>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <span className="relative flex size-2 shrink-0 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-[var(--phase-${phaseOrder})]/40" />
          <span className="size-1.5 rounded-full bg-[var(--phase-${phaseOrder})]" />
        </span>
        <span className="font-mono text-micro tracking-[0.08em] uppercase tabular-nums">
          {progress.completedSubtopics} / {progress.totalSubtopics}
        </span>
        {done ? (
          <CheckIcon aria-hidden="true" className="ml-auto size-3.5 shrink-0" />
        ) : null}
      </div>
    </Button>
  );
}
