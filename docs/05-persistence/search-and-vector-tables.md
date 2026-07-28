# Search and Vector Tables

## PostgreSQL extensions

Recommended extensions:

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS unaccent;
```

## `search.product_documents`

```text
product_variant_id uuid primary key
search_text text not null
normalized_search_text text not null
search_vector tsvector not null
embedding vector null
embedding_model text null
embedding_version text null
updated_at timestamptz not null
```

## Indexes

```text
GIN(search_vector)
GIN(normalized_search_text gin_trgm_ops)
HNSW or IVFFlat on embedding
```

The vector index should be added only after:

- the embedding dimension is fixed,
- the model is selected,
- representative data volume exists,
- recall and latency are measured.

## Query aliases

### `search.query_aliases`

```text
id uuid primary key
source_phrase text not null
normalized_phrase text not null
category_id uuid null
intent_code text null
attribute_filters jsonb null
priority integer not null
status text not null
created_at timestamptz not null
updated_at timestamptz not null
```

Examples:

```text
cırtlı bez → baby_diaper + closure_type=tape
tost peyniri → cheese + usage_intent=toast
```

## Search projection rule

Search documents are derived projections. Canonical catalog data remains the source of truth.
