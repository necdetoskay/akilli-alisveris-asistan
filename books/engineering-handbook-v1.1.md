# Engineering Handbook v1.1

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

---

# Volume 14 — API Contracts, Application Services and Authorization Boundaries

The platform uses versioned, contract-first APIs organized around application capabilities.

Commands and queries remain separate, errors follow a standard problem-details format and retryable commands support idempotency.

Authorization combines identity, role, permission and resource ownership.

API contracts do not mirror database tables directly.
