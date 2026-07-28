# Data Freshness and Quality Monitoring

## Freshness dimensions

```text
retailer
category
listing
offer
price
availability
promotion
search index
embedding
```

## Required indicators

```text
last successful scrape
last valid observation
age of current offer
stale listing count
missing-price count
quarantine ratio
unexpected category shift
promotion parse failure
```

## Quality alarms

Trigger investigation when a retailer suddenly returns zero products, price counts drop sharply, all prices become identical, one category disappears or match rate changes abnormally.

## Rule

Data-quality regressions should be treated as operational incidents.
