"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import type * as THREE from "three";

import { threeColorFromCssVar } from "@/components/three/track-world-colors";
import { phaseProgress } from "@/lib/progress";
import type { PhaseWithTopics } from "@/types/roadmap";

export function ProgressCore({
  phases,
  trackSlug,
}: {
  phases: PhaseWithTopics[];
  trackSlug: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const router = useRouter();

  const segments = useMemo(() => {
    const n = phases.length;
    const slot = (Math.PI * 2) / Math.max(n, 1);
    return phases.map((phase, i) => {
      const p = phaseProgress(phase);
      const fill = Math.max(0.001, (p.percent / 100) * slot);
      const accent = threeColorFromCssVar(`--phase-${phase.order}`, "rgb(45, 156, 64)");
      return {
        phase,
        index: i,
        start: i * slot,
        fill,
        slot,
        accent,
        percent: p.percent,
      };
    });
  }, [phases]);

  return (
    <div data-testid="progress-core" className="relative w-full">
      <div className="h-[260px] w-full border border-hairline bg-panel">
        <Canvas
          aria-hidden="true"
          dpr={[1, 2]}
          frameloop="demand"
          gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
          camera={{ position: [0, 0, 4.6], fov: 45 }}
        >
          <ProgressScene segments={segments} hovered={hovered} />
        </Canvas>
      </div>
      {hovered !== null ? (
        <div className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 border border-hairline bg-panel px-3 py-1.5 font-mono text-micro tracking-[0.1em] text-ink uppercase">
          {segments[hovered]?.phase.title} / {segments[hovered]?.percent}%
        </div>
      ) : null}
      <ol className="mt-3 grid gap-2 sm:grid-cols-2">
        {segments.map((seg) => (
          <li key={seg.phase.id}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 border border-hairline bg-panel px-3 py-2 text-left font-sans text-body text-ink transition-colors hover:bg-field"
              onClick={() => router.push(`/${trackSlug}#phase-${seg.phase.id}`)}
              onMouseEnter={() => setHovered(seg.index)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="flex items-center gap-2">
                <span className="font-mono text-micro text-ink-subtle">
                  {String(seg.phase.order).padStart(2, "0")}
                </span>
                {seg.phase.title}
              </span>
              <span className="font-mono text-micro text-ink-subtle">{seg.percent}%</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ProgressScene({
  segments,
  hovered,
}: {
  segments: {
    phase: PhaseWithTopics;
    index: number;
    start: number;
    fill: number;
    slot: number;
    accent: THREE.Color;
    percent: number;
  }[];
  hovered: number | null;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const invalidate = useThree((s) => s.invalidate);

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.003;
    invalidate();
  });

  return (
    <group ref={groupRef}>
      {segments.map((seg) => (
        <group key={seg.phase.id} rotation={[0, -seg.start, 0]}>
          {/* track (full slot, dim) */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.35, 0.06, 8, 48, seg.slot]} />
            <meshBasicMaterial color="#9ca3af" transparent opacity={0.18} />
          </mesh>
          {/* fill */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.35, 0.075, 8, 48, seg.fill]} />
            <meshStandardMaterial
              color={seg.accent}
              transparent
              opacity={hovered === seg.index ? 1 : 0.85}
              emissive={seg.accent}
              emissiveIntensity={hovered === seg.index ? 0.5 : 0.15}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
