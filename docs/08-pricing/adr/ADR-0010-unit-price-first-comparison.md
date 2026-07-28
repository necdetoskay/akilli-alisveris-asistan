# ADR-0010: Unit-Price-First Comparison

## Status

Accepted

## Context

Retailers sell the same or equivalent products in different package sizes and promotion structures. Shelf-price-only comparison produces misleading results.

## Decision

The platform will use effective unit price as the primary value metric when quantity and promotion conditions are known with sufficient confidence.

Shelf price remains visible, but ranking will consider:

- normalized quantity,
- effective promotion price,
- unit price,
- commercial conditions,
- availability,
- freshness,
- data confidence.

## Consequences

Benefits:

- fairer comparison across package sizes,
- better handling of multi-buy promotions,
- more transparent recommendations,
- fewer misleading “cheapest” results.

Trade-offs:

- quantity extraction must be reliable,
- category-specific comparison rules are required,
- promotion parsing becomes a maintained subsystem,
- some offers cannot receive a unit-price ranking.
