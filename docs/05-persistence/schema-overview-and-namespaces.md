# Schema Overview and Namespaces

## PostgreSQL schemas

Recommended logical namespaces:

```text
core
catalog
retailer
commerce
search
matching
ingestion
audit
```

## Responsibilities

### `core`

Shared system primitives:

- tenants if introduced later,
- application users,
- jobs,
- correlation IDs,
- version records.

### `catalog`

Canonical market data:

- brands,
- categories,
- products,
- variants,
- attributes,
- aliases.

### `retailer`

Retailer-specific source entities:

- retailers,
- stores,
- listings,
- listing images,
- source category paths.

### `commerce`

Commercial state and history:

- offers,
- promotions,
- price observations,
- availability observations,
- unit price calculations.

### `search`

Search projections:

- normalized search documents,
- embeddings,
- query aliases,
- taxonomy search terms.

### `matching`

Cross-source product matching:

- candidates,
- decisions,
- evidence,
- manual reviews.

### `ingestion`

Scrape and processing control:

- scrape runs,
- source observations,
- parser results,
- quarantine records,
- outbox events.

### `audit`

Historical and operational audit records.
