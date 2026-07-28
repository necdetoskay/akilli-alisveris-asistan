# Quality Strategy Overview

## Purpose

The platform must verify more than code execution.

Quality includes:

```text
functional correctness
price calculation correctness
product matching precision
data freshness
API compatibility
migration safety
operational reliability
security controls
user-facing explanation quality
```

## Risk-based testing

Testing effort should follow business risk.

Highest-risk areas include:

```text
incorrect product matching
wrong unit prices
misleading promotions
duplicate alerts
cross-user data access
broken migrations
stale or poisoned retailer data
basket optimization violating constraints
```

## Main rule

A feature is not ready when tests only prove that the happy path runs.
