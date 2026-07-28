# Confidence Scoring and Thresholds

## Composite score

An initial explainable score can be:

```text
total_score =
    identifier_score * w1
  + brand_score * w2
  + category_score * w3
  + lexical_score * w4
  + semantic_score * w5
  + attribute_score * w6
  - conflict_penalty
```

Weights are category-aware.

## Example

For baby diapers:

```text
brand: high importance
size: critical
package count: high importance
product form: critical
semantic title similarity: medium importance
```

For cheese:

```text
brand: medium importance
net weight: high importance
cheese type: high importance
form: medium importance
usage intent: supporting evidence
```

## Initial thresholds

Suggested starting point:

```text
0.95–1.00 → auto-match
0.80–0.95 → auto-match only without hard conflicts
0.60–0.80 → manual review
below 0.60 → unmatched or rejected
```

These are provisional and must be calibrated on labeled data.

## Margin rule

The score difference between the top two candidates also matters.

A high top score with a very small margin may still require review.
