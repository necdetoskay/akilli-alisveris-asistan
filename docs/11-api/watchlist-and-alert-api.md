# Watchlist and Alert API

## Create subscription

```http
POST /api/v1/watch-subscriptions
```

Example:

```json
{
  "subjectType": "product_variant",
  "subjectId": "uuid",
  "targetPrice": {
    "amount": 500.00,
    "currency": "TRY"
  },
  "minimumDropPercentage": 8,
  "channels": ["in_app"],
  "includeLoyaltyPrices": false
}
```

## List subscriptions

```http
GET /api/v1/watch-subscriptions
```

## Update subscription

```http
PATCH /api/v1/watch-subscriptions/{subscriptionId}
```

## Pause or resume

```http
POST /api/v1/watch-subscriptions/{subscriptionId}/pause
POST /api/v1/watch-subscriptions/{subscriptionId}/resume
```

## Alerts

```http
GET /api/v1/alerts
POST /api/v1/alerts/{alertId}/acknowledge
POST /api/v1/alerts/{alertId}/dismiss
```

## Rule

Subscription scope changes must be explicit and auditable.
