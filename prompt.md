You are a principal software architect and staff-level backend/mobile engineer.
Design and specify a production-grade system for the following application.

Your output must include:
- product specification
- backend architecture (Spring Boot)
- database schema (Postgres + PostGIS)
- API contracts
- proximity notification algorithm
- security & privacy model
- deployment & DevOps
- observability & testing
- MVP → V1 roadmap

Think deeply. Optimize for correctness, privacy, scalability, and long-term maintainability.

────────────────────────────────
0) PRODUCT OVERVIEW
────────────────────────────────

Build a map-based social notes platform where users create location-anchored "Pins".
Each Pin can be private, shared with selected friends, shared with selected followers,
or public.

There is:
- NO live location sharing
- ONLY proximity-based discovery and notifications
- STRONG permission controls at relationship and per-pin level
- Time-based availability and expiration (pins disappear everywhere after expiry)

Primary use cases:
1) Private future-self notes (hidden even from the owner until near)
2) Friends-only proximity notes
3) Influencer / creator treasure hunts using follower lists
4) Public proximity-based discovery with safety constraints

────────────────────────────────
1) CORE CONCEPTS & RULES
────────────────────────────────

1.1 Social Graph
- Users
- Friends (mutual relationship)
- Followers / Following (one-way)
- Blocks (bidirectional content hiding)

Per-relationship preferences (viewer → subject):
- can_see_pins (boolean)
- can_receive_proximity_notifications (boolean)

Defaults must be PRIVACY-FIRST (OFF unless enabled).

1.2 Lists
Users can create:
- Friend lists (e.g. Family, Inner Circle)
- Follower lists (e.g. VIP, Treasure Hunters)

Lists are used for pin access control.

1.3 Pins (Notes)
Each Pin includes:

CONTENT:
- text (required)
- optional media: image/audio/video
- optional link

LOCATION:
- exact lat/lng (stored server-side)
- optional altitude
- optional polygon-based mystery zone (creator-drawn)

ACCESS CONTROL:
- audience_type: PRIVATE | FRIENDS | FOLLOWERS | PUBLIC
- ACL:
  - friend lists
  - follower lists
  - optional specific users

TIME:
- available_from (now or scheduled datetime)
- expires_at (required)
- AFTER expires_at: pin disappears globally and permanently

REVEAL POLICY:
- VISIBLE_ALWAYS
- REACH_TO_REVEAL
- reveal_radius_meters
- map_precision: EXACT | BLURRED
- mystery_zone_polygon (optional)

NOTIFICATIONS:
- PROXIMITY ONLY
- notify_radius_meters
- cooldown (prevent spam)
- one-time or repeatable

FUTURE-SELF MODE (PRIVATE pins only):
- pin is hidden from owner until proximity condition is met
- owner receives proximity notification
- reveal requires explicit user action ("Open")

────────────────────────────────
2) DISCOVERY & VISIBILITY RULES
────────────────────────────────

A user can discover or unlock a Pin ONLY if ALL conditions pass:

1. Current time ∈ [available_from, expires_at)
2. User is not blocked by pin owner
3. Pin audience allows user
4. User belongs to required lists (if any)
5. User enabled can_see_pins for pin owner
6. For notifications: can_receive_proximity_notifications enabled
7. User is within required radius (for reach-to-reveal)

Expired pins:
- disappear everywhere
- are not retrievable even by users who previously unlocked them
- metadata may be retained ONLY for internal audit with NO content

────────────────────────────────
3) SYSTEM ARCHITECTURE (SPRING BOOT)
────────────────────────────────

Use a MODULAR MONOLITH (Spring Boot) with clear internal boundaries.
Design so services can be extracted later.

Modules:

1) Auth Module
- JWT access + refresh tokens
- device registration
- OAuth optional (Google/Apple)

2) Social Graph Module
- friends, follows, blocks
- relationship preferences

3) Lists Module
- friend lists
- follower lists

4) Pins Module
- pin CRUD
- ACL evaluation
- reveal rules
- expiration enforcement

5) Geo Module
- PostGIS queries
- distance calculations
- polygon containment checks

6) Proximity Engine
- candidate pin selection
- notification eligibility
- cooldown tracking

7) Notification Module
- proximity-triggered delivery
- local-device-first strategy

8) Media Module
- signed upload URLs
- CDN delivery

9) Moderation Module
- reports
- abuse handling
- admin flags

Internal communication:
- domain events (Spring Events or message queue abstraction)

────────────────────────────────
4) DATABASE DESIGN (POSTGRES + POSTGIS)
────────────────────────────────

Core tables (must be specified in detail):

- users
- user_devices
- friendships
- follows
- relationship_preferences
- blocks

- lists
- list_members

- pins
  - id
  - owner_id
  - content_ref
  - audience_type
  - available_from
  - expires_at
  - reveal_type
  - reveal_radius_m
  - map_precision
  - geom (POINT, PostGIS)
  - mystery_geom (POLYGON, nullable)
  - created_at

- pin_acl
  - pin_id
  - target_type (LIST | USER)
  - target_id

- pin_media

- pin_notifications_state
  - pin_id
  - user_id
  - last_notified_at
  - unlocked_at

Indexes:
- GIST on geom and mystery_geom
- composite indexes on (expires_at), (owner_id)
- geohash or H3 cell column for coarse matching

────────────────────────────────
5) PROXIMITY NOTIFICATION ALGORITHM
────────────────────────────────

STRICT RULE:
- NO live tracking
- NO remote "someone posted" notifications

Design:

CLIENT:
- obtains permission for background location
- computes coarse location bucket (e.g. H3 cell ~500–1000m)
- sends bucket updates periodically (throttled)

SERVER:
- receives bucket
- selects candidate pins based on:
  - same or neighboring buckets
  - relationship toggles
  - ACL
  - availability window
- returns candidate pin zones (IDs + polygons/radii)

CLIENT:
- registers OS geofences for limited candidates
- on geofence trigger:
  - calls /pins/{id}/check-reveal with precise location

SERVER:
- validates distance / polygon containment
- validates ACL + time + block
- returns unlock result
- updates notification state

COOLDOWN:
- enforce per pin/user cooldown

EDGE CASES:
- dense urban areas → rank candidates
- battery limits (iOS/Android geofence caps)
- mystery polygon shown but exact pin hidden

────────────────────────────────
6) API DESIGN (REST)
────────────────────────────────

Define endpoints with request/response examples:

Auth:
- POST /auth/login
- POST /auth/refresh

Social:
- POST /follow/{userId}
- POST /friends/request/{userId}
- POST /friends/accept/{requestId}
- PUT /relationships/{userId}/preferences
- POST /block/{userId}

Lists:
- POST /lists
- POST /lists/{id}/members

Pins:
- POST /pins
- GET /pins/map?bbox=...
- GET /pins/candidates?bucket=...
- POST /pins/{id}/check-reveal
- DELETE /pins/{id}

Media:
- POST /media/upload-url

Reports:
- POST /reports

Each endpoint must specify:
- auth requirements
- authorization checks
- rate limits
- idempotency where applicable

────────────────────────────────
7) FRONTEND / MOBILE UX
────────────────────────────────

Platforms:
- Mobile-first (iOS/Android)
- Web secondary

Key screens:
- onboarding with privacy explanation
- map with layer toggles
- per-user visibility toggles
- pin creation wizard (location → audience → reveal → time → notify)
- mystery zone visualization (polygon)
- unlock modal ("You’re near something")
- lists management
- safety/report/block UI

────────────────────────────────
8) SECURITY & PRIVACY
────────────────────────────────

- JWT short-lived access tokens
- refresh token rotation
- policy engine for pin access
- never log precise locations
- encrypt media & DB at rest
- secret manager for credentials
- GDPR-style delete/export
- rate limits on:
  - follows
  - pin creation
  - proximity checks

────────────────────────────────
9) DEPLOYMENT & DEVOPS
────────────────────────────────

Stack:
- Spring Boot (Java 17+)
- Docker
- Kubernetes (GKE or equivalent)
- Managed Postgres + Redis
- Object storage + CDN

CI/CD:
- GitHub Actions
- test → build → containerize → deploy

Infra:
- Terraform
- separate dev/stage/prod
- Flyway or Liquibase migrations

────────────────────────────────
10) OBSERVABILITY
────────────────────────────────

- structured logging
- distributed tracing
- metrics:
  - proximity checks
  - unlock success rate
  - notification delivery
- error tracking (Sentry)
- dashboards for abuse & spam signals

────────────────────────────────
11) TESTING STRATEGY
────────────────────────────────

- unit tests (ACL engine, geo math)
- integration tests (API + DB)
- E2E tests (critical flows)
- load tests (city-density simulation)
- security tests (auth, enumeration)

────────────────────────────────
12) MVP vs V1
────────────────────────────────

MVP:
- accounts
- follow/friends
- lists
- pins (reach-to-reveal)
- polygon mystery zones
- proximity notifications
- expiration

V1:
- private accounts
- creator hunt templates
- moderation tools
- analytics
- monetization hooks

────────────────────────────────
13) REQUIRED OUTPUT
────────────────────────────────

Produce:
1) architecture explanation
2) DB schema
3) API spec
4) policy engine pseudocode
5) proximity algorithm
6) security checklist
7) DevOps topology
8) MVP backlog & milestones

Design for correctness, trust, and long-term scale.
