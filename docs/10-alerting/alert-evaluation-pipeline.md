# Alert Evaluation Pipeline

## Event-driven evaluation

Relevant domain events include:

```text
offer.price_changed
offer.availability_changed
promotion.started
promotion.ended
listing.matched
basket.recalculation_requested
```

## Evaluation stages

```text
Event received
    ↓
Find affected active subscriptions
    ↓
Load current and historical context
    ↓
Evaluate trigger policy
    ↓
Apply confidence checks
    ↓
Apply cooldown and deduplication
    ↓
Create alert record
    ↓
Create notification jobs
```

## Idempotency

Evaluation must be idempotent.

The same event replay must not create duplicate user alerts.

## Recalculation

Saved baskets may require recalculation when any relevant offer changes.
