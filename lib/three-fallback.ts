/**
 * Decides whether TrackWorld should attempt to mount its canvas at all.
 *
 * 3D is on by default for every visitor whose device can run WebGL. It is
 * skipped ONLY when: the env kill switch is "false", the user sets 3D to Off,
 * Save-Data is on, or WebGL context creation fails (checked separately at
 * runtime via `webglAvailable`). Reduced motion and weak hardware do NOT
 * remove it: reduced motion renders a single static frame, and weak devices
 * get lower DPR / fewer points through Drei's PerformanceMonitor with a
 * sustained-fps escape hatch.
 */
export type ThreePreference = "on" | "reduced" | "off";

export type ThreeFallbackInput = {
  /** NEXT_PUBLIC_ENABLE_3D, verbatim from the environment (string). */
  enable3D: string | undefined;
  prefersReducedMotion: boolean;
  /** navigator.connection?.saveData */
  saveData: boolean;
  /** navigator.hardwareConcurrency; 0 or undefined means unknown. */
  hardwareConcurrency: number | undefined;
  /** Persisted user preference; defaults to "on". */
  userPreference?: ThreePreference;
};

export function shouldSkip3D(input: ThreeFallbackInput): boolean {
  if (input.enable3D === "false") return true;
  if ((input.userPreference ?? "on") === "off") return true;
  if (input.saveData) return true;
  return false;
}

/** True when the scene should render a single static frame (no animation). */
export function shouldRenderStatic(input: ThreeFallbackInput): boolean {
  if (input.prefersReducedMotion) return true;
  if ((input.userPreference ?? "on") === "reduced") return true;
  return false;
}

/** Cheap probe used only in the browser; returns true when WebGL is usable. */
export function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}
