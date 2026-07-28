# Release Gates and Acceptance Criteria

## Required release gates

```text
format and lint pass
type check pass
unit and domain tests pass
integration tests pass
contract tests pass
migration validation pass
security checks pass
dependency audit reviewed
data-quality regression checks pass
observability present
rollback plan documented
```

## Feature acceptance

A feature is complete only when:

```text
behavior is documented
tests cover critical cases
metrics and logs exist
errors are user-safe
authorization is verified
operational failure path is known
```

## Release readiness review

Review:

```text
known risks
open defects
SLO impact
database changes
feature flags
rollback steps
support notes
incident owner
```

## Rule

Release pressure must not bypass critical correctness, security or migration gates.
