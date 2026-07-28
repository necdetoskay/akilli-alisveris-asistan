# Quarantine and Dead-Letter Handling

## Quarantine purpose

Quarantine preserves problematic observations for investigation and replay.

Suggested fields:

```text
id
run_id
retailer_id
source_observation_id
failure_stage
failure_code
failure_message
payload_ref
parser_version
retryable
first_failed_at
last_failed_at
attempt_count
status
resolution_notes
```

## Status values

```text
open
retry_scheduled
resolved
ignored
blocked
```

## Dead-letter rule

A record enters the dead-letter state when:

- retry attempts are exhausted,
- the failure is deterministic,
- manual intervention is required.

## Safety rule

Do not silently drop data merely because it cannot currently be normalized or matched.
