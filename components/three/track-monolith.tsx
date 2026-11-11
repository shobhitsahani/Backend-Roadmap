"use client";

import { Canvas } from "@react-three/fiber";
import {
  PresentationControls,
  RoundedBox,
  Edges,
  Text,
  ContactShadows,
} from "@react-three/drei";
import { useMemo, useState } from "react";

import { threeColorFromCssVar } from "@/components/three/track-world-colors";

type Face = "backend" | "ai";

export function TrackMonolith({
  backendPercent,
  aiPercent,
  onNavigate,
}: {
  backendPercent: number;
  aiPercent: number;
  onNavigate: (face: Face) => void;
}) {
  const [hovered, setHovered] = useState<Face | null>(null);
  const [hintDismissed, setHintDismissed] = useState(false);

  const backendColor = useMemo(
    () => threeColorFromCssVar("--track-backend", "rgb(45, 156, 64)"),
    [],
  );
  const aiColor = useMemo(
    () => threeColorFromCssVar("--track-ai-engineer", "rgb(236, 91, 20)"),
    [],
  );

  return (
    <div
      data-testid="track-monolith"
      className="relative h-[360px] w-full md:h-[420px]"
      onPointerDown={() => setHintDismissed(true)}
    >
      <Canvas
        aria-hidden="true"
        dpr={[1, 2]}
        frameloop="demand"
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        camera={{ position: [0, 1.2, 4.2], fov: 28 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 6, 4]} intensity={0.9} castShadow />
        <directionalLight position={[-3, 2, -2]} intensity={0.25} />
        <PresentationControls
          global
          snap
          speed={1.5}
          rotation={[0, 0, 0]}
          polar={[0, 0]}
          azimuth={[-Math.PI / 2, Math.PI / 2]}
        >
          <group position={[0, 0, 0]}>
            <RoundedBox
              args={[2.4, 1.6, 0.28]}
              radius={0.06}
              smoothness={4}
              onPointerOver={(e) => {
                e.stopPropagation();
                const face: Face = e.point.z > 0 ? "backend" : "ai";
                setHovered(face);
              }}
              onPointerOut={() => setHovered(null)}
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              onPointerUp={() => setPressed(null)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                const face: Face = e.point.z > 0 ? "backend" : "ai";
                onNavigate(face);
              }}
            >
              <meshStandardMaterial color="#1f2937" roughness={0.6} metalness={0.15} />
              <Edges
                threshold={15}
                color={hovered === "backend" ? backendColor : "#4b5563"}
              />
            </RoundedBox>
            {/* Backend face label + ring */}
            <group position={[0, 0, 0.16]}>
              <Text
                position={[0, 0.35, 0]}
                fontSize={0.22}
                color="#f3f4f6"
                anchorX="center"
                anchorY="middle"
              >
                Backend
              </Text>
              <mesh position={[0, -0.25, 0]}>
                <torusGeometry
                  args={[0.32, 0.035, 12, 48, Math.PI * 2 * (backendPercent / 100)]}
                />
                <meshStandardMaterial
                  color={backendColor}
                  emissive={backendColor}
                  emissiveIntensity={0.4}
                />
              </mesh>
            </group>
            {/* AI face label + ring (back side, rotated) */}
            <group position={[0, 0, -0.16]} rotation={[0, Math.PI, 0]}>
              <Text
                position={[0, 0.35, 0]}
                fontSize={0.22}
                color="#f3f4f6"
                anchorX="center"
                anchorY="middle"
              >
                AI Engineer
              </Text>
              <Text
                position={[0, 0.1, 0]}
                fontSize={0.1}
                color="#9ca3af"
                anchorX="center"
                anchorY="middle"
              >
                TypeScript
              </Text>
              <mesh position={[0, -0.25, 0]}>
                <torusGeometry
                  args={[0.32, 0.035, 12, 48, Math.PI * 2 * (aiPercent / 100)]}
                />
                <meshStandardMaterial
                  color={aiColor}
                  emissive={aiColor}
                  emissiveIntensity={0.4}
                />
              </mesh>
            </group>
          </group>
        </PresentationControls>
        <ContactShadows
          position={[0, -0.85, 0]}
          opacity={0.4}
          scale={6}
          blur={2}
          far={2}
        />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.86, 0]}>
          <planeGeometry args={[8, 8]} />
          <meshStandardMaterial color="#0b0f14" roughness={0.9} metalness={0.05} />
        </mesh>
      </Canvas>
      {/* DOM mirror for assistive tech + keyboard */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-3">
        <button
          type="button"
          className="border border-hairline bg-panel px-3 py-1.5 font-mono text-micro text-ink uppercase"
          onClick={() => onNavigate("backend")}
        >
          Open Backend
        </button>
        <button
          type="button"
          className="border border-hairline bg-panel px-3 py-1.5 font-mono text-micro text-ink uppercase"
          onClick={() => onNavigate("ai")}
        >
          Open AI Engineer
        </button>
      </div>
      {!hintDismissed ? (
        <div className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 border border-hairline bg-panel px-3 py-1.5 font-mono text-micro text-ink-subtle uppercase">
          drag to rotate
        </div>
      ) : null}
    </div>
  );
}
