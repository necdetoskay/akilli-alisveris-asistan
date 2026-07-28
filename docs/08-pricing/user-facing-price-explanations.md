# User-Facing Price Explanations

## Goal

Users should understand why one offer is ranked above another.

## Explanation examples

```text
Bu teklif adet başına 12,00 TL ile en ucuz seçenek.
```

```text
Raf fiyatı daha yüksek olsa da kilogram fiyatı %8 daha düşük.
```

```text
89,90 TL fiyat yalnızca sadakat kartı ile geçerli.
```

```text
3 adet alındığında birim fiyat 83,33 TL oluyor.
```

```text
Bu ürünün gramajı doğrulanamadığı için yalnızca raf fiyatı gösteriliyor.
```

## Required explanation fields

```text
comparison_basis
unit_price
conditions
freshness
confidence
excluded_costs
reason_not_comparable
```

## Rule

Do not show a numerical saving claim when the underlying quantities or promotion conditions are uncertain.
