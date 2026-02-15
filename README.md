# Brooks

Brooks is a microservices-based location social app with a React frontend and Spring Boot backend services.

## Canonical Documentation
Use these as source of truth:
1. `PROJECT_OVERVIEW.md` - what the project does, architecture, stack, service responsibilities
2. `BUILD_GUIDE_DETAILED.md` - how to build/run locally and troubleshoot build/runtime issues
3. `DEPLOYMENT_GUIDE_DETAILED.md` - production deployment architecture, CI/CD flow, operations, incident fixes

## Specialized Documentation
- `AUTH0_SETUP.md` - Auth0 tenant/application/API setup
- `docs/SECURITY.md` - security implementation details
- `docs/security_privacy.md` - privacy and trust model
- `docs/product_spec.md` - product requirements
- `docs/policy_proximity.md` - proximity/access policy logic
- `docs/observability_testing.md` - test and observability notes

## Repo Structure
- `services/` - active microservices
- `platform/common` - shared utilities
- `platform/security` - shared security/JWT components
- `web/` - frontend
- `infra/` - compose files, caddy config, deployment infra
- `.github/workflows/` - CI/CD workflows
- `server/` - legacy monolith scaffold (deprecated)

## Quick Start
For a short operator path, see `QUICKSTART.md`.

## Deprecation Note
Legacy setup and phase-summary docs are preserved for history but are not authoritative for current deployment.
