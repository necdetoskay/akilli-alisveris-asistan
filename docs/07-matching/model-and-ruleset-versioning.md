# Model and Ruleset Versioning

## Versioned components

Store versions for:

```text
normalization rules
brand dictionary
category taxonomy
attribute extractor
embedding model
candidate generator
scoring rules
threshold configuration
manual override policy
```

## Decision reproducibility

A match decision must be reproducible from:

- source observation,
- normalized representation,
- candidate set,
- feature values,
- model and ruleset versions,
- threshold configuration.

## Activation

New versions should support:

```text
shadow evaluation
dry run
partial rollout
category-specific rollout
rollback
```

## Supersession

A new decision supersedes the previous decision but does not delete it.
