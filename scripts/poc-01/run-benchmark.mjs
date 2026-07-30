import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) throw new Error("OPENAI_API_KEY is required.");

const model = process.env.POC01_MODEL ?? "gpt-4o-mini-2024-07-18";
const detail = process.env.POC01_IMAGE_DETAIL ?? "high";
const selectedFixture = process.env.POC01_FIXTURE ?? "all";
const usdTry = Number(process.env.POC01_USD_TRY ?? "0");

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

const artifacts = path.join(root, ".artifacts", "poc-01", model);
await mkdir(artifacts, { recursive: true });

for (const fixture of fixtures) {
  const bytes = await readFile(path.join(root, fixture.image));
  const imageUrl = `data:image/png;base64,${bytes.toString("base64")}`;
  const started = performance.now();

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      store: false,
      instructions: prompt,
      input: [{
        role: "user",
        content: [
          { type: "input_text", text: "Extract all separately priced products from this brochure page." },
          { type: "input_image", image_url: imageUrl, detail }
        ]
      }],
      text: {
        format: {
          type: "json_schema",
          name: "catalog_extraction",
          description: "Structured extraction of products and prices from a Turkish retail brochure.",
          strict: true,
          schema
        }
      }
    })
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(`OpenAI request failed (${response.status}): ${JSON.stringify(body)}`);
  }

  const outputText = body.output
    ?.flatMap((item) => item.content ?? [])
    .find((item) => item.type === "output_text")?.text;
  if (!outputText) throw new Error(`No output_text returned for ${fixture.id}`);

  const extraction = JSON.parse(outputText);
  const usage = body.usage ?? {};
  const inputTokens = usage.input_tokens ?? 0;
  const cachedTokens = usage.input_tokens_details?.cached_tokens ?? 0;
  const uncachedTokens = Math.max(0, inputTokens - cachedTokens);
  const outputTokens = usage.output_tokens ?? 0;
  const costUsd =
    (uncachedTokens * pricing.input_usd_per_million +
      cachedTokens * pricing.cached_input_usd_per_million +
      outputTokens * pricing.output_usd_per_million) / 1_000_000;

  const result = {
    fixture_id: fixture.id,
    model,
    detail,
    response_id: body.id,
    latency_ms: Math.round(performance.now() - started),
    usage: {
      input_tokens: inputTokens,
      cached_input_tokens: cachedTokens,
      output_tokens: outputTokens,
      total_tokens: usage.total_tokens ?? inputTokens + outputTokens
    },
    cost: {
      usd: Number(costUsd.toFixed(8)),
      try: usdTry > 0 ? Number((costUsd * usdTry).toFixed(4)) : null,
      usd_try_rate: usdTry > 0 ? usdTry : null
    },
    extraction
  };

  await writeFile(path.join(artifacts, `${fixture.id}.result.json`), JSON.stringify(result, null, 2) + "\n");
  console.log(`${fixture.id}: ${extraction.products.length} products, $${result.cost.usd}, ${result.latency_ms} ms`);
}
