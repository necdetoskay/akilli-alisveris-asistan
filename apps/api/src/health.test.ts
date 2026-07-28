import { describe, expect, it } from "vitest";

import { createHealthResponse } from "./health.js";

describe("createHealthResponse", () => {
  it("returns a deterministic healthy response", () => {
    const now = new Date("2026-07-28T10:00:00.000Z");

    expect(createHealthResponse(now)).toEqual({
      service: "api",
      status: "ok",
      timestamp: "2026-07-28T10:00:00.000Z",
    });
  });
});
