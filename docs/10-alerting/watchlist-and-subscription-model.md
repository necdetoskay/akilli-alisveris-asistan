# Watchlist and Subscription Model

## Watchlist entities

A watchlist may contain:

```text
canonical product variant
equivalent product group
retailer listing
saved basket
category query
```

## Subscription model

Suggested fields:

```text
id
user_id
subject_type
subject_id
alert_policy
target_price
minimum_drop_amount
minimum_drop_percentage
preferred_retailers
allowed_retailers
include_loyalty_prices
include_promotions
include_substitutes
channel_preferences
status
created_at
updated_at
```

## Scope types

```text
exact_product
equivalent_products
preferred_brand
saved_search
saved_basket
```

## Rule

The subscription must preserve the exact product scope selected by the user.
