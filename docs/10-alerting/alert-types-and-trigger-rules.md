# Alert Types and Trigger Rules

## Target price reached

Trigger when:

```text
effective_price <= target_price
```

## Significant price drop

Trigger when both configured conditions are met:

```text
absolute_drop >= minimum_drop_amount
percentage_drop >= minimum_drop_percentage
```

## New historical low

Trigger when:

```text
current_price < previous_historical_low
```

with sufficient history confidence.

## Back in stock

Trigger only after a meaningful unavailable period:

```text
unavailable → available
```

## Promotion started

Trigger when a newly detected promotion:

- applies to the watched product,
- is currently valid,
- satisfies user membership preferences.

## Basket threshold reached

Trigger when:

```text
optimized_basket_total <= user_threshold
```

using the same basket constraints saved by the user.
