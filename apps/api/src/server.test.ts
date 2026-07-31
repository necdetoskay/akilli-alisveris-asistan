import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createApiServer } from "./server.js";
import type { ApiDependencies } from "./deps.js";

const openedServers: Array<ReturnType<typeof createApiServer>> = [];

function fakePool(): ApiDependencies["pool"] {
  const query = (): Promise<{ rows: never[] }> =>
    Promise.resolve({ rows: [], command: "", rowCount: 0, oid: 0, fields: [] });
  return { query } as unknown as ApiDependencies["pool"];
}

function fakeStorage(): ApiDependencies["storage"] {
  return {
    name: "local",
    put: () => Promise.resolve({ storageKey: "k", sha256: "s", byteSize: 0, existed: false }),
    get: () => Promise.resolve(Buffer.from("fake-bytes")),
    exists: () => Promise.resolve(true),
    stat: () => Promise.resolve({ byteSize: 0, sha256: "s" }),
  };
}

function depsFor(webRoot: string): ApiDependencies {
  return {
    pool: fakePool(),
    storage: fakeStorage(),
    ingestionConfig: {
      storageRoot: webRoot,
      modelName: "openai/gpt-4.1-mini",
      modelProvider: "openrouter",
      pipelineVersion: "test",
      usdToTryRate: 0,
      http: { userAgent: "test", timeoutMs: 1000, maxRetries: 0, maxImageBytes: 1024 },
      concurrency: { download: 1, extract: 1 },
    },
    extraction: {} as ApiDependencies["extraction"],
    webUrl: "http://localhost:3004",
  };
}

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

async function listen(server: ReturnType<typeof createApiServer>): Promise<string> {
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Expected TCP server address");
  }
  return `http://127.0.0.1:${address.port}`;
}

describe("createApiServer without dependencies", () => {
  it("serves health endpoint", async () => {
    const server = createApiServer();
    openedServers.push(server);
    const baseUrl = await listen(server);

    const response = await fetch(`${baseUrl}/health`);
    const body: unknown = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(body).toMatchObject({ service: "api", status: "ok" });
  });

  it("returns a Problem Details style 404 response", async () => {
    const server = createApiServer();
    openedServers.push(server);
    const baseUrl = await listen(server);

    const response = await fetch(`${baseUrl}/missing`);

    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toContain("application/problem+json");
    await expect(response.json()).resolves.toEqual({
      status: 404,
      title: "Not Found",
      type: "about:blank",
    });
  });
});

describe("createApiServer with static web root", () => {
  let webRoot: string;

  beforeEach(async () => {
    webRoot = await mkdtemp(path.join(tmpdir(), "akilli-web-"));
    await writeFile(path.join(webRoot, "index.html"), "<h1>web-ui</h1>", "utf8");
    await writeFile(path.join(webRoot, "styles.css"), "body {}", "utf8");
  });

  afterEach(async () => {
    await rm(webRoot, { recursive: true, force: true });
  });

  it("serves index.html at the root", async () => {
    const server = createApiServer(depsFor(webRoot));
    openedServers.push(server);
    const baseUrl = await listen(server);

    const response = await fetch(`${baseUrl}/`);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");
    expect(await response.text()).toContain("web-ui");
  });

  it("serves static assets with correct content type", async () => {
    const server = createApiServer(depsFor(webRoot));
    openedServers.push(server);
    const baseUrl = await listen(server);

    const response = await fetch(`${baseUrl}/styles.css`);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/css");
  });

  it("rejects path traversal outside the web root", async () => {
    const server = createApiServer(depsFor(webRoot));
    openedServers.push(server);
    const baseUrl = await listen(server);

    const response = await fetch(`${baseUrl}/../.env`);

    expect(response.status).toBe(404);
  });
});
