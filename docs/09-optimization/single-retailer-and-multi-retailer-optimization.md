# Single-Retailer and Multi-Retailer Optimization

## Single-retailer plan

Goal:

```text
Find the lowest-cost complete or near-complete basket from one retailer.
```

Benefits:

- one order,
- one delivery fee,
- simpler checkout,
- easier returns.

## Multi-retailer plan

Goal:

```text
Minimize total basket cost across multiple retailers.
```

Costs include:

- item prices,
- delivery fees,
- service fees,
- unmet minimum basket penalties,
- travel or pickup cost when modeled,
- promotion requirements.

## Retailer-count constraint

The engine should support:

```text
maxRetailers = 1
maxRetailers = 2
maxRetailers = 3
```

## Partial baskets

When no retailer can fulfill all items, the engine may return:

- best complete multi-retailer plan,
- best near-complete single-retailer plan,
- missing-item explanation.
