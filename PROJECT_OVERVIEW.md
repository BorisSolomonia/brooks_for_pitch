# Brooks Project Overview

## 1. What This Project Does
Brooks is a location-based social application backend + frontend.

Users can:
- authenticate
- manage social graph (friends/follows/blocks)
- manage lists
- create and view map pins
- upload media metadata
- report content for moderation
- receive notification events

The repository contains two backend styles:
- `server/` legacy monolith (older path)
- `services/` current microservices architecture (active path)

The production deployment currently uses microservices from `services/`.

## 2. High-Level Architecture

### Runtime Layers
1. Client layer
- Web frontend (`web/`, React + Vite)

2. Edge/proxy layer
- Caddy reverse proxy (`infra/caddy/Caddyfile`)
- Terminates TLS and routes `/api/*` to specific services

3. Service layer (Spring Boot services)
- `auth-service` (8081)
- `social-service` (8082)
- `lists-service` (8083)
- `pins-service` (8084)
- `media-service` (8085)
- `moderation-service` (8086)
- `notifications-service` (8087)

4. Data and cache layer
- PostgreSQL (currently Supabase external PostgreSQL)
- Redis (`brooks-redis`) for caching and related state

## 3. Repository Structure
- `services/`: Microservices source code (Java/Spring Boot)
- `platform/common`: shared classes (errors, rate limiting, filters)
- `platform/security`: shared JWT/security utilities
- `web/`: frontend app
- `infra/docker-compose.yml`: local compose
- `infra/docker-compose.prod.yml`: production compose
- `.github/workflows/deploy.yml`: CI/CD deployment pipeline
- `docs/`: design and operational docs

## 4. Technologies and Their Role

### Backend
- Java 17
- Spring Boot 3.2.x
- Spring Data JPA (ORM)
- Flyway (DB migrations)
- HikariCP (connection pool)
- Maven (build)

### Security
- Auth0 integration for JWT validation
- Internal service auth filters/config

### Data
- PostgreSQL (Supabase-hosted in current setup)
- PostGIS dialect in pins service for geo-related operations
- Redis for cache and ephemeral service state

### Frontend
- React + TypeScript + Vite
- Nginx (frontend image serving static assets)

### Infrastructure and Delivery
- Docker and Docker Compose
- Caddy reverse proxy
- GitHub Actions for build/deploy
- Google Cloud VM target host
- Google Artifact Registry for image storage
- GCP Secret Manager for production env payload

## 5. Service Responsibilities

### auth-service
- user accounts
- token flow/auth related entities
- migration files in `services/auth-service/src/main/resources/db/migration`

### social-service
- relationship graph and preferences

### lists-service
- list definitions and list membership

### pins-service
- primary app map-pin workflows
- uses social/lists internal APIs
- uses Redis

### media-service
- media-related API surface

### moderation-service
- reports and moderation workflows

### notifications-service
- notification-related workflows/events

## 6. Current Production Shape
- single VM
- all containers run on that VM
- external managed database (Supabase)
- compose-based orchestration
- caddy as ingress

This is a pragmatic architecture for early-stage production. It is simpler than Kubernetes, but requires careful env and DB connection management.