"use client";

import React from "react";
import { ReactFlow, Background, Controls, MiniMap, useReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Maximize2Icon, Minimize2Icon, ZoomInIcon, ZoomOutIcon } from "lucide-react";

import { buildGraph } from "./layout";
import { TopicNode } from "./topic-node";
import { PhaseFlowEdge } from "./phase-flow-edge";
import { useRoadmapStore } from "@/store/roadmap-store";
import { Button } from "@/components/ui/button";

const nodeTypes = { topic: TopicNode };
const edgeTypes = { "phase-flow": PhaseFlowEdge };

function GraphControls() {
  const { getViewport, setViewport } = useReactFlow();
  const [fit, setFit] = React.useState(true);

  return (
    <div className="absolute right-4 bottom-4 z-50 flex flex-col gap-2">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => {
            const current = getViewport();
            setViewport({ ...current, zoom: Math.min(2, current.zoom * 1.2) });
          }}
        >
          <ZoomInIcon className="size-4" />
          <span className="sr-only">Zoom in</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => {
            const current = getViewport();
            setViewport({ ...current, zoom: Math.max(0.4, current.zoom / 1.2) });
          }}
        >
          <ZoomOutIcon className="size-4" />
          <span className="sr-only">Zoom out</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setFit((current) => !current)}
        >
          {fit ? (
            <Minimize2Icon className="size-4" />
          ) : (
            <Maximize2Icon className="size-4" />
          )}
          <span className="sr-only">{fit ? "Fit to screen" : "Restore zoom"}</span>
        </Button>
      </div>
      {fit ? (
        <Button type="button" variant="outline" size="sm" onClick={() => setFit(false)}>
          Fit view
        </Button>
      ) : null}
    </div>
  );
}

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
          panOnScroll
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.4}
          maxZoom={2}
        >
          <Background gap={16} offset={[0, 0]} />
          <Controls position="top-right" showInteractive={false} />
          <MiniMap position="bottom-right" nodeBorderRadius={2} nodeStrokeWidth={1} />
          <GraphControls />
        </ReactFlow>
      </div>
    </section>
  );
}
