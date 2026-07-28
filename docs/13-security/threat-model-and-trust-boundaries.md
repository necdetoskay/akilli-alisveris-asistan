# Threat Model and Trust Boundaries

## Primary assets

```text
user accounts
sessions
saved baskets
watch subscriptions
notification preferences
retailer credentials
scraper execution environment
canonical catalog
price observations
matching decisions
administrative controls
audit records
```

## Trust boundaries

```text
browser ↔ public API
public API ↔ application services
application services ↔ database
workers ↔ queues
scrapers ↔ retailer websites
admin client ↔ privileged API
notification service ↔ external channels
```

## Example threats

```text
credential theft
session hijacking
authorization bypass
cross-user data access
malicious retailer content
HTML or script injection
price data poisoning
duplicate-event abuse
scraper SSRF
secret leakage
admin action abuse
dependency compromise
```

## Threat-analysis method

Use scenario-based analysis with:

```text
asset
actor
entry point
trust boundary
attack path
impact
existing control
residual risk
required mitigation
```
