# Basket Request and Constraints

## Basket request

Suggested request model:

```json
{
  "items": [
    {
      "productVariantId": "uuid",
      "quantity": 2,
      "substitutionPolicy": "exact"
    }
  ],
  "location": {
    "city": "Kocaeli",
    "district": "İzmit"
  },
  "preferences": {
    "maxRetailers": 2,
    "allowLoyaltyPrices": true,
    "allowMultiBuy": true,
    "preferAvailableNow": true
  }
}
```

## Hard constraints

Examples:

```text
exact product required
maximum retailer count
maximum total budget
delivery area
required delivery date
prohibited retailer
membership unavailable
minimum product quantity
```

## Soft constraints

Examples:

```text
prefer one retailer
prefer known retailer
avoid membership requirement
avoid minimum-basket promotions
prefer fresher prices
prefer fewer substitutions
```

Hard constraints must never be violated silently.
