# Application and API Security Controls

## Required controls

```text
input validation
output encoding
CSRF protection
rate limiting
request-size limits
safe file handling
authorization checks
idempotency protection
security headers
CORS allow-list
query timeout
safe error responses
```

## Injection prevention

Use parameterized database queries and controlled search-query construction.

Do not concatenate untrusted values into:

```text
SQL
shell commands
regular expressions without limits
URLs for unrestricted fetch
HTML
log templates
```

## Rate limiting

Apply different policies to:

```text
anonymous search
authenticated search
basket optimization
watch creation
login
administrative commands
scraper control endpoints
```

## Rule

Validation errors must not reveal internal schemas, SQL details or authorization logic.
