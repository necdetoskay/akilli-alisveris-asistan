# Migration and Persistence Validation

## Migration checks

Every migration should verify:

```text
upgrade from supported previous version
fresh database bootstrap
rollback or forward-fix plan
data preservation
index creation impact
constraint validity
application compatibility
```

## Expand-contract validation

Test both phases:

```text
old application + expanded schema
new application + expanded schema
new application after cleanup
```

## Persistence tests

Verify:

```text
append-only observation history
idempotent event handling
transactional outbox behavior
unique constraints
foreign keys
optimistic concurrency
audit record creation
```

## Rule

A migration that works only on an empty database is not considered safe.
