# Comparable Offer Groups

## Purpose

Offers should be compared only when they represent the same or a safely equivalent commercial need.

## Exact comparison group

Exact comparison requires the same canonical product variant.

Example:

```text
Prima Premium Care 4 Numara 52 Adet
```

across multiple retailers.

## Equivalent-value group

Some categories allow broader comparison based on normalized attributes.

Example:

```text
1 kg kaşar peyniri
2 x 500 g kaşar peyniri
```

may be comparable when:

- cheese type matches,
- brand constraints permit comparison,
- form is compatible,
- total quantity is equal,
- promotion conditions are understood.

## Non-comparable examples

```text
cırtlı bez vs külot bez
tam yağlı vs light peynir
şekerli kola vs şekersiz kola
tekli ürün vs üyelik şartlı toplu paket
```

## Group confidence

Comparable groups should store:

```text
comparison_type
comparison_key
confidence
rule_version
blocking_conflicts
```
