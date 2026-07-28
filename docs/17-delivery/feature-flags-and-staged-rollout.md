# Feature Flags and Staged Rollout

## Flag candidates

```text
retailer adapter
category ingestion
semantic reranking
auto-match threshold
promotion parser
watchlist alerts
basket optimization
admin tools
```

## Rollout stages

```text
local
internal
shadow
limited pilot
percentage rollout
general availability
```

## Kill switches

Critical integrations should support safe disablement without deployment.

Examples:

```text
pause retailer
disable auto matching
disable notification delivery
disable optimizer
fallback to lexical search
```

## Rule

Feature flags must have owners and removal dates. Permanent stale flags are technical debt.
