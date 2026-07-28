# Engineering Handbook v1.6

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
18. Deployment, DevOps and Environment Strategy
19. Monorepo Structure, Code Standards and Developer Experience

---

# Volume 19 — Monorepo Structure, Code Standards and Developer Experience

The platform uses pnpm workspaces and Turborepo.

Applications and packages maintain explicit dependency boundaries.

Strict TypeScript, typed configuration, shared root scripts and one documented onboarding path form the developer-experience baseline.

CI and local development use the same commands.
