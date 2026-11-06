"use client";

import React, { useState } from "react";
import { useReducedMotion } from "motion/react";
import { type Edge } from "@xyflow/react";

import { cn } from "@/lib/utils";

export type PhaseFlowEdgeData = {
  phaseOrder: number;
};

export type PhaseFlowEdge = Edge & {
  type: "phase-flow";
  data: PhaseFlowEdgeData;
  sourceX?: number;
  sourceY?: number;
  targetX?: number;
  targetY?: number;
};

export function PhaseFlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  style,
}: PhaseFlowEdge) {
  const reduceMotion = useReducedMotion();
  const [offset] = useState(0);

  const sx = sourceX ?? 0;
  const sy = sourceY ?? 0;
  const tx = targetX ?? 0;
  const ty = targetY ?? 0;
  const dx = tx - sx;
  const cp1x = sx + dx * 0.45;
  const cp2x = tx - dx * 0.45;

  const d = `M ${sx} ${sy} C ${cp1x} ${sy} ${cp2x} ${ty} ${tx} ${ty}`;

  const phaseColor = `var(--phase-${Math.max(1, Math.min(4, data.phaseOrder))})`;

  return (
    <path
      id={id}
      d={d}
      fill="none"
      stroke={cn(phaseColor, style?.stroke)}
      strokeWidth={1}
      strokeOpacity={0.3}
      strokeDasharray={reduceMotion ? "none" : "240"}
      strokeDashoffset={reduceMotion ? 0 : offset}
      style={style}
    >
      {!reduceMotion && (
        <animate
          attributeName="stroke-dashoffset"
          from="240"
          to="0"
          dur="0.6s"
          fill="freeze"
          keyTimes="0;1"
        />
      )}
    </path>
  );
}
