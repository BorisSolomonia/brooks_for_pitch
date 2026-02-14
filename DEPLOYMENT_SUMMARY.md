# 📋 Brooks App Deployment - Implementation Summary

## ✅ Completed Setup

All deployment configurations have been created for deploying your Brooks app to GCP VM with GitHub Actions, Secrets Manager, and Caddy.

## 📁 Files Created/Updated

### Docker Configuration.
- ✅ `server/Dockerfile` - Spring Boot backend container (Java 17, Maven build)
- ✅ `web/Dockerfile` - React/Vite frontend container (Node.js build + Nginx)
- ✅ `web/nginx.conf` - Nginx configuration for SPA routing and caching
- ✅ `docker-compose.yml` - Orchestrates all services (frontend, backend, database)

### Reverse Proxy
- ✅ `infra/caddy/Caddyfile` - Caddy configuration with:
  - Automatic HTTPS for `brooksweb.uk`
  - Routes `/api/*` → Backend (Spring Boot:8080)
  - Routes all other paths → Frontend (React:3000)
  - Security headers and compression

### CI/CD Pipeline
- ✅ `.github/workflows/deploy.yml` - Complete GitHub Actions workflow:
  - Builds backend and frontend Docker images
  - Pushes to Artifact Registry: `us-central1-docker.pkg.dev/brooks-485009/brooksar`
  - Deploys to VM via SSH
  - Health checks and automatic rollback on failure

### Configuration
- ✅ `server/src/main/resources/application-production.yml` - Spring Boot production config
- ✅ `.env.example` - Template for environment variables
- ✅ `.dockerignore` - Optimized Docker build context
- ✅ `.gitignore` - Updated with deployment-specific entries

### Scripts & Documentation
- ✅ `infra/scripts/setup-vm.sh` - Automated VM setup script
- ✅ `DEPLOYMENT.md` - Comprehensive deployment guide (full documentation)
- ✅ `QUICKSTART.md` - 15-minute quick start guide
- ✅ `DEPLOYMENT_SUMMARY.md` - This file

## 🏗️ Architecture Overview

```
┌─────────────┐
│   Internet  │
└──────┬──────┘
       │ HTTPS
       ↓
┌─────────────────────────────────┐
│  Caddy Reverse Proxy            │
│  (brooksweb.uk, Auto SSL)       │
│  - Routes /api/* → Backend      │
│  - Routes /* → Frontend         │
└────┬──────────────────┬─────────┘
     │                  │
     ↓                  ↓
┌──────────┐     ┌─────────────┐
│ Frontend │     │  Backend    │
│ (React)  │     │ (Spring)    │
│ Nginx    │     │ :8080       │
│ :3000    │     └──────┬──────┘
└──────────┘            │
                        ↓
                 ┌──────────────┐
                 │  PostgreSQL  │
                 │  + PostGIS   │
                 │  :5432       │
                 └──────────────┘
```

## 🚀 Deployment Information

### GCP Configuration
- **Project ID**: `brooks-485009`
- **VM Name**: `brooks-20260121-095019`
- **VM IP**: `35.238.77.14`
- **VM Zone**: `us-central1-f`
- **Service Account**: `brooks-service-account@brooks-485009.iam.gserviceaccount.com`
- **Artifact Registry**: `us-central1-docker.pkg.dev/brooks-485009/brooksar`
- **Domain**: `brooksweb.uk`

### Container Images
- **Backend**: `us-central1-docker.pkg.dev/brooks-485009/brooksar/brooks-backend`
- **Frontend**: `us-central1-docker.pkg.dev/brooks-485009/brooksar/brooks-frontend`

### Services
1. **brooks-backend** - Spring Boot API (port 8080)
2. **brooks-frontend** - React SPA (port 3000)
3. **brooks-db** - PostgreSQL 16 + PostGIS (port 5432)
4. **caddy** - Reverse proxy (ports 80, 443)

## 📝 Next Steps (In Order)

### 1️⃣ DNS Configuration (Required)
```
Point your domain to the VM:
A Record: brooksweb.uk → 35.238.77.14
A Record: www.brooksweb.uk → 35.238.77.14

Verify: nslookup brooksweb.uk
```

### 2️⃣ VM Setup (Run Once)
```bash
# SSH to VM
gcloud compute ssh brooks-20260121-095019 --zone=us-central1-f --project=brooks-485009

# Copy and run the setup script
# (from infra/scripts/setup-vm.sh)
chmod +x setup-vm.sh
./setup-vm.sh

# Generate SSH key for GitHub Actions
ssh-keygen -t ed25519 -f ~/.ssh/github_actions_brooks -N ""
cat ~/.ssh/github_actions_brooks.pub >> ~/.ssh/authorized_keys

# Save private key for GitHub Secrets
cat ~/.ssh/github_actions_brooks
```

### 3️⃣ Create GCP Secret Manager Secret
```bash
# 1. Copy .env.example to brooks-env.txt
# 2. Fill in all values (see DEPLOYMENT.md for details)
# 3. Create secret:

gcloud secrets create brooks-env \
  --project=brooks-485009 \
  --data-file=brooks-env.txt \
  --replication-policy=automatic

# 4. Clean up
rm brooks-env.txt
```

**Minimum Required Variables:**
- `DATABASE_PASSWORD` - Strong password for PostgreSQL
- `JWT_SECRET` - Generate with: `openssl rand -base64 32`
- `AUTH0_DOMAIN` - Your Auth0 tenant (or placeholder)
- `AUTH0_AUDIENCE` - Your Auth0 API identifier (or placeholder)
- All `VITE_*` variables for frontend configuration

### 4️⃣ Setup GitHub Secrets
Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

| Secret Name | Description | How to Get |
|------------|-------------|-----------|
| `GCP_SA_KEY` | Service account JSON key | See command below |
| `VM_HOST` | VM external IP | `35.238.77.14` |
| `VM_SSH_USER` | SSH username | Your GCP username |
| `VM_SSH_KEY` | SSH private key | From step 2 above |

**Get Service Account Key:**
```bash
gcloud iam service-accounts keys create ~/brooks-sa-key.json \
  --iam-account=brooks-service-account@brooks-485009.iam.gserviceaccount.com \
  --project=brooks-485009

cat ~/brooks-sa-key.json  # Copy entire JSON to GCP_SA_KEY
rm ~/brooks-sa-key.json
```

### 5️⃣ Grant Service Account Permissions
```bash
# Artifact Registry Writer
gcloud projects add-iam-policy-binding brooks-485009 \
  --member="serviceAccount:brooks-service-account@brooks-485009.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

# Secret Manager Accessor
gcloud projects add-iam-policy-binding brooks-485009 \
  --member="serviceAccount:brooks-service-account@brooks-485009.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### 6️⃣ Deploy!
```bash
# Commit all files and push
git add .
git commit -m "Add deployment configuration"
git push origin main

# GitHub Actions will automatically:
# 1. Build Docker images
# 2. Push to Artifact Registry
# 3. Deploy to VM
# 4. Configure Caddy
# 5. Run health checks
```

Watch deployment: `GitHub → Actions tab`

### 7️⃣ Verify Deployment
```bash
# Check HTTPS works
curl https://brooksweb.uk

# Check API health
curl https://brooksweb.uk/api/actuator/health

# SSH to VM and check logs
gcloud compute ssh brooks-20260121-095019 --zone=us-central1-f --project=brooks-485009
cd /opt/brooks
docker compose ps
docker compose logs -f
```

## 🔒 Security Features

- ✅ Non-root user in containers
- ✅ Automatic HTTPS with Let's Encrypt
- ✅ Security headers (CSP, XSS, etc.)
- ✅ Secrets stored in GCP Secret Manager
- ✅ SSH key authentication only
- ✅ Docker log rotation
- ✅ Resource limits on containers
- ✅ Health checks for all services

## 📊 Resource Limits

Configured in `docker-compose.yml`:

| Service | Memory Limit | CPU Limit |
|---------|-------------|-----------|
| Backend | 1GB | 1.0 CPU |
| Frontend | 256MB | 0.3 CPU |
| Database | 512MB | 0.5 CPU |

## 🔍 Monitoring & Troubleshooting

### View Logs
```bash
# All services
cd /opt/brooks && docker compose logs -f

# Specific service
docker logs -f brooks-backend
docker logs -f brooks-frontend
docker logs -f brooks-db
docker logs -f caddy
```

### Health Checks
```bash
# Backend (internal)
docker exec brooks-backend curl http://localhost:8080/actuator/health

# Frontend (internal)
docker exec brooks-frontend curl http://localhost:3000/health

# External
curl https://brooksweb.uk/api/actuator/health
```

### Container Status
```bash
docker compose ps
docker stats
```

## 🆘 Common Issues & Solutions

### Issue: SSL Certificate Not Working
**Solution:**
- Wait 2-5 minutes for DNS propagation
- Check DNS: `nslookup brooksweb.uk`
- Check Caddy logs: `docker logs caddy`
- Verify domain points to correct IP

### Issue: Backend Not Starting
**Solution:**
- Check logs: `docker logs brooks-backend`
- Verify database: `docker logs brooks-db`
- Check environment variables: `docker exec brooks-backend env | grep DATABASE`

### Issue: Deployment Fails in GitHub Actions
**Solution:**
- Check all 4 GitHub secrets are set correctly
- Verify service account has correct permissions
- Ensure VM setup script completed successfully
- Check GitHub Actions logs for specific error

### Issue: Cannot Connect to Database
**Solution:**
- Ensure database is healthy: `docker ps --filter name=brooks-db`
- Check database logs: `docker logs brooks-db`
- Verify connection string in environment variables

## 📚 Documentation Files

- **QUICKSTART.md** - 15-minute quick start guide
- **DEPLOYMENT.md** - Comprehensive deployment documentation
- **.env.example** - Environment variables template
- **infra/scripts/setup-vm.sh** - VM setup automation

## 🎯 Deployment Checklist

- [ ] DNS configured and propagated
- [ ] VM setup script executed successfully
- [ ] GCP Secret `brooks-env` created with all variables
- [ ] GitHub Secrets added (4 secrets)
- [ ] Service account permissions granted
- [ ] Code pushed to GitHub
- [ ] GitHub Actions workflow completed successfully
- [ ] HTTPS working: `curl https://brooksweb.uk`
- [ ] API working: `curl https://brooksweb.uk/api/actuator/health`
- [ ] Auth0 configured (or using placeholders)

## 💰 Cost Estimate

Approximate monthly costs on GCP:
- **VM (e2-medium)**: ~$25/month
- **Storage (disk + images)**: ~$5/month
- **Network egress**: ~$5-10/month
- **Total**: ~$35-40/month

*Free tier may apply depending on usage*

## 🚀 Future Enhancements

Optional improvements:
- [ ] Add monitoring (Google Cloud Monitoring)
- [ ] Setup database backups
- [ ] Add staging environment
- [ ] Configure Cloud CDN for static assets
- [ ] Implement CI/CD for database migrations
- [ ] Add automated testing in pipeline
- [ ] Setup alerts and notifications

## 📞 Support

- Check GitHub Actions logs for deployment issues
- Review container logs for runtime issues
- See DEPLOYMENT.md for detailed troubleshooting
- Verify all secrets are correctly configured

## ✨ Summary

Your Brooks app is now configured for professional production deployment with:
- 🐳 Docker containerization
- 🔄 Automated CI/CD via GitHub Actions
- 🔒 Secure secrets management with GCP Secret Manager
- 🌐 Automatic HTTPS with Caddy
- 📊 Health checks and automatic rollback
- 📝 Comprehensive documentation

**Total Time to Deploy**: ~15-20 minutes after initial setup

Good luck with your deployment! 🚀
