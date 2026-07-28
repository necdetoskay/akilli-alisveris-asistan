# Domain and Calculation Tests

## Required calculation coverage

```text
unit conversion
unit price
effective price
promotion conditions
delivery threshold
basket total
retailer split penalties
target-price alerts
historical-low detection
cooldown and hysteresis
```

## Example unit-price fixture

```text
Offer price: 112,50 TL
Package quantity: 750 g
Expected unit price: 150,00 TL/kg
```

## Example basket fixture

```text
Retailer A item subtotal: 410,00 TL
Small-order fee: 35,00 TL
Expected effective subtotal: 445,00 TL
```

## Property-based tests

Useful invariants:

```text
effective price is never negative
unit price is stable under equivalent unit conversion
hard constraints are never silently violated
adding a positive fee cannot reduce total cost
duplicate event replay cannot create duplicate alerts
```
