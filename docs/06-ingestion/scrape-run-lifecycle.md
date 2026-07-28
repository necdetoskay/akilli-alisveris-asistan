# Scrape Run Lifecycle

## States

```text
planned
queued
running
partially_succeeded
succeeded
failed
cancelled
```

## Run model

Suggested fields:

```text
id
retailer_id
adapter_version
trigger_type
requested_scope
status
started_at
finished_at
items_discovered
items_fetched
items_parsed
items_failed
correlation_id
created_at
```

## Item lifecycle

Each discovered source item should have its own execution record:

```text
discovered
fetching
fetched
parsing
normalized
persisted
quarantined
failed
```

## Partial success

A run should not be marked fully failed because a small number of items failed.

Recommended rule:

- run success describes the overall batch,
- item states preserve exact failures,
- thresholds determine when a run becomes `partially_succeeded`.

## Cancellation

Cancellation should stop scheduling new work while allowing in-flight operations to finish safely.
