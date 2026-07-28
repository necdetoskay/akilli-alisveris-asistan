# Engineering Handbook v1.4

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
13. Price History, Watchlists and Intelligent Alerts
14. API Contracts, Application Services and Authorization Boundaries
15. Observability, Operations, SLO and Incident Management
16. Security, Privacy, Threat Modeling and Compliance Foundations
17. Test Strategy, Quality Gates and Release Readiness

---

# Volume 17 — Test Strategy, Quality Gates and Release Readiness

The platform uses risk-based testing and release gates.

Critical calculations, matching decisions, scraper data, migrations, authorization and operational failure paths require explicit test evidence.

Golden datasets protect price, search, matching, basket and alert behavior.

A feature is ready only when behavior, tests, observability, security and rollback are all defined.
