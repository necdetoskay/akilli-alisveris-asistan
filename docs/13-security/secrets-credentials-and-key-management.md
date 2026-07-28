# Secrets, Credentials and Key Management

## Secret types

```text
database credentials
retailer credentials
API keys
notification provider credentials
encryption keys
signing keys
service-account tokens
```

## Storage

Secrets must not be stored in:

- source code,
- committed environment files,
- logs,
- issue descriptions,
- client bundles,
- screenshots or documentation examples.

Use a managed secret store or protected deployment-secret mechanism.

## Rotation

Define rotation requirements for:

```text
high-risk credentials
suspected exposure
employee or contractor departure
provider policy change
scheduled key lifecycle
```

## Access

Secret access must follow least privilege and be attributable to a service identity or operator.

## Rule

A secret copied into chat, a ticket or a Git commit must be treated as exposed and rotated.
