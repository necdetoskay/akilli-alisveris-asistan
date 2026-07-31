import { describe, expect, it } from "vitest";

import {
  escapeHtml,
  formatCurrency,
  formatDate,
  formatDateRange,
  offerCardFields,
  statusLabel,
} from "./format.js";

describe("formatCurrency", () => {
  it("formats TRY prices with Turkish locale", () => {
    expect(formatCurrency(39.5, "TRY")).toContain("39,50");
  });

  it("returns empty string for null prices", () => {
    expect(formatCurrency(null, "TRY")).toBe("");
  });
});

describe("formatDate", () => {
  it("formats ISO dates in Turkish", () => {
    expect(formatDate("2026-08-06T00:00:00.000Z")).toBeTruthy();
  });

  it("returns empty for invalid dates", () => {
    expect(formatDate("")).toBe("");
    expect(formatDate(null)).toBe("");
  });
});

describe("formatDateRange", () => {
  it("combines from and until dates", () => {
    const result = formatDateRange("2026-08-06T00:00:00.000Z", "2026-08-12T00:00:00.000Z");
    expect(result).toContain("–");
  });

  it("returns empty when both dates are missing", () => {
    expect(formatDateRange(null, null)).toBe("");
  });
});

describe("offerCardFields", () => {
  it("maps an offer row into card fields", () => {
    const fields = offerCardFields({
      retailer_name: "A101",
      retailer_code: "a101",
      product_name: "Süt 1 L",
      brand: "Pınar",
      quantity_raw_text: "1 L",
      current_price: 40,
      previous_price: 45,
      currency: "TRY",
      valid_from: "2026-08-06T00:00:00.000Z",
      valid_until: null,
      verification_status: "extracted",
      needs_review: false,
      brochure_id: "b-1",
      brochure_title: "A101 6 Ağustos",
    });

    expect(fields.retailer).toBe("A101");
    expect(fields.productName).toBe("Süt 1 L");
    expect(fields.meta).toContain("Pınar");
    expect(fields.meta).toContain("1 L");
    expect(fields.price).toContain("40");
    expect(fields.previousPrice).toContain("45");
    expect(fields.verificationStatus).toBe("extracted");
    expect(fields.needsReview).toBe(false);
    expect(fields.brochureId).toBe("b-1");
  });

  it("joins meta only with present fields", () => {
    const fields = offerCardFields({
      retailer_name: "BİM",
      retailer_code: "bim",
      product_name: "Ürün",
      brand: null,
      category: "Gıda",
      variant: null,
      quantity_raw_text: null,
      current_price: 10,
      previous_price: null,
      currency: "TRY",
      valid_from: null,
      valid_until: null,
      verification_status: "extracted",
      needs_review: true,
      brochure_id: "",
      brochure_title: "",
    });

    expect(fields.meta).toBe("Gıda");
    expect(fields.needsReview).toBe(true);
    expect(fields.previousPrice).toBe("");
  });
});

describe("statusLabel", () => {
  it("maps known statuses to Turkish labels", () => {
    expect(statusLabel("extracted")).toBe("Çıkarıldı");
    expect(statusLabel("reviewed")).toBe("İncelendi");
    expect(statusLabel("retailer_verified")).toBe("Doğrulandı");
  });

  it("falls back to the raw status", () => {
    expect(statusLabel("unknown")).toBe("unknown");
  });
});

describe("escapeHtml", () => {
  it("escapes special characters", () => {
    expect(escapeHtml('<script>alert("x")</script>')).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;",
    );
  });
});
