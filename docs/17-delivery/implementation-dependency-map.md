# Implementation Dependency Map

## Core dependency sequence

```text
repository foundation
    ↓
configuration and local infrastructure
    ↓
database and migrations
    ↓
canonical catalog
    ↓
scraper ingestion
    ↓
normalization and matching
    ↓
pricing
    ↓
search API
    ↓
web interface
    ↓
watchlists and alerts
    ↓
basket optimization
```

## Cross-cutting capabilities

These begin early and evolve continuously:

```text
testing
security
observability
CI/CD
documentation
```

## Rule

A sprint may depend on earlier contracts, but should avoid depending on unfinished future user interfaces.
