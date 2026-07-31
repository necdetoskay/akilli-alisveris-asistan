# Coding Agent Prompt — Sprint 00 MVP Vertical Slice

Implement Sprint 00 in `akilli-alisveris-asistan`.

Read first:

- `docs/sprints/SPRINT-00-MVP-VERTICAL-SLICE.md`
- `docs/guides/SPRINT-00-E2E-IMPLEMENTATION-GUIDE.md`

## Mission

Build the first production-oriented vertical slice for BİM and A101 brochure ingestion, immutable source storage, database-backed dashboard sections and role-aware uploads.

Do not productionize AI extraction in this sprint.

## Mandatory behavior

- Preserve all existing POC scripts and fixtures.
- Inspect existing migrations before adding new ones.
- Extend repository conventions instead of replacing them.
- Keep original brochure assets immutable.
- Use SHA-256 duplicate detection.
- Seed BİM and A101.
- Support admin upload, user upload and web source records.
- Build current, upcoming, expiring-soon and recent dashboard sections.
- Dashboard data must come from PostgreSQL.
- Product focus/bounding boxes are not required.
- Add DB and storage health/readiness.
- Add unit, integration and E2E tests from the sprint spec.

## Order

1. Repository inspection
2. Gap report
3. Migration
4. Seed
5. Storage abstraction
6. Upload and ingestion
7. Duplicate detection
8. Queue/job persistence
9. Dashboard queries
10. Dashboard UI
11. Brochure detail/source view
12. Web source management foundation
13. Tests
14. Guide verification
15. Final report

## Safety

- Never print secrets.
- Never embed API keys.
- Never overwrite original assets.
- Never publish if storage failed.
- Never silently discard duplicate submissions.
- Never use hard-coded dashboard arrays after DB integration.

## Final report

Return:

- files changed
- migration summary
- architecture decisions
- commands run
- tests passed/failed
- demo steps
- known limitations
- next sprint prerequisites

Do not commit unless explicitly instructed.
