"use client";

import { Canvas } from "@react-three/fiber";
import { TrackWorldScene } from "./track-world-scene";

/**
 * Runtime shell for the R3F canvas. Kept as its own file so next/dynamic
 * can `ssr: false` it as a client-only boundary.
 */
export default function TrackWorldCanvas() {
  return (
    <Canvas
      aria-hidden="true"
      dpr={[1, 1.5]}
      frameloop="demand"
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0.4, 9], fov: 48 }}
    >
      <TrackWorldScene />
    </Canvas>
  );
}
