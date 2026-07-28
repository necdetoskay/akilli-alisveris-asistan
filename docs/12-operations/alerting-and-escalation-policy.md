# Alerting and Escalation Policy

## Alert levels

```text
info
warning
high
critical
```

## Critical examples

```text
database unavailable
all search requests failing
corrupted price writes
security incident
cross-user data exposure
```

## Alert requirements

Every operational alert should include what failed, when it started, affected service or retailer, user impact, current metric, threshold and runbook reference.

## Anti-noise policy

Alerts must use deduplication, grouping, cooldown, recovery notification, ownership and escalation timeout.
