import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const model = process.env.POC01_MODEL ?? "openai/gpt-4o-mini";
const artifactModel = model.replaceAll("/", "__");
const resultDir = path.join(root, ".artifacts", "poc-01", artifactModel);
const mode = process.env.POC01_EVALUATION_MODE ?? "latest";
const allFiles = (await readdir(resultDir)).filter((name) => name.endsWith(".result.json"));
if (allFiles.length === 0) throw new Error(`No benchmark results found in ${resultDir}`);

const candidates = [];
for (const file of allFiles) {
  const result = JSON.parse(await readFile(path.join(resultDir, file), "utf8"));
  const isRegional = file.endsWith(".regional.result.json");
  if (mode === "regional" && !isRegional) continue;
  if (mode === "full" && isRegional) continue;
  candidates.push({ file, result, isRegional });
}
if (candidates.length === 0) throw new Error(`No ${mode} benchmark results found in ${resultDir}`);

const selectedByFixture = new Map();
for (const candidate of candidates) {
  const current = selectedByFixture.get(candidate.result.fixture_id);
  if (!current || (mode === "latest" && candidate.isRegional && !current.isRegional)) {
    selectedByFixture.set(candidate.result.fixture_id, candidate);
  }
}
const selected = [...selectedByFixture.values()];

const normalize = (value) => String(value ?? "").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const samePrice = (a, b) => Number(a) === Number(b);

const reports = [];
for (const { file, result } of selected) {
  const expected = JSON.parse(await readFile(path.join(root, "fixtures/poc-01/expected", `${result.fixture_id}.expected.json`), "utf8"));
  const predicted = result.extraction.products;
  const used = new Set();
  let matched = 0;
  let exactPrice = 0;

  for (const item of expected.products) {
    const index = predicted.findIndex((candidate, candidateIndex) =>
      !used.has(candidateIndex) &&
      (normalize(candidate.product_name) === normalize(item.product_name) ||
       normalize(candidate.product_name).includes(normalize(item.product_name)) ||
       normalize(item.product_name).includes(normalize(candidate.product_name)))
    );
    if (index >= 0) {
      used.add(index);
      matched += 1;
      if (samePrice(predicted[index].price.current, item.price.current)) exactPrice += 1;
    }
  }

  const falsePositives = predicted.length - used.size;
  reports.push({
    fixture_id: result.fixture_id,
    source_file: file,
    expected_products: expected.products.length,
    predicted_products: predicted.length,
    matched_products: matched,
    exact_price_matches: exactPrice,
    false_positives: falsePositives,
    product_recall: Number((matched / expected.products.length).toFixed(4)),
    exact_price_accuracy: matched ? Number((exactPrice / matched).toFixed(4)) : 0,
    hallucination_rate: predicted.length ? Number((falsePositives / predicted.length).toFixed(4)) : 0,
    cost_usd: result.cost.usd,
    cost_try: result.cost.try,
    latency_ms: result.latency_ms
  });
}

const summary = {
  model,
  evaluation_mode: mode,
  generated_at: new Date().toISOString(),
  reports,
  totals: {
    pages: reports.length,
    expected_products: reports.reduce((sum, item) => sum + item.expected_products, 0),
    matched_products: reports.reduce((sum, item) => sum + item.matched_products, 0),
    exact_price_matches: reports.reduce((sum, item) => sum + item.exact_price_matches, 0),
    cost_usd: Number(reports.reduce((sum, item) => sum + item.cost_usd, 0).toFixed(8)),
    cost_try: reports.every((item) => item.cost_try !== null)
      ? Number(reports.reduce((sum, item) => sum + item.cost_try, 0).toFixed(4))
      : null
  }
};

await mkdir(resultDir, { recursive: true });
await writeFile(path.join(resultDir, "evaluation.json"), JSON.stringify(summary, null, 2) + "\n");
console.log(JSON.stringify(summary, null, 2));
