export interface HealthResponse {
  readonly service: "api";
  readonly status: "ok";
  readonly timestamp: string;
}

export function createHealthResponse(now: Date = new Date()): HealthResponse {
  return {
    service: "api",
    status: "ok",
    timestamp: now.toISOString(),
  };
}
