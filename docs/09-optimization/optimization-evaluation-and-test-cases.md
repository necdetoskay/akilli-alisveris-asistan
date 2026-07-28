# Optimization Evaluation and Test Cases

## Required test scenarios

```text
one product, one retailer
one product, multiple retailers
multi-item basket, one complete retailer
multi-item basket, split cheaper
delivery threshold changes winner
membership price changes winner
multi-buy campaign
missing item
substitution allowed
substitution forbidden
stale price excluded
anomalous price excluded
```

## Correctness metrics

```text
optimal-cost accuracy
constraint violation count
plan completeness
explanation completeness
calculation reproducibility
runtime
candidate count
```

## Golden tests

Maintain deterministic basket fixtures with known optimal results.

## Safety gate

Any optimizer change that produces a lower numerical total by violating a hard constraint must fail validation.
