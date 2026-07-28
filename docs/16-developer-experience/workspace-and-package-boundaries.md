# Workspace and Package Boundaries

## Application packages

```text
apps/web
apps/admin
apps/api
apps/worker
apps/scraper
```

## Shared packages

```text
packages/domain
packages/application
packages/contracts
packages/database
packages/search
packages/matching
packages/pricing
packages/optimization
packages/observability
packages/config
packages/testing
packages/ui
```

## Dependency direction

```text
apps
 ↓
application
 ↓
domain
```

Infrastructure packages implement interfaces defined by domain or application layers.

## Forbidden dependencies

Examples:

```text
domain → database
domain → web framework
contracts → application implementation
shared package → application package
```

## Rule

Circular dependencies are build failures, not style warnings.
