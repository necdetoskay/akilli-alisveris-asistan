# Test-First Delivery Policy

## Policy

Every behavior begins with an executable test or an explicit test case before implementation is considered complete.

## Minimum tests for every feature

```text
happy path
invalid input
boundary case
expected failure
authorization when applicable
persistence behavior when applicable
observability assertion when applicable
```

## Required test layers

```text
unit
domain
component
integration
contract
end-to-end
data quality
regression
```

Not every file needs every layer, but every user-visible or business-critical behavior must be covered by the relevant layers.

## Bug policy

Every confirmed bug requires a failing regression test before or together with the fix.

## No-test exceptions

A no-test exception requires:

```text
written reason
risk assessment
owner
expiry date
follow-up task
```

## Rule

No feature is accepted based only on manual verification.
