import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "schemas/catalog-extraction.schema.json",
  "config/poc-01/models.json",
  "config/poc-01/extraction-prompt.txt",
  "fixtures/poc-01/images/bim-2026-08-04-gida.png",
  "fixtures/poc-01/images/bim-2026-08-05-aktuel.png",
  "fixtures/poc-01/expected/bim-2026-08-04-gida.expected.json",
  "fixtures/poc-01/expected/bim-2026-08-05-aktuel.expected.json"
];

for (const relative of required) {
  await access(path.join(root, relative), constants.R_OK);
}

for (const relative of required.filter((item) => item.endsWith(".json"))) {
  JSON.parse(await readFile(path.join(root, relative), "utf8"));
}

console.log("POC-01 fixtures and configuration are valid.");
