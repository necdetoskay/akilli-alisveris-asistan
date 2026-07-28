# Authentication and Authorization Boundaries

## Authentication

The API receives an authenticated principal containing:

```text
subject id
session id
roles
permissions
tenant or account context
authentication strength
```

## Example roles

```text
user
support
catalog_reviewer
operations
administrator
```

## Permission examples

```text
watchlist.read_own
watchlist.write_own
alerts.read_own
matching.review
ingestion.retry
retailer.pause
admin.audit_read
```

## Ownership

Normal users may access only their own:

- watch subscriptions,
- saved baskets,
- alerts,
- preferences.

## Service boundaries

Internal workers should use service identities rather than user sessions.

## Rule

Role checks alone are insufficient. Resource ownership and command-specific permission must also be verified.
