# Constraints, Indexes and Partitioning

## Constraint principles

Database constraints should enforce rules that are:

- stable,
- deterministic,
- independent from application workflow,
- costly to repair after corruption.

Examples:

- non-negative prices,
- valid currencies,
- one active normalized brand name,
- no self-merge for products,
- typed attribute value consistency,
- unique retailer listing identity.

## Index strategy

Index by confirmed query patterns, not speculation.

Initial indexes:

```text
catalog.products(category_id, status)
catalog.product_variants(product_id, status)
retailer.listings(retailer_id, is_active)
retailer.listings(matched_variant_id)
commerce.offers(listing_id, last_observed_at desc)
commerce.price_observations(offer_id, observed_at desc)
matching.candidates(listing_id, candidate_rank)
matching.decisions(listing_id, decided_at desc)
```

## Partial indexes

Examples:

```text
active retailer listings
unmatched listings
open manual reviews
currently available offers
```

## Partitioning threshold

Partition only when operational evidence shows need.

Likely future candidates:

- price observations,
- availability observations,
- ingestion source observations,
- audit events.
