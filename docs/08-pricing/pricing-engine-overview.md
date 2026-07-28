# Pricing Engine Overview

## Purpose

Retail prices cannot be compared reliably by shelf price alone.

The pricing engine evaluates:

- package size,
- unit quantity,
- unit conversion,
- promotion conditions,
- loyalty requirements,
- minimum basket rules,
- multi-buy campaigns,
- delivery fees when relevant,
- availability,
- confidence of extracted values.

## Core flow

```text
Offer
    ↓
Quantity normalization
    ↓
Promotion interpretation
    ↓
Effective price calculation
    ↓
Unit price calculation
    ↓
Comparable group validation
    ↓
Ranking and explanation
```

## Main rule

The cheapest displayed price is not necessarily the best-value offer.
