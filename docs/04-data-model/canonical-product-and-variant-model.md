# Canonical Product and Variant Model

## Canonical product

A canonical product represents the stable market concept shared by one or more variants.

Example:

```text
Prima Premium Care Bebek Bezi
```

Suggested fields:

```text
id
brand_id
category_id
canonical_name
slug
description
status
created_at
updated_at
```

## Product variant

A variant represents a commercially distinguishable version.

Examples:

```text
Prima Premium Care 4 Numara 52 Adet
Prima Premium Care 5 Numara 40 Adet
```

Suggested fields:

```text
id
canonical_product_id
variant_name
manufacturer_sku
gtin
package_quantity
net_quantity
net_quantity_unit
status
search_document
embedding
created_at
updated_at
```

## Product identity

Variant identity may depend on brand, product family, model, series, size, package count, weight, volume, flavor, color, target age, usage form, GTIN or manufacturer SKU.

GTIN is high-confidence evidence but must not be treated as universally present or universally correct.
