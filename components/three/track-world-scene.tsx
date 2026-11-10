"use client";

import { useFrame, type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo, useRef } from "react";

import { threeColorFromCssVar } from "./track-world-colors";
import { consumeTrackWorldDolly } from "./track-world-events";
import {
  CONSTELLATION_ANCHORS,
  CONSTELLATION_EDGES,
  CONSTELLATION_POINTS,
  LATTICE_EDGES,
  LATTICE_NODES,
} from "./track-world-data";

type SceneColors = { backend: THREE.Color; ai: THREE.Color };

function readSceneColors(): SceneColors {
  return {
    backend: threeColorFromCssVar("--track-backend", "rgb(45, 156, 64)"),
    ai: threeColorFromCssVar("--track-ai-engineer", "rgb(236, 91, 20)"),
  };
}

const PULSE_COUNT = 6;

export function TrackWorldScene(props: ThreeElements["group"]) {
  const colors = useMemo(() => readSceneColors(), []);
  const pulseEdges = CONSTELLATION_EDGES;
  const ref = useRef<THREE.Group>(null);
  const latticeRef = useRef<THREE.Group>(null);
  const aiRef = useRef<THREE.Group>(null);
  const pulseRefs = useRef<Array<THREE.Mesh | null>>(Array(PULSE_COUNT).fill(null));

  const latticePositions = useMemo(() => {
    const array = new Float32Array(LATTICE_NODES.length * 3);
    LATTICE_NODES.forEach(([x, y, z], i) => {
      array.set([x, y, z], i * 3);
    });
    return array;
  }, []);

  const constellationPositions = useMemo(() => {
    const array = new Float32Array(CONSTELLATION_POINTS.length * 3);
    CONSTELLATION_POINTS.forEach(([x, y, z], i) => {
      array.set([x, y, z], i * 3);
    });
    return array;
  }, []);

  const anchorPositions = useMemo(() => {
    const array = new Float32Array(CONSTELLATION_ANCHORS.length * 3);
    CONSTELLATION_ANCHORS.forEach(([x, y, z], i) => {
      array.set([x, y, z], i * 3);
    });
    return array;
  }, []);

  const latticeEdges = useMemo(() => {
    const array = new Float32Array(LATTICE_EDGES.length * 2 * 3);
    LATTICE_EDGES.forEach(([a, b], i) => {
      const pa = LATTICE_NODES[a]!;
      const pb = LATTICE_NODES[b]!;
      array.set([...pa, ...pb], i * 6);
    });
    return array;
  }, []);

  const constellationEdges = useMemo(() => {
    const array = new Float32Array(CONSTELLATION_EDGES.length * 2 * 3);
    CONSTELLATION_EDGES.forEach(([a, b], i) => {
      const pa = CONSTELLATION_ANCHORS[a]!;
      const pb = CONSTELLATION_ANCHORS[b]!;
      array.set([...pa, ...pb], i * 6);
    });
    return array;
  }, []);

  useFrame(() => {
    const request = consumeTrackWorldDolly();
    if (request) {
      // A click asked to approach the chosen track: push the matching cluster
      // and its caption corridor toward the camera. No easing tricks — the
      // z-lerp is the whole move.
      if (latticeRef.current && aiRef.current) {
        latticeRef.current.userData.targetZ = request.slug === "backend" ? 3.2 : 9;
        aiRef.current.userData.targetZ = request.slug === "ai-engineer" ? -1.2 : -4.5;
      }
    }
    if (latticeRef.current) {
      const target = latticeRef.current.userData.targetZ ?? 4.5;
      latticeRef.current.position.z = THREE.MathUtils.lerp(
        latticeRef.current.position.z,
        target,
        0.08,
      );
    }
    if (aiRef.current) {
      const target = aiRef.current.userData.targetZ ?? -4.5;
      aiRef.current.position.z = THREE.MathUtils.lerp(
        aiRef.current.position.z,
        target,
        0.08,
      );
    }
    pulseRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const edge = pulseEdges[(i * 8) % pulseEdges.length] ?? pulseEdges[0]!;
      if (!edge) return;
      const [a, b] = edge;
      const pa = CONSTELLATION_ANCHORS[a];
      const pb = CONSTELLATION_ANCHORS[b];
      if (!pa || !pb) return;
      const phase = ((performance.now() / 1000 + (i + 1) * 0.4) % 2.4) / 2.4;
      mesh.position.set(
        THREE.MathUtils.lerp(pa[0], pb[0], phase),
        THREE.MathUtils.lerp(pa[1], pb[1], phase),
        THREE.MathUtils.lerp(pa[2], pb[2], phase),
      );
      mesh.scale.setScalar(0.75 + 0.5 * Math.sin(phase * Math.PI));
    });
  });

  return (
    <group ref={ref} {...props}>
      {/* Backend lattice */}
      <group ref={latticeRef} position={[-3.4, -0.6, 4.5]}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[latticePositions, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={0.075}
            transparent
            opacity={0.92}
            color={colors.backend}
            sizeAttenuation
            depthWrite={false}
          />
        </points>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[latticeEdges, 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            color={colors.backend}
            transparent
            opacity={0.35}
            depthWrite={false}
          />
        </lineSegments>
      </group>

      {/* AI constellation */}
      <group ref={aiRef} position={[3.4, 0.4, -4.5]} rotation={[0, -0.28, 0]}>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[constellationPositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.055}
            transparent
            opacity={0.7}
            color={colors.ai}
            sizeAttenuation
            depthWrite={false}
          />
        </points>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[anchorPositions, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={0.14}
            transparent
            opacity={0.98}
            color={colors.ai}
            sizeAttenuation
            depthWrite={false}
          />
        </points>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[constellationEdges, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={colors.ai}
            transparent
            opacity={0.42}
            depthWrite={false}
          />
        </lineSegments>
        {Array.from({ length: PULSE_COUNT }).map((_, i) => (
          <mesh
            key={`pulse-${i}`}
            ref={(m) => {
              pulseRefs.current[i] = m;
            }}
          >
            <sphereGeometry args={[0.09, 6, 6]} />
            <meshBasicMaterial
              color={colors.ai}
              transparent
              opacity={0.9}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default TrackWorldScene;
