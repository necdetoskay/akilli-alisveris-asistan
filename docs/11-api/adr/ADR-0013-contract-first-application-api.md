# ADR-0013: Contract-First Application API

## Status

Accepted

## Context

The application includes web, administrative and background-worker clients. Database-driven endpoints would tightly couple clients to internal tables and make domain changes risky.

## Decision

The platform will use versioned, contract-first APIs organized around application capabilities.

Contracts will define:

- commands and queries,
- validation,
- authorization,
- idempotency,
- concurrency,
- pagination,
- problem details,
- asynchronous result handling.

## Consequences

Benefits:

- stable client integration,
- clear domain boundaries,
- easier testing and documentation,
- safer internal refactoring,
- explicit authorization.

Trade-offs:

- contract maintenance is required,
- versioning discipline is necessary,
- mapping layers add code,
- asynchronous commands require status resources.
