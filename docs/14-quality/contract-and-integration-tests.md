# Contract and Integration Tests

## API contract tests

Verify:

```text
request schema
response schema
error format
status code
pagination behavior
idempotency
authorization
backward compatibility
```

## Provider and consumer contracts

Important boundaries:

```text
web client ↔ API
admin client ↔ API
API ↔ application services
workers ↔ queues
notification service ↔ provider
scraper adapters ↔ ingestion pipeline
```

## Integration environments

Integration tests should use disposable dependencies where possible:

```text
PostgreSQL
queue or broker
object storage when required
mock retailer endpoints
notification provider sandbox
```

## Rule

External services must not be required for every local test run.
