# ADR-0012: Event-Driven Intelligent Alerting

## Status

Accepted

## Context

Polling every user subscription independently is expensive and produces duplicate work. Raw price changes also generate noisy notifications when history, confidence and user preferences are ignored.

## Decision

The platform will use event-driven alert evaluation.

Offer, availability, promotion and basket events will identify affected subscriptions. Trigger policies will evaluate current state together with price history, confidence, cooldowns and user preferences.

Notifications will be created only after durable alert records pass deduplication.

## Consequences

Benefits:

- less repeated computation,
- faster relevant alerts,
- centralized noise suppression,
- auditable trigger decisions,
- reliable replay and idempotency.

Trade-offs:

- event routing must be correct,
- saved basket recalculation can be expensive,
- cooldown state must be maintained,
- notification delivery requires separate operational monitoring.
