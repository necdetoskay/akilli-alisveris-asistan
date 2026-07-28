# Retailer, Listing and Offer Tables

## `retailer.retailers`

```text
id uuid primary key
code text not null unique
name text not null
base_url text null
status text not null
created_at timestamptz not null
updated_at timestamptz not null
```

## `retailer.stores`

```text
id uuid primary key
retailer_id uuid not null references retailer.retailers(id)
external_store_id text null
name text not null
city text null
district text null
delivery_channel text null
status text not null
```

## `retailer.listings`

```text
id uuid primary key
retailer_id uuid not null references retailer.retailers(id)
external_listing_id text null
source_url text not null
canonical_source_url text not null
raw_title text not null
normalized_title text not null
raw_brand text null
normalized_brand_id uuid null references catalog.brands(id)
source_category_path text null
canonical_category_id uuid null references catalog.categories(id)
matched_variant_id uuid null references catalog.product_variants(id)
match_status text not null
parser_version text not null
first_seen_at timestamptz not null
last_seen_at timestamptz not null
is_active boolean not null
source_payload_ref text null
created_at timestamptz not null
updated_at timestamptz not null
```

Recommended uniqueness:

```text
unique(retailer_id, external_listing_id)
unique(retailer_id, canonical_source_url)
```

Because some retailers do not provide stable external IDs, partial unique indexes may be required.

## `commerce.offers`

```text
id uuid primary key
listing_id uuid not null references retailer.listings(id)
store_id uuid null references retailer.stores(id)
currency char(3) not null
current_price numeric(14,2) null
original_price numeric(14,2) null
unit_price numeric(14,4) null
unit_price_unit text null
promotion_text text null
availability_status text not null
valid_from timestamptz null
valid_until timestamptz null
last_observed_at timestamptz not null
created_at timestamptz not null
updated_at timestamptz not null
```
