# Service-Level Objectives and Error Budgets

## Initial SLO candidates

```text
99.5% successful search requests per rolling 30 days
95% of search requests complete within 1.5 seconds
95% of actively monitored offers meet freshness targets
95% of standard baskets complete within 5 seconds
95% of eligible price events are evaluated within 10 minutes
```

These are initial targets and require production calibration.

## Error budget

When the error budget is exhausted:

- reliability work takes priority,
- risky releases may be paused,
- root causes must be reviewed.

## Rule

SLOs must represent user-visible outcomes, not only server uptime.
