# ADR-0009: Explainable Hybrid Product Matching

## Status

Accepted

## Context

Retailer listings contain inconsistent titles, incomplete attributes and unreliable identifiers. Pure lexical matching misses equivalent products, while pure semantic matching can confuse commercially distinct variants.

## Decision

The platform will use an explainable hybrid matcher combining:

- identifiers,
- lexical similarity,
- semantic similarity,
- category compatibility,
- structured attributes,
- explicit conflict rules.

Auto-match decisions require high confidence and no hard conflicts.

## Consequences

Benefits:

- better recall than exact text matching,
- safer decisions than embeddings alone,
- reviewable evidence,
- category-specific tuning,
- measurable regression testing.

Trade-offs:

- feature engineering is required,
- thresholds need labeled data,
- manual review remains necessary,
- matching logic becomes a maintained product capability.
