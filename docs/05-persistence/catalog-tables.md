# Catalog Tables

## `catalog.brands`

```text
id uuid primary key
name text not null
normalized_name text not null
slug text not null
status text not null
created_at timestamptz not null
updated_at timestamptz not null
```

Important constraints:

```text
unique(normalized_name)
unique(slug)
```

## `catalog.categories`

```text
id uuid primary key
parent_id uuid null references catalog.categories(id)
code text not null
name text not null
slug text not null
status text not null
schema_version integer not null
created_at timestamptz not null
updated_at timestamptz not null
```

Important constraints:

```text
unique(code)
unique(slug)
```

## `catalog.products`

```text
id uuid primary key
brand_id uuid references catalog.brands(id)
category_id uuid not null references catalog.categories(id)
canonical_name text not null
normalized_name text not null
slug text not null
status text not null
merged_into_id uuid null references catalog.products(id)
created_at timestamptz not null
updated_at timestamptz not null
```

## `catalog.product_variants`

```text
id uuid primary key
product_id uuid not null references catalog.products(id)
variant_name text not null
normalized_variant_name text not null
manufacturer_sku text null
gtin text null
package_quantity numeric null
net_quantity numeric null
net_quantity_unit text null
status text not null
created_at timestamptz not null
updated_at timestamptz not null
```

## Attribute model

### `catalog.attribute_definitions`

```text
id uuid primary key
code text not null unique
name text not null
value_type text not null
is_filterable boolean not null
is_searchable boolean not null
```

### `catalog.category_attributes`

```text
category_id uuid
attribute_definition_id uuid
is_required boolean not null
sort_order integer not null
primary key(category_id, attribute_definition_id)
```

### `catalog.product_variant_attribute_values`

```text
product_variant_id uuid
attribute_definition_id uuid
text_value text null
numeric_value numeric null
boolean_value boolean null
json_value jsonb null
normalized_value text null
primary key(product_variant_id, attribute_definition_id)
```

Exactly one typed value column should be populated according to the attribute definition.
