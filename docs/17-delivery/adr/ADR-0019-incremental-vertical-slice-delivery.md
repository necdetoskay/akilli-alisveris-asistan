# ADR-0019: Incremental Vertical-Slice Delivery

## Status

Accepted

## Context

The architecture contains many domains and supporting systems. Building all horizontal layers before user-visible functionality would delay validation and increase integration risk.

## Decision

The project will use incremental vertical slices.

The first slice will cover one retailer, one category and the complete path from ingestion to user-visible comparison.

Cross-cutting capabilities such as tests, security and observability will be introduced from the first sprint and strengthened continuously.

## Consequences

Benefits:

- early validation,
- smaller integration risk,
- faster feedback,
- visible progress,
- production-shaped architecture.

Trade-offs:

- early implementations may be narrow,
- some shared abstractions emerge later,
- feature flags and temporary limits require management,
- documentation must track evolving scope.
