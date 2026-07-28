# POC Architecture and Manual AI Configuration

## Initial architecture

```text
Web UI
  ↓
API
  ↓
Application services
  ↓
PostgreSQL
```

Supporting workers may be introduced only where needed for scraping or replay.

## Manual AI flow

```text
Administrator enters provider settings
    ↓
Configuration is validated
    ↓
AI operation is triggered manually
    ↓
Structured result is validated
    ↓
Result is stored with model metadata
```

## Initial configuration fields

```text
provider
model
apiKey
temperature
maxTokens
enabled
```

## Recommended first provider mode

Use one OpenAI-compatible endpoint contract so OpenRouter or another compatible provider can be configured without changing domain code.

## Security

API keys:

- are never returned to the client after saving,
- are never written to logs,
- are encrypted or stored through environment configuration,
- are redacted in errors,
- are excluded from test fixtures.

## Fallback

Every AI-assisted operation must support manual input or deterministic parsing when the provider is unavailable.

## Rule

The POC must never become unusable solely because the LLM is unavailable.
