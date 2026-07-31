import type {
  ExtractedProduct,
  MergeResult,
  RegionProductEntry,
} from "./types.js";

function normalizeText(value: string | null | undefined): string {
  return String(value ?? "")
    .toLocaleLowerCase("tr-TR")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function tokens(value: string): Set<string> {
  return new Set(normalizeText(value).split(" ").filter((token) => token.length > 1));
}

function jaccard(left: Set<string>, right: Set<string>): number {
  if (left.size === 0 || right.size === 0) return 0;
  let intersection = 0;
  for (const token of left) if (right.has(token)) intersection += 1;
  return intersection / (left.size + right.size - intersection);
}

function numeric(value: number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function sameUnit(left: string | null | undefined, right: string | null | undefined): boolean {
  return normalizeText(left) === normalizeText(right);
}

export function productSimilarity(left: ExtractedProduct, right: ExtractedProduct): number {
  const leftPrice = numeric(left.price?.current);
  const rightPrice = numeric(right.price?.current);
  if (leftPrice !== null && rightPrice !== null && Math.abs(leftPrice - rightPrice) > 1) {
    return 0;
  }

  const leftName = normalizeText(left.product_name);
  const rightName = normalizeText(right.product_name);
  const nameSimilarity = jaccard(tokens(leftName), tokens(rightName));
  const nameContains =
    leftName.length >= 5 &&
    rightName.length >= 5 &&
    (leftName.includes(rightName) || rightName.includes(leftName));

  let score = Math.max(nameSimilarity * 0.45, nameContains ? 0.38 : 0);

  if (leftPrice !== null && rightPrice !== null) {
    const difference = Math.abs(leftPrice - rightPrice);
    score += difference <= 0.01 ? 0.35 : difference <= 0.5 ? 0.22 : 0.08;
  }

  const leftBrand = normalizeText(left.brand);
  const rightBrand = normalizeText(right.brand);
  if (leftBrand && rightBrand) score += leftBrand === rightBrand ? 0.12 : -0.08;
  else if (!leftBrand || !rightBrand) score += 0.03;

  const leftQuantity = numeric(left.quantity?.value);
  const rightQuantity = numeric(right.quantity?.value);
  if (leftQuantity !== null && rightQuantity !== null) {
    if (
      Math.abs(leftQuantity - rightQuantity) <= 0.01 &&
      sameUnit(left.quantity?.unit, right.quantity?.unit)
    ) {
      score += 0.12;
    } else {
      score -= 0.08;
    }
  }

  return Math.max(0, Math.min(1, score));
}

function completeness(product: ExtractedProduct): number {
  return [
    product.product_name,
    product.brand,
    product.variant,
    product.quantity?.value,
    product.quantity?.unit,
    product.price?.current,
    product.price?.price_type,
  ].filter((value) => value !== null && value !== undefined && value !== "").length +
    (product.needs_review ? -2 : 1) +
    Number(product.confidence ?? 0);
}

function mergePair(left: ExtractedProduct, right: ExtractedProduct): ExtractedProduct {
  const preferred = completeness(right) > completeness(left) ? right : left;
  const secondary = preferred === left ? right : left;
  const leftPrice = numeric(left.price?.current);
  const rightPrice = numeric(right.price?.current);
  const priceConflict =
    leftPrice !== null && rightPrice !== null && Math.abs(leftPrice - rightPrice) > 0.01;

  return {
    ...preferred,
    brand: preferred.brand ?? secondary.brand,
    variant: preferred.variant ?? secondary.variant,
    category: preferred.category ?? secondary.category,
    quantity: {
      value: preferred.quantity?.value ?? secondary.quantity?.value ?? null,
      unit: preferred.quantity?.unit ?? secondary.quantity?.unit ?? null,
      package_count: preferred.quantity?.package_count ?? secondary.quantity?.package_count ?? null,
      raw_text: preferred.quantity?.raw_text ?? secondary.quantity?.raw_text ?? null,
    },
    price: {
      current: preferred.price?.current ?? secondary.price?.current ?? null,
      previous: preferred.price?.previous ?? secondary.price?.previous ?? null,
      currency: preferred.price?.currency ?? secondary.price?.currency ?? "TRY",
      price_type: preferred.price?.price_type ?? secondary.price?.price_type ?? null,
    },
    confidence: priceConflict
      ? Math.min(Number(left.confidence ?? 0), Number(right.confidence ?? 0), 0.7)
      : Math.max(Number(left.confidence ?? 0), Number(right.confidence ?? 0)),
    needs_review: Boolean(preferred.needs_review || secondary.needs_review || priceConflict),
    uncertainty_reason: priceConflict
      ? `Conflicting regional prices: ${leftPrice} vs ${rightPrice}`
      : (preferred.uncertainty_reason ?? secondary.uncertainty_reason ?? null),
  };
}

export interface MergeableEntry {
  readonly region: string;
  readonly product: ExtractedProduct;
}

export function mergeRegionalProducts(
  regionalProducts: readonly RegionProductEntry[],
  threshold = 0.72,
): MergeResult {
  const merged: Array<{
    product: ExtractedProduct;
    regions: Set<string>;
    similarity: number | null;
  }> = [];
  let droppedWithoutPrice = 0;
  let duplicateMerges = 0;

  for (const entry of regionalProducts) {
    const product = entry.product;
    if (numeric(product.price?.current) === null) {
      droppedWithoutPrice += 1;
      continue;
    }

    let bestIndex = -1;
    let bestScore = 0;
    for (let index = 0; index < merged.length; index += 1) {
      const candidate = merged[index];
      if (!candidate) continue;
      const score = productSimilarity(candidate.product, product);
      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    }

    if (bestIndex >= 0 && bestScore >= threshold) {
      const existing = merged[bestIndex];
      if (!existing) throw new Error("Merge invariant violated: bestIndex out of range.");
      existing.product = mergePair(existing.product, product);
      existing.regions.add(entry.region);
      existing.similarity = Number(bestScore.toFixed(4));
      duplicateMerges += 1;
    } else {
      merged.push({
        product,
        regions: new Set([entry.region]),
        similarity: null,
      });
    }
  }

  return {
    products: merged.map((entry) => entry.product),
    trace: merged.map(({ product, regions, similarity }) => ({
      product_name: product.product_name,
      price: product.price?.current ?? null,
      regions: [...regions],
      merged_similarity: similarity,
    })),
    stats: {
      input_products: regionalProducts.length,
      output_products: merged.length,
      duplicate_merges: duplicateMerges,
      dropped_without_price: droppedWithoutPrice,
    },
  };
}

/**
 * Business-rule validation applied after schema validation.
 * Rejects empty/meaningless product names and flags missing prices for review.
 */
export function validateExtractedProducts(products: readonly ExtractedProduct[]): {
  readonly products: readonly ExtractedProduct[];
  readonly rejected: number;
} {
  const kept: ExtractedProduct[] = [];
  let rejected = 0;

  for (const product of products) {
    const name = normalizeText(product.product_name);
    if (!name || name.length < 2) {
      rejected += 1;
      continue;
    }
    const hasPrice = numeric(product.price?.current) !== null;
    kept.push(hasPrice ? product : { ...product, needs_review: true });
  }

  return { products: kept, rejected };
}
