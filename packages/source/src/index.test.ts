import { readFile } from "node:fs/promises";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { crawlCatalogue, discoverCatalogueCandidates, parseCatalogueDetail } from "./index.js";

const fixturesDir = path.resolve("fixtures/sprint-00/html");
const base = "https://aktuel-urunler.com";

async function loadFixture(name: string): Promise<string> {
  return readFile(path.join(fixturesDir, name), "utf8");
}

function fixtureFetcher(byUrl: Record<string, string>): (url: string) => Promise<string> {
  const exact = new Map(Object.entries(byUrl));
  return (url: string): Promise<string> => {
    const hit = exact.get(url);
    if (!hit) return Promise.reject(new Error(`No fixture for ${url}`));
    return Promise.resolve(hit);
  };
}

describe("parseCatalogueDetail - A101 6 Ağustos (multi-page)", () => {
  it("extracts title, canonical URL and dates", async () => {
    const html = await loadFixture("a101-6agustos.html");
    const detail = parseCatalogueDetail(html, `${base}/a101-6-agustos-2026-aktuel-urunler-katalogu/`);

    expect(detail.title).toContain("A101 6 Ağustos 2026");
    expect(detail.canonicalUrl).toBe(`${base}/a101-6-agustos-2026-aktuel-urunler-katalogu/`);
    expect(detail.retailerCode).toBe("a101");
    expect(detail.validFrom?.toISOString()).toBe("2026-08-06T00:00:00.000Z");
    expect(detail.publishedAt?.toISOString()).toBe("2026-07-30T12:51:19.000Z");
    expect(detail.validUntil).toBeNull();
  });

  it("discovers the next source page via same-slug pagination links", async () => {
    const html = await loadFixture("a101-6agustos.html");
    const detail = parseCatalogueDetail(html, `${base}/a101-6-agustos-2026-aktuel-urunler-katalogu/`);

    expect(detail.pageNumber).toBe(1);
    expect(detail.nextPageUrl).toBe(`${base}/a101-6-agustos-2026-aktuel-urunler-katalogu/2/`);
  });

  it("collects only full-size page images, excluding variants and story images", async () => {
    const html = await loadFixture("a101-6agustos.html");
    const detail = parseCatalogueDetail(html, `${base}/a101-6-agustos-2026-aktuel-urunler-katalogu/`);

    expect(detail.imageUrls).toHaveLength(3);
    expect(detail.imageUrls).toEqual([
      `${base}/wp-diger/uploads/2026/07/A101-6-Agustos-2026-1.webp`,
      `${base}/wp-diger/uploads/2026/07/A101-6-Agustos-2026-2.webp`,
      `${base}/wp-diger/uploads/2026/07/A101-6-Agustos-2026-3.webp`,
    ]);
  });

  it("page 2 returns pageNumber 2, imageUrls 4-6, next /3/", async () => {
    const html = await loadFixture("a101-6ag-p2.html");
    const detail = parseCatalogueDetail(html, `${base}/a101-6-agustos-2026-aktuel-urunler-katalogu/2/`);

    expect(detail.pageNumber).toBe(2);
    expect(detail.nextPageUrl).toBe(`${base}/a101-6-agustos-2026-aktuel-urunler-katalogu/3/`);
    expect(detail.imageUrls).toHaveLength(3);
    expect(detail.imageUrls[0]).toContain("A101-6-Agustos-2026-4.webp");
    expect(detail.imageUrls[2]).toContain("A101-6-Agustos-2026-6.webp");
  });

  it("page 3 has no next page and does not treat son-sayfa-linki as a page", async () => {
    const html = await loadFixture("a101-6ag-p3.html");
    const detail = parseCatalogueDetail(html, `${base}/a101-6-agustos-2026-aktuel-urunler-katalogu/3/`);

    expect(detail.pageNumber).toBe(3);
    expect(detail.nextPageUrl).toBeNull();
    expect(detail.imageUrls).toHaveLength(3);
    expect(detail.imageUrls[0]).toContain("A101-6-Agustos-2026-7.webp");
  });
});

describe("parseCatalogueDetail - BİM (single-page)", () => {
  it("BİM 9 Ağustos is a single source page with 3 images", async () => {
    const html = await loadFixture("bim-9agustos.html");
    const detail = parseCatalogueDetail(html, `${base}/bim-9-agustos-2026-aktuel-urunler-katalogu/`);

    expect(detail.title).toContain("BİM 9 Ağustos 2026");
    expect(detail.retailerCode).toBe("bim");
    expect(detail.pageNumber).toBe(1);
    expect(detail.nextPageUrl).toBeNull();
    expect(detail.imageUrls).toHaveLength(3);
    expect(detail.imageUrls.map((u) => u.split("/").pop())).toEqual([
      "Bim-9-Agustos-2026-1.webp",
      "Bim-9-Agustos-2026-2.webp",
      "Bim-9-Agustos-2026-3.webp",
    ]);
  });

  it("BİM 31 Temmuz extracts the title date", async () => {
    const html = await loadFixture("bim-31temmuz.html");
    const detail = parseCatalogueDetail(html, `${base}/bim-31-temmuz-2026-aktuel-urunler-katalogu/`);

    expect(detail.validFrom?.toISOString()).toBe("2026-07-31T00:00:00.000Z");
    expect(detail.imageUrls).toHaveLength(3);
  });

  it("BİM 2 Ağustos has 2 full-size images", async () => {
    const html = await loadFixture("bim-2agustos.html");
    const detail = parseCatalogueDetail(html, `${base}/bim-2-agustos-2026-aktuel-urunler-katalogu/`);

    expect(detail.imageUrls).toHaveLength(2);
  });
});

describe("crawlCatalogue", () => {
  it("walks A101 6 Ağustos pages 1-3 and counts 9 brochure pages", async () => {
    const root = `${base}/a101-6-agustos-2026-aktuel-urunler-katalogu/`;
    const fetchPage = fixtureFetcher({
      [root]: await loadFixture("a101-6agustos.html"),
      [`${root}2/`]: await loadFixture("a101-6ag-p2.html"),
      [`${root}3/`]: await loadFixture("a101-6ag-p3.html"),
    });

    const parsed = await crawlCatalogue(root, fetchPage);

    expect(parsed.canonicalUrl).toBe(root);
    expect(parsed.retailerCode).toBe("a101");
    expect(parsed.pageCountDiscovered).toBe(9);
    expect(parsed.pages).toHaveLength(3);
    expect(parsed.pages.map((p) => p.pageNumber)).toEqual([1, 2, 3]);
  });

  it("walks A101 30 Temmuz and counts 11 brochure pages", async () => {
    const root = `${base}/a101-30-temmuz-2026-aktuel-urunler-katalogu/`;
    const fetchPage = fixtureFetcher({
      [root]: await loadFixture("a101-30temmuz.html"),
      [`${root}2/`]: await loadFixture("a101-30tem-p2.html"),
      [`${root}3/`]: await loadFixture("a101-30tem-p3.html"),
    });

    const parsed = await crawlCatalogue(root, fetchPage);

    expect(parsed.pageCountDiscovered).toBe(11);
    expect(parsed.pages).toHaveLength(3);
    const seen = parsed.pages.map((p) => p.pageNumber);
    expect(seen).toEqual([1, 2, 3]);
  });

  it("BİM 9 Ağustos crawls a single page with 3 brochure pages", async () => {
    const root = `${base}/bim-9-agustos-2026-aktuel-urunler-katalogu/`;
    const fetchPage = fixtureFetcher({
      [root]: await loadFixture("bim-9agustos.html"),
    });

    const parsed = await crawlCatalogue(root, fetchPage);

    expect(parsed.pageCountDiscovered).toBe(3);
    expect(parsed.pages).toHaveLength(1);
  });
});

describe("discoverCatalogueCandidates", () => {
  it("finds A101 catalogue cards, deduplicates and skips nav/devam links", async () => {
    const html = await loadFixture("a101-cat.html");
    const candidates = discoverCatalogueCandidates(html, "a101");

    expect(candidates.length).toBeGreaterThanOrEqual(8);
    expect(candidates[0]?.title).toContain("A101 6 Ağustos 2026");
    expect(candidates[0]?.url).toBe(`${base}/a101-6-agustos-2026-aktuel-urunler-katalogu/`);
    expect(candidates[0]?.validFrom?.toISOString()).toBe("2026-08-06T00:00:00.000Z");

    const urls = candidates.map((c) => c.url);
    expect(new Set(urls).size).toBe(urls.length);
    expect(candidates.every((c) => c.retailerCode === "a101")).toBe(true);
  });

  it("finds BİM catalogue candidates", async () => {
    const html = await loadFixture("bim-cat.html");
    const candidates = discoverCatalogueCandidates(html, "bim");

    expect(candidates.length).toBeGreaterThanOrEqual(1);
    expect(candidates.every((c) => c.retailerCode === "bim")).toBe(true);
  });
});
