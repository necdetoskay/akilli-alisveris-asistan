# Retailer Listing and Offer Model

## Retailer listing

A retailer listing is the source-specific product page or catalog item.

Suggested fields:

```text
id
retailer_id
external_listing_id
source_url
raw_title
normalized_title
raw_brand
normalized_brand_id
source_category_path
canonical_category_id
matched_variant_id
match_status
first_seen_at
last_seen_at
is_active
source_payload_ref
parser_version
```

## Offer

An offer is the current purchasable commercial state of a listing.

Suggested fields:

```text
id
retailer_listing_id
store_id
currency
current_price
original_price
unit_price
unit_price_unit
promotion_text
availability_status
valid_from
valid_until
last_observed_at
```

## Separation rule

The listing describes what the retailer calls the item. The offer describes price, discount, availability, store, delivery channel and validity period.

A listing may have multiple offers when stores, delivery channels, loyalty programs or geographic regions differ.
