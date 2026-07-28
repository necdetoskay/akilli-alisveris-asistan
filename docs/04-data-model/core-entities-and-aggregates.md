# Core Entities and Aggregates

## Design goals

The model must support multiple retailers describing the same real-world product differently, semantic title equivalence, package-size differences, historical pricing, offer availability, explainable product matching and safe reprocessing.

## Main aggregates

### Catalog aggregate

- `Brand`
- `Category`
- `CanonicalProduct`
- `ProductVariant`
- `ProductAttributeValue`
- `ProductAlias`

### Retailer aggregate

- `Retailer`
- `RetailerStore`
- `RetailerListing`
- `RetailerListingAttribute`
- `RetailerListingImage`

### Commerce aggregate

- `Offer`
- `PriceObservation`
- `AvailabilityObservation`
- `Promotion`
- `UnitPrice`

### Matching aggregate

- `MatchCandidate`
- `MatchDecision`
- `MatchEvidence`
- `ManualReview`

## Boundary rule

A retailer listing is never the canonical product. A listing can be linked to one product variant, remain unmatched, enter manual review or be re-matched when parsers and taxonomy rules improve.
