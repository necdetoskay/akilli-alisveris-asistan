# Outbox and Downstream Events

## Why outbox

Database changes and event publication must remain consistent.

The ingestion transaction writes:

- listing changes,
- offer changes,
- observations,
- outbox event.

A separate publisher delivers outbox events.

## Example events

```text
listing.discovered
listing.updated
listing.normalized
listing.match_requested
listing.matched
offer.price_changed
offer.availability_changed
promotion.started
promotion.ended
observation.quarantined
```

## Outbox fields

```text
id
aggregate_type
aggregate_id
event_type
payload
occurred_at
published_at
attempt_count
last_error
deduplication_key
```

## Delivery semantics

Use at-least-once delivery.

Consumers must be idempotent.
