# Volume 13 — Price History, Watchlists and Intelligent Alerts

This volume defines how users track products, searches and baskets over time.

---

## 1. Watch scopes

Users may track:

```text
exact product
equivalent product group
retailer listing
saved search
saved basket
```

The selected scope is preserved exactly.

---

## 2. History interpretation

The platform calculates current price, rolling median, rolling minimum, historical minimum, change percentage and volatility.

Historical claims include coverage confidence.

---

## 3. Alert types

Supported triggers include:

```text
target price reached
significant price drop
new historical low
back in stock
promotion started
preferred retailer becomes cheapest
basket threshold reached
```

---

## 4. Noise suppression

Raw price movement is not enough for notification.

The system applies:

- deduplication,
- cooldowns,
- hysteresis,
- freshness checks,
- confidence checks,
- parser-correction suppression.

---

## 5. Example threshold

For a target of `500,00 TL`:

```text
trigger at <= 500,00 TL
reset above 515,00 TL
```

This prevents repeated notifications when the price oscillates around the threshold.

---

## 6. Event-driven evaluation

Offer, availability and promotion changes identify affected subscriptions.

Evaluation is idempotent, so replaying the same event does not create duplicate alerts.

---

## 7. Notification preferences

Users control:

- channels,
- quiet hours,
- daily limits,
- membership prices,
- promotions,
- substitutions,
- confidence threshold,
- instant or digest delivery.

---

## 8. Explainability

Every alert explains what changed, old and new price, percentage difference, retailer, conditions, freshness and trigger reason.

---

## 9. Quality

The primary objective is useful alerts, not high alert volume.

Golden history fixtures verify thresholds, historical lows, cooldowns, event replay and channel behavior.
