import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { computeStorageKey, hashSha256, LocalStorage, LocalStorageError } from "./index.js";

let tempDir: string;
let storage: LocalStorage;

beforeEach(async () => {
  tempDir = await mkdtemp(path.join(tmpdir(), "akilli-storage-"));
  storage = new LocalStorage(tempDir);
});

afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true });
});

describe("hashSha256", () => {
  it("returns the sha256 hex digest", () => {
    expect(hashSha256(Buffer.from("hello"))).toBe(
      "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
    );
  });
});

describe("LocalStorage.put", () => {
  it("writes bytes and reports created object", async () => {
    const data = Buffer.from("original-page-image");
    const digest = hashSha256(data);

    const result = await storage.put("a/1.png", data, digest);

    expect(result).toEqual({ storageKey: "a/1.png", sha256: digest, byteSize: 19, existed: false });
    expect((await readFile(path.join(tempDir, "a", "1.png"))).toString()).toBe(
      "original-page-image",
    );
  });

  it("does not overwrite an existing key (immutability)", async () => {
    const first = Buffer.from("first-version");
    const second = Buffer.from("second-version-different");

    await storage.put("immutable.bin", first, hashSha256(first));
    const result = await storage.put("immutable.bin", second, hashSha256(second));

    expect(result.existed).toBe(true);
    expect((await storage.get("immutable.bin")).toString()).toBe("first-version");
  });

  it("rejects empty objects", async () => {
    await expect(storage.put("empty.bin", Buffer.alloc(0), hashSha256(Buffer.alloc(0)))).rejects.toThrow(
      LocalStorageError,
    );
  });

  it("rejects keys escaping the root directory", async () => {
    await expect(storage.put("../escape.bin", Buffer.from("x"), "abc")).rejects.toThrow(
      LocalStorageError,
    );
  });
});

describe("LocalStorage round trip", () => {
  it("get returns identical bytes and stat reports hash", async () => {
    const data = Buffer.from("brochure-image-bytes");
    const digest = hashSha256(data);
    await storage.put("b/2.webp", data, digest);

    const readBack = await storage.get("b/2.webp");
    expect(readBack).toEqual(data);

    const stat = await storage.stat("b/2.webp");
    expect(stat.sha256).toBe(digest);
    expect(stat.byteSize).toBe(data.length);
  });

  it("get throws for missing object", async () => {
    await expect(storage.get("missing/file.png")).rejects.toThrow(LocalStorageError);
  });
});

describe("computeStorageKey", () => {
  it("builds the documented key layout", () => {
    const key = computeStorageKey("a101", "00000000-0000-4000-8000-0000000000aa", 3, "asset-1", "webp");
    expect(key).toMatch(/^brochures\/a101\/\d{4}\/\d{2}\/00000000-0000-4000-8000-0000000000aa\/pages\/3\/asset-1\.webp$/);
  });

  it("sanitizes the extension", () => {
    const key = computeStorageKey("bim", "id", 1, "asset", "WEBP?");
    expect(key.endsWith("asset.webp")).toBe(true);
  });
});
