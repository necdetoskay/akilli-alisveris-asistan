# Engineering Handbook v0.4

## Included volumes

1. Governance
2. Product Vision
3. Proof of Concept
4. Domain
5. System Architecture
6. Hybrid Semantic Search
7. Product Catalog and Canonical Data Model

---

# Volume 07 — Product Catalog and Canonical Data Model

The system separates canonical products, variants, retailer listings, offers and historical observations.

A retailer listing is never treated as the canonical product.

Structured category attributes support hybrid semantic search and explainable matching.

Price and availability observations are append-only, while current state is maintained as a projection.

Matching candidates and decisions remain versioned, explainable and auditable.
