import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export interface IngestionConfig {
  readonly storageRoot: string;
  readonly modelProvider: string;
  readonly modelName: string;
  readonly pipelineVersion: string;
  readonly usdToTryRate: number;
  readonly http: {
    readonly userAgent: string;
    readonly timeoutMs: number;
    readonly maxRetries: number;
    readonly maxImageBytes: number;
  };
  readonly concurrency: {
    readonly download: number;
    readonly extract: number;
  };
}

function repoRoot(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  return resolve(here, "../../..");
}

function repoConfigDir(): string {
  return resolve(repoRoot(), "config/poc-01");
}

export interface ModelPricingConfig {
  readonly inputUsdPerMillion: number;
  readonly cachedInputUsdPerMillion: number;
  readonly outputUsdPerMillion: number;
}

export function loadModelPricing(modelName: string): ModelPricingConfig {
  const pricingRaw = JSON.parse(readFileSync(resolve(repoConfigDir(), "models.json"), "utf8")) as {
    models?: Record<
      string,
      {
        input_usd_per_million?: number;
        cached_input_usd_per_million?: number;
        output_usd_per_million?: number;
      }
    >;
  };
  const pricing = pricingRaw.models?.[modelName] ?? {};
  return {
    inputUsdPerMillion: Number(pricing.input_usd_per_million ?? 0),
    cachedInputUsdPerMillion: Number(pricing.cached_input_usd_per_million ?? 0),
    outputUsdPerMillion: Number(pricing.output_usd_per_million ?? 0),
  };
}

export function readExtractionPrompt(promptPath?: string): string {
  const file = promptPath ?? resolve(repoConfigDir(), "extraction-prompt.txt");
  return readFileSync(file, "utf8");
}

export function readExtractionSchema(schemaPath?: string): unknown {
  const file =
    schemaPath ?? resolve(repoConfigDir(), "../../schemas/catalog-extraction.schema.json");
  return JSON.parse(readFileSync(file, "utf8")) as unknown;
}

export function loadIngestionConfig(overrides: Partial<IngestionConfig> = {}): IngestionConfig {
  const env = process.env;
  const modelName = overrides.modelName ?? env.INGESTION_MODEL ?? "openai/gpt-4.1-mini";

  const defaults: IngestionConfig = {
    storageRoot: env.INGESTION_STORAGE_ROOT ?? resolve(repoRoot(), "data/storage"),
    modelProvider: "openrouter",
    modelName,
    pipelineVersion: "sprint-00-1",
    usdToTryRate: Number(env.INGESTION_USD_TRY ?? "0"),
    http: {
      userAgent: "akilli-alisveris-asistan/0.1 (sprint-00 ingestion)",
      timeoutMs: Number(env.INGESTION_HTTP_TIMEOUT_MS ?? "30000"),
      maxRetries: Number(env.INGESTION_HTTP_MAX_RETRIES ?? "2"),
      maxImageBytes: Number(env.INGESTION_MAX_IMAGE_BYTES ?? String(25 * 1024 * 1024)),
    },
    concurrency: {
      download: Number(env.INGESTION_DOWNLOAD_CONCURRENCY ?? "4"),
      extract: Number(env.INGESTION_EXTRACT_CONCURRENCY ?? "4"),
    },
  };

  return {
    ...defaults,
    ...overrides,
    modelProvider: overrides.modelProvider ?? defaults.modelProvider,
    modelName,
    pipelineVersion: overrides.pipelineVersion ?? defaults.pipelineVersion,
    usdToTryRate: overrides.usdToTryRate ?? defaults.usdToTryRate,
    http: { ...defaults.http, ...overrides.http },
    concurrency: { ...defaults.concurrency, ...overrides.concurrency },
  };
}
