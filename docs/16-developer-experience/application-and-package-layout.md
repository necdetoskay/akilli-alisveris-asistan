# Application and Package Layout

## Example application layout

```text
apps/api/
├── src/
│   ├── modules/
│   ├── routes/
│   ├── middleware/
│   ├── bootstrap/
│   └── main.ts
├── tests/
├── package.json
└── tsconfig.json
```

## Example package layout

```text
packages/pricing/
├── src/
│   ├── domain/
│   ├── services/
│   ├── policies/
│   └── index.ts
├── tests/
├── package.json
└── tsconfig.json
```

## Public API

Each package exposes a controlled public surface through its root entry point.

Internal files should not be imported by deep relative paths from other packages.

## Rule

Package internals are private unless intentionally exported.
