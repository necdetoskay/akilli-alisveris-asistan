# ADR-0014: Observability as a Product Capability

## Status

Accepted

## Context

Infrastructure monitoring cannot detect many failures that matter to a price-comparison product, such as stale data, incorrect matches, broken unit prices or noisy alerts.

## Decision

The platform will treat observability as a product capability covering infrastructure, application behavior, ingestion, data freshness, matching quality, pricing quality and user-facing outcomes.

## Consequences

Benefits include earlier detection of user-impacting failures, retailer-specific visibility and measurable reliability work.

Trade-offs include telemetry cost, threshold calibration and dashboard maintenance.
