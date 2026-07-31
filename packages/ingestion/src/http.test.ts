import { describe, expect, it, vi } from "vitest";

import { HttpError, HttpFetcher, isRetryableHttpError } from "./http.js";

function responseFor(status: number, contentType: string, body = "data"): Response {
  return new Response(body, {
    status,
    headers: { "content-type": contentType },
  });
}

describe("HttpFetcher", () => {
  it("returns bytes with content type for successful image fetches", async () => {
    const fetchImpl = vi.fn(() => Promise.resolve(responseFor(200, "image/webp", "webp-bytes")));
    const fetcher = new HttpFetcher({ fetchImpl });
    const result = await fetcher.fetchBytes("https://example.com/image.webp", {
      contentType: /^image\//,
    });
    expect(result.contentType).toBe("image/webp");
    expect(result.bytes.toString()).toBe("webp-bytes");
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("rejects non-image content types without retrying", async () => {
    const fetchImpl = vi.fn(() => Promise.resolve(responseFor(200, "text/html")));
    const fetcher = new HttpFetcher({ fetchImpl, maxRetries: 3 });
    await expect(
      fetcher.fetchBytes("https://example.com/not-an-image", { contentType: /^image\// }),
    ).rejects.toThrow("Unsupported content-type");
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("retries transient 5xx failures up to maxRetries", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(responseFor(503, "text/plain"))
      .mockResolvedValueOnce(responseFor(503, "text/plain"))
      .mockResolvedValueOnce(responseFor(200, "image/png"));
    const fetcher = new HttpFetcher({ fetchImpl, maxRetries: 3 });
    const result = await fetcher.fetchBytes("https://example.com/image.png");
    expect(result.contentType).toBe("image/png");
    expect(fetchImpl).toHaveBeenCalledTimes(3);
  });

  it("does not retry permanent 404 errors", async () => {
    const fetchImpl = vi.fn(() => Promise.resolve(responseFor(404, "text/plain")));
    const fetcher = new HttpFetcher({ fetchImpl, maxRetries: 3 });
    await expect(fetcher.fetchText("https://example.com/missing")).rejects.toThrow("HTTP 404");
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("rejects oversized responses without retrying", async () => {
    const fetchImpl = vi.fn(() =>
      Promise.resolve(responseFor(200, "application/octet-stream", "x".repeat(100))),
    );
    const fetcher = new HttpFetcher({ fetchImpl, maxRetries: 3 });
    await expect(fetcher.fetchBytes("https://example.com/big", { maxBytes: 10 })).rejects.toThrow(
      "exceeds size limit",
    );
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("classifies retryable statuses", () => {
    expect(isRetryableHttpError(new HttpError("429", 429, true))).toBe(true);
    expect(isRetryableHttpError(new HttpError("500", 500, true))).toBe(true);
    expect(isRetryableHttpError(new HttpError("404", 404, false))).toBe(false);
  });
});
