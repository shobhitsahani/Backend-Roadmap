import type { PhaseWithTopics, Topic } from "@/types/roadmap";

export type GraphNode = {
  id: string;
  type: "topic";
  position: { x: number; y: number };
  data: { topic: Topic; phase: PhaseWithTopics };
};

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  type: "phase-flow";
};

export type GraphLayout = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

const COLUMN_GAP = 360;
const TOPIC_GAP = 150;
const PHASE_HEADER_Y = 40;

export function buildGraph(phases: PhaseWithTopics[]): GraphLayout {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  let previousTopicId: string | null = null;
  let topicIndex = 0;

  phases.forEach((phase, phaseIndex) => {
    const x = phaseIndex * COLUMN_GAP;
    let y = PHASE_HEADER_Y;

    phase.topics.forEach((topic) => {
      nodes.push({
        id: topic.id,
        type: "topic",
        position: { x, y },
        data: { topic, phase },
      });

      if (previousTopicId !== null) {
        edges.push({
          id: `e-${topicIndex - 1}-${topicIndex}`,
          source: previousTopicId,
          target: topic.id,
          type: "phase-flow",
        });
      }

      previousTopicId = topic.id;
      topicIndex += 1;
      y += TOPIC_GAP;
    });
  });

  return { nodes, edges };
}
