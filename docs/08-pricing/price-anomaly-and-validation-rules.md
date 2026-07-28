# Price Anomaly and Validation Rules

## Validation checks

Flag prices when:

```text
price <= 0
discounted price > original price
discount percentage exceeds reasonable limits
price changes by an extreme ratio
currency is unsupported
quantity is missing for a required comparison
unit price differs radically from category norms
promotion dates are invalid
```

## Anomaly examples

```text
1 kg peynir = 9,90 TL
52'li bebek bezi = 6.499,00 TL
original price = 89,90 TL
discounted price = 109,90 TL
```

These values may be real, but should be quarantined or marked suspicious until confirmed.

## Historical comparison

Use recent history to detect:

- sudden drop,
- sudden increase,
- stale promotion,
- repeated parsing error,
- decimal separator mistakes.

## Safety rule

An anomalous price should not automatically become the recommended cheapest offer.
