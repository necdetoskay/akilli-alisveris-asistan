# ADR-0007: PostgreSQL as Primary Operational Database

## Status

Accepted

## Context

The system requires transactional consistency, relational catalog modeling, append-only commercial history, full-text search, trigram similarity, structured filtering and semantic vector search.

## Decision

PostgreSQL will be the primary operational database.

The initial platform will use:

- relational tables for canonical data,
- JSONB only where schema flexibility is justified,
- PostgreSQL full-text search,
- `pg_trgm`,
- `pgvector`,
- transactional outbox,
- ordinary SQL migrations.

## Consequences

Benefits:

- one operational data platform,
- strong constraints and transactions,
- simpler deployment,
- native hybrid search foundation,
- easier consistency between catalog and offers.

Trade-offs:

- PostgreSQL must serve multiple workloads,
- vector and search indexes require tuning,
- high-volume history may later need partitioning,
- specialized search infrastructure may still be introduced when evidence justifies it.
