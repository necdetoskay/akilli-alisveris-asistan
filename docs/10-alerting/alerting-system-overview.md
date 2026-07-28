# Alerting System Overview

## Purpose

Users should not need to repeatedly recheck the same product or basket.

The alerting system evaluates meaningful future changes such as:

- target price reached,
- significant price drop,
- new historical low,
- product back in stock,
- promotion started,
- promotion ending soon,
- preferred retailer becomes cheapest,
- basket cost falls below a threshold.

## Core flow

```text
Price or availability event
    ↓
Affected subscriptions
    ↓
Eligibility checks
    ↓
History-aware trigger evaluation
    ↓
Noise suppression
    ↓
Notification creation
    ↓
Channel delivery
```

## Main rule

A raw data change is not automatically a user-worthy alert.
