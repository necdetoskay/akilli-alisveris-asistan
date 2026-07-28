# Volume 07 — Product Catalog and Canonical Data Model

This volume defines how the Akıllı Alışveriş Asistanı represents products, retailer listings, offers and historical observations.

---

## 1. Canonical catalog

Retailers rarely describe the same product consistently. The platform therefore separates the market concept from the source listing.

```text
Canonical Product
    ↓
Product Variant
    ↓
Retailer Listing
    ↓
Offer
    ↓
Price Observation
```

---

## 2. Core entities

The model includes brand, category, canonical product, product variant, retailer, retailer listing, offer, price observation, availability observation, match candidate and match decision.

---

## 3. Variants and identity

Identity may depend on brand, family, size, package count, weight, volume, flavor, form and GTIN. GTIN is strong evidence but is not the only evidence.

---

## 4. Structured attributes

Search and matching require typed category-specific attributes.

For baby diapers these include closure type, product form, size and package count.

For cheese these include cheese type, form, usage intent and net weight.

---

## 5. Listings and offers

A listing is a source-specific representation. An offer stores current commercial terms such as price, promotion, store, availability and validity period.

---

## 6. Historical observations

Price and availability history are append-only. Current state is a projection derived from the latest valid observation.

---

## 7. Matching records

Candidate and decision records persist scores, confidence, evidence, model version and decision source.

---

## 8. Reliability

Deterministic identifiers, source hashes, uniqueness constraints, transactions and idempotency keys prevent duplicate history.

---

## 9. Governance

Catalog changes, transformation versions and manual actions remain auditable. Entities are normally retired or merged rather than deleted.
