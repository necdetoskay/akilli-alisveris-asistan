import { describe, expect, it } from "vitest";

import {
  generateRegions,
  mergeRegionalProducts,
  productSimilarity,
  validateExtractedProducts,
} from "./index.js";
import type { ExtractedProduct, RegionProductEntry } from "./types.js";

describe("generateRegions", () => {
  it("produces 4 overlapping 2x2 regions", () => {
    const regions = generateRegions(1000, 2000, { columns: 2, rows: 2, overlapRatio: 0.12 });

    expect(regions).toHaveLength(4);
    expect(regions.map((r) => r.id)).toEqual(["r1c1", "r1c2", "r2c1", "r2c2"]);
  });

  it("keeps regions inside image bounds", () => {
    const regions = generateRegions(100, 100, { columns: 2, rows: 2, overlapRatio: 0.12 });
    for (const region of regions) {
      expect(region.left).toBeGreaterThanOrEqual(0);
      expect(region.top).toBeGreaterThanOrEqual(0);
      expect(region.left + region.width).toBeLessThanOrEqual(100);
      expect(region.top + region.height).toBeLessThanOrEqual(100);
    }
  });

  it("regions overlap along the grid boundaries", () => {
    const regions = generateRegions(1000, 1000, { columns: 2, rows: 2, overlapRatio: 0.12 });
    const topLeft = regions[0];
    const topRight = regions[1];
    if (!topLeft || !topRight) throw new Error("Expected four regions.");

    // Overlap extends past the exact half boundary.
    expect(topLeft.left + topLeft.width).toBeGreaterThan(500);
    expect(topRight.left).toBeLessThan(500);
  });

  it("rejects invalid configurations", () => {
    expect(() => generateRegions(0, 100)).toThrow();
    expect(() => generateRegions(100, 100, { columns: 0, rows: 2, overlapRatio: 0.1 })).toThrow();
    expect(() =>
      generateRegions(100, 100, { columns: 2, rows: 2, overlapRatio: 0.5 }),
    ).toThrow();
  });
});

function makeProduct(overrides: Partial<ExtractedProduct> = {}): ExtractedProduct {
  return {
    product_name: "Test Ürün",
    brand: null,
    category: null,
    variant: null,
    quantity: null,
    price: { current: 10, previous: null, currency: "TRY", price_type: null },
    campaign: null,
    installment: null,
    attributes: [],
    confidence: 0.9,
    needs_review: false,
    uncertainty_reason: null,
    ...overrides,
  };
}

describe("productSimilarity", () => {
  it("identical products with same price score high", () => {
    const left = makeProduct({ product_name: "Süt 1 Litre", brand: "Sütaş", price: { current: 40, previous: null, currency: "TRY", price_type: null }, quantity: { value: 1, unit: "L", package_count: null, raw_text: "1 L" } });
    const right = makeProduct({ product_name: "Süt 1 Litre", brand: "Sütaş", price: { current: 40, previous: null, currency: "TRY", price_type: null }, quantity: { value: 1, unit: "L", package_count: null, raw_text: "1 L" } });
    expect(productSimilarity(left, right)).toBeGreaterThanOrEqual(0.8);
  });

  it("products with very different prices score 0", () => {
    const left = makeProduct({ product_name: "Süt", price: { current: 10, previous: null, currency: "TRY", price_type: null } });
    const right = makeProduct({ product_name: "Süt", price: { current: 100, previous: null, currency: "TRY", price_type: null } });
    expect(productSimilarity(left, right)).toBe(0);
  });
});

describe("mergeRegionalProducts", () => {
  it("merges duplicate products and keeps unique ones", () => {
    const entries: RegionProductEntry[] = [
      { region: "r1c1", product: makeProduct({ product_name: "Yoğurt 1 kg", price: { current: 60, previous: null, currency: "TRY", price_type: null } }) },
      { region: "r1c2", product: makeProduct({ product_name: "Yoğurt 1 kg", price: { current: 60, previous: null, currency: "TRY", price_type: null } }) },
      { region: "r2c1", product: makeProduct({ product_name: "Ekmek", price: { current: 15, previous: null, currency: "TRY", price_type: null } }) },
    ];

    const result = mergeRegionalProducts(entries, 0.72);

    expect(result.stats.output_products).toBe(2);
    expect(result.stats.duplicate_merges).toBe(1);
    const yoğurtTrace = result.trace.find((t) => t.product_name.includes("Yoğurt"));
    expect(yoğurtTrace?.regions).toEqual(["r1c1", "r1c2"]);
  });

  it("drops products without a price", () => {
    const entries: RegionProductEntry[] = [
      { region: "r1c1", product: makeProduct({ product_name: "Sadece Görsel Ürün", price: { current: null, previous: null, currency: "TRY", price_type: null } }) },
    ];

    const result = mergeRegionalProducts(entries, 0.72);

    expect(result.stats.dropped_without_price).toBe(1);
    expect(result.stats.output_products).toBe(0);
  });
});

describe("validateExtractedProducts", () => {
  it("rejects empty product names", () => {
    const { products, rejected } = validateExtractedProducts([
      makeProduct({ product_name: " " }),
      makeProduct(),
    ]);
    expect(rejected).toBe(1);
    expect(products).toHaveLength(1);
  });

  it("flags products without price for review", () => {
    const { products } = validateExtractedProducts([
      makeProduct({ product_name: "Fiyatsız Ürün", price: { current: null, previous: null, currency: "TRY", price_type: null } }),
    ]);
    expect(products[0]?.needs_review).toBe(true);
  });
});
