# Observability and Testing

## Observability
- Structured JSON logs with request and correlation IDs propagated across services.
- Distributed tracing (OpenTelemetry) for API gateway and all services.
- Metrics:
  - proximity checks per minute
  - unlock success rate
  - notification delivery success/failure
  - pin creation rate
- Dashboards for abuse signals and rate limit hits.

## Testing Strategy
- Unit tests: ACL engine, geo math, reveal policy rules.
- Integration tests: API + DB per service with Testcontainers.
- Contract tests for internal service APIs.
- E2E tests: critical flows across gateway and core services.
- Load tests: city-density simulations for pins-service.
- Security tests: auth, enumeration, abuse vectors.
