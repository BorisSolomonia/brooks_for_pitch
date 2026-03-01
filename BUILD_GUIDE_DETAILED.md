# Build Guide (Detailed, Rookie-Friendly)

This guide explains how to build a system like Brooks, then how to build this specific repository.

## Part A. How to Think About Building This Kind of App

## 1. Start With Bounded Features.
Break product behavior into domains first:
- Identity/Auth
- Social graph
- Lists
- Pins/geolocation
- Moderation
- Notifications

Why this matters:
- each domain can become a service later
- each service can own its schema/tables
- failures are easier to isolate

## 2. Define Contracts Before Code
Create endpoint contracts first (OpenAPI or written API docs).
Define:
- request/response shapes
- auth requirements
- error shape
- internal service endpoints

In Brooks, `api/openapi.yaml` + service controllers define contracts.

## 3. Pick Data Ownership Rules
Golden rule for microservices:
- one service owns one data model
- do not directly query another service's tables

If a service needs another domain's data:
- call internal API
- or use eventing pattern

## 4. Build a Thin Shared Platform
Create reusable code for:
- error handling
- common security filters
- shared primitives

In Brooks:
- `platform/common`
- `platform/security`

## 5. Add Operational Foundations Early
From the start, add:
- health endpoints
- migrations (Flyway)
- connection pooling config
- containerization

These are not optional in distributed production.

## Part B. How to Build This Repository Locally

## 1. Prerequisites
Install:
- JDK 17
- Maven 3.9+
- Docker Desktop / Docker Engine + Compose
- Node.js 20+ (if building frontend outside Docker)

## 2. Clone and Inspect
From repo root:
```bash
git clone <repo-url>
cd Brooks_new_1
```

Read:
- `README.md`
- `infra/docker-compose.yml`
- `services/*/src/main/resources/application.yml`

## 3. Prepare Environment Variables
Use `.env` for local.

Minimum critical values:
- `AUTH_DB_URL`, `AUTH_DB_USER`, `AUTH_DB_PASSWORD`
- `SOCIAL_DB_URL`, `SOCIAL_DB_USER`, `SOCIAL_DB_PASSWORD`
- `LISTS_DB_URL`, `LISTS_DB_USER`, `LISTS_DB_PASSWORD`
- `PINS_DB_URL`, `PINS_DB_USER`, `PINS_DB_PASSWORD`
- `MODERATION_DB_URL`, `MODERATION_DB_USER`, `MODERATION_DB_PASSWORD`
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_CACHE_TTL_SECONDS`
- Auth0 and internal auth keys

Important local note:
- if services run in Docker, URLs must not point to `localhost` unless DB is on host and network allows it
- for Supabase external DB, use session pooler: `jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require` with user `postgres.<project-ref>` (port 5432 = session mode, compatible with HikariCP/Flyway; avoid 6543 transaction mode)

## 4. Build and Run the Full Stack in Docker
From repo root:
```bash
docker compose -f infra/docker-compose.yml up -d --build redis auth-service social-service lists-service pins-service media-service moderation-service notifications-service frontend
```

Then verify containers:
```bash
docker ps
```

## 5. Validate Runtime Health
Check logs for each DB-backed service:
```bash
docker logs --since 5m brooks-auth-service | tail -100
docker logs --since 5m brooks-social-service | tail -100
docker logs --since 5m brooks-lists-service | tail -100
docker logs --since 5m brooks-pins-service | tail -100
docker logs --since 5m brooks-moderation-service | tail -100
```

Expected behavior:
- Flyway runs migrations once
- Hikari pool starts
- Tomcat starts on service port

## 6. Build Backend Artifacts via Maven
From root:
```bash
mvn -DskipTests package
```

Or per service:
```bash
mvn -pl services/pins-service -am -DskipTests package
```

## 7. Frontend Build
If building locally (not docker):
```bash
cd web
npm ci
npm run build
```

## 8. Rookie Debugging Checklist
If startup fails:
1. Check missing env vars first
2. Check DB URL format next
3. Check migration conflicts (duplicate versions/checksum)
4. Check DB connection saturation
5. Check inter-service URLs and DNS inside Docker

## 9. Common Build/Run Failure Patterns

### Duplicate Flyway versions
Example: two `V2__*.sql` in same service.
Fix: each migration version must be unique.

### Flyway checksum mismatch
Cause: modified already-applied migration files.
Fix: restore old migration bytes or run `flyway repair` after careful review.

### Supabase SSL root cert path issues
Cause: `sslrootcert` path invalid in container.
Fix: use `sslmode=require` and remove `sslrootcert` query parameter unless cert is mounted correctly.

### Wrong DB host in container
Cause: `postgres` hostname used when no postgres container exists.
Fix: use correct external host (Supabase) or run internal postgres and use service name.

### Docker not running on Windows
Symptom: `dockerDesktopLinuxEngine` pipe errors.
Fix: start Docker Desktop.

## 10. Quality Bar Before Commit
- services compile
- compose config valid
- required env checks pass
- startup logs clean for DB-backed services
- no duplicate Flyway versions