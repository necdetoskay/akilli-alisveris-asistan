import type { Pool } from "pg";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { createPool, loadDbConfig } from "@akilli-alisveris/db";
import { OpenRouterExtractionClient, type ModelPricing } from "@akilli-alisveris/extraction";
import {
  loadIngestionConfig,
  loadModelPricing,
  readExtractionPrompt,
  readExtractionSchema,
  type IngestionConfig,
} from "@akilli-alisveris/ingestion";
import { LocalStorage, type StorageProvider } from "@akilli-alisveris/storage";

export interface ApiDependencies {
  readonly pool: Pool;
  readonly storage: StorageProvider;
  readonly ingestionConfig: IngestionConfig;
  readonly extraction: OpenRouterExtractionClient;
  readonly webUrl: string;
}

export function buildDependencies(environment: NodeJS.ProcessEnv = process.env): ApiDependencies {
  const dbConfig = loadDbConfig(environment);
  const pool = createPool(dbConfig);

  const ingestionConfig = loadIngestionConfig();
  const pricing = loadModelPricing(ingestionConfig.modelName);
  const modelPricing: ModelPricing = {
    input_usd_per_million: pricing.inputUsdPerMillion,
    cached_input_usd_per_million: pricing.cachedInputUsdPerMillion,
    output_usd_per_million: pricing.outputUsdPerMillion,
  };

  const apiKey = environment.OPENROUTER_API_KEY ?? "";
  const extraction = new OpenRouterExtractionClient({
    apiKey,
    model: ingestionConfig.modelName,
    pricing: modelPricing,
    schema: readExtractionSchema(),
    prompt: readExtractionPrompt(),
  });

  const storage = new LocalStorage(ingestionConfig.storageRoot);

  const webUrl = environment.WEB_URL ?? "http://localhost:3003";

  return { pool, storage, ingestionConfig, extraction, webUrl };
}
