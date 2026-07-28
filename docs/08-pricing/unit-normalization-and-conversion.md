# Unit Normalization and Conversion

## Canonical quantity units

Recommended canonical units:

```text
mass: gram
volume: millilitre
count: piece
length: metre
area: square metre
```

## Example conversions

```text
1 kg → 1000 g
1.5 litre → 1500 ml
3 x 500 g → 1500 g
4 x 250 ml → 1000 ml
52'li → 52 pieces
```

## Conversion model

A normalized quantity record should include:

```text
source_value
source_unit
multiplier
package_count
normalized_value
normalized_unit
formula_version
confidence
```

## Safety rule

Do not convert between incompatible dimensions.

Examples:

```text
gram ↔ millilitre
piece ↔ kilogram
litre ↔ package
```

Such comparisons require category-specific business rules and must not be assumed.
