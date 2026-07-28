# ADR-0018: pnpm and Turborepo Modular Monorepo

## Status

Accepted

## Context

The platform contains multiple applications and shared domain capabilities. Separate repositories would make contracts, schemas and cross-cutting changes harder to coordinate.

## Decision

The platform will use a pnpm workspace monorepo with Turborepo task orchestration.

Applications and packages will maintain explicit dependency boundaries and controlled public APIs.

## Consequences

Benefits:

- atomic changes across applications and packages,
- one lockfile,
- consistent scripts,
- shared contracts,
- faster cached builds,
- simpler onboarding.

Trade-offs:

- repository discipline is required,
- task configuration must be maintained,
- accidental coupling must be prevented,
- large changes may affect multiple packages.
