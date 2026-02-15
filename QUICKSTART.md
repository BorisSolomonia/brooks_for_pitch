# Quickstart (Canonical)

This quickstart is intentionally short.
For full instructions, use `DEPLOYMENT_GUIDE_DETAILED.md`.

## 1. Required Inputs
Set GitHub secrets used by `.github/workflows/deploy.yml`:
- `GCP_SA_KEY`
- `GCP_PROJECT_ID`
- `GCP_REGION`
- `GCP_ARTIFACT_REPOSITORY`
- `GCP_ENV_SECRET_NAME`
- `VM_SSH_USER`
- `VM_SSH_KEY`

## 2. Production Env Source
Store production env payload in GCP Secret Manager (`GCP_ENV_SECRET_NAME`).
Do not treat local `.env` as production source of truth.

## 3. VM Identity and Permissions
Ensure VM has:
- Docker + docker compose plugin
- attached service account with Artifact Registry read permission

## 4. Deploy
Push to `main` or run workflow manually.
Pipeline flow is:
1. VM SSH handshake
2. fetch env from Secret Manager
3. build/push images to Artifact Registry
4. upload deployment files
5. phased service startup on VM

## 5. Verify
On VM:
```bash
docker ps
docker compose --env-file /opt/brooks/.env.runtime -f /opt/brooks/infra/docker-compose.prod.yml ps
```

Check logs for DB-backed services:
```bash
docker logs --since 10m brooks-auth-service | tail -120
docker logs --since 10m brooks-pins-service | tail -120
docker logs --since 10m brooks-moderation-service | tail -120
```

## 6. If DB pool timeouts appear
Use recovery in `DEPLOYMENT_GUIDE_DETAILED.md` section "Operator Quick Recovery Commands".
