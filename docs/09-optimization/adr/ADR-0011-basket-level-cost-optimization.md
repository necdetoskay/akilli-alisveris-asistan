# ADR-0011: Basket-Level Cost Optimization

## Status

Accepted

## Context

Choosing the lowest-priced offer per product independently can increase total cost because of delivery fees, minimum baskets, retailer splits and promotion conditions.

## Decision

The platform will optimize at basket level.

The optimizer will consider:

- item prices,
- unit-price comparability,
- availability,
- delivery and service fees,
- retailer count,
- minimum baskets,
- promotion conditions,
- substitutions,
- data freshness,
- match confidence.

It will generate multiple explainable plans instead of one opaque answer.

## Consequences

Benefits:

- lower real checkout cost,
- fewer misleading recommendations,
- support for convenience-oriented plans,
- transparent trade-offs,
- better handling of retailer thresholds.

Trade-offs:

- optimization complexity increases,
- delivery and campaign data must be modeled,
- runtime grows with basket and retailer size,
- approximation may be required for large candidate sets.
