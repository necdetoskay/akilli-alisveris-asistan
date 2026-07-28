# Test Pyramid and Ownership

## Test layers

```text
unit tests
domain tests
component tests
integration tests
contract tests
end-to-end tests
data-quality tests
performance tests
security tests
operational drills
```

## Suggested emphasis

```text
many fast unit and domain tests
focused integration tests
contract tests for service boundaries
limited critical end-to-end tests
continuous data-quality evaluation
```

## Ownership

Each feature owner is responsible for:

- expected behavior,
- test fixtures,
- failure cases,
- observability,
- rollback criteria.

Quality engineering supports standards and tooling but does not own all product correctness.

## Rule

Tests must be deterministic unless explicitly designed to evaluate probabilistic behavior.
