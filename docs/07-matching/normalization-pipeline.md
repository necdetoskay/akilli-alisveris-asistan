# Normalization Pipeline

## Goal

Convert inconsistent retailer text into comparable, typed product facts.

## Pipeline

```text
Raw title and attributes
    ↓
Unicode and whitespace normalization
    ↓
Brand extraction
    ↓
Quantity and unit extraction
    ↓
Package-count extraction
    ↓
Variant token extraction
    ↓
Category classification
    ↓
Attribute mapping
    ↓
Canonical normalized representation
```

## Example

Input:

```text
PRİMA Premium Care 4 Beden 52'li Bebek Bezi
```

Normalized output:

```json
{
  "brand": "Prima",
  "productFamily": "Premium Care",
  "category": "baby_diaper",
  "attributes": {
    "size": 4,
    "packageCount": 52,
    "productForm": "standard"
  },
  "normalizedTitle": "prima premium care 4 numara 52 adet bebek bezi"
}
```

## Rules

Normalization must be:

- deterministic,
- versioned,
- reversible enough for audit,
- independent from final match acceptance,
- safe to replay.
