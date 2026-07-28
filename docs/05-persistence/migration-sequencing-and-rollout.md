# Migration Sequencing and Rollout

## Migration principles

- migrations are immutable after release,
- each migration has one bounded purpose,
- destructive changes use expand-and-contract,
- data migrations are restartable,
- application and schema compatibility overlap during rollout.

## Initial migration order

### Migration 001 — Extensions and schemas

- create PostgreSQL extensions,
- create logical schemas.

### Migration 002 — Reference entities

- brands,
- categories,
- attribute definitions,
- category attribute bindings.

### Migration 003 — Canonical catalog

- products,
- product variants,
- variant attribute values.

### Migration 004 — Retailer source model

- retailers,
- stores,
- listings.

### Migration 005 — Offers and history

- offers,
- price observations,
- availability observations,
- unit-price calculations.

### Migration 006 — Search projections

- product search documents,
- query aliases,
- search indexes.

### Migration 007 — Matching

- candidates,
- decisions,
- evidence,
- manual reviews.

### Migration 008 — Ingestion and outbox

- scrape runs,
- source observations,
- quarantine,
- outbox events.

## Expand-and-contract example

To rename or replace a live column:

1. add the new column,
2. write both old and new columns,
3. backfill,
4. switch reads,
5. stop writing the old column,
6. remove it in a later release.
