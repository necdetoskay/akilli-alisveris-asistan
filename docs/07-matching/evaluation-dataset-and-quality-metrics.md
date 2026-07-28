# Evaluation Dataset and Quality Metrics

## Labeled dataset

Build a curated dataset containing:

```text
listing
correct canonical variant
hard negative candidates
category
retailer
reasoning notes
reviewer identity
label version
```

## Required metrics

```text
precision
recall
F1
auto-match precision
manual-review rate
false-positive rate
false-negative rate
top-1 accuracy
top-3 recall
category-specific accuracy
```

## Most important metric

Auto-match precision is more important than maximizing automatic coverage.

A wrong price comparison is more damaging than leaving a listing unmatched.

## Evaluation slices

Measure separately by:

- retailer,
- category,
- brand,
- package complexity,
- missing identifiers,
- new products,
- promotion-heavy titles.

## Regression gate

A new matcher version must not be activated when it reduces precision beyond the accepted tolerance.
