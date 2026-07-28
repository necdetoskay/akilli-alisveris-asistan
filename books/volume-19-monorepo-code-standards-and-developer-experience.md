# Volume 19 — Monorepo Structure, Code Standards and Developer Experience

This volume defines the repository and development workflow of the Akıllı Alışveriş Asistanı.

---

## 1. Repository model

```text
apps/
packages/
infra/
scripts/
docs/
books/
```

Applications and shared packages live in one pnpm workspace.

---

## 2. Package boundaries

Applications depend on application and domain packages.

Domain code never depends on database or framework implementations.

Package internals remain private unless exported intentionally.

---

## 3. TypeScript standards

Strict TypeScript is required.

Unchecked casts, `any` and non-null assertions require justification.

Business failures use typed results and stable error codes.

---

## 4. Configuration

Applications consume typed configuration.

Environment variables are validated at startup and are not read directly throughout business code.

---

## 5. Local workflow

The standard flow is:

```text
install → configure → start dependencies → migrate → seed → develop → check
```

One documented path should be sufficient for onboarding.

---

## 6. Tooling

The baseline toolchain is:

```text
pnpm
Turborepo
TypeScript
ESLint
Prettier
Vitest
Docker Compose
```

CI and local development share the same scripts.

---

## 7. Dependencies

Each package declares what it uses.

Internal dependencies use `workspace:*`.

Duplicate technical solutions require explicit architecture approval.

---

## 8. Contributions

Every pull request documents scope, tests, migration impact, operational impact and rollback.

Documentation and tests are part of the change.
