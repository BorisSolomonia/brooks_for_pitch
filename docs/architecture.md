# Backend Architecture (Microservices)

## Summary
The backend is a microservices architecture with strict data ownership per service. A thin API Gateway routes external requests to services, and internal service-to-service calls are authenticated with JWT.

## Services
1) auth-service
- User accounts, password hashing
- JWT access + refresh tokens
- Device registration
- Owns: users, user_devices, refresh_tokens

2) social-service
- Friends, follows, blocks
- Relationship preferences
- Owns: friendships, follows, blocks, relationship_preferences

3) lists-service
- Friend and follower lists
- List membership management
- Owns: lists, list_members

4) pins-service
- Pin CRUD
- Access control evaluation
- Reveal rules and expiration
- Geo queries (PostGIS)
- Owns: pins, pin_acl, pin_media, pin_notification_state

5) media-service
- Signed upload URLs
- CDN delivery metadata (optional)
- Owns: media metadata if persisted

6) moderation-service
- Reports and abuse signals
- Owns: reports

7) notifications-service
- Proximity-triggered delivery and push integration
- Owns: notification jobs and delivery state

## Data Ownership and Access
- Each service has its own database and schema.
- No cross-service database access.
- Pins access checks call social-service and lists-service via internal APIs.

## External Entry Point
- API Gateway exposes public REST endpoints.
- Gateway validates JWT for most endpoints and forwards user context.

## Internal APIs
- social-service: GET /internal/graph/view?viewerId=&subjectId=
- lists-service: POST /internal/lists/membership
- pins-service: POST /internal/pins/{id}/check-reveal (optional for notifications-service)

## Proximity Flow
1) Client sends coarse bucket to pins-service via gateway.
2) pins-service returns candidate zones for geofencing.
3) Client triggers geofence and calls /pins/{id}/check-reveal.
4) pins-service calls social-service and lists-service to validate access.
5) pins-service returns unlock decision and content when allowed.

## Scaling Notes
- Service-specific autoscaling based on request and background job metrics.
- Cache hot list memberships and relationship preferences in pins-service.
- Read replicas for pins-service and social-service.

## Future Evolution
- Replace internal REST with async events where possible.
- Move proximity candidate selection into a dedicated worker.
- Add service mesh for mTLS and retries.
