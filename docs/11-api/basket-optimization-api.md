# Basket Optimization API

## Optimize basket

```http
POST /api/v1/basket-optimizations
```

Request:

```json
{
  "items": [
    {
      "productVariantId": "uuid",
      "quantity": 2,
      "substitutionPolicy": "exact"
    }
  ],
  "preferences": {
    "maxRetailers": 2,
    "allowLoyaltyPrices": true,
    "includeDeliveryCosts": true
  }
}
```

Response:

```json
{
  "optimizationId": "uuid",
  "status": "completed",
  "plans": [
    {
      "strategy": "lowest_total_cost",
      "total": {
        "amount": 1284.70,
        "currency": "TRY"
      },
      "retailerCount": 2,
      "items": [],
      "costBreakdown": {
        "items": 1244.80,
        "delivery": 39.90,
        "service": 0
      },
      "explanations": []
    }
  ]
}
```

## Long-running optimization

Large baskets may return:

```text
202 Accepted
status = queued
```

Clients then retrieve:

```http
GET /api/v1/basket-optimizations/{optimizationId}
```
