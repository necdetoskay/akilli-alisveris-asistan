import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { loadApiConfig } from "@akilli-alisveris/config";

import { buildDependencies } from "./deps.js";
import { createApiServer } from "./server.js";

function loadEnvFile(): void {
  const candidates = [
    resolve(process.cwd(), ".env"),
    resolve(process.cwd(), "../../.env"),
    resolve(process.cwd(), "../../../.env"),
  ];
  let envPath: string | null = null;
  let content: string | null = null;
  for (const candidate of candidates) {
    try {
      content = readFileSync(candidate, "utf8");
      envPath = candidate;
      break;
    } catch {
      // try next candidate
    }
  }
  if (envPath === null || content === null) return;
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator < 0) continue;
    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if (
      value.length >= 2 &&
      ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'")))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile();

const config = loadApiConfig();
const deps = buildDependencies();
const server = createApiServer(deps);
server.listen(config.port, config.host, () => {
  console.log(`API listening on http://${config.host}:${config.port}`);
});

const shutdown = (): void => {
  server.close((error) => {
    if (error) {
      console.error("API shutdown failed", error);
      process.exitCode = 1;
      return;
    }

    void deps.pool.end().finally(() => {
      process.exitCode = 0;
    });
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
