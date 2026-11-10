"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { TrackWorldScene } from "./track-world-scene";

function FrameOnce() {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    invalidate();
  }, [invalidate]);
  return null;
}

/**
 * Runtime shell for the R3F canvas. Kept as its own file so next/dynamic
 * can `ssr: false` it as a client-only boundary.
 */
export default function TrackWorldCanvas({
  staticFrame = false,
}: {
  staticFrame?: boolean;
}) {
  return (
    <Canvas
      aria-hidden="true"
      dpr={[1, 2]}
      frameloop={staticFrame ? "never" : "demand"}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0.4, 9], fov: 48 }}
    >
      {staticFrame ? <FrameOnce /> : null}
      <TrackWorldScene />
    </Canvas>
  );
}
