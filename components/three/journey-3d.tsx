"use client";

import { Canvas } from "@react-three/fiber";
import { useMemo, useState } from "react";

import { threeColorFromCssVar } from "@/components/three/track-world-colors";
import { phaseProgress } from "@/lib/progress";
import type { PhaseWithTopics } from "@/types/roadmap";

const NODE_RADIUS = 0.32;

function nodePosition(index: number, total: number): [number, number, number] {
  const angle = (index / Math.max(total, 1)) * Math.PI * 1.6 - Math.PI * 0.8;
  const y = (total - 1) / 2 - index;
  return [Math.sin(angle) * 2.2, y * 1.1, Math.cos(angle) * 1.2];
}

function phaseState(
  phase: PhaseWithTopics,
): "done" | "in-progress" | "prereq" | "not-started" {
  const isPrereq = phase.topics.length > 0 && phase.topics.every((t) => t.linkedTopicId);
  if (isPrereq) return "prereq";
  const progress = phaseProgress(phase);
  if (progress.percent >= 100) return "done";
  if (progress.percent > 0) return "in-progress";
  return "not-started";
}

function JourneyScene({ phases }: { phases: PhaseWithTopics[] }) {
  const positions = useMemo(
    () => phases.map((_, i) => nodePosition(i, phases.length)),
    [phases],
  );

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 6]} intensity={0.8} />
      {phases.map((phase, i) => {
        const state = phaseState(phase);
        const accent = threeColorFromCssVar(`--phase-${phase.order}`, "rgb(45, 156, 64)");
        const pos = positions[i]!;
        const dim = state === "not-started";
        return (
          <group key={phase.id} position={pos}>
            {state === "prereq" ? (
              <mesh>
                <sphereGeometry args={[NODE_RADIUS, 16, 16]} />
                <meshBasicMaterial color={accent} wireframe transparent opacity={0.7} />
              </mesh>
            ) : (
              <mesh>
                <sphereGeometry args={[NODE_RADIUS, 16, 16]} />
                <meshStandardMaterial
                  color={
                    state === "done"
                      ? accent
                      : state === "in-progress"
                        ? accent
                        : "#6b7280"
                  }
                  transparent
                  opacity={dim ? 0.25 : 0.9}
                  emissive={state === "done" ? accent : undefined}
                  emissiveIntensity={state === "done" ? 0.4 : 0}
                />
              </mesh>
            )}
            {state === "in-progress" ? (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[NODE_RADIUS + 0.12, 0.03, 8, 32]} />
                <meshBasicMaterial color={accent} transparent opacity={0.9} />
              </mesh>
            ) : null}
          </group>
        );
      })}
      {/* connecting line */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(positions.flatMap((p) => p)), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#9ca3af" transparent opacity={0.35} />
      </line>
    </>
  );
}

export function Journey3D({
  phases,
  onOpenTopic,
}: {
  phases: PhaseWithTopics[];
  onOpenTopic: (topicId: string) => void;
}) {
  const [overviewKey, setOverviewKey] = useState(0);

  return (
    <div data-testid="journey-3d" className="relative w-full">
      <div className="h-[420px] w-full border border-hairline bg-panel md:h-[520px]">
        <Canvas
          aria-hidden="true"
          dpr={[1, 2]}
          frameloop="demand"
          gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
          camera={{ position: [0, 0, 6.5], fov: 50 }}
          key={overviewKey}
        >
          <JourneyScene phases={phases} />
        </Canvas>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="font-mono text-micro tracking-[0.1em] text-ink-subtle uppercase">
          Journey / {phases.length} phases
        </p>
        <button
          type="button"
          className="font-mono text-micro tracking-[0.1em] text-ink uppercase underline-offset-4 hover:underline"
          onClick={() => setOverviewKey((k) => k + 1)}
        >
          Overview
        </button>
      </div>
      <ol className="mt-4 flex flex-col gap-2">
        {phases.map((phase, i) => {
          const state = phaseState(phase);
          const firstTopic = phase.topics[0];
          return (
            <li key={phase.id}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 border border-hairline bg-panel px-3 py-2 text-left font-sans text-body text-ink transition-colors hover:bg-field"
                onClick={() => {
                  if (firstTopic) onOpenTopic(firstTopic.id);
                }}
                disabled={!firstTopic}
              >
                <span className="flex items-center gap-2">
                  <span className="font-mono text-micro text-ink-subtle">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {phase.title}
                  <span className="font-mono text-micro text-ink-subtle uppercase">
                    {state}
                  </span>
                </span>
                <span className="font-mono text-micro text-ink-subtle">
                  {phaseProgress(phase).percent}%
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
