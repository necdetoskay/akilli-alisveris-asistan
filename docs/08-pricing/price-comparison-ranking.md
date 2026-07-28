# Price Comparison Ranking

## Ranking dimensions

Offer ranking can consider:

```text
effective unit price
exact product match confidence
availability
promotion accessibility
retailer preference
delivery cost
minimum basket requirement
price freshness
data confidence
```

## Default rule

For exact product matches:

1. currently available,
2. valid price,
3. lower effective unit price,
4. fewer restrictive conditions,
5. fresher observation,
6. higher data confidence.

## Score example

```text
ranking_score =
    price_value_score
  + availability_score
  + freshness_score
  + confidence_score
  - promotion_friction_penalty
  - delivery_penalty
```

## Explainability

The ranking must be explainable as:

```text
En düşük birim fiyat
Kart gerektirmiyor
Fiyat 2 saat önce doğrulandı
Teslimat ücreti dahil değil
```
