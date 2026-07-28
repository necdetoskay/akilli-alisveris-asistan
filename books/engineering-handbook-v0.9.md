# Engineering Handbook v0.9

## Included volumes

1. Governance
2. Product Vision
3. Proof of Concept
4. Domain
5. System Architecture
6. Hybrid Semantic Search
7. Product Catalog and Canonical Data Model
8. PostgreSQL Physical Schema and Migration Strategy
9. Scraper, Ingestion and Processing Orchestration
10. Product Normalization, Matching and Confidence Engine
11. Price Comparison, Unit Price and Promotion Engine
12. Basket Optimization and Recommendation Engine

---

# Volume 12 — Basket Optimization and Recommendation Engine

The platform optimizes the complete shopping basket rather than selecting the cheapest offer for each item independently.

Total cost includes products, delivery, service fees, retailer splits, campaign conditions and substitution penalties.

The engine returns multiple explainable plans for lowest cost, convenience and balanced trade-offs.

Hard constraints are never silently violated.
