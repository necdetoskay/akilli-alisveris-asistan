# Dependency and Versioning Policy

## Dependency placement

A dependency belongs in the package that uses it.

Root dependencies are reserved for shared development tooling.

## Versions

Use a single lockfile and controlled upgrades.

## Internal packages

Internal packages use workspace references:

```json
{
  "dependencies": {
    "@akilli-alisveris/domain": "workspace:*"
  }
}
```

## Upgrade policy

Dependency upgrades should include:

```text
release notes review
security review
test execution
migration impact review
rollback awareness
```

## Rule

Do not add duplicate libraries that solve the same concern without an architecture decision.
