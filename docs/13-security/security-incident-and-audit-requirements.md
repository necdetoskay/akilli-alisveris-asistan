# Security Incident and Audit Requirements

## Security events

Examples:

```text
failed privileged login
permission denial
role change
secret access
admin review decision
retailer adapter pause
observation replay
bulk export
session revocation
suspicious rate-limit activity
```

## Audit record

Suggested fields:

```text
timestamp
actor
actor_type
action
resource_type
resource_id
reason
before_state_hash
after_state_hash
correlation_id
source_ip_classification
outcome
```

## Incident priorities

Immediate investigation is required for:

- cross-user access,
- leaked credentials,
- unauthorized admin command,
- price-data tampering,
- audit-log deletion,
- malicious dependency,
- scraper access to internal network.

## Preservation

Security incident evidence should be access-controlled and retained according to incident policy.

## Rule

Audit records must be tamper-evident and must not contain secrets.
