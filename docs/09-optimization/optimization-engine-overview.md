# Optimization Engine Overview

## Purpose

Selecting the cheapest offer for every product independently may create an expensive or impractical basket.

Example:

```text
Product A is cheapest at Retailer 1
Product B is cheapest at Retailer 2
Product C is cheapest at Retailer 3
```

This may introduce:

- three delivery fees,
- three minimum-basket requirements,
- three separate orders,
- unavailable delivery slots,
- excessive travel or pickup effort.

## Core flow

```text
Shopping list
    ↓
Intent and product resolution
    ↓
Eligible offer generation
    ↓
Substitution policy
    ↓
Retailer and delivery constraints
    ↓
Basket optimization
    ↓
Alternative plan generation
    ↓
Explanation
```

## Output

The engine should return more than one plan:

```text
Lowest total cost
Single-retailer convenience
Balanced recommendation
Preferred-retailer plan
```
