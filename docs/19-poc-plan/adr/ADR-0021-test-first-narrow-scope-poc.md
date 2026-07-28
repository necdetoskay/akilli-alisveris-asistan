# ADR-0021: Test-First Narrow-Scope POC

## Status

Accepted

## Context

The project includes scraping, normalization, matching, pricing, search and optional AI assistance. Implementing the full production architecture before validating these assumptions would create unnecessary risk.

## Decision

The project will begin with a narrow, test-first POC.

The POC uses one retailer, one category, manual triggers and manually configured AI settings.

Every feature requires relevant automated tests. Confirmed bugs require regression tests.

LLM-dependent capabilities must provide a manual or deterministic fallback.

## Consequences

Benefits:

- early validation,
- measurable quality,
- safer matching and pricing,
- controlled AI dependency,
- reduced scope,
- reproducible results.

Trade-offs:

- initial coverage is narrow,
- test development increases early effort,
- some production capabilities are deferred,
- fixtures and golden datasets require maintenance.
