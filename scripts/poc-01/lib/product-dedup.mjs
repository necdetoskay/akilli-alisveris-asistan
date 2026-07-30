const normalizeText = (value) => String(value ?? "")
  .toLocaleLowerCase("tr-TR")
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^\p{L}\p{N}]+/gu, " ")
  .trim();

const tokens = (value) => new Set(normalizeText(value).split(" ").filter((token) => token.length > 1));

const jaccard = (left, right) => {
  if (left.size === 0 || right.size === 0) return 0;
  let intersection = 0;
  for (const token of left) if (right.has(token)) intersection += 1;
  return intersection / (left.size + right.size - intersection);
};

const numeric = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const sameUnit = (left, right) => normalizeText(left) === normalizeText(right);

export const productSimilarity = (left, right) => {
  const leftPrice = numeric(left.price?.current);
  const rightPrice = numeric(right.price?.current);
  if (leftPrice !== null && rightPrice !== null && Math.abs(leftPrice - rightPrice) > 1) return 0;

  const leftName = normalizeText(left.product_name);
  const rightName = normalizeText(right.product_name);
  const nameSimilarity = jaccard(tokens(leftName), tokens(rightName));
  const nameContains = leftName.length >= 5 && rightName.length >= 5 &&
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
    if (Math.abs(leftQuantity - rightQuantity) <= 0.01 && sameUnit(left.quantity?.unit, right.quantity?.unit)) score += 0.12;
    else score -= 0.08;
  }

  return Math.max(0, Math.min(1, score));
};

const completeness = (product) => [
  product.product_name,
  product.brand,
  product.variant,
  product.quantity?.value,
  product.quantity?.unit,
  product.price?.current,
  product.price?.price_type
].filter((value) => value !== null && value !== undefined && value !== "").length +
  (product.needs_review ? -2 : 1) + Number(product.confidence ?? 0);

const mergePair = (left, right) => {
  const preferred = completeness(right) > completeness(left) ? right : left;
  const secondary = preferred === left ? right : left;
  const leftPrice = numeric(left.price?.current);
  const rightPrice = numeric(right.price?.current);
  const priceConflict = leftPrice !== null && rightPrice !== null && Math.abs(leftPrice - rightPrice) > 0.01;

  return {
    ...preferred,
    brand: preferred.brand ?? secondary.brand,
    variant: preferred.variant ?? secondary.variant,
    category: preferred.category ?? secondary.category,
    quantity: {
      ...secondary.quantity,
      ...preferred.quantity,
      raw_text: preferred.quantity?.raw_text ?? secondary.quantity?.raw_text ?? null
    },
    price: {
      ...secondary.price,
      ...preferred.price
    },
    confidence: priceConflict
      ? Math.min(Number(left.confidence ?? 0), Number(right.confidence ?? 0), 0.7)
      : Math.max(Number(left.confidence ?? 0), Number(right.confidence ?? 0)),
    needs_review: Boolean(preferred.needs_review || secondary.needs_review || priceConflict),
    uncertainty_reason: priceConflict
      ? `Conflicting regional prices: ${leftPrice} vs ${rightPrice}`
      : preferred.uncertainty_reason ?? secondary.uncertainty_reason ?? null
  };
};

export const mergeRegionalProducts = (regionalProducts, threshold = 0.72) => {
  const merged = [];
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
      const score = productSimilarity(merged[index].product, product);
      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    }

    if (bestIndex >= 0 && bestScore >= threshold) {
      merged[bestIndex] = {
        product: mergePair(merged[bestIndex].product, product),
        regions: [...new Set([...merged[bestIndex].regions, entry.region])],
        similarity: Number(bestScore.toFixed(4))
      };
      duplicateMerges += 1;
    } else {
      merged.push({ product, regions: [entry.region], similarity: null });
    }
  }

  return {
    products: merged.map((entry) => entry.product),
    trace: merged.map(({ product, regions, similarity }) => ({
      product_name: product.product_name,
      price: product.price?.current ?? null,
      regions,
      merged_similarity: similarity
    })),
    stats: {
      input_products: regionalProducts.length,
      output_products: merged.length,
      duplicate_merges: duplicateMerges,
      dropped_without_price: droppedWithoutPrice
    }
  };
};
