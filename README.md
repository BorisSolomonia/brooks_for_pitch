# Brooks

This repository contains a microservices backend scaffold, API contract, and schemas for the Brooks proximity pin application.

## Structure
- `docs/` product and architecture documentation
- `api/openapi.yaml` REST API contract (gateway)
- `services/` Spring Boot microservices
- `infra/` local dev infrastructure (Postgres/PostGIS)
- `web/` frontend (Vite + React)
- `server/` legacy monolith scaffold (deprecated)

## Services
- `services/auth-service`
- `services/social-service`
- `services/lists-service`
- `services/pins-service`
- `services/media-service`
- `services/moderation-service`
- `services/notifications-service`

## Local Development
1) Configure Auth0 (see "Auth0 Setup" below).
2) Start the full stack (DB + services + frontend):
   `docker compose -f infra/docker-compose.yml up -d --build`
3) Open the UI at `http://localhost:3000`
4) Use the API contract at `api/openapi.yaml`

To run services without Docker:
1) Start Postgres/PostGIS: `docker compose -f infra/docker-compose.yml up -d postgres`
2) Export Auth0 env vars (see "Auth0 Setup" below).
3) Run a service: `mvn -f services/pins-service/pom.xml spring-boot:run`

## Auth0 Setup
1) Create an Auth0 API:
   - Identifier: e.g. `https://brooks-api` (this becomes the audience).
2) Create an Auth0 Application (Single Page Application):
   - Allowed Callback URLs: `http://localhost:3000`
   - Allowed Logout URLs: `http://localhost:3000`
   - Allowed Web Origins: `http://localhost:3000`
3) Configure environment variables:
   - Backend services (Docker or shell):
     - `AUTH0_ISSUER_URI=https://YOUR_DOMAIN/`
     - `AUTH0_AUDIENCE=https://brooks-api`
   - Frontend (`web/.env`):
     - `VITE_AUTH0_DOMAIN=YOUR_DOMAIN` (no https)
     - `VITE_AUTH0_CLIENT_ID=YOUR_CLIENT_ID`
     - `VITE_AUTH0_AUDIENCE=https://brooks-api`
     - `VITE_AUTH0_REDIRECT_URI=http://localhost:3000`
4) Start the stack and sign in or create an account on the first screen.

## Notes
- Each service owns its data and schema.
- Internal service APIs are protected by Auth0 JWTs.
- Pins-service uses PostGIS for spatial queries.
- Frontend map defaults to Leaflet/OpenStreetMap. To switch to Google Maps, set
  `VITE_GOOGLE_MAPS_KEY` and change `VITE_MAP_PROVIDER` to `google` in `web/.env`
  (or pass the same args at Docker build time).
