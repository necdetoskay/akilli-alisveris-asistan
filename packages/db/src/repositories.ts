import type { Queryable } from "./pool.js";
import type {
  AssetInsert,
  AssetRow,
  BrochureInsert,
  BrochurePageInsert,
  BrochurePageRow,
  BrochureRow,
  ExtractionRegionInsert,
  ExtractionRunInsert,
  IngestionJobInsert,
  ProductOfferInsert,
  ProductOfferRow,
  RetailerRow,
  SourceFetchRunInsert,
  SourceFetchRunUpdate,
  SourceRow,
} from "./types.js";

interface Row {
  [key: string]: unknown;
}

function mapRow(row: Row): Record<string, unknown> {
  return row;
}

export class CatalogRepository {
  public constructor(private readonly db: Queryable) {}

  public async getRetailerByCode(code: string): Promise<RetailerRow | null> {
    const result = await this.db.query(
      "SELECT id, code, name, website_url, is_active FROM catalog.retailers WHERE code = $1",
      [code],
    );
    const row = result.rows[0] as Row | undefined;
    return row ? (mapRow(row) as unknown as RetailerRow) : null;
  }

  public async getSourceByRetailerCode(code: string): Promise<SourceRow | null> {
    const result = await this.db.query(
      `SELECT s.id, s.retailer_id, s.source_type, s.name, s.base_url, s.category_url,
              s.is_enabled, s.parser_version, s.last_success_at, s.last_error_at
       FROM catalog.brochure_sources s
       JOIN catalog.retailers r ON r.id = s.retailer_id
       WHERE r.code = $1 AND s.is_enabled = true`,
      [code],
    );
    const row = result.rows[0] as Row | undefined;
    return row ? (mapRow(row) as unknown as SourceRow) : null;
  }

  public async getSourceById(sourceId: string): Promise<SourceRow | null> {
    const result = await this.db.query(
      `SELECT id, retailer_id, source_type, name, base_url, category_url,
              is_enabled, parser_version, last_success_at, last_error_at
       FROM catalog.brochure_sources WHERE id = $1`,
      [sourceId],
    );
    const row = result.rows[0] as Row | undefined;
    return row ? (mapRow(row) as unknown as SourceRow) : null;
  }

  public async markSourceSuccess(sourceId: string): Promise<void> {
    await this.db.query(
      `UPDATE catalog.brochure_sources
       SET last_success_at = now(), last_error_at = NULL, updated_at = now()
       WHERE id = $1`,
      [sourceId],
    );
  }

  public async markSourceError(sourceId: string): Promise<void> {
    await this.db.query(
      `UPDATE catalog.brochure_sources
       SET last_error_at = now(), updated_at = now()
       WHERE id = $1`,
      [sourceId],
    );
  }

  public async upsertBrochure(insert: BrochureInsert): Promise<BrochureRow> {
    const result = await this.db.query(
      `INSERT INTO catalog.brochures (
         id, retailer_id, source_id, discovery_source_url, content_source_url,
         title, campaign_name, publication_date, valid_from, valid_until,
         page_count_discovered
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (source_id, content_source_url) DO UPDATE SET
         title = EXCLUDED.title,
         campaign_name = EXCLUDED.campaign_name,
         publication_date = COALESCE(EXCLUDED.publication_date, catalog.brochures.publication_date),
         valid_from = COALESCE(EXCLUDED.valid_from, catalog.brochures.valid_from),
         valid_until = COALESCE(EXCLUDED.valid_until, catalog.brochures.valid_until),
         page_count_discovered = GREATEST(catalog.brochures.page_count_discovered, EXCLUDED.page_count_discovered),
         updated_at = now()
       RETURNING *`,
      [
        insert.id,
        insert.retailer_id,
        insert.source_id,
        insert.discovery_source_url,
        insert.content_source_url,
        insert.title,
        insert.campaign_name ?? null,
        insert.publication_date ?? null,
        insert.valid_from ?? null,
        insert.valid_until ?? null,
        insert.page_count_discovered ?? 0,
      ],
    );
    return mapRow(result.rows[0] as Row) as unknown as BrochureRow;
  }

  public async getBrochureById(brochureId: string): Promise<BrochureRow | null> {
    const result = await this.db.query("SELECT * FROM catalog.brochures WHERE id = $1", [
      brochureId,
    ]);
    const row = result.rows[0] as Row | undefined;
    return row ? (mapRow(row) as unknown as BrochureRow) : null;
  }

  public async getBrochureBySourceAndUrl(
    sourceId: string,
    contentSourceUrl: string,
  ): Promise<BrochureRow | null> {
    const result = await this.db.query(
      "SELECT * FROM catalog.brochures WHERE source_id = $1 AND content_source_url = $2",
      [sourceId, contentSourceUrl],
    );
    const row = result.rows[0] as Row | undefined;
    return row ? (mapRow(row) as unknown as BrochureRow) : null;
  }

  public async updateBrochureIngestionStatus(
    brochureId: string,
    status: string,
    pageCountDownloaded?: number,
  ): Promise<void> {
    await this.db.query(
      `UPDATE catalog.brochures
       SET ingestion_status = $2,
           page_count_downloaded = $3,
           updated_at = now()
       WHERE id = $1`,
      [brochureId, status, pageCountDownloaded ?? 0],
    );
  }

  public async updateBrochureExtractionStatus(brochureId: string, status: string): Promise<void> {
    await this.db.query(
      `UPDATE catalog.brochures
       SET extraction_status = $2, updated_at = now()
       WHERE id = $1`,
      [brochureId, status],
    );
  }

  public async insertBrochurePage(insert: BrochurePageInsert): Promise<BrochurePageRow> {
    const result = await this.db.query(
      `INSERT INTO catalog.brochure_pages (
         id, brochure_id, page_number, source_page_url, source_image_url
       ) VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (brochure_id, page_number, source_image_url) DO NOTHING
       RETURNING *`,
      [
        insert.id,
        insert.brochure_id,
        insert.page_number,
        insert.source_page_url,
        insert.source_image_url,
      ],
    );
    const row = result.rows[0] as Row | undefined;
    if (row) return mapRow(row) as unknown as BrochurePageRow;
    const existing = await this.db.query(
      "SELECT * FROM catalog.brochure_pages WHERE brochure_id = $1 AND page_number = $2 AND source_image_url = $3",
      [insert.brochure_id, insert.page_number, insert.source_image_url],
    );
    return mapRow(existing.rows[0] as Row) as unknown as BrochurePageRow;
  }

  public async getBrochurePages(brochureId: string): Promise<BrochurePageRow[]> {
    const result = await this.db.query(
      "SELECT * FROM catalog.brochure_pages WHERE brochure_id = $1 ORDER BY page_number",
      [brochureId],
    );
    return result.rows.map((row) => mapRow(row as Row) as unknown as BrochurePageRow);
  }

  public async linkPageAsset(
    pageId: string,
    assetId: string,
    sha256: string,
    width: number | null,
    height: number | null,
  ): Promise<void> {
    await this.db.query(
      `UPDATE catalog.brochure_pages
       SET original_asset_id = $2, sha256 = $3, width = $4, height = $5,
           download_status = 'downloaded', updated_at = now()
       WHERE id = $1`,
      [pageId, assetId, sha256, width, height],
    );
  }

  public async markPageDuplicate(pageId: string, sha256: string): Promise<void> {
    await this.db.query(
      `UPDATE catalog.brochure_pages
       SET sha256 = $2, download_status = 'duplicate', updated_at = now()
       WHERE id = $1`,
      [pageId, sha256],
    );
  }

  public async linkPageDuplicateAsset(
    pageId: string,
    assetId: string,
    sha256: string,
  ): Promise<void> {
    await this.db.query(
      `UPDATE catalog.brochure_pages
       SET original_asset_id = $2, sha256 = $3, download_status = 'duplicate', updated_at = now()
       WHERE id = $1`,
      [pageId, assetId, sha256],
    );
  }

  public async markPageFailed(pageId: string): Promise<void> {
    await this.db.query(
      `UPDATE catalog.brochure_pages
       SET download_status = 'failed', updated_at = now()
       WHERE id = $1`,
      [pageId],
    );
  }

  public async markPageFailedBySource(
    brochureId: string,
    pageNumber: number,
    sourceImageUrl: string,
  ): Promise<void> {
    await this.db.query(
      `UPDATE catalog.brochure_pages
       SET download_status = 'failed', updated_at = now()
       WHERE brochure_id = $1 AND page_number = $2 AND source_image_url = $3`,
      [brochureId, pageNumber, sourceImageUrl],
    );
  }

  public async insertAsset(insert: AssetInsert): Promise<AssetRow> {
    const result = await this.db.query(
      `INSERT INTO catalog.brochure_assets (
         id, brochure_id, brochure_page_id, asset_type, storage_provider,
         storage_key, original_filename, media_type, byte_size, sha256, width, height
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       ON CONFLICT (asset_type, sha256, storage_provider) DO NOTHING
       RETURNING *`,
      [
        insert.id,
        insert.brochure_id,
        insert.brochure_page_id ?? null,
        insert.asset_type,
        insert.storage_provider,
        insert.storage_key,
        insert.original_filename ?? null,
        insert.media_type,
        insert.byte_size,
        insert.sha256,
        insert.width ?? null,
        insert.height ?? null,
      ],
    );
    const row = result.rows[0] as Row | undefined;
    if (row) return mapRow(row) as unknown as AssetRow;
    const existing = await this.db.query(
      "SELECT * FROM catalog.brochure_assets WHERE asset_type = $1 AND sha256 = $2 AND storage_provider = $3",
      [insert.asset_type, insert.sha256, insert.storage_provider],
    );
    return mapRow(existing.rows[0] as Row) as unknown as AssetRow;
  }

  public async getAssetBySha256(
    assetType: string,
    sha256: string,
    storageProvider: string,
  ): Promise<AssetRow | null> {
    const result = await this.db.query(
      "SELECT * FROM catalog.brochure_assets WHERE asset_type = $1 AND sha256 = $2 AND storage_provider = $3",
      [assetType, sha256, storageProvider],
    );
    const row = result.rows[0] as Row | undefined;
    return row ? (mapRow(row) as unknown as AssetRow) : null;
  }

  public async getAssetById(assetId: string): Promise<AssetRow | null> {
    const result = await this.db.query("SELECT * FROM catalog.brochure_assets WHERE id = $1", [
      assetId,
    ]);
    const row = result.rows[0] as Row | undefined;
    return row ? (mapRow(row) as unknown as AssetRow) : null;
  }

  public async insertExtractionRun(insert: ExtractionRunInsert): Promise<{ id: string }> {
    const result = await this.db.query(
      `INSERT INTO catalog.extraction_runs (
         id, brochure_id, model_provider, model_name, pipeline_version
       ) VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (brochure_id, model_name, pipeline_version) DO UPDATE SET
         status = 'running',
         started_at = now(),
         finished_at = NULL,
         error_code = NULL,
         error_message = NULL
       RETURNING id`,
      [
        insert.id,
        insert.brochure_id,
        insert.model_provider,
        insert.model_name,
        insert.pipeline_version,
      ],
    );
    return { id: (result.rows[0] as Row).id as string };
  }

  public async getExtractionRun(
    brochureId: string,
    modelName: string,
    pipelineVersion: string,
  ): Promise<{ status: string } | null> {
    const result = await this.db.query(
      `SELECT id, status FROM catalog.extraction_runs
       WHERE brochure_id = $1 AND model_name = $2 AND pipeline_version = $3
       LIMIT 1`,
      [brochureId, modelName, pipelineVersion],
    );
    const row = result.rows[0] as Row | undefined;
    return row ? { status: row.status as string } : null;
  }

  public async finishExtractionRun(
    runId: string,
    status: string,
    inputTokens: number,
    outputTokens: number,
    costUsd: number,
    costTry: number,
    errorCode?: string | null,
    errorMessage?: string | null,
  ): Promise<void> {
    await this.db.query(
      `UPDATE catalog.extraction_runs
       SET status = $2,
           input_tokens = $3,
           output_tokens = $4,
           cost_usd = $5,
           cost_try = $6,
           finished_at = now(),
           error_code = $7,
           error_message = $8
       WHERE id = $1`,
      [
        runId,
        status,
        inputTokens,
        outputTokens,
        costUsd,
        costTry,
        errorCode ?? null,
        errorMessage ?? null,
      ],
    );
  }

  public async insertExtractionRegion(insert: ExtractionRegionInsert): Promise<{ id: string }> {
    const result = await this.db.query(
      `INSERT INTO catalog.extraction_regions (
         id, extraction_run_id, brochure_page_id, region_key,
         left_px, top_px, width_px, height_px, result_asset_id
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (extraction_run_id, brochure_page_id, region_key) DO NOTHING
       RETURNING id`,
      [
        insert.id,
        insert.extraction_run_id,
        insert.brochure_page_id,
        insert.region_key,
        insert.left_px,
        insert.top_px,
        insert.width_px,
        insert.height_px,
        insert.result_asset_id ?? null,
      ],
    );
    const row = result.rows[0] as Row | undefined;
    if (row) return { id: row.id as string };
    const existing = await this.db.query(
      `SELECT id FROM catalog.extraction_regions
       WHERE extraction_run_id = $1 AND brochure_page_id = $2 AND region_key = $3
       LIMIT 1`,
      [insert.extraction_run_id, insert.brochure_page_id, insert.region_key],
    );
    return { id: (existing.rows[0] as Row).id as string };
  }

  public async insertProductOffer(insert: ProductOfferInsert): Promise<ProductOfferRow> {
    const result = await this.db.query(
      `INSERT INTO catalog.product_offers (
         id, retailer_id, brochure_id, brochure_page_id, extraction_run_id,
         source_region_id, discovery_source, content_source, product_name,
         brand, category, variant, quantity_value, quantity_unit, quantity_raw_text,
         current_price, previous_price, currency, valid_from, valid_until,
         confidence, needs_review, uncertainty_reason
       ) VALUES (
         $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
         $16, $17, $18, $19, $20, $21, $22, $23
       )
       ON CONFLICT DO NOTHING
       RETURNING *`,
      [
        insert.id,
        insert.retailer_id,
        insert.brochure_id,
        insert.brochure_page_id,
        insert.extraction_run_id ?? null,
        insert.source_region_id ?? null,
        insert.discovery_source,
        insert.content_source,
        insert.product_name,
        insert.brand ?? null,
        insert.category ?? null,
        insert.variant ?? null,
        insert.quantity_value ?? null,
        insert.quantity_unit ?? null,
        insert.quantity_raw_text ?? null,
        insert.current_price ?? null,
        insert.previous_price ?? null,
        insert.currency ?? "TRY",
        insert.valid_from ?? null,
        insert.valid_until ?? null,
        insert.confidence ?? 0,
        insert.needs_review ?? false,
        insert.uncertainty_reason ?? null,
      ],
    );
    const row = result.rows[0] as Row | undefined;
    return row
      ? (mapRow(row) as unknown as ProductOfferRow)
      : await this.getOfferByUniqueKey(insert);
  }

  private async getOfferByUniqueKey(insert: ProductOfferInsert): Promise<ProductOfferRow> {
    const result = await this.db.query(
      `SELECT * FROM catalog.product_offers
       WHERE brochure_page_id = $1 AND product_name = $2 AND current_price = $3
         AND discovery_source = $4 AND content_source = $5
       LIMIT 1`,
      [
        insert.brochure_page_id,
        insert.product_name,
        insert.current_price ?? null,
        insert.discovery_source,
        insert.content_source,
      ],
    );
    return mapRow(result.rows[0] as Row) as unknown as ProductOfferRow;
  }

  public async insertIngestionJob(insert: IngestionJobInsert): Promise<{ id: string }> {
    const result = await this.db.query(
      `INSERT INTO catalog.ingestion_jobs (
         id, source_id, brochure_id, brochure_page_id, job_type, idempotency_key
       ) VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (idempotency_key) DO NOTHING
       RETURNING id`,
      [
        insert.id,
        insert.source_id ?? null,
        insert.brochure_id ?? null,
        insert.brochure_page_id ?? null,
        insert.job_type,
        insert.idempotency_key,
      ],
    );
    const row = result.rows[0] as Row | undefined;
    if (row) return { id: row.id as string };
    const existing = await this.db.query(
      "SELECT id FROM catalog.ingestion_jobs WHERE idempotency_key = $1",
      [insert.idempotency_key],
    );
    return { id: (existing.rows[0] as Row).id as string };
  }

  public async completeJob(jobId: string): Promise<void> {
    await this.db.query(
      `UPDATE catalog.ingestion_jobs
       SET status = 'succeeded', finished_at = now(), updated_at = now()
       WHERE id = $1`,
      [jobId],
    );
  }

  public async failJob(jobId: string, errorCode: string, errorMessage: string): Promise<void> {
    await this.db.query(
      `UPDATE catalog.ingestion_jobs
       SET status = 'failed', finished_at = now(), error_code = $2,
           error_message = $3, updated_at = now()
       WHERE id = $1`,
      [jobId, errorCode, errorMessage],
    );
  }

  public async insertSourceFetchRun(insert: SourceFetchRunInsert): Promise<{ id: string }> {
    const result = await this.db.query(
      "INSERT INTO catalog.source_fetch_runs (id, source_id) VALUES ($1, $2) RETURNING id",
      [insert.id, insert.source_id],
    );
    return { id: (result.rows[0] as Row).id as string };
  }

  public async finishSourceFetchRun(runId: string, update: SourceFetchRunUpdate): Promise<void> {
    await this.db.query(
      `UPDATE catalog.source_fetch_runs
       SET status = $2,
           finished_at = $3,
           discovered_brochure_count = $4,
           discovered_page_count = $5,
           downloaded_page_count = $6,
           duplicate_page_count = $7,
           extracted_product_count = $8,
           total_cost_usd = $9,
           total_cost_try = $10,
           error_message = $11
       WHERE id = $1`,
      [
        runId,
        update.status,
        update.finishedAt ?? null,
        update.discoveredBrochureCount ?? 0,
        update.discoveredPageCount ?? 0,
        update.downloadedPageCount ?? 0,
        update.duplicatePageCount ?? 0,
        update.extractedProductCount ?? 0,
        update.totalCostUsd ?? 0,
        update.totalCostTry ?? 0,
        update.errorMessage ?? null,
      ],
    );
  }

  public async listBrochures(limit = 50, retailerCode?: string): Promise<BrochureRow[]> {
    const params: unknown[] = [limit];
    let where = "";
    if (retailerCode) {
      where = "WHERE r.code = $2";
      params.push(retailerCode);
    }
    const result = await this.db.query(
      `SELECT b.* FROM catalog.brochures b
       JOIN catalog.retailers r ON r.id = b.retailer_id
       ${where}
       ORDER BY b.created_at DESC
       LIMIT $1`,
      params,
    );
    return result.rows.map((row) => mapRow(row as Row) as unknown as BrochureRow);
  }

  public async listSources(): Promise<Array<SourceRow & { readonly retailer_code: string }>> {
    const result = await this.db.query(
      `SELECT s.id, s.retailer_id, s.source_type, s.name, s.base_url, s.category_url,
              s.is_enabled, s.parser_version, s.last_success_at, s.last_error_at,
              r.code AS retailer_code
       FROM catalog.brochure_sources s
       JOIN catalog.retailers r ON r.id = s.retailer_id
       ORDER BY r.code`,
    );
    return result.rows.map(
      (row) => mapRow(row as Row) as unknown as SourceRow & { readonly retailer_code: string },
    );
  }

  public async listIngestionJobs(limit = 50): Promise<Array<Record<string, unknown>>> {
    const result = await this.db.query(
      `SELECT id, source_id, brochure_id, brochure_page_id, job_type, status,
              idempotency_key, attempt_count, queued_at, started_at, finished_at,
              error_code, error_message
       FROM catalog.ingestion_jobs
       ORDER BY created_at DESC
       LIMIT $1`,
      [limit],
    );
    return result.rows.map((row) => mapRow(row as Row));
  }

  public async listProductOffers(
    limit = 100,
    brochureId?: string,
    needsReview?: boolean,
  ): Promise<ProductOfferRow[]> {
    const params: unknown[] = [limit];
    const conditions: string[] = [];
    if (brochureId) {
      conditions.push("brochure_id = $2");
      params.push(brochureId);
    }
    if (needsReview !== undefined) {
      conditions.push(`needs_review = $${params.length + 1}`);
      params.push(needsReview);
    }
    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const result = await this.db.query(
      `SELECT * FROM catalog.product_offers
       ${where}
       ORDER BY created_at DESC
       LIMIT $1`,
      params,
    );
    return result.rows.map((row) => mapRow(row as Row) as unknown as ProductOfferRow);
  }
}
