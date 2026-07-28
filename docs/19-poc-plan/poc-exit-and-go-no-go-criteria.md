# POC Exit and Go/No-Go Criteria

## Go

Proceed to production-oriented implementation when:

```text
primary user flow works
matching precision meets target
pricing tests pass fully
scraper quality is acceptable
manual review workload is manageable
LLM provides measurable value or is safely optional
critical tests are stable
```

## Conditional go

Proceed with restrictions when:

```text
the core concept is validated
one subsystem needs replacement
scope can remain limited
risk has a clear mitigation plan
```

## No-go or pivot

Stop or redesign when:

```text
matching precision remains unsafe
retailer data cannot be collected reliably
comparable price cannot be calculated consistently
manual workload exceeds expected value
LLM dependency cannot be controlled
test suite cannot reproduce results
```

## Required final report

The POC closes with:

```text
measured results
target comparison
known limitations
technical debt
operational findings
recommended next step
```
