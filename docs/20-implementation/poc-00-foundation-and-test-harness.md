# POC-00 — Foundation and Test Harness

## Delivered

```text
pnpm workspace
Turborepo task graph
strict TypeScript configuration
ESLint flat configuration
Prettier
Vitest
Playwright
Docker Compose PostgreSQL
typed configuration package
minimal API application
unit tests
integration-style HTTP tests
end-to-end tests
GitHub Actions quality workflow
```

## Quality command

```powershell
pnpm check
```

This command runs:

```text
format check
lint
type check
unit and component tests
build
```

End-to-end tests run separately:

```powershell
pnpm e2e
```

## Initial runtime

```powershell
corepack enable
pnpm install
Copy-Item .env.example .env
docker compose up -d
pnpm dev
```

Health endpoint:

```text
GET http://127.0.0.1:3100/health
```

## Acceptance criteria

- workspace packages resolve,
- strict type checking is active,
- invalid configuration is rejected,
- health endpoint succeeds,
- unknown routes return safe problem details,
- root quality command fails when a quality gate fails,
- CI executes the same commands used locally.

## Known POC limitation

The API is intentionally framework-free in POC-00. Framework selection is deferred until the first business API slice requires routing, validation and middleware beyond this foundation.
