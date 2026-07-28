# POC Success Metrics

## Matching

Recommended initial targets:

```text
auto-match precision ≥ 98%
manual-review decision accuracy ≥ 95%
hard-conflict escape rate = 0 in golden dataset
```

## Search

```text
critical-query top-5 success ≥ 90%
zero-result rate measured and explained
structured filters apply correctly = 100% in test dataset
```

## Scraper

```text
fixture parser pass rate = 100%
duplicate ingestion side effects = 0
known malformed inputs quarantined = 100%
```

## Pricing

```text
golden calculation pass rate = 100%
negative effective price = 0
invalid unit comparison is never presented as valid
```

## Reliability

```text
complete POC flow passes repeatedly
provider outage does not block manual fallback
fresh database bootstrap succeeds
all critical regression tests pass
```

## Interpretation

Targets may be adjusted only through an explicit decision with documented evidence.
