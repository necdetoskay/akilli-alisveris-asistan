import { randomUUID } from "node:crypto";
import path from "node:path";

import type { Pool } from "pg";
import sharp from "sharp";

import { CatalogRepository, runInTransaction } from "@akilli-alisveris/db";
import {
  generateRegions,
  mergeRegionalProducts,
  validateExtractedProducts,
  type ExtractionRegion,
  type ExtractedProduct,
  type OpenRouterExtractionClient,
} from "@akilli-alisveris/extraction";
import {
  crawlCatalogue,
  discoverCatalogueCandidates,
  type CatalogueCandidate,
  type CataloguePage,
} from "@akilli-alisveris/source";
import { computeStorageKey, hashSha256, type StorageProvider } from "@akilli-alisveris/storage";

import type { IngestionConfig } from "./config.js";
import { HttpFetcher } from "./http.js";
import { selectTargetCatalogues } from "./select.js";
import type { BrochureRunResult, PageRunResult, SourceRunResult } from "./types.js";

export interface IngestionOrchestratorOptions {
  readonly pool: Pool;
  readonly storage: StorageProvider;
  readonly config: IngestionConfig;
  readonly extraction: OpenRouterExtractionClient;
  readonly fetcher?: HttpFetcher;
}

interface RegionEntry {
  readonly regionKey: string;
  readonly pageId: string;
  readonly product: ExtractedProduct;
}

async function mapLimit<T, R>(
  items: readonly T[],
  limit: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: Array<R | undefined> = new Array<R | undefined>(items.length);
  let cursor = 0;

  async function runWorker(): Promise<void> {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      const item = items[index];
      if (item === undefined) break;
      results[index] = await worker(item);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => runWorker());
  await Promise.all(workers);
  return results as R[];
}

function extensionFor(url: string): string {
  const filename = url.split("/").pop() ?? "";
  const clean = filename.split("?")[0]?.split("#")[0] ?? filename;
  const ext = path.extname(clean).replace(/^\./, "").toLowerCase();
  return ext || "bin";
}

function mediaTypeFor(contentType: string): string {
  return contentType.split(";")[0]?.trim().toLowerCase() || "application/octet-stream";
}

function validDate(value: Date | null | undefined): Date | null {
  return value instanceof Date && !Number.isNaN(value.getTime()) ? value : null;
}

export class IngestionOrchestrator {
  private readonly pool: Pool;
  private readonly storage: StorageProvider;
  private readonly config: IngestionConfig;
  private readonly extraction: OpenRouterExtractionClient;
  private readonly fetcher: HttpFetcher;

  public constructor(options: IngestionOrchestratorOptions) {
    this.pool = options.pool;
    this.storage = options.storage;
    this.config = options.config;
    this.extraction = options.extraction;
    this.fetcher =
      options.fetcher ??
      new HttpFetcher({
        userAgent: this.config.http.userAgent,
        timeoutMs: this.config.http.timeoutMs,
        maxRetries: this.config.http.maxRetries,
      });
  }

  private repo(): CatalogRepository {
    return new CatalogRepository(this.pool);
  }

  /**
   * Runs the full automated source flow described in the E2E guide section 10:
   * fetch run -> category page -> discover -> select active/upcoming -> ingest.
   */
  public async runSource(retailerCode: string, now: Date = new Date()): Promise<SourceRunResult> {
    const source = await this.repo().getSourceByRetailerCode(retailerCode);
    if (!source) throw new Error(`No enabled source found for retailer code: ${retailerCode}`);

    const sourceFetchRunId = randomUUID();
    await this.repo().insertSourceFetchRun({ id: sourceFetchRunId, source_id: source.id });

    let status: "complete" | "partial" | "failed" = "complete";
    let errorMessage: string | null = null;
    let discoveredBrochureCount = 0;
    let discoveredPageCount = 0;
    let downloadedPageCount = 0;
    let duplicatePageCount = 0;
    let extractedProductCount = 0;
    let totalCostUsd = 0;
    let totalCostTry = 0;
    const brochures: BrochureRunResult[] = [];

    try {
      const candidates = await this.discoverFromCategory(source.category_url, retailerCode);
      discoveredBrochureCount = candidates.length;

      const selection = selectTargetCatalogues(candidates, now);
      const targets = [selection.active, selection.upcoming].filter(
        (candidate): candidate is CatalogueCandidate => candidate !== null,
      );

      const seen = new Set<string>();
      for (const candidate of targets) {
        if (seen.has(candidate.url)) continue;
        seen.add(candidate.url);
        const brochure = await this.ingestCatalogue(source.id, source.retailer_id, candidate);
        brochures.push(brochure);
        discoveredPageCount += brochure.pageCountDiscovered;
        downloadedPageCount += brochure.pageCountDownloaded;
        duplicatePageCount += brochure.pageCountDuplicate;
        extractedProductCount += brochure.extractedProductCount;
        totalCostUsd += brochure.costUsd;
        totalCostTry += brochure.costTry;
      }

      await this.repo().markSourceSuccess(source.id);
    } catch (error) {
      status = "failed";
      errorMessage = error instanceof Error ? error.message : String(error);
      await this.repo().markSourceError(source.id);
    }

    await this.repo().finishSourceFetchRun(sourceFetchRunId, {
      status,
      finishedAt: new Date(),
      discoveredBrochureCount,
      discoveredPageCount,
      downloadedPageCount,
      duplicatePageCount,
      extractedProductCount,
      totalCostUsd,
      totalCostTry,
      errorMessage,
    });

    return {
      sourceId: source.id,
      sourceFetchRunId,
      retailerCode,
      status,
      discoveredBrochureCount,
      discoveredPageCount,
      downloadedPageCount,
      duplicatePageCount,
      extractedProductCount,
      totalCostUsd,
      totalCostTry,
      errorMessage,
      brochures,
    };
  }

  private async discoverFromCategory(
    categoryUrl: string,
    retailerCode: string,
  ): Promise<CatalogueCandidate[]> {
    const html = await this.fetcher.fetchText(categoryUrl, {
      maxBytes: 10 * 1024 * 1024,
    });
    return discoverCatalogueCandidates(html, retailerCode);
  }

  /**
   * Ingests one catalogue: upsert brochure -> crawl pages -> download images ->
   * extract regions -> merge -> write offers. Idempotent per content_source_url.
   */
  public async ingestCatalogue(
    sourceId: string,
    retailerId: string,
    candidate: CatalogueCandidate,
  ): Promise<BrochureRunResult> {
    const discoverJobId = (
      await this.repo().insertIngestionJob({
        id: randomUUID(),
        source_id: sourceId,
        job_type: "discover",
        idempotency_key: `discover:${sourceId}:${candidate.url}`,
      })
    ).id;

    const parsed = await crawlCatalogue(candidate.url, (url) =>
      this.fetcher.fetchText(url, { maxBytes: 10 * 1024 * 1024 }),
    );
    await this.repo().completeJob(discoverJobId);

    const brochure = await runInTransaction(this.pool, (client) =>
      new CatalogRepository(client).upsertBrochure({
        id: randomUUID(),
        retailer_id: retailerId,
        source_id: sourceId,
        discovery_source_url: candidate.url,
        content_source_url: parsed.canonicalUrl,
        title: parsed.title,
        campaign_name: parsed.title,
        publication_date: validDate(parsed.publishedAt),
        valid_from: validDate(parsed.validFrom),
        valid_until: validDate(parsed.validUntil),
        page_count_discovered: parsed.pageCountDiscovered,
      }),
    );

    await this.repo().updateBrochureIngestionStatus(brochure.id, "discovered");

    const pageResults: PageRunResult[] = [];
    const errors: string[] = [];
    let pageNumber = 0;
    let downloaded = 0;
    let duplicates = 0;
    let failed = 0;

    const tasks: Array<{ page: CataloguePage; imageUrl: string }> = [];
    for (const page of parsed.pages) {
      for (const imageUrl of page.imageUrls) {
        tasks.push({ page, imageUrl });
      }
    }

    await mapLimit(tasks, this.config.concurrency.download, async (task) => {
      const current = pageNumber;
      pageNumber += 1;
      const result = await this.downloadPage({
        brochureId: brochure.id,
        pageNumber: current + 1,
        sourcePageUrl: task.page.sourcePageUrl,
        sourceImageUrl: task.imageUrl,
        idempotencyKey: `download:${sourceId}:${parsed.canonicalUrl}:${current + 1}`,
      });
      pageResults.push(result);
      if (result.status === "downloaded") downloaded += 1;
      else if (result.status === "duplicate") duplicates += 1;
      else failed += 1;
      if (result.errorMessage) errors.push(result.errorMessage);
    });

    await this.repo().updateBrochureIngestionStatus(
      brochure.id,
      failed === 0 ? "downloaded" : "incomplete",
      downloaded + duplicates,
    );

    const extraction = await this.extractBrochure(
      retailerId,
      brochure.id,
      parsed.canonicalUrl,
      validDate(brochure.valid_from),
      validDate(brochure.valid_until),
    );

    return {
      brochureId: brochure.id,
      title: brochure.title,
      contentSourceUrl: parsed.canonicalUrl,
      discoverySourceUrl: candidate.url,
      pageCountDiscovered: parsed.pageCountDiscovered,
      pageCountDownloaded: downloaded + duplicates,
      pageCountDuplicate: duplicates,
      pageCountFailed: failed,
      extractedProductCount: extraction.productCount,
      extractionStatus: extraction.status,
      costUsd: extraction.costUsd,
      costTry: extraction.costTry,
      pages: [...pageResults].sort((a, b) => a.pageNumber - b.pageNumber),
      errors,
    };
  }

  private async downloadPage(options: {
    readonly brochureId: string;
    readonly pageNumber: number;
    readonly sourcePageUrl: string;
    readonly sourceImageUrl: string;
    readonly idempotencyKey: string;
  }): Promise<PageRunResult> {
    const { brochureId, pageNumber, sourcePageUrl, sourceImageUrl, idempotencyKey } = options;

    const repo = this.repo();
    const jobId = (
      await repo.insertIngestionJob({
        id: randomUUID(),
        brochure_id: brochureId,
        job_type: "download_page",
        idempotency_key: idempotencyKey,
      })
    ).id;

    try {
      const fetched = await this.fetcher.fetchBytes(sourceImageUrl, {
        maxBytes: this.config.http.maxImageBytes,
        contentType: /^image\//,
      });
      const sha256 = hashSha256(fetched.bytes);
      const metadata = await sharp(fetched.bytes).metadata();
      const width = metadata.width ?? null;
      const height = metadata.height ?? null;

      const existing = await repo.getAssetBySha256("original", sha256, this.storage.name);
      if (existing) {
        const page = await repo.insertBrochurePage({
          id: randomUUID(),
          brochure_id: brochureId,
          page_number: pageNumber,
          source_page_url: sourcePageUrl,
          source_image_url: sourceImageUrl,
        });
        await repo.linkPageDuplicateAsset(page.id, existing.id, sha256);
        await repo.completeJob(jobId);
        return {
          pageNumber,
          sourcePageUrl,
          sourceImageUrl,
          status: "duplicate",
          sha256,
          byteSize: existing.byte_size,
          storageKey: existing.storage_key,
          errorMessage: null,
        };
      }

      const assetId = randomUUID();
      const storageKey = computeStorageKey(
        "aktuel-urunler",
        brochureId,
        pageNumber,
        assetId,
        extensionFor(sourceImageUrl),
      );
      const stored = await this.storage.put(storageKey, fetched.bytes, sha256);
      const verified = await this.storage.stat(storageKey);
      if (verified.sha256 !== sha256) {
        throw new Error(`Hash read-back mismatch for ${sourceImageUrl}`);
      }

      const page = await runInTransaction(this.pool, (client) =>
        new CatalogRepository(client).insertBrochurePage({
          id: randomUUID(),
          brochure_id: brochureId,
          page_number: pageNumber,
          source_page_url: sourcePageUrl,
          source_image_url: sourceImageUrl,
        }),
      );

      await runInTransaction(this.pool, async (client) => {
        const cRepo = new CatalogRepository(client);
        const asset = await cRepo.insertAsset({
          id: assetId,
          brochure_id: brochureId,
          brochure_page_id: page.id,
          asset_type: "original",
          storage_provider: this.storage.name,
          storage_key: storageKey,
          original_filename: sourceImageUrl.split("/").pop() ?? sourceImageUrl,
          media_type: mediaTypeFor(fetched.contentType),
          byte_size: stored.byteSize,
          sha256,
          width,
          height,
        });
        await cRepo.linkPageAsset(page.id, asset.id, sha256, width, height);
      });
      await repo.completeJob(jobId);

      return {
        pageNumber,
        sourcePageUrl,
        sourceImageUrl,
        status: "downloaded",
        sha256,
        byteSize: stored.byteSize,
        storageKey,
        errorMessage: null,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await this.repo().markPageFailedBySource(brochureId, pageNumber, sourceImageUrl);
      await this.repo().failJob(jobId, "download_failed", message);
      return {
        pageNumber,
        sourcePageUrl,
        sourceImageUrl,
        status: "failed",
        sha256: null,
        byteSize: null,
        storageKey: null,
        errorMessage: message,
      };
    }
  }

  private async extractBrochure(
    retailerId: string,
    brochureId: string,
    contentSourceUrl: string,
    validFrom: Date | null,
    validUntil: Date | null,
  ): Promise<{ status: string; productCount: number; costUsd: number; costTry: number }> {
    const repo = this.repo();
    const runId = randomUUID();
    const extractJobId = (await repo.insertIngestionJob({
      id: randomUUID(),
      brochure_id: brochureId,
      job_type: "extract_brochure",
      idempotency_key: `extract:${brochureId}:${this.config.pipelineVersion}`,
    })).id;

    const existingRun = await repo.getExtractionRun(
      brochureId,
      this.config.modelName,
      this.config.pipelineVersion,
    );
    if (existingRun && existingRun.status === "complete") {
      await repo.completeJob(extractJobId);
      return { status: "complete", productCount: 0, costUsd: 0, costTry: 0 };
    }

    const pages = await repo.getBrochurePages(brochureId);
    const downloadable = pages.filter((page) => page.download_status === "downloaded");
    if (downloadable.length === 0) {
      await repo.updateBrochureExtractionStatus(brochureId, "failed");
      await repo.failJob(
        extractJobId,
        "no_pages_downloaded",
        "No downloadable pages for extraction",
      );
      return { status: "failed", productCount: 0, costUsd: 0, costTry: 0 };
    }

    await repo.updateBrochureExtractionStatus(brochureId, "running");
    await repo.insertExtractionRun({
      id: runId,
      brochure_id: brochureId,
      model_provider: this.config.modelProvider,
      model_name: this.config.modelName,
      pipeline_version: this.config.pipelineVersion,
    });

    const regionEntries: RegionEntry[] = [];
    const regionErrors: string[] = [];
    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    let totalCostUsd = 0;
    const regionToDbId = new Map<string, string>();

    for (const page of downloadable) {
      const asset = page.original_asset_id ? await repo.getAssetById(page.original_asset_id) : null;
      const storageKey = asset?.storage_key;
      if (!storageKey) {
        regionErrors.push(`Page ${page.page_number} has no stored asset`);
        continue;
      }
      const bytes = await this.storage.get(storageKey);
      const metadata = await sharp(bytes).metadata();
      const width = metadata.width ?? 0;
      const height = metadata.height ?? 0;
      const regions: ExtractionRegion[] = generateRegions(width, height);

      const results = await mapLimit(regions, this.config.concurrency.extract, async (region) => {
        try {
          const result = await this.extraction.extractRegion({ sourceImage: bytes, region });
          return { region, result, ok: true as const };
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          return { region, message, ok: false as const };
        }
      });

      for (const outcome of results) {
        const regionKey = `p${page.page_number}:${outcome.region.id}`;
        const regionRow = await repo.insertExtractionRegion({
          id: randomUUID(),
          extraction_run_id: runId,
          brochure_page_id: page.id,
          region_key: outcome.region.id,
          left_px: outcome.region.left,
          top_px: outcome.region.top,
          width_px: outcome.region.width,
          height_px: outcome.region.height,
        });
        regionToDbId.set(regionKey, regionRow.id);

        if (!outcome.ok) {
          regionErrors.push(
            `Page ${page.page_number} region ${outcome.region.id}: ${outcome.message}`,
          );
          continue;
        }

        const regionResult = outcome.result;
        totalInputTokens += regionResult.usage.input_tokens;
        totalOutputTokens += regionResult.usage.output_tokens;
        totalCostUsd += regionResult.usage.cost_usd;
        for (const product of regionResult.products) {
          regionEntries.push({ regionKey, pageId: page.id, product });
        }
      }
    }

    const validation = validateExtractedProducts(regionEntries.map((entry) => entry.product));
    const validNames = new Set(
      validation.products.map((product) => `${product.product_name}|${product.price?.current}`),
    );

    const merged = mergeRegionalProducts(
      regionEntries
        .filter((entry) =>
          validNames.has(`${entry.product.product_name}|${entry.product.price?.current}`),
        )
        .map((entry) => ({ region: entry.regionKey, product: entry.product })),
    );

    await runInTransaction(this.pool, async (client) => {
      const cRepo = new CatalogRepository(client);
      for (const product of merged.products) {
        const trace = merged.trace.find(
          (t) => t.product_name === product.product_name && t.price === product.price?.current,
        );
        const regionKey = trace?.regions[0] ?? null;
        const entry = regionEntries.find((candidate) => candidate.regionKey === regionKey);
        await cRepo.insertProductOffer({
          id: randomUUID(),
          retailer_id: retailerId,
          brochure_id: brochureId,
          brochure_page_id: entry?.pageId ?? "",
          extraction_run_id: runId,
          source_region_id: regionKey ? (regionToDbId.get(regionKey) ?? null) : null,
          discovery_source: "aktuel-urunler",
          content_source: contentSourceUrl,
          product_name: product.product_name,
          brand: product.brand,
          category: product.category,
          variant: product.variant,
          quantity_value: product.quantity?.value ?? null,
          quantity_unit: product.quantity?.unit ?? null,
          quantity_raw_text: product.quantity?.raw_text ?? null,
          current_price: product.price?.current ?? null,
          previous_price: product.price?.previous ?? null,
          currency: product.price?.currency ?? "TRY",
          valid_from: validFrom,
          valid_until: validUntil,
          confidence: product.confidence,
          needs_review: product.needs_review,
          uncertainty_reason: product.uncertainty_reason,
        });
      }
    });

    const hasFailures = regionErrors.length > 0;
    const hasReview = merged.products.some((product) => product.needs_review);
    const status = hasFailures ? "partial" : hasReview ? "review_required" : "complete";
    const costTry = totalCostUsd * this.config.usdToTryRate;

    await repo.finishExtractionRun(
      runId,
      status,
      totalInputTokens,
      totalOutputTokens,
      totalCostUsd,
      costTry,
      hasFailures ? "region_failure" : null,
      hasFailures ? regionErrors.join("; ") : null,
    );
    await repo.updateBrochureExtractionStatus(brochureId, status);
    await repo.completeJob(extractJobId);

    return {
      status,
      productCount: merged.products.length,
      costUsd: totalCostUsd,
      costTry,
    };
  }
}
