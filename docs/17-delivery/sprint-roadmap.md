# Sprint Roadmap

## Sprint 00 — Repository Foundation

Deliver:

```text
pnpm workspace
Turborepo
root scripts
TypeScript configuration
lint and formatting
CI skeleton
Docker Compose baseline
```

## Sprint 01 — Database Foundation

Deliver:

```text
PostgreSQL
extensions
migration runner
logical schemas
health checks
seed mechanism
```

## Sprint 02 — Canonical Catalog

Deliver:

```text
product
variant
retailer
listing
offer
price observation
repository interfaces
```

## Sprint 03 — First Retailer Adapter

Deliver one retailer and one category with raw observation persistence and replay.

## Sprint 04 — Normalization Pipeline

Deliver title normalization, brand extraction, quantity parsing and category mapping.

## Sprint 05 — Matching MVP

Deliver candidate generation, scoring, conflict detection and manual-review queue.

## Sprint 06 — Pricing MVP

Deliver effective price, unit price, promotion interpretation and comparable ranking.

## Sprint 07 — Search API

Deliver hybrid search contracts, filters, pagination and explainable ranking metadata.

## Sprint 08 — Web Search Experience

Deliver user search, result list, comparison view, freshness indication and error states.

## Sprint 09 — Operational Hardening

Deliver dashboards, alerts, SLO indicators, replay tools and runbooks.

## Sprint 10 — Watchlists and Alerts

Deliver subscriptions, target-price rules, cooldowns and one notification channel.

## Sprint 11 — Basket Optimization MVP

Deliver cheapest, single-retailer and balanced plans with explanations.

## Sprint 12 — Security and Release Hardening

Deliver access control, audit records, rate limits, backup restore test and release gates.

## Sprint 13 — Production Pilot

Deliver staged rollout with limited retailers, categories and users.
