# Unit Price Calculation

## Formula

```text
unit_price = effective_price / normalized_quantity
```

## Examples

A 750 g product priced at 112,50 TL:

```text
112,50 TL / 750 g = 0,15 TL/g
150,00 TL/kg
```

A 52-piece diaper package priced at 624,00 TL:

```text
624,00 TL / 52 = 12,00 TL/adet
```

## Stored values

```text
effective_price
normalized_quantity
normalized_unit
unit_price
display_unit
display_unit_price
formula_version
confidence
failure_reason
```

## Display-unit policy

Prefer user-friendly units:

```text
TL/kg instead of TL/g
TL/litre instead of TL/ml
TL/adet for countable products
```

## Missing quantity

When quantity cannot be extracted safely:

- do not fabricate a unit price,
- show shelf price only,
- mark comparison confidence as limited.
