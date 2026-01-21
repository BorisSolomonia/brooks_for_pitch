# Security and Privacy Model

## Threat Model (Top Risks)
- Location inference by scraping or repeated queries.
- Spoofed location or replayed geofence events.
- Relationship graph enumeration.
- Abusive content and stalking behavior.

## Mitigations
- Strict rate limits and anomaly detection for proximity checks.
- Per-pin and per-user cooldown enforcement.
- Challenge tokens on geofence trigger to prevent replay.
- No storage of exact location history; only short-lived buckets.
- Blocks hide content in both directions and remove visibility.

## Authentication
- Short-lived JWT access tokens.
- Refresh token rotation and revocation list.
- Device registration with per-device refresh tokens.

## Authorization
- Policy engine for pin access with explicit rules.
- Centralized ACL evaluation with list and relationship checks.
- Service-to-service calls authenticated with JWT and scoped headers.

## Data Protection
- Encryption at rest for DB and object storage.
- TLS for all in-transit traffic.
- Secrets in a managed secret store.

## Privacy
- No live location sharing.
- Minimal logs; never log precise lat/lng.
- User data export and deletion (GDPR style).

## Abuse Handling
- Reporting pipeline with admin review.
- Rate limits on follows, pin creation, and map queries.
- Soft delete and quarantine for suspicious pins.
