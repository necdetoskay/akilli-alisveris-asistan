# Tooling, Scripts and Task Orchestration

## Toolchain

```text
pnpm
Turborepo
TypeScript
ESLint
Prettier
Vitest
Docker Compose
```

## Root scripts

```text
dev
build
test
test:integration
lint
format
typecheck
db:migrate
db:seed
check
```

## Task graph

Turborepo should understand package dependencies and cache deterministic tasks.

## Script rules

Scripts must:

- work from the repository root,
- return non-zero on failure,
- avoid hidden manual prerequisites,
- print actionable errors,
- behave consistently on supported environments.

## Rule

CI and local development should execute the same underlying scripts.
