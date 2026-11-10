/**
 * Decides whether TrackWorld should attempt to mount its canvas at all.
 * Pure and total so it can be unit-tested without a browser; the actual
 * WebGL probe happens separately at runtime.
 *
 * 3D is an enhancement, never the only path, so the default is to skip it
 * whenever anything about the client suggests it will be heavy, broken or
 * unwanted.
 */
export type ThreeFallbackInput = {
  /** NEXT_PUBLIC_ENABLE_3D, verbatim from the environment (string). */
  enable3D: string | undefined;
  prefersReducedMotion: boolean;
  /** navigator.connection?.saveData */
  saveData: boolean;
  /** navigator.hardwareConcurrency; 0 or undefined means unknown. */
  hardwareConcurrency: number | undefined;
};

export function shouldSkip3D(input: ThreeFallbackInput): boolean {
  if (input.enable3D === "false") return true;
  if (input.prefersReducedMotion) return true;
  if (input.saveData) return true;
  const cores = input.hardwareConcurrency ?? 0;
  if (cores > 0 && cores <= 4) return true;
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
