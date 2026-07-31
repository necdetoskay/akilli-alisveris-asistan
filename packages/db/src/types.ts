export interface RetailerRow {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly website_url: string | null;
  readonly is_active: boolean;
}

export interface SourceRow {
  readonly id: string;
  readonly retailer_id: string;
  readonly source_type: string;
  readonly name: string;
  readonly base_url: string;
  readonly category_url: string;
  readonly is_enabled: boolean;
  readonly parser_version: string;
  readonly last_success_at: Date | null;
  readonly last_error_at: Date | null;
}

export interface BrochureInsert {
  readonly id: string;
  readonly retailer_id: string;
  readonly source_id: string;
  readonly discovery_source_url: string;
  readonly content_source_url: string;
  readonly title: string;
  readonly campaign_name?: string | null;
  readonly publication_date?: Date | null;
  readonly valid_from?: Date | null;
  readonly valid_until?: Date | null;
  readonly page_count_discovered?: number;
}

export interface BrochureRow {
  readonly id: string;
  readonly retailer_id: string;
  readonly source_id: string;
  readonly discovery_source_url: string;
  readonly content_source_url: string;
  readonly title: string;
  readonly campaign_name: string | null;
  readonly publication_date: Date | null;
  readonly valid_from: Date | null;
  readonly valid_until: Date | null;
  readonly verification_status: string;
  readonly ingestion_status: string;
  readonly page_count_discovered: number;
  readonly page_count_downloaded: number;
  readonly extraction_status: string;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly archived_at: Date | null;
}

export interface BrochurePageInsert {
  readonly id: string;
  readonly brochure_id: string;
  readonly page_number: number;
  readonly source_page_url: string;
  readonly source_image_url: string;
}

export interface BrochurePageRow extends BrochurePageInsert {
  readonly original_asset_id: string | null;
  readonly sha256: string | null;
  readonly width: number | null;
  readonly height: number | null;
  readonly download_status: string;
  readonly extraction_status: string;
  readonly created_at: Date;
  readonly updated_at: Date;
}

export interface AssetInsert {
  readonly id: string;
  readonly brochure_id: string;
  readonly brochure_page_id?: string | null;
  readonly asset_type: "original" | "region_crop";
  readonly storage_provider: string;
  readonly storage_key: string;
  readonly original_filename?: string | null;
  readonly media_type: string;
  readonly byte_size: number;
  readonly sha256: string;
  readonly width?: number | null;
  readonly height?: number | null;
}

export interface AssetRow {
  readonly id: string;
  readonly brochure_id: string;
  readonly brochure_page_id: string | null;
  readonly asset_type: string;
  readonly storage_provider: string;
  readonly storage_key: string;
  readonly original_filename: string | null;
  readonly media_type: string;
  readonly byte_size: number;
  readonly sha256: string;
  readonly width: number | null;
  readonly height: number | null;
  readonly created_at: Date;
}

export interface ExtractionRunInsert {
  readonly id: string;
  readonly brochure_id: string;
  readonly model_provider: string;
  readonly model_name: string;
  readonly pipeline_version: string;
}

export interface ExtractionRegionInsert {
  readonly id: string;
  readonly extraction_run_id: string;
  readonly brochure_page_id: string;
  readonly region_key: string;
  readonly left_px: number;
  readonly top_px: number;
  readonly width_px: number;
  readonly height_px: number;
  readonly result_asset_id?: string | null;
}

export interface ProductOfferInsert {
  readonly id: string;
  readonly retailer_id: string;
  readonly brochure_id: string;
  readonly brochure_page_id: string;
  readonly extraction_run_id?: string | null;
  readonly source_region_id?: string | null;
  readonly discovery_source: string;
  readonly content_source: string;
  readonly product_name: string;
  readonly brand?: string | null;
  readonly category?: string | null;
  readonly variant?: string | null;
  readonly quantity_value?: number | null;
  readonly quantity_unit?: string | null;
  readonly quantity_raw_text?: string | null;
  readonly current_price?: number | null;
  readonly previous_price?: number | null;
  readonly currency?: string;
  readonly valid_from?: Date | null;
  readonly valid_until?: Date | null;
  readonly confidence?: number;
  readonly needs_review?: boolean;
  readonly uncertainty_reason?: string | null;
}

export interface ProductOfferRow {
  readonly id: string;
  readonly retailer_id: string;
  readonly brochure_id: string;
  readonly brochure_page_id: string;
  readonly extraction_run_id: string | null;
  readonly source_region_id: string | null;
  readonly discovery_source: string;
  readonly content_source: string;
  readonly product_name: string;
  readonly brand: string | null;
  readonly category: string | null;
  readonly variant: string | null;
  readonly quantity_value: number | null;
  readonly quantity_unit: string | null;
  readonly quantity_raw_text: string | null;
  readonly current_price: number | null;
  readonly previous_price: number | null;
  readonly currency: string;
  readonly valid_from: Date | null;
  readonly valid_until: Date | null;
  readonly confidence: number;
  readonly needs_review: boolean;
  readonly uncertainty_reason: string | null;
  readonly verification_status: string;
  readonly created_at: Date;
}

export interface IngestionJobInsert {
  readonly id: string;
  readonly source_id?: string | null;
  readonly brochure_id?: string | null;
  readonly brochure_page_id?: string | null;
  readonly job_type: "discover" | "download_page" | "extract_page" | "extract_brochure";
  readonly idempotency_key: string;
}

export interface SourceFetchRunInsert {
  readonly id: string;
  readonly source_id: string;
}

export interface SourceFetchRunUpdate {
  readonly status: "complete" | "partial" | "failed";
  readonly finishedAt?: Date;
  readonly discoveredBrochureCount?: number;
  readonly discoveredPageCount?: number;
  readonly downloadedPageCount?: number;
  readonly duplicatePageCount?: number;
  readonly extractedProductCount?: number;
  readonly totalCostUsd?: number;
  readonly totalCostTry?: number;
  readonly errorMessage?: string | null;
}
