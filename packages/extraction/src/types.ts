export interface ExtractionRegion {
  readonly id: string;
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

export interface ExtractedQuantity {
  readonly value: number | null;
  readonly unit: string | null;
  readonly package_count: number | null;
  readonly raw_text: string | null;
}

export interface ExtractedPrice {
  readonly current: number | null;
  readonly previous: number | null;
  readonly currency: string;
  readonly price_type: string | null;
}

export interface ExtractedAttribute {
  readonly name: string;
  readonly value: string | number | boolean | null;
}

export interface ExtractedInstallment {
  readonly count: number | null;
  readonly description: string | null;
}

export interface ExtractedProduct {
  readonly product_name: string;
  readonly brand: string | null;
  readonly category: string | null;
  readonly variant: string | null;
  readonly quantity: ExtractedQuantity | null;
  readonly price: ExtractedPrice;
  readonly campaign: string | null;
  readonly installment: ExtractedInstallment | null;
  readonly attributes: readonly ExtractedAttribute[];
  readonly confidence: number;
  readonly needs_review: boolean;
  readonly uncertainty_reason: string | null;
}

export interface ExtractionCatalogMeta {
  readonly retailer: string | null;
  readonly campaign_name: string | null;
  readonly valid_from: string | null;
  readonly valid_until: string | null;
  readonly source_page: number;
}

export interface ExtractionOutput {
  readonly catalog: ExtractionCatalogMeta;
  readonly products: readonly ExtractedProduct[];
}

export interface RegionProductEntry {
  readonly region: string;
  readonly product: ExtractedProduct;
}

export interface OpenRouterUsage {
  readonly input_tokens: number;
  readonly cached_input_tokens: number;
  readonly output_tokens: number;
  readonly total_tokens: number;
  readonly cost_usd: number;
}

export interface RegionExtractionResult {
  readonly region: ExtractionRegion;
  readonly products: readonly ExtractedProduct[];
  readonly usage: OpenRouterUsage;
  readonly latency_ms: number;
}

export interface ModelPricing {
  readonly input_usd_per_million: number;
  readonly cached_input_usd_per_million: number;
  readonly output_usd_per_million: number;
}

export interface MergedProductEntry {
  readonly product: ExtractedProduct;
  readonly regions: readonly string[];
  readonly similarity: number | null;
}

export interface MergeTraceEntry {
  readonly product_name: string;
  readonly price: number | null;
  readonly regions: readonly string[];
  readonly merged_similarity: number | null;
}

export interface MergeResult {
  readonly products: readonly ExtractedProduct[];
  readonly trace: readonly MergeTraceEntry[];
  readonly stats: {
    readonly input_products: number;
    readonly output_products: number;
    readonly duplicate_merges: number;
    readonly dropped_without_price: number;
  };
}
