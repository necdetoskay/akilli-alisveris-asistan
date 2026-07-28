# Configuration and Environment Conventions

## Configuration ownership

Each application owns a typed configuration schema.

## Environment files

```text
.env.example
.env.local
.env.test
```

Real secrets are never committed.

## Validation

Applications validate required configuration during startup and fail fast with safe messages.

## Naming

```text
APP_ENV
DATABASE_URL
REDIS_URL
OTEL_EXPORTER_OTLP_ENDPOINT
SCRAPER_CONCURRENCY
```

## Rule

Reading environment variables directly throughout business code is forbidden. Use the typed configuration package.
