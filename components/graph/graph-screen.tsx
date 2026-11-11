"use client";

import React from "react";
import { ReactFlow, Background, type ReactFlowInstance } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { buildGraph, type GraphEdge, type GraphNode } from "./layout";
import { TopicNode } from "./topic-node";
import { PhaseHeaderNode } from "./phase-header-node";
import { PhaseFlowEdge } from "./phase-flow-edge";
import { useTheme } from "@/components/theme/theme-provider";
import { isDarkTheme } from "@/lib/theme/config";
import { useRoadmapStore } from "@/store/roadmap-store";

const nodeTypes = { topic: TopicNode, "phase-header": PhaseHeaderNode };
const edgeTypes = { "phase-flow": PhaseFlowEdge };

export function GraphScreen() {
  const phases = useRoadmapStore((state) => state.snapshot.phases);
  const { nodes, edges } = React.useMemo(() => buildGraph(phases), [phases]);
  const { resolvedTheme } = useTheme();

  const handleInit = React.useCallback(
    (instance: ReactFlowInstance<GraphNode, GraphEdge>) => {
      if (window.matchMedia("(max-width: 767px)").matches) {
        instance.setViewport({ x: 16, y: 16, zoom: 0.7 });
      }
    },
    [],
  );

  return (
    <section className="border-t border-hairline pt-4 md:pt-6">
      <div className="relative flex h-[60dvh] min-h-[420px] w-full overflow-hidden rounded-sm border border-hairline bg-panel md:h-[720px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.12, minZoom: 0.65 }}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.35}
          maxZoom={2}
          nodesDraggable={false}
          nodesConnectable={false}
          colorMode={isDarkTheme(resolvedTheme) ? "dark" : "light"}
          onInit={handleInit}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={16} offset={[0, 0]} />
          {/* mouse gestures: wheel = zoom, drag = pan, pinch = zoom; view fits on entry */}
        </ReactFlow>
      </div>
      <p className="mt-2 font-mono text-micro tracking-[0.1em] text-ink-subtle uppercase md:hidden">
        Drag to pan · pinch to zoom
      </p>
    </section>
  );
}
