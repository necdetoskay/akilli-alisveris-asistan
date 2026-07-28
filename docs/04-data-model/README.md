# Product Catalog & Canonical Data Model

This section defines the canonical product catalog and commercial offer data model for the Akıllı Alışveriş Asistanı.

The model separates:

- canonical products from retailer listings,
- product variants from package-specific SKUs,
- offers from price observations,
- structured attributes from free-form source data,
- matching decisions from matching candidates,
- current state from append-only history.

Documents:

1. [Core entities and aggregates](core-entities-and-aggregates.md)
2. [Canonical product and variant model](canonical-product-and-variant-model.md)
3. [Retailer listing and offer model](retailer-listing-and-offer-model.md)
4. [Category taxonomy and attributes](category-taxonomy-and-attributes.md)
5. [Price history and availability](price-history-and-availability.md)
6. [Product matching records](product-matching-records.md)
7. [Identifiers, uniqueness and idempotency](identifiers-uniqueness-and-idempotency.md)
8. [Retention, audit and versioning](retention-audit-and-versioning.md)
9. [ADR-0006](adr/ADR-0006-canonical-catalog-separated-from-retailer-offers.md)
