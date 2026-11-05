export class RoadmapError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, status = 400, code = "BAD_REQUEST") {
    super(message);
    this.name = "RoadmapError";
    this.status = status;
    this.code = code;
  }
}
