# Deployment and DevOps (Microservices)

## Stack
- Spring Boot (Java 17)
- Postgres (per service) + PostGIS for pins-service
- Redis for caching and rate limiting
- Object storage + CDN for media
- API Gateway (routing + auth)

## CI/CD
- Build and test each service independently
- Containerize and push images to registry
- Deploy to dev/stage/prod with approvals

## Infrastructure
- Kubernetes with per-service deployments
- Managed Postgres instances or separate databases per service
- Secret manager for credentials
- IaC with Terraform

## Local Development
- docker-compose brings up Postgres, all services, and the web frontend
- Each service reads its own DB from env vars

## Data Lifecycle
- Scheduled job in pins-service to purge expired pins and media
- Short retention for location buckets (15 minutes)
- Audit records retained without content
