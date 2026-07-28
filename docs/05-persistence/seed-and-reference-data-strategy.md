# Seed and Reference Data Strategy

## Seed categories

Initial seeds should include:

- application-required statuses,
- supported currencies,
- initial category taxonomy,
- category attribute definitions,
- normalized attribute vocabularies,
- known retailer records,
- carefully reviewed search aliases.

## Seed rules

Seeds must be:

- deterministic,
- idempotent,
- versioned,
- environment-safe,
- repeatable in local development and CI.

## Do not seed

Avoid seeding:

- volatile prices,
- scraped product listings,
- generated embeddings tied to a temporary model,
- large production-like datasets into every environment.

## Reference-data migrations

Stable reference data may be migration-backed.

Frequently changing operational configuration should use normal application tables and administration workflows.
