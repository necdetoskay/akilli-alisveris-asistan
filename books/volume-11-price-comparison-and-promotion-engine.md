# Volume 11 — Price Comparison, Unit Price and Promotion Engine

This volume defines how the Akıllı Alışveriş Asistanı compares offers fairly.

---

## 1. Comparison principle

Shelf price alone is not sufficient.

The system evaluates normalized quantity, effective price, promotion conditions, availability, freshness and confidence.

---

## 2. Unit normalization

Mass, volume and count are normalized to canonical units.

Examples:

```text
1 kg → 1000 g
1,5 litre → 1500 ml
3 x 500 g → 1500 g
52'li → 52 adet
```

Incompatible dimensions are never converted automatically.

---

## 3. Comparable groups

Exact product variants form the safest comparison group.

Broader equivalent-value groups are permitted only when category rules confirm compatibility.

---

## 4. Unit price

```text
unit_price = effective_price / normalized_quantity
```

A product priced at 112,50 TL for 750 g has a unit price of 150,00 TL/kg.

A 52-piece diaper package priced at 624,00 TL has a unit price of 12,00 TL/adet.

---

## 5. Promotions

The platform models direct discounts, loyalty prices, coupons, multi-buy promotions, bundles and minimum-basket campaigns.

Conditional prices are never shown as unconditional prices.

---

## 6. Effective price

Effective price represents the real amount attributable to the compared quantity after valid conditions.

For `3 adet 250 TL`, the effective unit price is `83,33 TL/adet`.

---

## 7. Ranking

Exact matches are ranked by:

1. availability,
2. valid effective price,
3. lower unit price,
4. fewer restrictions,
5. fresher observation,
6. higher confidence.

---

## 8. Validation

Suspicious values are flagged using business rules and historical ranges.

An anomalous price does not automatically become the recommended cheapest offer.

---

## 9. Explanation

Every recommendation explains its basis, conditions, freshness and confidence.

The system avoids savings claims when quantity or promotion interpretation is uncertain.
