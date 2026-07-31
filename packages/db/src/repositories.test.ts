import { describe, expect, it } from "vitest";

import { CatalogRepository } from "./repositories.js";
import type { Queryable } from "./pool.js";

interface FakeRow {
  [key: string]: unknown;
}

function fakeDb(handler: (sql: string, params: unknown[]) => { rows: FakeRow[] }): Queryable {
  const query = (sql: string, params: unknown[] = []): Promise<{ rows: FakeRow[] }> =>
    Promise.resolve(handler(sql, params));
  return { query } as Queryable;
}

describe("CatalogRepository", () => {
  it("getRetailerByCode maps a row", async () => {
    const db = fakeDb((sql, params) => {
      expect(sql).toContain("FROM catalog.retailers");
      expect(params).toEqual(["a101"]);
      return {
        rows: [
          {
            id: "10000000-0000-4000-8000-000000000001",
            code: "a101",
            name: "A101",
            website_url: "https://www.a101.com.tr",
            is_active: true,
          },
        ],
      };
    });

    const repo = new CatalogRepository(db);
    const retailer = await repo.getRetailerByCode("a101");

    expect(retailer?.code).toBe("a101");
    expect(retailer?.name).toBe("A101");
  });

  it("getRetailerByCode returns null when missing", async () => {
    const db = fakeDb(() => ({ rows: [] }));
    const repo = new CatalogRepository(db);
    expect(await repo.getRetailerByCode("missing")).toBeNull();
  });

  it("getSourceByRetailerCode joins retailers and maps the source", async () => {
    const db = fakeDb((sql, params) => {
      expect(sql).toContain("JOIN catalog.retailers");
      expect(params).toEqual(["bim"]);
      return {
        rows: [
          {
            id: "20000000-0000-4000-8000-000000000002",
            retailer_id: "10000000-0000-4000-8000-000000000002",
            source_type: "aktuel-urunler",
            name: "aktuel-urunler.com BİM",
            base_url: "https://aktuel-urunler.com",
            category_url: "https://aktuel-urunler.com/bim-aktuel/",
            is_enabled: true,
            parser_version: "sprint-00-1",
            last_success_at: null,
            last_error_at: null,
          },
        ],
      };
    });

    const repo = new CatalogRepository(db);
    const source = await repo.getSourceByRetailerCode("bim");

    expect(source?.id).toBe("20000000-0000-4000-8000-000000000002");
    expect(source?.category_url).toBe("https://aktuel-urunler.com/bim-aktuel/");
  });

  it("insertProductOffer passes nulls for optional fields", async () => {
    const captured: { sql: string; params: unknown[] }[] = [];
    const db = fakeDb((sql, params) => {
      captured.push({ sql, params });
      return { rows: [] };
    });

    const repo = new CatalogRepository(db);
    await repo.insertProductOffer({
      id: "30000000-0000-4000-8000-000000000001",
      retailer_id: "10000000-0000-4000-8000-000000000001",
      brochure_id: "40000000-0000-4000-8000-000000000001",
      brochure_page_id: "50000000-0000-4000-8000-000000000001",
      discovery_source: "aktuel-urunler",
      content_source: "https://aktuel-urunler.com/a101-6-agustos-2026-aktuel-urunler-katalogu/",
      product_name: "Süt 1 L",
      current_price: 40,
    });

    const insertSql = captured.find((c) => c.sql.includes("INSERT INTO catalog.product_offers"));
    expect(insertSql).toBeDefined();
    const params = insertSql?.params ?? [];
    expect(params[0]).toBe("30000000-0000-4000-8000-000000000001");
    expect(params[8]).toBe("Süt 1 L");
    expect(params[15]).toBe(40);
  });
});
