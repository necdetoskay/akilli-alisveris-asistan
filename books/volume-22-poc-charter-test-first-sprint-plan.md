# Volume 22 — POC Charter and Test-First Sprint Plan

The POC validates the complete product-comparison flow using one retailer and one category.

All operations begin as manual triggers.

AI configuration is entered manually and AI-assisted behavior must have a deterministic or manual fallback.

The POC consists of eight sprints:

```text
POC-00 foundation and test harness
POC-01 PostgreSQL and catalog
POC-02 retailer ingestion
POC-03 normalization and AI configuration
POC-04 matching and review
POC-05 pricing and comparison
POC-06 search and complete flow
POC-07 quality evaluation and decision
```

Every feature must be covered by relevant automated tests.

The POC ends with measured matching, search, scraper and pricing results and a formal go, conditional-go or no-go decision.
