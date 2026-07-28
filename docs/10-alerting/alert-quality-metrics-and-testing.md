# Alert Quality Metrics and Testing

## Metrics

```text
trigger accuracy
duplicate-alert rate
false-positive rate
delivery success rate
alert open rate
alert dismissal rate
unsubscribe rate
cooldown suppression count
stale-data suppression count
```

## Required test cases

```text
target reached exactly
target crossed downward
price oscillates around threshold
duplicate event replay
new historical low
insufficient history
back in stock after short outage
back in stock after meaningful outage
promotion requires unavailable membership
basket threshold reached
quiet-hours delivery
channel failure
```

## Golden tests

Maintain deterministic history fixtures and expected alerts.

## Primary quality rule

Alert usefulness is more important than alert volume.
