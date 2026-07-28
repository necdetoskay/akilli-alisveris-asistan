# Local Development Workflow

## Standard flow

```text
clone
 ↓
install dependencies
 ↓
copy environment template
 ↓
start dependencies
 ↓
run migrations
 ↓
seed test data
 ↓
start applications
 ↓
run checks
```

## Recommended commands

```text
pnpm install
pnpm dev
pnpm test
pnpm lint
pnpm typecheck
pnpm build
```

## Local dependencies

Use Docker Compose for infrastructure dependencies such as PostgreSQL, Redis or a queue when required.

## Rule

A new developer should reach a working local environment by following one documented path.
