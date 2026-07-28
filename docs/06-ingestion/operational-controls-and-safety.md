# Operational Controls and Safety

## Required controls

- pause retailer adapter,
- pause all ingestion,
- cancel run,
- cap concurrency,
- configure rate limits,
- disable browser automation,
- retry selected failures,
- replay selected observations,
- quarantine a source pattern.

## Kill switches

Each retailer adapter should have an immediate disable switch.

## Metrics

Track:

```text
fetch success rate
parse success rate
normalization success rate
match rate
quarantine rate
queue depth
retry count
average processing latency
retailer response latency
price observation throughput
```

## Alerts

Alert on:

- sudden parser failure increase,
- retailer-wide HTTP errors,
- zero observations for an expected source,
- abnormal price distributions,
- outbox backlog,
- queue growth,
- repeated authentication failure.
