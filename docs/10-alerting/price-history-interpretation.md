# Price History Interpretation

## History windows

Useful analysis windows:

```text
24 hours
7 days
30 days
90 days
all available history
```

## Derived values

```text
current price
previous price
rolling minimum
rolling maximum
rolling median
historical minimum
historical maximum
percentage change
absolute change
volatility
observation count
```

## Example

```text
Current price: 489,90 TL
30-day median: 539,90 TL
30-day minimum: 479,90 TL
```

Interpretation:

```text
The current price is 9.3% below the 30-day median,
but it is not a new 30-day low.
```

## Data sufficiency

Do not claim a historical low when history is incomplete.

Store:

```text
history_start
observation_count
coverage_confidence
```
