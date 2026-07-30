import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";
import sharp from "sharp";

const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) throw new Error("OPENROUTER_API_KEY is required.");

const model = process.env.POC01_MODEL ?? "openai/gpt-4o-mini";
const detail = process.env.POC01_IMAGE_DETAIL ?? "high";
const selectedFixture = process.env.POC01_FIXTURE ?? "bim-2026-08-04-gida";
const usdTry = Number(process.env.POC01_USD_TRY ?? "0");
const appUrl = process.env.OPENROUTER_APP_URL ?? "http://localhost";
const appName = process.env.OPENROUTER_APP_NAME ?? "Akilli Alisveris Asistani POC-01 Regional";
const columns = Number(process.env.POC01_REGION_COLUMNS ?? "2");
const rows = Number(process.env.POC01_REGION_ROWS ?? "3");
const overlapRatio = Number(process.env.POC01_REGION_OVERLAP ?? "0.10");

if (!Number.isInteger(columns) || columns < 1 || !Number.isInteger(rows) || rows < 1) {
  throw new Error("POC01_REGION_COLUMNS and POC01_REGION_ROWS must be positive integers.");
}
if (!Number.isFinite(overlapRatio) || overlapRatio < 0 || overlapRatio >= 0.4) {
  throw new Error("POC01_REGION_OVERLAP must be between 0 and 0.4.");
}

const root = process.cwd();
const fixtures = [
  { id: "bim-2026-08-04-gida", image: "fixtures/poc-01/images/bim-2026-08-04-gida.png" },
  { id: "bim-2026-08-05-aktuel", image: "fixtures/poc-01/images/bim-2026-08-05-aktuel.png" }
];
const fixture = fixtures.find((item) => item.id === selectedFixture);
if (!fixture) throw new Error(`Unknown POC01_FIXTURE: ${selectedFixture}`);

const readJson = async (file) => JSON.parse((await readFile(file, "utf8")).replace(/^\uFEFF/, ""));
const schema = await readJson(path.join(root, "schemas/catalog-extraction.schema.json"));
const prompt = await readFile(path.join(root, "config/poc-01/extraction-prompt.txt"), "utf8");
const pricing = (await readJson(path.join(root, "config/poc-01/models.json"))).models[model];
if (!pricing) throw new Error(`No pricing configuration for model: ${model}`);

const artifactModel = model.replaceAll("/", "__");
const artifacts = path.join(root, ".artifacts", "poc-01", artifactModel);
const regionDir = path.join(artifacts, `${fixture.id}.regions`);
await rm(regionDir, { recursive: true, force: true });
await mkdir(regionDir, { recursive: true });

const sourcePath = path.join(root, fixture.image);
const metadata = await sharp(sourcePath).metadata();
if (!metadata.width || !metadata.height) throw new Error(`Unable to read image dimensions: ${sourcePath}`);

const normalize = (value) => String(value ?? "")
  .toLocaleLowerCase("tr-TR")
  .replace(/[^\p{L}\p{N}]+/gu, " ")
  .trim();
const productKey = (product) => [
  normalize(product.brand), normalize(product.product_name), normalize(product.variant),
  Number(product.price?.current ?? -1).toFixed(2)
].join("|");

const regions = [];
const cellWidth = metadata.width / columns;
const cellHeight = metadata.height / rows;
const overlapX = Math.round(cellWidth * overlapRatio);
const overlapY = Math.round(cellHeight * overlapRatio);
for (let row = 0; row < rows; row += 1) {
  for (let column = 0; column < columns; column += 1) {
    const left = Math.max(0, Math.floor(column * cellWidth) - overlapX);
    const top = Math.max(0, Math.floor(row * cellHeight) - overlapY);
    const right = Math.min(metadata.width, Math.ceil((column + 1) * cellWidth) + overlapX);
    const bottom = Math.min(metadata.height, Math.ceil((row + 1) * cellHeight) + overlapY);
    regions.push({ id: `r${row + 1}c${column + 1}`, left, top, width: right - left, height: bottom - top });
  }
}

const mergedProducts = new Map();
const regionReports = [];
let catalog = null;
let totalLatency = 0;
let totalInputTokens = 0;
let totalCachedTokens = 0;
let totalOutputTokens = 0;
let totalCostUsd = 0;

for (const region of regions) {
  const cropBytes = await sharp(sourcePath)
    .extract({ left: region.left, top: region.top, width: region.width, height: region.height })
    .png().toBuffer();
  await writeFile(path.join(regionDir, `${region.id}.png`), cropBytes);
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
        { role: "user", content: [
          { type: "text", text: `This is region ${region.id} of a ${rows}x${columns} brochure grid. Extract every complete, separately priced product visible in this region. Do not infer content cut by an edge.` },
          { type: "image_url", image_url: { url: `data:image/png;base64,${cropBytes.toString("base64")}`, detail } }
        ] }
      ],
      response_format: { type: "json_schema", json_schema: { name: "catalog_extraction", strict: true, schema } }
    })
  });
  const body = await response.json();
  if (!response.ok) throw new Error(`OpenRouter request failed for ${region.id} (${response.status}): ${JSON.stringify(body)}`);
  const outputText = body.choices?.[0]?.message?.content;
  if (typeof outputText !== "string" || outputText.trim().length === 0) throw new Error(`No text content returned for ${region.id}`);

  const extraction = JSON.parse(outputText);
  catalog ??= extraction.catalog;
  const usage = body.usage ?? {};
  const inputTokens = usage.prompt_tokens ?? 0;
  const cachedTokens = usage.prompt_tokens_details?.cached_tokens ?? 0;
  const outputTokens = usage.completion_tokens ?? 0;
  const uncachedTokens = Math.max(0, inputTokens - cachedTokens);
  const calculatedCostUsd = (uncachedTokens * pricing.input_usd_per_million + cachedTokens * pricing.cached_input_usd_per_million + outputTokens * pricing.output_usd_per_million) / 1_000_000;
  const reportedCostUsd = Number(usage.cost);
  const costUsd = Number.isFinite(reportedCostUsd) ? reportedCostUsd : calculatedCostUsd;
  const latencyMs = Math.round(performance.now() - started);

  totalLatency += latencyMs;
  totalInputTokens += inputTokens;
  totalCachedTokens += cachedTokens;
  totalOutputTokens += outputTokens;
  totalCostUsd += costUsd;
  for (const product of extraction.products) {
    const key = productKey(product);
    const existing = mergedProducts.get(key);
    if (!existing || Number(product.confidence ?? 0) > Number(existing.confidence ?? 0)) mergedProducts.set(key, product);
  }
  regionReports.push({ region: region.id, bounds: region, products: extraction.products.length, latency_ms: latencyMs, cost_usd: Number(costUsd.toFixed(8)) });
  console.log(`${region.id}: ${extraction.products.length} products, $${costUsd.toFixed(8)}, ${latencyMs} ms`);
}

const products = [...mergedProducts.values()];
const result = {
  fixture_id: fixture.id,
  benchmark_mode: "regional-grid",
  provider: "openrouter",
  model_requested: model,
  detail,
  grid: { columns, rows, overlap_ratio: overlapRatio, regions: regionReports },
  latency_ms: totalLatency,
  usage: { input_tokens: totalInputTokens, cached_input_tokens: totalCachedTokens, output_tokens: totalOutputTokens, total_tokens: totalInputTokens + totalOutputTokens },
  cost: { usd: Number(totalCostUsd.toFixed(8)), source: "regional_sum", try: usdTry > 0 ? Number((totalCostUsd * usdTry).toFixed(4)) : null, usd_try_rate: usdTry > 0 ? usdTry : null },
  extraction: { catalog, products }
};
const resultPath = path.join(artifacts, `${fixture.id}.regional.result.json`);
await writeFile(resultPath, JSON.stringify(result, null, 2) + "\n");
console.log(`Merged: ${products.length} unique products, $${result.cost.usd}, ${totalLatency} ms`);
console.log(`Result: ${resultPath}`);
