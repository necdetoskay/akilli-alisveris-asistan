# Delivery Strategy Overview

## Purpose

The project should move from documentation to working software through small, testable and production-shaped increments.

## Delivery principles

```text
vertical slices
working software every sprint
risk-first implementation
observable from the beginning
migration-safe changes
feature-flagged rollout
documentation kept current
```

## Main rule

The project must not build every infrastructure layer before delivering the first usable end-to-end flow.

## Recommended first vertical slice

```text
one retailer
    ↓
one product category
    ↓
scrape and persist
    ↓
normalize and match
    ↓
calculate comparable price
    ↓
search and display
```
