# Volume 12 — Basket Optimization and Recommendation Engine

This volume defines how the Akıllı Alışveriş Asistanı optimizes the total shopping basket.

---

## 1. Why basket optimization matters

The cheapest retailer for each individual product may not produce the cheapest final order.

Multiple delivery fees, minimum basket requirements and order splitting can erase item-level savings.

---

## 2. Input constraints

The optimizer accepts:

- requested products,
- quantities,
- location,
- maximum retailer count,
- substitution rules,
- budget,
- membership availability,
- delivery preferences.

Hard constraints are never silently violated.

---

## 3. Eligible offers

An offer must have sufficient match confidence, valid pricing, supported location, available stock and satisfiable promotion conditions.

---

## 4. Substitutions

Substitutions are policy-controlled.

A cheaper product is not automatically equivalent.

The system distinguishes exact, family-level, brand-equivalent and category-equivalent substitutions.

---

## 5. Single and multi-retailer plans

The engine produces:

```text
lowest total cost
single-retailer convenience
balanced recommendation
preferred-retailer plan
```

Partial fulfillment is explained explicitly.

---

## 6. Total effective cost

```text
total_effective_cost =
    item_cost
  + delivery_cost
  + service_cost
  + small_order_cost
  + membership_cost
  + penalties
```

Penalties represent retailer splitting, uncertain data and substitutions.

---

## 7. Delivery thresholds

The optimizer evaluates:

- delivery fees,
- free-delivery thresholds,
- minimum basket requirements,
- small-order fees.

Moving one product to another retailer may reduce the final basket cost even when that item's shelf price is higher.

---

## 8. Explainability

Each plan explains:

- item subtotal,
- delivery and service costs,
- retailer count,
- promotion conditions,
- substitutions,
- missing items,
- price freshness,
- savings versus alternatives.

---

## 9. Validation

Golden test baskets verify optimal cost, constraints, explanation completeness and reproducibility.

A lower total is invalid if it violates a hard user constraint.
