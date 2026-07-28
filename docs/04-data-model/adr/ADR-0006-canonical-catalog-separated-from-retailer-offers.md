# ADR-0006: Canonical Catalog Separated from Retailer Offers

## Status

Accepted

## Context

Retailers use inconsistent product titles, categories, package descriptions and identifiers. Treating retailer listings as products would fragment the catalog and make price comparison unreliable.

## Decision

The system will maintain a canonical catalog independent from retailer listings and commercial offers.

```text
Canonical Product
    ↓
Product Variant
    ↓
Retailer Listing
    ↓
Offer
    ↓
Price and Availability Observations
```

## Consequences

Benefits:

- one product can be compared across retailers,
- package and variant differences are explicit,
- matching decisions are auditable,
- listings can be reprocessed safely.

Trade-offs:

- matching becomes a first-class subsystem,
- taxonomy requires governance,
- uncertain cases require manual review.
