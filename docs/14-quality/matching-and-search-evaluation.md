# Matching and Search Evaluation

## Matching datasets

Maintain labeled examples for:

```text
exact match
valid variant match
hard conflict
near-duplicate title
brand alias
package-size mismatch
product-form mismatch
category mismatch
```

## Primary matching KPI

```text
auto-match precision
```

False auto-matches are more damaging than manual-review volume.

## Search evaluation

Evaluate:

```text
intent interpretation
top-k relevance
zero-result rate
filter correctness
attribute conflict handling
typo tolerance
alias resolution
```

## Regression gate

A new matcher or search version must not reduce accepted precision or critical-query performance beyond tolerance.
