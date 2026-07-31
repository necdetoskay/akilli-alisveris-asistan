import { describe, expect, it } from "vitest";

import { DbConfigError, loadDbConfig } from "./config.js";

describe("loadDbConfig", () => {
  it("loads databaseUrl from environment", () => {
    const config = loadDbConfig({ DATABASE_URL: "postgresql://u:p@localhost:5432/db" });
    expect(config.databaseUrl).toBe("postgresql://u:p@localhost:5432/db");
  });

  it("throws when DATABASE_URL is missing", () => {
    expect(() => loadDbConfig({})).toThrow(DbConfigError);
    expect(() => loadDbConfig({})).toThrow("DATABASE_URL");
  });

  it("parses optional pool settings", () => {
    const config = loadDbConfig({
      DATABASE_URL: "postgresql://u:p@localhost:5432/db",
      DATABASE_POOL_MAX: "5",
      DATABASE_CONNECTION_TIMEOUT_MS: "2000",
    });
    expect(config.maxConnections).toBe(5);
    expect(config.connectionTimeoutMs).toBe(2000);
  });

  it("rejects invalid pool settings", () => {
    expect(() =>
      loadDbConfig({ DATABASE_URL: "postgresql://u:p@localhost/db", DATABASE_POOL_MAX: "abc" }),
    ).toThrow(DbConfigError);
    expect(() =>
      loadDbConfig({ DATABASE_URL: "postgresql://u:p@localhost/db", DATABASE_POOL_MAX: "0" }),
    ).toThrow(DbConfigError);
  });
});
