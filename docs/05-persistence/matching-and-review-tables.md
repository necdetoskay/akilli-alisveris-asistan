# Matching and Review Tables

## `matching.candidates`

```text
id uuid primary key
listing_id uuid not null references retailer.listings(id)
product_variant_id uuid not null references catalog.product_variants(id)
lexical_score numeric(6,5) null
semantic_score numeric(6,5) null
attribute_score numeric(6,5) null
identifier_score numeric(6,5) null
category_score numeric(6,5) null
total_score numeric(6,5) not null
candidate_rank integer not null
matcher_version text not null
created_at timestamptz not null
```

## `matching.decisions`

```text
id uuid primary key
listing_id uuid not null references retailer.listings(id)
product_variant_id uuid null references catalog.product_variants(id)
decision text not null
confidence numeric(6,5) null
decision_source text not null
ruleset_version text null
model_version text null
explanation jsonb null
decided_at timestamptz not null
supersedes_decision_id uuid null references matching.decisions(id)
```

## `matching.evidence`

```text
id uuid primary key
decision_id uuid not null references matching.decisions(id)
evidence_type text not null
weight numeric(6,5) null
value jsonb not null
created_at timestamptz not null
```

## `matching.manual_reviews`

```text
id uuid primary key
listing_id uuid not null references retailer.listings(id)
status text not null
assigned_to text null
resolution text null
resolution_notes text null
created_at timestamptz not null
resolved_at timestamptz null
```

The current active decision can be projected to `retailer.listings.matched_variant_id`.
