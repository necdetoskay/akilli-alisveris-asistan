# Price History and Availability

## Append-only observations

Every successful scrape should produce observations rather than overwrite history.

### Price observation

```text
id
offer_id
observed_price
original_price
currency
observed_at
run_id
source_hash
```

### Availability observation

```text
id
offer_id
availability_status
stock_text
observed_at
run_id
source_hash
```

## Current state projection

Current price and availability may be stored on `Offer` for fast reads. The projection is derived from the latest valid observation.

## Unit price

Unit price should be calculated from normalized quantities whenever possible.

```text
TL / kg
TL / litre
TL / piece
TL / diaper
```

The calculation stores its input quantity, normalized quantity, formula version, confidence and reason when unavailable.
