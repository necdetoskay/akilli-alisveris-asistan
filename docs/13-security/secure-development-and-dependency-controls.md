# Secure Development and Dependency Controls

## Development controls

```text
code review
branch protection
required tests
secret scanning
dependency scanning
static analysis
container scanning
migration review
security test cases
release approval
```

## Dependency policy

Dependencies should be:

- necessary,
- actively maintained,
- pinned or lockfile-controlled,
- reviewed for license and risk,
- updated through controlled pull requests.

## CI checks

Minimum checks:

```text
format
lint
type check
unit tests
integration tests
dependency audit
secret scan
build
migration validation
```

## Supply-chain protections

Use provenance and checksums where possible. Restrict package-install scripts in sensitive environments.

## Rule

A passing build is not sufficient when security checks or migration validation are skipped.
