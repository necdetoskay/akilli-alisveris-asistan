# Search and Catalog API

## Search endpoint

```http
GET /api/v1/search?q=bebek+bezi+cırtlı&limit=20
```

Example response:

```json
{
  "query": "bebek bezi cırtlı",
  "interpretedIntent": {
    "category": "baby_diaper",
    "requiredAttributes": {
      "closureType": "tape"
    }
  },
  "items": [],
  "nextCursor": null,
  "correlationId": "uuid"
}
```

## Product details

```http
GET /api/v1/products/{productVariantId}
```

## Offer comparison

```http
GET /api/v1/products/{productVariantId}/offers
```

Optional filters:

```text
retailer
location
availableOnly
includeLoyaltyPrices
freshnessLimit
```

## Price history

```http
GET /api/v1/products/{productVariantId}/price-history?window=30d
```

## Rule

Search responses should include interpretation and confidence when user intent affects filtering.
