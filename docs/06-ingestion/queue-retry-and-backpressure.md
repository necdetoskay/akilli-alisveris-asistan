# Queue, Retry and Backpressure

## Queue model

Recommended logical queues:

```text
discover
fetch
parse
normalize
match
persist
publish
```

They may initially be implemented in one worker process while preserving logical separation.

## Retry policy

Retries should depend on failure class.

### Retryable

- network timeout,
- transient HTTP 5xx,
- temporary database failure,
- rate-limit response,
- short-lived browser failure.

### Non-retryable

- unsupported page structure,
- invalid required identity,
- deterministic parser error,
- blocked source requiring human action.

## Backoff

Use exponential backoff with jitter.

Example policy:

```text
attempt 1: immediate
attempt 2: 30 seconds
attempt 3: 2 minutes
attempt 4: 10 minutes
attempt 5: 1 hour
```

## Backpressure

The system should slow intake when:

- parse backlog grows,
- database latency rises,
- retailer rate limits are approached,
- error rates exceed thresholds,
- downstream publication is delayed.
