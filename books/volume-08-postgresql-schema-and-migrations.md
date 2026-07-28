# Volume 08 — PostgreSQL Physical Schema and Migration Strategy

This volume translates the canonical domain model into a concrete PostgreSQL design.

---

## 1. Logical namespaces

The database is divided into logical schemas:

```text
core
catalog
retailer
commerce
search
matching
ingestion
audit
```

Each schema owns a bounded group of tables.

---

## 2. Catalog persistence

The catalog stores brands, categories, products, variants, attribute definitions and typed attribute values.

Critical searchable attributes are relationally visible rather than hidden only in JSON.

---

## 3. Retailer and offer persistence

Retailer listings remain separate from canonical products.

Offers store current commercial terms, while append-only observation tables preserve price and availability history.

---

## 4. Search persistence

PostgreSQL provides:

- full-text search,
- trigram similarity,
- unaccented normalization,
- vector similarity through `pgvector`.

Search documents are derived projections rather than the source of truth.

---

## 5. Matching persistence

Candidate scores, decisions, evidence and manual-review records are stored separately.

The active listing-to-variant link is a projection of the latest accepted decision.

---

## 6. Constraints and indexes

Database constraints protect stable invariants.

Indexes are introduced for confirmed access patterns, while partitioning is deferred until operational metrics justify it.

---

## 7. Migration strategy

Migrations are immutable and ordered.

The initial sequence creates extensions and schemas first, then reference data, canonical catalog, retailer entities, offers, history, search, matching and ingestion infrastructure.

Destructive changes use expand-and-contract.

---

## 8. Seed strategy

Reference data is deterministic, idempotent and versioned.

Volatile prices, scraped listings and temporary-model embeddings are not treated as ordinary seed data.

---

## 9. Database decision

PostgreSQL is the primary operational database because it supports transactional catalog data, historical observations, structured filtering, full-text search, trigram similarity and vector search in one platform.
