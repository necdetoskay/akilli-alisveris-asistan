# Category Taxonomy and Attributes

## Category taxonomy

Categories should be hierarchical but stable.

```text
Bebek
└── Bebek Bezi

Süt ve Kahvaltılık
└── Peynir
    ├── Kaşar Peyniri
    ├── Eritme Peyniri
    └── Tost Peyniri
```

Suggested fields:

```text
id
parent_id
code
name
slug
status
search_aliases
schema_version
```

## Category-specific attributes

Baby diapers:

```text
size
package_count
product_form
closure_type
usage_period
weight_range
```

Cheese:

```text
cheese_type
form
fat_level
milk_type
usage_intent
net_weight
```

Critical searchable attributes should not exist only inside opaque JSON.

Controlled values should be canonical, while Turkish labels remain presentation data.
