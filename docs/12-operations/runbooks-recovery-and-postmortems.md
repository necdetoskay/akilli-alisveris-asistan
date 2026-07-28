# Runbooks, Recovery and Postmortems

## Required runbooks

```text
retailer scraper stopped
parser failure spike
queue backlog
database connection exhaustion
search latency spike
stale price surge
matching precision regression
notification delivery failure
outbox consumer failure
bad deployment rollback
```

## Recovery verification

Do not close an incident only because the process restarted.

Verify that backlog drains, fresh observations arrive, prices remain valid, user queries succeed and duplicate events were not created.

## Postmortem

Postmortems should be blameless and include timeline, impact, root cause, contributing factors, detection gaps, corrective actions, owners and due dates.
