import { describe, expect, it } from "vitest";

import { ConfigurationError, loadApiConfig } from "./index.js";

describe("loadApiConfig", () => {
  it("uses safe local defaults", () => {
    expect(loadApiConfig({})).toEqual({
      appEnv: "development",
      host: "127.0.0.1",
      port: 3100,
    });
  });

  it("parses explicit configuration", () => {
    expect(
      loadApiConfig({
        APP_ENV: "test",
        API_HOST: "0.0.0.0",
        API_PORT: "4100",
      }),
    ).toEqual({
      appEnv: "test",
      host: "0.0.0.0",
      port: 4100,
    });
  });

  it.each(["0", "65536", "not-a-number", "3.14"])(
    "rejects invalid API_PORT value %s",
    (value) => {
      expect(() => loadApiConfig({ API_PORT: value })).toThrow(ConfigurationError);
    },
  );

  it("rejects unsupported environments", () => {
    expect(() => loadApiConfig({ APP_ENV: "preview" })).toThrow(
      "APP_ENV must be one of development, test or production",
    );
  });
});
