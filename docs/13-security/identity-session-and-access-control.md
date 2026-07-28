# Identity, Session and Access Control

## Authentication

Authentication should support:

- secure password or external identity provider,
- multi-factor authentication for privileged roles,
- session expiration,
- session revocation,
- device and session visibility,
- step-up authentication for critical actions.

## Session controls

```text
httpOnly cookies
secure flag
sameSite policy
short-lived access state
rotating refresh or session identifiers
CSRF protection
logout and global revocation
```

## Authorization

Authorization checks must combine:

```text
identity
role
specific permission
resource ownership
command context
authentication strength
```

## Privileged roles

Examples:

```text
catalog_reviewer
operations
security_auditor
administrator
```

Privileged access should be limited, logged and reviewed periodically.

## Rule

Administrative UI visibility is not an authorization control. Enforcement must occur on the server.
