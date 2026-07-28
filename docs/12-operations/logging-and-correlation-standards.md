# Logging and Correlation Standards

## Structured logging

Logs should be structured and machine-readable.

Recommended fields:

```text
timestamp
level
service
environment
event_name
message
correlation_id
trace_id
span_id
request_id
user_id_hash
retailer_id
scrape_run_id
observation_id
product_variant_id
duration_ms
outcome
error_code
```

## Sensitive data

Logs must not contain passwords, session tokens, API keys, full payment information or raw personal data by default.

## Correlation

Every user request and background flow should carry a correlation identifier.

## Error logging

Errors should include a stable error code, operation, retryability, failure class and safe message.
