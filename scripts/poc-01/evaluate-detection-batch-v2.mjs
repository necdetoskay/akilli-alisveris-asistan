import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root=process.cwd();
const detectionModel=process.env.POC01_DETECTION_MODEL ?? "openai/gpt-4.1-mini";
const extractionModel=process.env.POC01_EXTRACTION_MODEL ?? "openai/gpt-4.1-mini";
const fixtureId=process.env.POC01_FIXTURE ?? "bim-2026-08-04-gida";
const artifactKey=`${detectionModel}__${extractionModel}`.replaceAll("/","__");
const dir=path.join(root,".artifacts","poc-01",artifactKey);
const resultPath=path.join(dir,`${fixtureId}.detection-batch-v2.result.json`);
const result=JSON.parse(await readFile(resultPath,"utf8"));
const expected=JSON.parse(await readFile(path.join(root,"fixtures/poc-01/expected",`${fixtureId}.expected.json`),"utf8"));

const normalize=v=>String(v??"").toLocaleLowerCase("tr-TR").normalize("NFD").replace(/\p{M}/gu,"").replace(/[^\p{L}\p{N}]+/gu," ").trim();
const predicted=result.extraction.products;
const used=new Set();
let matched=0, exactPrice=0;
for (const item of expected.products) {
  const target=normalize(item.product_name);
  const index=predicted.findIndex((candidate,i)=>{
    if (used.has(i)) return false;
    const name=normalize(candidate.product_name);
    return name===target || name.includes(target) || target.includes(name);
  });
  if (index>=0) {
    used.add(index); matched++;
    if (Number(predicted[index].price?.current)===Number(item.price?.current)) exactPrice++;
  }
}
const falsePositives=predicted.length-used.size;
const report={
  model:`${detectionModel} -> ${extractionModel}`,
  evaluation_mode:"detection-batch-v2",
  generated_at:new Date().toISOString(),
  reports:[{
    fixture_id:fixtureId,
    expected_products:expected.products.length,
    predicted_products:predicted.length,
    matched_products:matched,
    exact_price_matches:exactPrice,
    false_positives:falsePositives,
    product_recall:Number((matched/expected.products.length).toFixed(4)),
    exact_price_accuracy:matched?Number((exactPrice/matched).toFixed(4)):0,
    hallucination_rate:predicted.length?Number((falsePositives/predicted.length).toFixed(4)):0,
    detected_boxes:result.detection.accepted_boxes,
    detection_cost_usd:result.detection.cost_usd,
    cost_usd:result.cost.usd,
    cost_try:result.cost.try,
    latency_ms:result.latency_ms
  }]
};
await writeFile(path.join(dir,"evaluation-detection-batch-v2.json"),JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify(report,null,2));
