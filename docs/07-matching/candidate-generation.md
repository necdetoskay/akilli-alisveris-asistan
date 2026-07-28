# Candidate Generation

## Purpose

Candidate generation narrows the canonical catalog before expensive ranking.

## Candidate sources

Candidates may come from:

- verified GTIN,
- exact manufacturer SKU,
- exact normalized brand and family,
- category plus quantity filters,
- trigram title similarity,
- full-text search,
- semantic vector similarity,
- alias-expanded search.

## Blocking keys

Useful blocking keys:

```text
brand + category
category + package_count
brand + net_quantity
brand + product_family
verified_gtin
```

## Candidate limits

Recommended initial limits:

```text
identifier candidates: all exact matches
lexical candidates: top 50
semantic candidates: top 50
merged candidate set: top 100 before scoring
```

Limits should be tuned with evaluation data.

## Safety rule

Candidate generation may be permissive. Final acceptance must be strict.
