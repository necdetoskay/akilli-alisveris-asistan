import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";

const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) throw new Error("OPENROUTER_API_KEY is required.");

const model = process.env.POC01_MODEL ?? "openai/gpt-4o-mini-2024-07-18";
const detail = process.env.POC01_IMAGE_DETAIL ?? "high";
const selectedFixture = process.env.POC01_FIXTURE ?? "all";
const usdTry = Number(process.env.POC01_USD_TRY ?? "0");
const appUrl = process.env.OPENROUTER_APP_URL ?? "http://localhost";
const appName = process.env.OPENROUTER_APP_NAME ?? "Akilli Alisveris Asistani POC-01";

const root = process.cwd();
const fixtures = [
  { id: "bim-2026-08-04-gida", image: "fixtures/poc-01/images/bim-2026-08-04-gida.png" },
  { id: "bim-2026-08-05-aktuel", image: "fixtures/poc-01/images/bim-2026-08-05-aktuel.png" }
].filter((item) => selectedFixture === "all" || item.id === selectedFixture);

if (fixtures.length === 0) throw new Error(`Unknown POC01_FIXTURE: ${selectedFixture}`);

const schema = JSON.parse(await readFile(path.join(root, "schemas/catalog-extraction.schema.json"), "utf8"));
const prompt = await readFile(path.join(root, "config/poc-01/extraction-prompt.txt"), "utf8");
const pricing = JSON.parse(await readFile(path.join(root, "config/poc-01/models.json"), "utf8")).models[model];
if (!pricing) throw new Error(`No pricing configuration for model: ${model}`);

const artifacts = path.join(root, ".artifacts", "poc-01", model.replaceAll("/", "__"));
await mkdir(artifacts, { recursive: true });

for (const fixture of fixtures) {
  const bytes = await readFile(path.join(root, fixture.image));
  const imageUrl = `data:image/png;base64,${bytes.toString("base64")}`;
  const started = performance.now();

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": appUrl,
      "X-OpenRouter-Title": appName
    },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [
        { role: "system", content: prompt },
        {
          role: "user",
          content: [
            { type: "text", text: "Extract all separately priced products from this brochure page." },
            { type: "image_url", image_url: { url: imageUrl, detail } }
          ]
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "catalog_extraction",
          strict: true,
          schema
        }
      }
    })
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(`OpenRouter request failed (${response.status}): ${JSON.stringify(body)}`);
  }

  const outputText = body.choices?.[0]?.message?.content;
  if (typeof outputText !== "string" || outputText.trim().length === 0) {
    throw new Error(`No text content returned for ${fixture.id}`);
  }

  const extraction = JSON.parse(outputText);
  const usage = body.usage ?? {};
  const inputTokens = usage.prompt_tokens ?? 0;
  const cachedTokens = usage.prompt_tokens_details?.cached_tokens ?? 0;
  const uncachedTokens = Math.max(0, inputTokens - cachedTokens);
  const outputTokens = usage.completion_tokens ?? 0;
  const calculatedCostUsd =
    (uncachedTokens * pricing.input_usd_per_million +
      cachedTokens * pricing.cached_input_usd_per_million +
      outputTokens * pricing.output_usd_per_million) / 1_000_000;
  const reportedCostUsd = Number(usage.cost);
  const costUsd = Number.isFinite(reportedCostUsd) ? reportedCostUsd : calculatedCostUsd;

  const result = {
    fixture_id: fixture.id,
    provider: "openrouter",
    model_requested: model,
    model_resolved: body.model ?? null,
    detail,
    response_id: body.id,
    latency_ms: Math.round(performance.now() - started),
    usage: {
      input_tokens: inputTokens,
      cached_input_tokens: cachedTokens,
      output_tokens: outputTokens,
      total_tokens: usage.total_tokens ?? inputTokens + outputTokens,
      reported_cost_usd: Number.isFinite(reportedCostUsd) ? reportedCostUsd : null
    },
    cost: {
      usd: Number(costUsd.toFixed(8)),
      source: Number.isFinite(reportedCostUsd) ? "openrouter_usage" : "configured_token_rates",
      try: usdTry > 0 ? Number((costUsd * usdTry).toFixed(4)) : null,
      usd_try_rate: usdTry > 0 ? usdTry : null
    },
    extraction
  };

  await writeFile(path.join(artifacts, `${fixture.id}.result.json`), JSON.stringify(result, null, 2) + "\n");
  console.log(`${fixture.id}: ${extraction.products.length} products, $${result.cost.usd}, ${result.latency_ms} ms`);
}
