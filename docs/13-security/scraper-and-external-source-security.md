# Scraper and External-Source Security

## Risks

Scrapers process untrusted external content.

Potential risks include:

```text
malicious HTML
oversized payloads
redirect abuse
SSRF
unexpected file downloads
parser denial of service
content-based injection
credential leakage
retailer blocking
```

## Isolation

Retailer adapters should run with:

- restricted network access,
- no access to internal metadata endpoints,
- minimal filesystem permissions,
- execution timeouts,
- memory and CPU limits,
- response-size limits,
- controlled redirect policy.

## Content handling

External text is data, not executable instructions.

Sanitize content before rendering and never execute scripts from retailer pages.

## Rule

A retailer page must never be able to reach internal services through the scraper.
