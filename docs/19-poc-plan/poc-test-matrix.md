# POC Test Matrix

## Repository foundation

Tests:

```text
workspace packages resolve
root scripts execute
type checking fails on invalid types
lint fails on rule violations
build graph detects package dependencies
```

## Database

Tests:

```text
fresh migration
migration on existing data
constraints
unique indexes
transaction rollback
seed idempotency
```

## Scraper

Tests:

```text
valid product page
missing price
out-of-stock item
changed selector
timeout
redirect
malformed payload
duplicate observation
```

## Normalization

Tests:

```text
brand extraction
quantity parsing
size parsing
product-form parsing
Turkish character normalization
unknown attribute handling
deterministic fallback
LLM schema validation
```

## Matching

Tests:

```text
exact match
valid variant
package conflict
brand conflict
product-form conflict
low confidence
manual approval
manual rejection
duplicate decision replay
```

## Pricing

Tests:

```text
effective price
unit price
discount
bundle
invalid quantity
missing quantity
currency validation
rounding
```

## Search

Tests:

```text
exact query
typo
brand alias
attribute filter
excluded attribute
zero results
pagination
ranking stability
```

## UI

Tests:

```text
loading
success
empty state
validation error
API failure
stale data indicator
manual match approval
settings validation
```

## End-to-end

Critical scenario:

```text
manual scrape
→ normalize
→ match
→ approve
→ calculate
→ search
→ compare
```
