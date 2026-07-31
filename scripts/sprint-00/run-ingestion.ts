import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { createPool, loadDbConfig } from "@akilli-alisveris/db";
import { OpenRouterExtractionClient, type ModelPricing } from "@akilli-alisveris/extraction";
import {
  IngestionOrchestrator,
  loadIngestionConfig,
  loadModelPricing,
  readExtractionPrompt,
  readExtractionSchema,
} from "@akilli-alisveris/ingestion";
import { LocalStorage } from "@akilli-alisveris/storage";

function loadEnvFile(): void {
  const envPath = resolve(process.cwd(), ".env");
  const content = readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator < 0) continue;
    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if (
      value.length >= 2 &&
      ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'")))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

async function main(): Promise<void> {
  loadEnvFile();

  const retailerCode = process.argv[2];
  if (!retailerCode) {
    console.error("Usage: tsx scripts/sprint-00/run-ingestion.ts <a101|bim>");
    process.exitCode = 1;
    return;
  }

  const dbConfig = loadDbConfig();
  const pool = createPool(dbConfig);
  const config = loadIngestionConfig();

  const pricing = loadModelPricing(config.modelName);
  const modelPricing: ModelPricing = {
    input_usd_per_million: pricing.inputUsdPerMillion,
    cached_input_usd_per_million: pricing.cachedInputUsdPerMillion,
    output_usd_per_million: pricing.outputUsdPerMillion,
  };
  const extraction = new OpenRouterExtractionClient({
    apiKey: process.env.OPENROUTER_API_KEY ?? "",
    model: config.modelName,
    pricing: modelPricing,
    schema: readExtractionSchema(),
    prompt: readExtractionPrompt(),
  });

  const storage = new LocalStorage(config.storageRoot);
  const orchestrator = new IngestionOrchestrator({ pool, storage, config, extraction });

  const started = Date.now();
  const result = await orchestrator.runSource(retailerCode);
  const elapsedMs = Date.now() - started;

  console.log(
    JSON.stringify(
      {
        retailerCode,
        elapsedMs,
        status: result.status,
        discoveredBrochureCount: result.discoveredBrochureCount,
        discoveredPageCount: result.discoveredPageCount,
        downloadedPageCount: result.downloadedPageCount,
        duplicatePageCount: result.duplicatePageCount,
        extractedProductCount: result.extractedProductCount,
        totalCostUsd: result.totalCostUsd,
        totalCostTry: result.totalCostTry,
        errorMessage: result.errorMessage,
        brochures: result.brochures.map((brochure) => ({
          brochureId: brochure.brochureId,
          title: brochure.title,
          pageCountDiscovered: brochure.pageCountDiscovered,
          pageCountDownloaded: brochure.pageCountDownloaded,
          pageCountDuplicate: brochure.pageCountDuplicate,
          pageCountFailed: brochure.pageCountFailed,
          extractedProductCount: brochure.extractedProductCount,
          extractionStatus: brochure.extractionStatus,
          costUsd: brochure.costUsd,
          errors: brochure.errors,
        })),
      },
      null,
      2,
    ),
  );

  await pool.end();
}

void main();
