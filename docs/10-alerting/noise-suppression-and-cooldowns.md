# Noise Suppression and Cooldowns

## Duplicate suppression

Do not resend the same alert for the same underlying event.

Use a deduplication key based on:

```text
subscription
trigger type
subject
effective price
promotion identity
observation window
```

## Cooldown examples

```text
target price: once until price rises above reset threshold
significant drop: 24 hours
back in stock: 12 hours
promotion started: once per promotion
basket threshold: 24 hours
```

## Hysteresis

Avoid alert flapping near thresholds.

Example:

```text
Target price: 500,00 TL
Trigger at: <= 500,00 TL
Reset only when price rises above: 515,00 TL
```

## Noise rules

Suppress alerts when:

- price change is caused by a parser correction,
- observation confidence is low,
- offer is unavailable,
- promotion conditions are unresolved,
- current data is stale,
- user has already acknowledged the same state.
