# Distributed Tracing and Request Flow

## Traced flows

```text
search
product comparison
basket optimization
watch subscription creation
alert evaluation
scrape processing
product matching
outbox delivery
```

## Example trace

```text
POST /basket-optimizations
    ↓
validate request
    ↓
resolve products
    ↓
load eligible offers
    ↓
calculate delivery constraints
    ↓
run optimizer
    ↓
persist result
```

## Sampling

Errors are always retained, slow requests receive high sampling and normal traffic uses configurable sampling.

## Rule

Tracing should reveal where time is spent without exposing private user content.
