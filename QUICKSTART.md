# Brooks App - Quick Deployment Guide

## 🚀 Super Quick Start (15 minutes)

### 1. DNS Setup (5 min)
```
Point brooksweb.uk → 34.59.112.7
```

### 2. VM Setup (5 min)
```bash
# SSH to VM
gcloud compute ssh brooks-20260121-095019 --zone=us-central1-f --project=brooks-485009

# Run setup script (copy from infra/scripts/setup-vm.sh and run)
./setup-vm.sh

# Generate SSH key for GitHub Actions
ssh-keygen -t ed25519 -f ~/.ssh/github_actions_brooks -N ""
cat ~/.ssh/github_actions_brooks.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/github_actions_brooks  # Save this for GitHub Secrets
```

### 3. Create GCP Secret (2 min)
```bash
# Create brooks-env.txt with your values (use .env.example as template)
# Then:
gcloud secrets create brooks-env \
  --project=brooks-485009 \
  --data-file=brooks-env.txt \
  --replication-policy=automatic
```

### 4. GitHub Secrets (3 min)
Add to GitHub repository (`Settings` → `Secrets`):

| Secret | Value |
|--------|-------|
| `GCP_SA_KEY` | Service account JSON key |
| `VM_HOST` | `34.59.112.7` |
| `VM_SSH_USER` | Your GCP username |
| `VM_SSH_KEY` | Content from `~/.ssh/github_actions_brooks` |

Get service account key:
```bash
gcloud iam service-accounts keys create ~/key.json \
  --iam-account=brooks-service-account@brooks-485009.iam.gserviceaccount.com
cat ~/key.json  # Copy to GCP_SA_KEY secret
rm ~/key.json
```

### 5. Deploy! (1 min)
```bash
git push origin main
```

Watch deployment: GitHub → Actions tab

### 6. Verify
```bash
curl https://brooksweb.uk
curl https://brooksweb.uk/api/actuator/health
```

## 📝 Minimum Required Secrets

### GCP Secret: `brooks-env`
```bash
DATABASE_NAME=brooks
DATABASE_USER=brooks
DATABASE_PASSWORD=YOUR_STRONG_PASSWORD
JWT_SECRET=YOUR_32_CHAR_RANDOM_STRING
AUTH0_DOMAIN=placeholder.auth0.com
AUTH0_AUDIENCE=https://placeholder
VITE_AUTH_API_URL=https://brooksweb.uk/api
VITE_AUTH0_DOMAIN=placeholder.auth0.com
VITE_AUTH0_CLIENT_ID=placeholder
VITE_AUTH0_AUDIENCE=https://placeholder
VITE_AUTH0_REDIRECT_URI=https://brooksweb.uk
VITE_MAP_PROVIDER=leaflet
VITE_SOCIAL_API_URL=https://brooksweb.uk/api/social
VITE_LISTS_API_URL=https://brooksweb.uk/api/lists
VITE_PINS_API_URL=https://brooksweb.uk/api/pins
VITE_MEDIA_API_URL=https://brooksweb.uk/api/media
VITE_MODERATION_API_URL=https://brooksweb.uk/api/moderation
VITE_NOTIFICATIONS_API_URL=https://brooksweb.uk/api/notifications
VITE_NOMINATIM_URL=https://nominatim.openstreetmap.org
```

Generate JWT secret:
```bash
openssl rand -base64 32
```

## 🔧 Common Commands

### View Logs
```bash
# SSH to VM
gcloud compute ssh brooks-20260121-095019 --zone=us-central1-f

# All logs
cd /opt/brooks && docker compose logs -f

# Specific service
docker logs -f brooks-backend
docker logs -f brooks-frontend
docker logs -f caddy
```

### Restart Services
```bash
cd /opt/brooks
docker compose restart
```

### Manual Deploy
```bash
cd /opt/brooks
docker compose pull
docker compose up -d --force-recreate
```

## ⚠️ Troubleshooting

### SSL Not Working?
- Wait 2-5 minutes for DNS propagation
- Check DNS: `nslookup brooksweb.uk`
- Check Caddy logs: `docker logs caddy`

### Backend Not Starting?
- Check logs: `docker logs brooks-backend`
- Verify DB: `docker logs brooks-db`
- Check health: `docker exec brooks-backend curl http://localhost:8080/actuator/health`

### Deployment Failed?
- Check GitHub Actions logs
- Verify all secrets are set
- Ensure VM setup script ran successfully

## 📚 Full Documentation
See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete guide.

## 🆘 Support Checklist
- [ ] DNS configured and propagated?
- [ ] VM setup script completed?
- [ ] All GitHub secrets added?
- [ ] GCP secret `brooks-env` created?
- [ ] Service account has correct permissions?
- [ ] Docker and Docker Compose installed on VM?
- [ ] Caddy running: `docker ps | grep caddy`?
