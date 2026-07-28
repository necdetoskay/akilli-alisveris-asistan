# Price and Availability History Tables

## `commerce.price_observations`

```text
id uuid primary key
offer_id uuid not null references commerce.offers(id)
observed_price numeric(14,2) not null
original_price numeric(14,2) null
currency char(3) not null
observed_at timestamptz not null
run_id uuid not null
source_hash text not null
created_at timestamptz not null
```

Recommended uniqueness:

```text
unique(offer_id, observed_at, source_hash)
```

## `commerce.availability_observations`

```text
id uuid primary key
offer_id uuid not null references commerce.offers(id)
availability_status text not null
stock_text text null
observed_at timestamptz not null
run_id uuid not null
source_hash text not null
created_at timestamptz not null
```

## `commerce.unit_price_calculations`

```text
id uuid primary key
offer_id uuid not null references commerce.offers(id)
input_price numeric(14,2) not null
input_quantity numeric null
input_unit text null
normalized_quantity numeric null
normalized_unit text null
calculated_unit_price numeric(14,4) null
formula_version text not null
confidence numeric(5,4) null
failure_reason text null
calculated_at timestamptz not null
```

## Partitioning

Price observations may be partitioned by month once data volume justifies it.

Initial recommendation:

- start unpartitioned,
- collect row-count and query-latency metrics,
- introduce monthly range partitioning before tables become operationally difficult to migrate.
