# ADR-0008: Adapter-Based Ingestion Pipeline

## Status

Accepted

## Context

Retailers expose inconsistent page structures, identifiers, rate limits, availability models and anti-automation behavior.

## Decision

The ingestion system will use retailer-specific source adapters that emit a common raw observation envelope.

Adapters remain isolated from canonical catalog and matching decisions.

Processing after fetch uses shared stages:

```text
parse
normalize
validate
match
persist
publish
```

## Consequences

Benefits:

- retailer-specific code remains isolated,
- shared processing rules are reusable,
- raw observations can be replayed,
- parser changes do not require new scraping,
- failures are easier to diagnose.

Trade-offs:

- adapter contracts require discipline,
- source changes need monitoring,
- browser-based adapters are operationally heavier,
- replay storage has cost.
