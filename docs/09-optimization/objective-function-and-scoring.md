# Objective Function and Scoring

## Primary objective

```text
minimize total_effective_cost
```

Where:

```text
total_effective_cost =
    item_cost
  + delivery_cost
  + service_cost
  + small_order_cost
  + membership_cost
  + substitution_penalty
  + retailer_split_penalty
  + uncertainty_penalty
```

## Balanced objective

A balanced recommendation may optimize:

```text
score =
    normalized_cost
  + convenience_penalty
  + freshness_penalty
  + confidence_penalty
  + substitution_penalty
```

## Penalty examples

```text
extra retailer
unverified promotion
low-confidence match
stale price
substitute product
membership requirement
```

## Rule

Penalty weights must be visible in configuration and versioned.
