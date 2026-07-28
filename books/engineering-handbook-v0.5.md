# Engineering Handbook v0.5

## Included volumes

1. Governance
2. Product Vision
3. Proof of Concept
4. Domain
5. System Architecture
6. Hybrid Semantic Search
7. Product Catalog and Canonical Data Model
8. PostgreSQL Physical Schema and Migration Strategy

---

# Volume 08 — PostgreSQL Physical Schema and Migration Strategy

PostgreSQL is the primary operational database.

The physical design separates catalog, retailer, commerce, search, matching, ingestion and audit responsibilities through logical schemas.

Canonical catalog data remains relational and strongly constrained.

Retailer offers and append-only observations preserve current commercial state and history.

Hybrid search uses PostgreSQL full-text search, trigram similarity, structured attributes and `pgvector`.

Migrations are immutable, ordered and deployed with expand-and-contract when compatibility overlap is required.
