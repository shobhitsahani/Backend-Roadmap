"use client";

import React from "react";
import { ReactFlow, Background, MiniMap } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { buildGraph } from "./layout";
import { TopicNode } from "./topic-node";
import { PhaseFlowEdge } from "./phase-flow-edge";
import { useRoadmapStore } from "@/store/roadmap-store";

const nodeTypes = { topic: TopicNode };
const edgeTypes = { "phase-flow": PhaseFlowEdge };

export function GraphScreen() {
  const phases = useRoadmapStore((state) => state.snapshot.phases);
  const { nodes, edges } = React.useMemo(() => buildGraph(phases), [phases]);

  return (
    <section className="border-t border-hairline pt-4 md:pt-6">
      <div className="relative flex h-[720px] w-full overflow-hidden rounded-sm border border-hairline bg-panel">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.12 }}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.4}
          maxZoom={2}
        >
          <Background gap={16} offset={[0, 0]} />
          {/* mouse gestures: wheel = zoom, drag = pan, pinch = zoom; view fits on entry */}
          <MiniMap position="bottom-right" nodeBorderRadius={2} nodeStrokeWidth={1} />
        </ReactFlow>
      </div>
    </section>
  );
}
