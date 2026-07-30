import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const model = process.env.POC01_MODEL ?? "gpt-4o-mini-2024-07-18";
const resultDir = path.join(root, ".artifacts", "poc-01", model);
const files = (await readdir(resultDir)).filter((name) => name.endsWith(".result.json"));
if (files.length === 0) throw new Error(`No benchmark results found in ${resultDir}`);

const normalize = (value) => String(value ?? "").toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const samePrice = (a, b) => Number(a) === Number(b);

const reports = [];
for (const file of files) {
  const result = JSON.parse(await readFile(path.join(resultDir, file), "utf8"));
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
