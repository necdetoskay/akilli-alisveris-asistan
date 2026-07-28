# Volume 09 — Scraper, Ingestion and Processing Orchestration

This volume defines how external retailer data safely enters the Akıllı Alışveriş Asistanı.

---

## 1. Pipeline

```text
Scheduler
    ↓
Source Adapter
    ↓
Raw Observation
    ↓
Parser
    ↓
Normalizer
    ↓
Validation
    ↓
Matching
    ↓
Persistence
    ↓
Outbox
```

Raw observations are preserved so later processing failures do not require immediate re-scraping.

---

## 2. Source adapters

Each retailer has an adapter for source-specific fetching, pagination, authentication, browser automation and rate limiting.

Adapters emit a common envelope and never write directly to canonical catalog tables.

---

## 3. Run lifecycle

Scrape runs and individual source items have separate states.

Partial success is supported so one malformed product does not invalidate an entire run.

---

## 4. Parsing and normalization

Parsing extracts source fields.

Normalization converts source values into canonical forms such as:

```text
649,90 TL → 649.90 TRY
1,5 kg → 1500 g
52'li → package_count=52
```

Every transformation remains versioned.

---

## 5. Queueing and retries

Logical queues separate discovery, fetch, parse, normalization, matching, persistence and publication.

Retries use failure classification, exponential backoff and jitter.

Backpressure slows intake when downstream stages are overloaded.

---

## 6. Quarantine

Malformed or unsupported observations are quarantined rather than silently dropped.

Quarantine records preserve failure stage, code, payload reference, retry state and resolution notes.

---

## 7. Outbox

Listing, offer and observation changes are committed together with outbox events.

Publication is at-least-once, and consumers are idempotent.

---

## 8. Replay

Stored raw observations support reprocessing after parser, taxonomy, matcher or formula upgrades.

Reprocessing creates versioned outputs and preserves previous decisions for audit.

---

## 9. Operational control

Operators can pause sources, cancel runs, cap concurrency, retry failures and replay observations.

Kill switches and metrics protect both the platform and retailer sources.
