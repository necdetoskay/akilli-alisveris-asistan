# Performance, Resilience and Chaos Tests

## Performance scenarios

```text
high-volume search
large basket optimization
alert fan-out
scrape-run burst
matching backlog
price-history query
manual-review listing
```

## Resilience scenarios

```text
database latency
queue delay
duplicate messages
notification provider outage
retailer timeout
partial search-index failure
cache outage
worker restart
```

## Chaos principles

Chaos tests should be:

- scoped,
- reversible,
- observable,
- approved,
- never run against uncontrolled production paths.

## Success criteria

The platform should degrade safely, preserve data integrity and recover without duplicate side effects.
