# POC-01 — Brochure Extraction and Real Cost Benchmark

## Goal

Prove that two representative BİM brochure pages can be converted into reliable structured product-price data before backend and frontend implementation begins.

## Scope

- Version the two supplied brochure images as benchmark fixtures.
- Define one strict extraction JSON schema.
- Create manually verified golden datasets.
- Run the OpenRouter Chat Completions API against each page.
- Record token usage, latency and calculated API cost.
- Evaluate product recall, exact price accuracy and hallucination rate.
- Keep model pricing configurable.

## Out of scope

- Production ingestion API
- Database persistence
- User interface
- Scraping and catalog discovery
- Automatic model fallback

## Commands

```powershell
pnpm test:poc01
pnpm poc01:verify

$env:OPENROUTER_API_KEY = "..."
$env:POC01_MODEL = "openai/gpt-4o-mini-2024-07-18"
$env:POC01_USD_TRY = "<test-day exchange rate>"
pnpm poc01:benchmark
pnpm poc01:evaluate
```

To test one page only:

```powershell
$env:POC01_FIXTURE = "bim-2026-08-04-gida"
pnpm poc01:benchmark
```

## Acceptance criteria

- Both fixtures and golden datasets are present and readable.
- The benchmark produces valid schema-conforming JSON.
- API usage, latency and USD cost are recorded per page.
- TL cost is recorded when `POC01_USD_TRY` is provided.
- Evaluation reports product recall, exact price accuracy and hallucination rate.
- Results are written under `.artifacts/poc-01/` and are not committed.
- No backend, frontend or production database feature is introduced.

## Decision gate

Do not start production ingestion until a benchmark run establishes:

- valid JSON rate: 100%
- product recall: at least 90%
- exact price accuracy: at least 97%
- hallucination rate: at most 1%

The golden datasets must be reviewed by a human before these thresholds are treated as final.

## Regional-grid iteration

The third benchmark iteration uses a 2x2 grid with 12% overlap to reduce API cost and duplicate detections. It merges regional candidates using product-name similarity, brand, quantity and price; discards candidates without a visible price; and marks conflicting duplicate prices for review.

Run it with:

```powershell
$env:POC01_REGION_COLUMNS = "2"
$env:POC01_REGION_ROWS = "2"
$env:POC01_REGION_OVERLAP = "0.12"
$env:POC01_DEDUP_THRESHOLD = "0.72"
pnpm poc01:benchmark:regional
$env:POC01_EVALUATION_MODE = "regional"
pnpm poc01:evaluate
```

The evaluator selects one result per fixture, preventing the same regional result from being counted twice when both copied and regional result files exist.

Decision targets:

- product recall >= 0.85
- exact price accuracy >= 0.95
- hallucination rate <= 0.05
- total cost <= 1.00 TRY per page
