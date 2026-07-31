import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";
import sharp from "sharp";

const root = process.cwd();
const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) throw new Error("OPENROUTER_API_KEY is required.");

const detectionModel = process.env.POC01_DETECTION_MODEL ?? "openai/gpt-4.1-mini";
const extractionModel = process.env.POC01_EXTRACTION_MODEL ?? "openai/gpt-4.1-mini";
const fixtureId = process.env.POC01_FIXTURE ?? "bim-2026-08-04-gida";
const detail = process.env.POC01_IMAGE_DETAIL ?? "high";
const batchSize = Number(process.env.POC01_CROP_BATCH_SIZE ?? "4");
const minConfidence = Number(process.env.POC01_DETECTION_MIN_CONFIDENCE ?? "0.35");
const cropPadding = Number(process.env.POC01_CROP_PADDING ?? "0.04");
const usdTry = Number(process.env.POC01_USD_TRY ?? "0");

if (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > 9) throw new Error("POC01_CROP_BATCH_SIZE must be 1..9.");

const fixtures = {
  "bim-2026-08-04-gida": "fixtures/poc-01/images/bim-2026-08-04-gida.png",
  "bim-2026-08-05-aktuel": "fixtures/poc-01/images/bim-2026-08-05-aktuel.png"
};
const fixtureImage = fixtures[fixtureId];
if (!fixtureImage) throw new Error(`Unknown fixture: ${fixtureId}`);

const readJson = async (file) => JSON.parse((await readFile(file, "utf8")).replace(/^\uFEFF/, ""));
const detectionSchema = await readJson(path.join(root, "schemas/product-offer-detection-v2.schema.json"));
const catalogSchema = await readJson(path.join(root, "schemas/catalog-extraction.schema.json"));
const detectionPrompt = await readFile(path.join(root, "config/poc-01/detection-v2-prompt.txt"), "utf8");
const extractionPrompt = await readFile(path.join(root, "config/poc-01/batch-extraction-v2-prompt.txt"), "utf8");

const artifactKey = `${detectionModel}__${extractionModel}`.replaceAll("/", "__");
const artifactDir = path.join(root, ".artifacts", "poc-01", artifactKey);
const cropDir = path.join(artifactDir, `${fixtureId}.detected-crops-v2`);
const sheetDir = path.join(artifactDir, `${fixtureId}.contact-sheets-v2`);
await rm(cropDir, { recursive: true, force: true });
await rm(sheetDir, { recursive: true, force: true });
await mkdir(cropDir, { recursive: true });
await mkdir(sheetDir, { recursive: true });

const sourceBytes = await readFile(path.join(root, fixtureImage));
const metadata = await sharp(sourceBytes).metadata();
if (!metadata.width || !metadata.height) throw new Error("Image dimensions could not be read.");

const callModel = async ({ model, messages, schema, schemaName }) => {
  const started = performance.now();
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.OPENROUTER_APP_URL ?? "http://localhost",
      "X-OpenRouter-Title": process.env.OPENROUTER_APP_NAME ?? "Akilli Alisveris Asistani POC-01"
    },
    body: JSON.stringify({
      model,
      stream: false,
      messages,
      response_format: { type: "json_schema", json_schema: { name: schemaName, strict: true, schema } }
    })
  });
  const body = await response.json();
  if (!response.ok) throw new Error(`OpenRouter ${schemaName} failed (${response.status}): ${JSON.stringify(body)}`);
  const content = body.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) throw new Error(`No content returned for ${schemaName}.`);
  return {
    data: JSON.parse(content),
    usage: body.usage ?? {},
    latency_ms: Math.round(performance.now() - started),
    response_id: body.id ?? null,
    resolved_model: body.model ?? null
  };
};

const usageCost = (usage) => {
  const cost = Number(usage?.cost);
  return Number.isFinite(cost) ? cost : 0;
};

const detection = await callModel({
  model: detectionModel,
  schema: detectionSchema,
  schemaName: "product_offer_detection_v2",
  messages: [
    { role: "system", content: detectionPrompt },
    { role: "user", content: [
      { type: "text", text: "Detect every separately priced product offer block." },
      { type: "image_url", image_url: { url: `data:image/png;base64,${sourceBytes.toString("base64")}`, detail } }
    ] }
  ]
});

const iou = (a, b) => {
  const l = Math.max(a.x_min, b.x_min), t = Math.max(a.y_min, b.y_min);
  const r = Math.min(a.x_max, b.x_max), bt = Math.min(a.y_max, b.y_max);
  const inter = Math.max(0, r - l) * Math.max(0, bt - t);
  const areaA = Math.max(0, a.x_max - a.x_min) * Math.max(0, a.y_max - a.y_min);
  const areaB = Math.max(0, b.x_max - b.x_min) * Math.max(0, b.y_max - b.y_min);
  return inter / Math.max(1, areaA + areaB - inter);
};

const valid = detection.data.offers
  .filter(b => b.confidence >= minConfidence && b.x_max > b.x_min && b.y_max > b.y_min)
  .sort((a,b) => b.confidence - a.confidence);

const boxes = [];
for (const box of valid) if (!boxes.some(kept => iou(box, kept) >= 0.55)) boxes.push(box);
boxes.sort((a,b) => a.y_min - b.y_min || a.x_min - b.x_min);

const crops = [];
for (let i = 0; i < boxes.length; i++) {
  const b = boxes[i];
  const rawLeft = b.x_min / 1000 * metadata.width;
  const rawTop = b.y_min / 1000 * metadata.height;
  const rawRight = b.x_max / 1000 * metadata.width;
  const rawBottom = b.y_max / 1000 * metadata.height;
  const padX = (rawRight - rawLeft) * cropPadding;
  const padY = (rawBottom - rawTop) * cropPadding;
  const left = Math.max(0, Math.floor(rawLeft - padX));
  const top = Math.max(0, Math.floor(rawTop - padY));
  const right = Math.min(metadata.width, Math.ceil(rawRight + padX));
  const bottom = Math.min(metadata.height, Math.ceil(rawBottom + padY));
  const cropId = `offer-${String(i + 1).padStart(3, "0")}`;
  const bytes = await sharp(sourceBytes).extract({ left, top, width: right-left, height: bottom-top }).png().toBuffer();
  await writeFile(path.join(cropDir, `${cropId}.png`), bytes);
  crops.push({ cropId, bytes, bounds:{left,top,width:right-left,height:bottom-top}, confidence:b.confidence });
}

const productItem = structuredClone(catalogSchema.properties.products.items);
productItem.properties = { crop_id: { type: "string", minLength: 1 }, ...productItem.properties };
productItem.required = ["crop_id", ...productItem.required];
const batchSchema = {
  type: "object",
  additionalProperties: false,
  required: ["products"],
  properties: { products: { type: "array", items: productItem } }
};

const makeCell = async (crop) => {
  const width=512, height=512, header=44;
  const img = await sharp(crop.bytes).resize(width-20, height-header-20, {fit:"contain",background:"white"}).png().toBuffer();
  const label = Buffer.from(`<svg width="${width}" height="${header}"><rect width="100%" height="100%" fill="white"/><text x="12" y="31" font-family="Arial" font-size="26" font-weight="bold">${crop.cropId}</text></svg>`);
  return sharp({create:{width,height,channels:3,background:"white"}}).composite([{input:label,left:0,top:0},{input:img,gravity:"south"}]).png().toBuffer();
};

const byCrop = new Map();
const batches = [];
let totalCost = usageCost(detection.usage);
let totalLatency = detection.latency_ms;
let inputTokens = detection.usage.prompt_tokens ?? 0;
let outputTokens = detection.usage.completion_tokens ?? 0;

for (let start=0; start<crops.length; start+=batchSize) {
  const batch = crops.slice(start,start+batchSize);
  const cols = Math.ceil(Math.sqrt(batch.length));
  const rows = Math.ceil(batch.length/cols);
  const cells = await Promise.all(batch.map(makeCell));
  const sheet = await sharp({create:{width:cols*512,height:rows*512,channels:3,background:"white"}})
    .composite(cells.map((input,i)=>({input,left:(i%cols)*512,top:Math.floor(i/cols)*512}))).png().toBuffer();
  const batchId = `batch-${String(start/batchSize+1).padStart(2,"0")}`;
  await writeFile(path.join(sheetDir, `${batchId}.png`), sheet);
  const extraction = await callModel({
    model: extractionModel,
    schema: batchSchema,
    schemaName: "batch_product_extraction_v2",
    messages: [
      { role: "system", content: extractionPrompt },
      { role: "user", content: [
        { type: "text", text: `Return exactly one product for: ${batch.map(x=>x.cropId).join(", ")}` },
        { type: "image_url", image_url: { url:`data:image/png;base64,${sheet.toString("base64")}`, detail } }
      ] }
    ]
  });
  for (const p of extraction.data.products) {
    if (batch.some(c=>c.cropId===p.crop_id) && !byCrop.has(p.crop_id)) byCrop.set(p.crop_id,p);
  }
  const cost=usageCost(extraction.usage);
  totalCost += cost; totalLatency += extraction.latency_ms;
  inputTokens += extraction.usage.prompt_tokens ?? 0;
  outputTokens += extraction.usage.completion_tokens ?? 0;
  batches.push({batch_id:batchId,crop_ids:batch.map(x=>x.cropId),returned_products:extraction.data.products.length,cost_usd:Number(cost.toFixed(8)),latency_ms:extraction.latency_ms});
  console.log(`${batchId}: ${extraction.data.products.length}/${batch.length}, $${cost.toFixed(8)}`);
}

const products = crops.map(c=>byCrop.get(c.cropId)).filter(Boolean).map(({crop_id,...p})=>p);
const missing = crops.filter(c=>!byCrop.has(c.cropId)).map(c=>c.cropId);

const result = {
  fixture_id: fixtureId,
  benchmark_mode: "detection-batch-v2",
  provider: "openrouter",
  detection_model_requested: detectionModel,
  extraction_model_requested: extractionModel,
  detail,
  detection: {
    raw_boxes: detection.data.offers.length,
    accepted_boxes: boxes.length,
    cost_usd: Number(usageCost(detection.usage).toFixed(8)),
    latency_ms: detection.latency_ms,
    boxes: crops.map(c=>({crop_id:c.cropId,bounds:c.bounds,detector_confidence:c.confidence}))
  },
  extraction_batches: {batch_size:batchSize,batches,missing_crop_ids:missing},
  latency_ms: totalLatency,
  usage: {input_tokens:inputTokens,output_tokens:outputTokens,total_tokens:inputTokens+outputTokens},
  cost: {usd:Number(totalCost.toFixed(8)),try:usdTry>0?Number((totalCost*usdTry).toFixed(4)):null,usd_try_rate:usdTry||null},
  extraction: {catalog:{retailer:null,campaign_name:null,valid_from:null,valid_until:null,source_page:null},products}
};
const resultPath = path.join(artifactDir, `${fixtureId}.detection-batch-v2.result.json`);
await writeFile(resultPath, JSON.stringify(result,null,2)+"\n");
console.log(`Detected ${boxes.length}; extracted ${products.length}; missing ${missing.length}; $${result.cost.usd}`);
console.log(resultPath);
