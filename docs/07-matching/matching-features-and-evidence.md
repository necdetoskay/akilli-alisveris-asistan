# Matching Features and Evidence

## Positive evidence

Examples:

```text
verified GTIN match
same normalized brand
same product family
same category
same package count
same net quantity
compatible size
high lexical similarity
high semantic similarity
same form
same flavor
```

## Negative evidence

Examples:

```text
different brand
different product form
different size
different package count
different flavor
different target age
different quantity unit
category conflict
```

## Feature groups

### Identifier features

- GTIN
- manufacturer SKU
- retailer external mapping

### Lexical features

- normalized title similarity
- token overlap
- trigram score
- phrase match

### Semantic features

- embedding cosine similarity
- usage-intent similarity
- alias-expanded meaning

### Structured features

- category
- brand
- package count
- weight
- volume
- size
- form
- flavor

## Explainability

Every accepted or rejected decision should include human-readable evidence.
