# Coding Agent Prompt — Sprint 00 Real Brochure Ingestion

Implement Sprint 00 in `akilli-alisveris-asistan`.

Read first:

- `docs/sprints/SPRINT-00-MVP-VERTICAL-SLICE.md`
- `docs/guides/SPRINT-00-E2E-IMPLEMENTATION-GUIDE.md`
- `docs/product/URUN-TANITIMI.md`

## Mission

Build the first real end-to-end vertical slice for BİM and A101.

Use `aktuel-urunler.com` as the initial discovery/content source, discover the active and nearest upcoming catalogues, download every catalogue page, preserve original images as immutable source evidence, extract products with `openai/gpt-4.1-mini` using the validated 2x2 regional pipeline, persist results to PostgreSQL and render real dashboard data.

Do not use seed products, seed catalogues or hard-coded dashboard arrays.

## Mandatory behavior

- Preserve all existing POC scripts and fixtures.
- Inspect existing migrations before adding new ones.
- Use real source ingestion.
- Treat one catalogue as one brochure and its images as brochure pages.
- Discover all pagination pages.
- Fail catalogue completeness when a page is missing.
- Keep original assets immutable.
- Use SHA-256 duplicate detection.
- Persist discovery source, content source and verification status separately.
- Publish first-version extracted records with `verification_status=extracted`.
- Use `openai/gpt-4.1-mini` through OpenRouter.
- Use the existing 2x2 regional extraction method.
- Do not use detection-first bounding boxes.
- Persist token usage and cost.
- Build current, upcoming, expiring-soon and recent dashboard sections.
- Dashboard data must come from PostgreSQL.
- Product focus/bounding boxes are not required.
- Support admin upload and user upload.
- Add health/readiness for DB and storage.
- Add unit, integration, edge, regression and E2E tests from the sprint spec.

## Implementation order

1. Repository inspection
2. Baseline POC regression
3. Existing migration analysis
4. Source HTML investigation and fixtures
5. Data model migration
6. Storage abstraction
7. A101 source adapter
8. BİM source adapter
9. Catalogue and pagination discovery
10. Image download and immutable storage
11. GPT-4.1 Mini 2x2 extraction integration
12. Product offer persistence
13. Dashboard queries
14. Dashboard UI
15. Brochure/source view
16. Admin upload
17. User upload and review flow
18. Queue and retry behavior
19. Tests
20. Guide verification
21. Final report

## Safety

- Never print secrets.
- Never embed API keys.
- Never overwrite original assets.
- Never mark an incomplete catalogue complete.
- Never publish if source storage failed.
- Never silently discard duplicate submissions.
- Never claim retailer verification when the data only came from a third-party catalogue site.
- Never claim stock availability.
- Never claim that prices apply in every store.
- Never use hard-coded dashboard arrays.
- Never bypass robots, authentication, paywalls or technical access controls.

## Required final report

Return:

- files changed
- base and final commit SHA
- migration summary
- source adapter decisions
- discovered brochure/page counts
- downloaded/duplicate counts
- extraction product counts
- review counts
- cost and token usage
- architecture decisions
- commands run
- tests passed
- tests failed
- demo steps
- known limitations
- next sprint prerequisites

Do not commit unless explicitly instructed.
