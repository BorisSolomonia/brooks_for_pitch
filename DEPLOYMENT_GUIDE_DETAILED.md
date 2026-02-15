# Deployment Guide (Detailed, Rookie-Friendly)

This document explains deployment architecture, exact deployment flow for this repo, and real production issues seen in this project with fixes.

## 1. Deployment Architecture

Current target architecture:
- GitHub Actions builds service images
- images pushed to Google Artifact Registry
- VM pulls and runs containers with `docker compose`
- Caddy exposes public HTTPS routes
- database is external on Supabase (not a local postgres container)

Flow:
1. Push code to `main`/`master`
2. CI job performs SSH handshake with VM
3. CI loads env from GCP Secret Manager
4. CI builds and pushes backend + frontend images
5. CI uploads compose and env files to VM
6. VM logs into Artifact Registry and pulls images
7. VM recreates stack with phased startup

Main files:
- `.github/workflows/deploy.yml`
- `infra/docker-compose.prod.yml`
- `infra/caddy/Caddyfile`

## 2. Required Cloud Resources

On GCP:
- one VM (Ubuntu/Debian)
- Artifact Registry repository
- Secret Manager secret with production env
- service account for CI to build/push and read secret
- VM attached service account with Artifact Registry read access

On Supabase:
- PostgreSQL credentials
- host/port/user/password for pooler/direct connection

## 3. Required GitHub Secrets
- `GCP_SA_KEY`
- `GCP_PROJECT_ID`
- `GCP_REGION`
- `GCP_ARTIFACT_REPOSITORY`
- `GCP_ENV_SECRET_NAME`
- `VM_SSH_USER`
- `VM_SSH_KEY`

VM host/zone are currently set in workflow env.

## 4. Production Env Strategy
Use Secret Manager payload as source of truth.

Workflow behavior:
- secret -> `.env.production`
- normalized -> `/opt/brooks/.env`
- runtime merged values -> `/opt/brooks/.env.runtime`

Do not manually edit live container env unless for short emergency mitigation.

## 5. Database URL Rules for This Project
For Supabase pooler usage:
- URL format:
  `jdbc:postgresql://<pooler-host>:6543/postgres?sslmode=require`
- user:
  `postgres.<project-ref>` (not plain `postgres`)
- remove `sslrootcert` query arg unless cert file is definitely mounted

All DB-backed services currently point to Supabase credentials in env.

## 6. Startup Strategy to Avoid DB Pool Storm
This project experienced Supabase pool exhaustion when many services started at once.

Current mitigation in deployment:
- inject low connection defaults when missing:
  - `DB_MAX_POOL_SIZE=1`
  - `DB_MIN_IDLE=0`
  - `DB_CONNECTION_TIMEOUT_MS=60000`
  - `FLYWAY_CONNECT_RETRIES=30`
- start services in phases:
  - redis first
  - db-backed services one by one with delay
  - then media/notifications/frontend/caddy

This is intentionally conservative for stability.

## 7. Step-by-Step Deployment (Operator Runbook)

## 7.1 Update production secret
Update Secret Manager env payload with correct values.

## 7.2 Ensure VM SA permissions
VM attached service account must include:
- `roles/artifactregistry.reader`

If changing VM service account:
```bash
gcloud compute instances set-service-account <vm-name> \
  --zone=<zone> \
  --service-account=<sa-email> \
  --scopes=https://www.googleapis.com/auth/cloud-platform
```

## 7.3 Trigger deployment
Push to main:
```bash
git push origin main
```

## 7.4 Verify deployment on VM
```bash
docker ps
docker compose --env-file /opt/brooks/.env.runtime -f /opt/brooks/infra/docker-compose.prod.yml ps
```

Check critical logs:
```bash
docker logs --since 10m brooks-auth-service | tail -120
docker logs --since 10m brooks-pins-service | tail -120
docker logs --since 10m brooks-moderation-service | tail -120
```

## 8. Incident History in This Project and Fixes

## 8.1 SSH handshake failures (`EOF`, timeout)
Symptoms:
- `ssh: handshake failed: EOF`
- `dial tcp ...:22: i/o timeout`

Fixes:
- add handshake job before deploy
- use current VM IP in workflow
- add retry path for scp after re-check handshake

## 8.2 Artifact Registry unauthenticated pull
Symptom:
- `Unauthenticated request ... downloadArtifacts`

Fixes:
- ensure VM SA has Artifact Registry Reader role
- use VM metadata token docker login on VM deploy script

## 8.3 Missing image variables during compose interpolation
Symptom:
- `BROOKS_AUTH_IMAGE must be set`

Fixes:
- write `BROOKS_*_IMAGE` into `.env.runtime` before any compose call
- use same env file for `down/pull/up`

## 8.4 Redis env missing at startup
Symptom:
- missing required env var `REDIS_*`

Fixes:
- enforce required env var checks before deploy
- keep secret payload complete

## 8.5 Supabase SSL cert file errors
Symptoms:
- `Could not open SSL root certificate file /etc/ssl/certs/supabase-ca.crt`

Fixes:
- normalize DB URLs to `sslmode=require`
- remove `sslrootcert` from JDBC query params

## 8.6 Supabase auth failures
Symptom:
- `password authentication failed`

Fixes:
- use correct Supabase pooler username format
- verify password in secret payload and redeploy

## 8.7 Unknown host `postgres`
Symptom:
- `UnknownHostException: postgres`

Fixes:
- use external Supabase host in DB URLs when no local postgres container exists

## 8.8 Flyway duplicate migration version
Symptom:
- `Found more than one migration with version 2`

Fixes:
- keep migration versions unique per service
- avoid adding duplicate `Vx__` names

## 8.9 Flyway checksum mismatch
Symptom:
- `Migration checksum mismatch for version ...`

Fixes:
- do not edit historical migrations after apply
- if needed, run `flyway repair` only after controlled review

## 8.10 Supabase pool timeout at startup
Symptom:
- `FATAL: Unable to check out connection from the pool due to timeout`

Fixes:
- low hikari pool settings
- sequential startup
- increase flyway retries
- if still persistent: consider direct DB endpoint (5432) instead of pooler (6543) for long-lived app connections

## 9. Future Risks and Preventive Controls

## 9.1 Risk: shared DB schema collisions across services
Control:
- per-service schema and per-service flyway history table

## 9.2 Risk: migration drift
Control:
- migration immutability policy
- CI check for duplicate versions

## 9.3 Risk: secret drift between local and prod
Control:
- secret schema checklist
- pre-deploy env validation script

## 9.4 Risk: VM under-sizing
Control:
- minimum VM memory >= 4 GB for this many containers
- monitor memory and OOM events

## 9.5 Risk: deployment race conditions
Control:
- keep handshake gate
- keep upload retry
- keep phased startup

## 10. Operator Quick Recovery Commands

Force low DB pressure and sequential restart:
```bash
cd /opt/brooks

grep -q '^DB_MAX_POOL_SIZE=' .env.runtime && sed -i 's/^DB_MAX_POOL_SIZE=.*/DB_MAX_POOL_SIZE=1/' .env.runtime || echo 'DB_MAX_POOL_SIZE=1' >> .env.runtime
grep -q '^DB_MIN_IDLE=' .env.runtime && sed -i 's/^DB_MIN_IDLE=.*/DB_MIN_IDLE=0/' .env.runtime || echo 'DB_MIN_IDLE=0' >> .env.runtime
grep -q '^DB_CONNECTION_TIMEOUT_MS=' .env.runtime && sed -i 's/^DB_CONNECTION_TIMEOUT_MS=.*/DB_CONNECTION_TIMEOUT_MS=60000/' .env.runtime || echo 'DB_CONNECTION_TIMEOUT_MS=60000' >> .env.runtime
grep -q '^FLYWAY_CONNECT_RETRIES=' .env.runtime && sed -i 's/^FLYWAY_CONNECT_RETRIES=.*/FLYWAY_CONNECT_RETRIES=30/' .env.runtime || echo 'FLYWAY_CONNECT_RETRIES=30' >> .env.runtime

docker compose --env-file .env.runtime -f infra/docker-compose.prod.yml up -d --force-recreate auth-service
sleep 20
docker compose --env-file .env.runtime -f infra/docker-compose.prod.yml up -d --force-recreate social-service
sleep 20
docker compose --env-file .env.runtime -f infra/docker-compose.prod.yml up -d --force-recreate lists-service
sleep 20
docker compose --env-file .env.runtime -f infra/docker-compose.prod.yml up -d --force-recreate pins-service
sleep 20
docker compose --env-file .env.runtime -f infra/docker-compose.prod.yml up -d --force-recreate moderation-service
```

This recovery sequence was built from actual incidents seen in this project.