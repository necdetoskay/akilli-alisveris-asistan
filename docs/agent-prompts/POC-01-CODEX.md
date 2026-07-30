# Coding Agent Prompt — POC-01

You are implementing **POC-01 — Brochure Extraction and Real Cost Benchmark** in the Akıllı Alışveriş Asistanı repository.

Repository:

`E:\Projeler\ai-studio-projects\akilli-alisveris-asistan`

Patch:

`poc-01-brochure-extraction-benchmark.patch`

## Required procedure

1. Inspect `git status`, `package.json`, `.gitignore`, `docs/poc/POC-00.md`, and existing scripts.
2. Confirm POC-00 is already applied. Do not implement POC-02 or later features.
3. Apply the patch with `git apply --check --whitespace=error-all`, then `git apply`.
4. Preserve unrelated repository changes.
5. Run `pnpm test:poc01` and `pnpm poc01:verify`.
6. Review both golden datasets against the supplied images. Correct only demonstrable transcription mistakes; do not guess unreadable data.
7. Before an API run, confirm current OpenAI pricing. Update only `config/poc-01/models.json` when rates differ.
8. Ask the operator to provide `OPENAI_API_KEY` through the environment. Never print, commit or persist the key.
9. Run the benchmark first with `gpt-4o-mini-2024-07-18` unless that model is unavailable. Record the exact replacement model if changed.
10. Set `POC01_USD_TRY` to the test-day USD/TRY rate supplied or approved by the operator.
11. Run `pnpm poc01:benchmark` and `pnpm poc01:evaluate`.
12. Inspect `.artifacts/poc-01/<model>/evaluation.json`.
13. Do not claim success unless real API results exist.
14. Report changed files, exact commands, token usage, USD/TL cost per page, accuracy metrics, environmental limitations and unresolved errors.
15. Do not commit or push unless explicitly instructed.

Recommended commit message:

`test: add poc-01 brochure extraction benchmark`
