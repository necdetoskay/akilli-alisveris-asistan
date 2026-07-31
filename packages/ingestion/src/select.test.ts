import { describe, expect, it } from "vitest";

import type { CatalogueCandidate } from "@akilli-alisveris/source";

import { selectTargetCatalogues } from "./select.js";

function candidate(overrides: Partial<CatalogueCandidate>): CatalogueCandidate {
  return {
    title: "Test Katalog",
    url: "https://aktuel-urunler.com/test-katalog/",
    retailerCode: "a101",
    validFrom: null,
    publishedAt: null,
    ...overrides,
  };
}

describe("selectTargetCatalogues", () => {
  it("picks the latest active and nearest upcoming catalogue", () => {
    const now = new Date("2026-07-31T12:00:00Z");
    const candidates = [
      candidate({
        title: "6 Ağustos",
        url: "https://aktuel-urunler.com/a101-6-agustos-2026/",
        validFrom: new Date("2026-08-06T00:00:00Z"),
      }),
      candidate({
        title: "30 Temmuz",
        url: "https://aktuel-urunler.com/a101-30-temmuz-2026/",
        validFrom: new Date("2026-07-30T00:00:00Z"),
      }),
      candidate({
        title: "23 Temmuz",
        url: "https://aktuel-urunler.com/a101-23-temmuz-2026/",
        validFrom: new Date("2026-07-23T00:00:00Z"),
      }),
    ];

    const selection = selectTargetCatalogues(candidates, now);
    expect(selection.active?.title).toBe("30 Temmuz");
    expect(selection.upcoming?.title).toBe("6 Ağustos");
  });

  it("returns null upcoming when everything has started", () => {
    const now = new Date("2026-08-20T12:00:00Z");
    const candidates = [
      candidate({
        title: "6 Ağustos",
        url: "https://aktuel-urunler.com/a101-6-agustos-2026/",
        validFrom: new Date("2026-08-06T00:00:00Z"),
      }),
      candidate({
        title: "30 Temmuz",
        url: "https://aktuel-urunler.com/a101-30-temmuz-2026/",
        validFrom: new Date("2026-07-30T00:00:00Z"),
      }),
    ];

    const selection = selectTargetCatalogues(candidates, now);
    expect(selection.active?.title).toBe("6 Ağustos");
    expect(selection.upcoming).toBeNull();
  });

  it("falls back to the first undated candidate when no dates parse", () => {
    const selection = selectTargetCatalogues(
      [candidate({ title: "Undated A" }), candidate({ title: "Undated B" })],
      new Date("2026-07-31T12:00:00Z"),
    );
    expect(selection.active?.title).toBe("Undated A");
    expect(selection.upcoming).toBeNull();
  });

  it("returns nulls for empty candidate lists", () => {
    const selection = selectTargetCatalogues([], new Date("2026-07-31T12:00:00Z"));
    expect(selection.active).toBeNull();
    expect(selection.upcoming).toBeNull();
  });
});
