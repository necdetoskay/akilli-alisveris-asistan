# POC Sprint Plan

## POC-00 — Foundation and Test Harness

Deliver:

```text
pnpm workspace
Turborepo
TypeScript strict configuration
lint and formatting
Vitest
integration-test infrastructure
Playwright
Docker Compose
CI quality gates
```

Mandatory tests:

```text
root script smoke tests
workspace dependency test
sample unit test
sample integration test
sample end-to-end test
CI failure verification
```

Exit condition:

The repository can run all quality checks through one command.

---

## POC-01 — PostgreSQL and Core Catalog

Deliver:

```text
database connection
migrations
retailer
product
variant
listing
offer
price observation
seed data
```

Mandatory tests:

```text
migration tests
repository integration tests
constraints
transaction behavior
seed idempotency
```

Exit condition:

Canonical catalog data can be persisted and read reliably.

---

## POC-02 — Manual Retailer Ingestion

Deliver:

```text
one retailer adapter
one category
manual scrape trigger
raw observation storage
parser
replay command
```

Mandatory tests:

```text
HTML fixtures
parser regression
timeouts
invalid content
duplicate ingestion
replay idempotency
data-quality assertions
```

Exit condition:

Representative retailer data is collected reproducibly.

---

## POC-03 — Normalization and Manual AI Configuration

Deliver:

```text
deterministic normalization
brand extraction
quantity parsing
category attributes
manual AI settings
LLM structured-output adapter
manual fallback
```

Mandatory tests:

```text
normalization unit tests
Turkish text fixtures
schema validation
provider failure
invalid API key response
secret redaction
manual fallback
```

Exit condition:

Raw listings become validated normalized records with or without AI.

---

## POC-04 — Matching and Review

Deliver:

```text
candidate generation
matching score
hard conflicts
confidence bands
manual review page
approve and reject actions
```

Mandatory tests:

```text
golden matching dataset
hard-conflict tests
score boundaries
review authorization
idempotent decisions
audit records
UI component tests
```

Exit condition:

Equivalent products can be grouped with measurable precision and safe manual control.

---

## POC-05 — Pricing and Comparison

Deliver:

```text
effective price
unit price
basic promotion rules
offer ranking
comparison API
comparison page
```

Mandatory tests:

```text
golden money fixtures
rounding
invalid quantity
promotion boundaries
API contract tests
UI loading and error tests
comparison end-to-end test
```

Exit condition:

The user can see correct and explainable comparable prices.

---

## POC-06 — Search and Complete User Flow

Deliver:

```text
search endpoint
lexical search
typo tolerance
structured filters
result ranking
search page
product detail
```

Mandatory tests:

```text
search relevance dataset
filter tests
pagination
zero-result behavior
ranking regression
accessibility smoke test
complete end-to-end flow
```

Exit condition:

The primary POC user scenario works from search to comparison.

---

## POC-07 — Quality Evaluation and POC Decision

Deliver:

```text
matching evaluation report
search evaluation report
scraper reliability report
performance smoke tests
security review
known limitations
go-no-go report
```

Mandatory tests:

```text
full regression suite
fresh database run
existing database migration run
backup and restore smoke test
failure recovery scenario
release-candidate end-to-end suite
```

Exit condition:

The POC can be accepted, extended or stopped using measured evidence.
