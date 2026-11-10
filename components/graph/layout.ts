import type { PhaseWithTopics, Topic } from "@/types/roadmap";

export type TopicGraphNode = {
  id: string;
  type: "topic";
  position: { x: number; y: number };
  data: { topic: Topic; phaseOrder: number };
};

export type PhaseHeaderGraphNode = {
  id: string;
  type: "phase-header";
  position: { x: number; y: number };
  data: { order: number; title: string };
  draggable: false;
  selectable: false;
};

export type GraphNode = TopicGraphNode | PhaseHeaderGraphNode;

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
  type: "phase-flow";
  data: { phaseOrder: number };
};

export type GraphLayout = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

const COLUMN_GAP = 360;
const TOPIC_GAP = 150;
const PHASE_HEADER_Y = 64;

export function buildGraph(phases: PhaseWithTopics[]): GraphLayout {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  let previous: { id: string; phaseOrder: number } | null = null;
  let topicIndex = 0;

  phases.forEach((phase, phaseIndex) => {
    const x = phaseIndex * COLUMN_GAP;

    nodes.push({
      id: `phase-${phase.id}`,
      type: "phase-header",
      position: { x, y: 0 },
      data: { order: phase.order, title: phase.title },
      draggable: false,
      selectable: false,
    });

    let y = PHASE_HEADER_Y;

    phase.topics.forEach((topic) => {
      nodes.push({
        id: topic.id,
        type: "topic",
        position: { x, y },
        data: { topic, phaseOrder: phase.order },
      });

      if (previous !== null) {
        const sameColumn = previous.phaseOrder === phase.order;
        edges.push({
          id: `e-${topicIndex - 1}-${topicIndex}`,
          source: previous.id,
          target: topic.id,
          sourceHandle: sameColumn ? "source-bottom" : "source-right",
          targetHandle: sameColumn ? "target-top" : "target-left",
          type: "phase-flow",
          data: { phaseOrder: phase.order },
        });
      }

      previous = { id: topic.id, phaseOrder: phase.order };
      topicIndex += 1;
      y += TOPIC_GAP;
    });
  });

  return { nodes, edges };
}
