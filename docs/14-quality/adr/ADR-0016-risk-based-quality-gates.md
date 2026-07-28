# ADR-0016: Risk-Based Quality Gates

## Status

Accepted

## Context

The platform contains calculations, matching decisions, scraper pipelines, user data and operational workflows. A uniform test checklist would under-test high-risk areas and over-test low-risk changes.

## Decision

The platform will use risk-based quality gates.

Critical changes require stronger evidence, including golden datasets, migration validation, contract tests, security checks and operational rollback readiness.

Release approval depends on business impact, not only changed-line count.

## Consequences

Benefits:

- more testing where failure is costly,
- clearer release decisions,
- stronger protection for pricing and matching,
- safer migrations,
- better operational readiness.

Trade-offs:

- risk classification requires judgment,
- some releases require more preparation,
- test datasets need maintenance,
- release gates must be kept fast enough for regular delivery.
