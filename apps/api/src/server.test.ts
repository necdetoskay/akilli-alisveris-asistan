import { afterEach, describe, expect, it } from "vitest";

import { createApiServer } from "./server.js";

const openedServers: Array<ReturnType<typeof createApiServer>> = [];

afterEach(async () => {
  await Promise.all(
    openedServers.splice(0).map(
      (server) =>
        new Promise<void>((resolve, reject) => {
          server.close((error) => {
            if (error) {
              reject(error);
              return;
            }

            resolve();
          });
        }),
    ),
  );
});

describe("createApiServer", () => {
  it("serves health endpoint", async () => {
    const server = createApiServer();
    openedServers.push(server);

    await new Promise<void>((resolve) => {
      server.listen(0, "127.0.0.1", resolve);
    });

    const address = server.address();

    if (!address || typeof address === "string") {
      throw new Error("Expected TCP server address");
    }

    const response = await fetch(`http://127.0.0.1:${address.port}/health`);
    const body: unknown = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(body).toMatchObject({
      service: "api",
      status: "ok",
    });
  });

  it("returns a Problem Details style 404 response", async () => {
    const server = createApiServer();
    openedServers.push(server);

    await new Promise<void>((resolve) => {
      server.listen(0, "127.0.0.1", resolve);
    });

    const address = server.address();

    if (!address || typeof address === "string") {
      throw new Error("Expected TCP server address");
    }

    const response = await fetch(`http://127.0.0.1:${address.port}/missing`);

    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toContain("application/problem+json");
    await expect(response.json()).resolves.toEqual({
      status: 404,
      title: "Not Found",
      type: "about:blank",
    });
  });
});
