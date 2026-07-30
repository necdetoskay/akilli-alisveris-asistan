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

The second benchmark iteration divides each brochure page into a 2x3 grid with 10% overlap, extracts each region independently with the same OpenRouter model and strict schema, and merges exact duplicate product records. This tests whether increased local resolution improves recall without moving to an expensive model.

Decision targets:

- product recall >= 0.85
- exact price accuracy >= 0.95
- hallucination rate <= 0.05
- total cost <= 1.00 TRY per page
