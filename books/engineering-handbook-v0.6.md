# Engineering Handbook v0.6

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

---

# Volume 09 — Scraper, Ingestion and Processing Orchestration

Retailer-specific adapters emit a common raw observation envelope.

The shared processing pipeline parses, normalizes, validates, matches, persists and publishes changes.

Raw observations are retained for replay.

Retries are classified, backpressure is explicit, failures are quarantined and downstream publication uses the transactional outbox pattern.
