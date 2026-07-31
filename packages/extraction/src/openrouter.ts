import { performance } from "node:perf_hooks";

import sharp from "sharp";

import type {
  ExtractionOutput,
  ExtractionRegion,
  ModelPricing,
  RegionExtractionResult,
} from "./types.js";

export interface OpenRouterClientOptions {
  readonly apiKey: string;
  readonly model: string;
  readonly pricing: ModelPricing;
  readonly schema: unknown;
  readonly prompt: string;
  readonly imageDetail?: string;
  readonly appUrl?: string;
  readonly appName?: string;
  readonly fetchImpl?: typeof fetch;
}

export interface ExtractRegionOptions {
  readonly sourceImage: string | Buffer;
  readonly region: ExtractionRegion;
}

export class ExtractionError extends Error {
  public constructor(
    message: string,
    readonly regionId: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ExtractionError";
  }
}

function readPricingValue(value: number | undefined): number {
  return Number.isFinite(value) ? Number(value) : 0;
}

/**
 * Thin, typed OpenRouter client for brochure region extraction.
 *
 * Cost is taken from OpenRouter's reported `usage.cost` when present and
 * falls back to configured per-token pricing. Token counters are always
 * populated from `usage` so persistence stays accurate.
 */
export class OpenRouterExtractionClient {
  private readonly apiKey: string;
  private readonly model: string;
  private readonly pricing: ModelPricing;
  private readonly schema: unknown;
  private readonly prompt: string;
  private readonly imageDetail: string;
  private readonly appUrl: string;
  private readonly appName: string;
  private readonly fetchImpl: typeof fetch;

  public constructor(options: OpenRouterClientOptions) {
    if (!options.apiKey.trim()) throw new Error("OpenRouter API key is required.");
    if (!options.model.trim()) throw new Error("OpenRouter model is required.");

    this.apiKey = options.apiKey;
    this.model = options.model;
    this.pricing = options.pricing;
    this.schema = options.schema;
    this.prompt = options.prompt;
    this.imageDetail = options.imageDetail ?? "high";
    this.appUrl = options.appUrl ?? "http://localhost";
    this.appName = options.appName ?? "Akilli Alisveris Asistani Sprint-00";
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  public async extractRegion(options: ExtractRegionOptions): Promise<RegionExtractionResult> {
    const { sourceImage, region } = options;
    const started = performance.now();

    let cropBytes: Buffer;
    try {
      cropBytes = await sharp(sourceImage)
        .extract({
          left: region.left,
          top: region.top,
          width: region.width,
          height: region.height,
        })
        .png()
        .toBuffer();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new ExtractionError(`Image crop failed: ${message}`, region.id);
    }

    let response: Response;
    try {
      response = await this.fetchImpl("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": this.appUrl,
          "X-OpenRouter-Title": this.appName,
        },
        body: JSON.stringify({
          model: this.model,
          stream: false,
          messages: [
            { role: "system", content: this.prompt },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `This is region ${region.id} (left=${region.left}, top=${region.top}, ${region.width}x${region.height}px) of a 2x2 brochure grid. Extract every complete, separately priced product visibly present in this region. Do not infer content cut by an edge.`,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/png;base64,${cropBytes.toString("base64")}`,
                    detail: this.imageDetail,
                  },
                },
              ],
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: { name: "catalog_extraction", strict: true, schema: this.schema },
          },
        }),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new ExtractionError(`OpenRouter request failed: ${message}`, region.id);
    }

    const latencyMs = Math.round(performance.now() - started);
    const body: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      const detail = JSON.stringify(body);
      throw new ExtractionError(
        `OpenRouter request failed (${response.status}): ${detail}`,
        region.id,
        response.status,
      );
    }

    const parsed = body as {
      choices?: ReadonlyArray<{ message?: { content?: string } }>;
      usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        prompt_tokens_details?: { cached_tokens?: number };
        cost?: number;
      };
    };

    const outputText = parsed.choices?.[0]?.message?.content;
    if (typeof outputText !== "string" || outputText.trim().length === 0) {
      throw new ExtractionError(`No text content returned for region ${region.id}`, region.id);
    }

    let extraction: ExtractionOutput;
    try {
      extraction = JSON.parse(outputText) as ExtractionOutput;
    } catch {
      throw new ExtractionError(`Model returned invalid JSON for region ${region.id}`, region.id);
    }

    if (!extraction || typeof extraction !== "object" || !Array.isArray(extraction.products)) {
      throw new ExtractionError(`Model output violates the extraction schema for region ${region.id}`, region.id);
    }

    const usage = parsed.usage ?? {};
    const inputTokens = usage.prompt_tokens ?? 0;
    const cachedTokens = usage.prompt_tokens_details?.cached_tokens ?? 0;
    const outputTokens = usage.completion_tokens ?? 0;
    const uncachedTokens = Math.max(0, inputTokens - cachedTokens);

    const calculatedCostUsd =
      (uncachedTokens * readPricingValue(this.pricing.input_usd_per_million) +
        cachedTokens * readPricingValue(this.pricing.cached_input_usd_per_million) +
        outputTokens * readPricingValue(this.pricing.output_usd_per_million)) /
      1_000_000;

    const reportedCostUsd = Number(usage.cost);
    const costUsd = Number.isFinite(reportedCostUsd) ? reportedCostUsd : calculatedCostUsd;

    return {
      region,
      products: extraction.products,
      usage: {
        input_tokens: inputTokens,
        cached_input_tokens: cachedTokens,
        output_tokens: outputTokens,
        total_tokens: inputTokens + outputTokens,
        cost_usd: costUsd,
      },
      latency_ms: latencyMs,
    };
  }
}
