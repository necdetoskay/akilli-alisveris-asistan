# Retention, Audit and Versioning

## Long-term data

- canonical products,
- variants,
- categories,
- verified identifiers,
- match decisions,
- price observations used for history.

## Configurable retention

- raw HTML,
- screenshots,
- large source payloads,
- debug traces,
- failed parser artifacts.

Important changes should record actor, source, before, after, reason, timestamp and correlation ID.

The scraper, parser, normalization rules, taxonomy schema, matcher, embedding model and unit-price formula are versioned.

Catalog entities are normally retired, merged or deprecated rather than physically deleted.
