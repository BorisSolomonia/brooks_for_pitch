# Brooks App Deployment Guide

This guide will help you deploy the Brooks app to GCP VM using GitHub Actions, Secrets Manager, and Caddy.

## Architecture Overview

```
Internet → Caddy (HTTPS) → Frontend (Nginx:3000) + Backend (Spring Boot:8080) → PostgreSQL
```

- **Frontend**: React/Vite app served by Nginx on port 3000
- **Backend**: Spring Boot API on port 8080
- **Database**: PostgreSQL 16 with PostGIS extension
- **Reverse Proxy**: Caddy with automatic HTTPS via Let's Encrypt
- **CI/CD**: GitHub Actions → Artifact Registry → VM deployment

## Prerequisites

- [x] GCP project: `brooks-485009`
- [x] GCP VM: `instance-20260122-071626` (IP: `35.192.65.148`, Zone: `us-central1-c`)
- [x] Service Account: `brooks-service-account@brooks-485009.iam.gserviceaccount.com`
- [x] Artifact Registry: `us-central1-docker.pkg.dev/brooks-485009/brooksar`
- [x] Domain: `brooksweb.uk`
- [ ] DNS configured (see step 1 below)
- [ ] GitHub repository with code
- [ ] Auth0 account (or use placeholders for now)

## Deployment Steps

### 1. Configure DNS

Point your domain to the VM's external IP:

```
A Record:     brooksweb.uk      → 34.59.112.7
A Record:     www.brooksweb.uk  → 34.59.112.7
```

Wait for DNS propagation (use `nslookup brooksweb.uk` to verify).

### 2. Setup VM

SSH into your VM and run the setup script:

```bash
# SSH to VM
gcloud compute ssh brooks-20260121-095019 \
  --zone=us-central1-f \
  --project=brooks-485009

# Download and run setup script (or copy it manually)
curl -o setup-vm.sh https://raw.githubusercontent.com/YOUR-USERNAME/YOUR-REPO/main/infra/scripts/setup-vm.sh
chmod +x setup-vm.sh
./setup-vm.sh

# Log out and back in for Docker group changes
exit
```

### 3. Generate SSH Key for GitHub Actions

On your VM, generate an SSH key for GitHub Actions:

```bash
ssh-keygen -t ed25519 -C "github-actions-brooks" -f ~/.ssh/github_actions_brooks -N ""

# Add public key to authorized_keys
cat ~/.ssh/github_actions_brooks.pub >> ~/.ssh/authorized_keys

# Display private key (save this for GitHub Secrets)
cat ~/.ssh/github_actions_brooks
```

### 4. Create GCP Secret for Environment Variables

Create a file named `brooks-env.txt` with all environment variables:

```bash
# Database
DATABASE_NAME=brooks
DATABASE_USER=brooks
DATABASE_PASSWORD=CHANGE_ME_STRONG_PASSWORD

# JWT
JWT_SECRET=CHANGE_ME_LONG_RANDOM_STRING_AT_LEAST_32_CHARS

# Auth0 Configuration (IMPORTANT: Replace with your actual Auth0 values)
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://your-api-audience

# Vite Frontend Variables
VITE_AUTH_API_URL=https://brooksweb.uk/api
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=YOUR_AUTH0_CLIENT_ID
VITE_AUTH0_AUDIENCE=https://your-api-audience
VITE_AUTH0_REDIRECT_URI=https://brooksweb.uk
VITE_MAP_PROVIDER=leaflet
VITE_GOOGLE_MAPS_KEY=YOUR_GOOGLE_MAPS_KEY_IF_USING_GOOGLE_MAPS
```

Create the secret in GCP Secret Manager:

```bash
gcloud secrets create brooks-env \
  --project=brooks-485009 \
  --data-file=brooks-env.txt \
  --replication-policy=automatic

# Verify
gcloud secrets describe brooks-env --project=brooks-485009

# Clean up local file
rm brooks-env.txt
```

### 5. Setup GitHub Secrets

Add the following secrets to your GitHub repository (`Settings` → `Secrets and variables` → `Actions`):

| Secret Name | Description | How to Get |
|------------|-------------|-----------|
| `GCP_SA_KEY` | Service account JSON key | Download from GCP Console → IAM → Service Accounts → Create Key (JSON) |
| `VM_HOST` | VM external IP | `34.59.112.7` |
| `VM_SSH_USER` | SSH username | Your GCP username (usually your email prefix) |
| `VM_SSH_KEY` | SSH private key | Content of `~/.ssh/github_actions_brooks` from step 3 |

#### Getting the Service Account Key

```bash
# Create a new key for the service account
gcloud iam service-accounts keys create ~/brooks-sa-key.json \
  --iam-account=brooks-service-account@brooks-485009.iam.gserviceaccount.com \
  --project=brooks-485009

# Display the key (copy this entire JSON to GitHub Secret GCP_SA_KEY)
cat ~/brooks-sa-key.json

# Delete local copy for security
rm ~/brooks-sa-key.json
```

### 6. Configure Service Account Permissions

Ensure your service account has the required permissions:

```bash
# Grant required roles
gcloud projects add-iam-policy-binding brooks-485009 \
  --member="serviceAccount:brooks-service-account@brooks-485009.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding brooks-485009 \
  --member="serviceAccount:brooks-service-account@brooks-485009.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud projects add-iam-policy-binding brooks-485009 \
  --member="serviceAccount:brooks-service-account@brooks-485009.iam.gserviceaccount.com" \
  --role="roles/storage.objectViewer"
```

### 7. Initialize Database Schema

The database schema will be automatically initialized on first deployment using the SQL file at `db/schema.sql`.

If you need to manually initialize or update the schema:

```bash
# SSH to VM
gcloud compute ssh brooks-20260121-095019 --zone=us-central1-f --project=brooks-485009

# Once deployed, exec into the database container
docker exec -i brooks-db psql -U brooks -d brooks < /docker-entrypoint-initdb.d/01-schema.sql
```

### 8. Deploy

Push your code to the main/master branch:

```bash
git add .
git commit -m "Initial deployment setup"
git push origin main
```

GitHub Actions will automatically:
1. Build backend and frontend Docker images
2. Push images to Artifact Registry
3. Deploy to VM
4. Configure Caddy
5. Run health checks

Monitor the deployment:
- Go to your GitHub repository → `Actions` tab
- Click on the latest workflow run
- Watch the deployment steps in real-time

### 9. Verify Deployment

After deployment completes:

```bash
# Check services are running
gcloud compute ssh brooks-20260121-095019 --zone=us-central1-f --project=brooks-485009
cd /opt/brooks
docker compose ps

# Check logs
docker compose logs -f --tail=50

# Test endpoints
curl http://localhost:3000/health     # Frontend
curl http://localhost:8080/actuator/health  # Backend

# Test external access
curl https://brooksweb.uk
curl https://brooksweb.uk/api/actuator/health
```

### 10. Configure Auth0 (Important!)

The app currently uses placeholder Auth0 values. To enable authentication:

1. **Create Auth0 Application**:
   - Go to [Auth0 Dashboard](https://manage.auth0.com/)
   - Create a new Single Page Application
   - Note the Domain and Client ID

2. **Configure Auth0 Application**:
   - Allowed Callback URLs: `https://brooksweb.uk`
   - Allowed Logout URLs: `https://brooksweb.uk`
   - Allowed Web Origins: `https://brooksweb.uk`
   - Allowed Origins (CORS): `https://brooksweb.uk`

3. **Create Auth0 API**:
   - Create a new API in Auth0
   - Note the API Identifier (audience)

4. **Update Secret**:
   ```bash
   # Create updated brooks-env.txt with real Auth0 values
   # Then update the secret:
   gcloud secrets versions add brooks-env \
     --project=brooks-485009 \
     --data-file=brooks-env.txt
   ```

5. **Redeploy**:
   ```bash
   git commit --allow-empty -m "Trigger redeployment with Auth0 config"
   git push origin main
   ```

## Architecture Details

### Container Structure

- **brooks-frontend**: Nginx serving React SPA (port 3000)
- **brooks-backend**: Spring Boot API (port 8080)
- **brooks-db**: PostgreSQL 16 with PostGIS (port 5432)
- **caddy**: Reverse proxy with auto-SSL (ports 80, 443)

### Network Configuration

- **brooks-network**: Internal network for app containers
- **web**: External network for Caddy to reach app containers

### Data Persistence

- **brooks-db-data**: PostgreSQL data volume (persistent)

### Caddy Configuration

Caddy handles:
- Automatic HTTPS with Let's Encrypt
- HTTP → HTTPS redirect
- Routes `/api/*` to backend
- Routes all other paths to frontend
- Health checks for both services
- Security headers

## Troubleshooting

### Deployment Fails

1. Check GitHub Actions logs for detailed error messages
2. Verify all secrets are correctly set
3. Ensure DNS is properly configured

### SSL Certificate Issues

```bash
# Check Caddy logs
docker logs caddy

# Verify DNS propagation
nslookup brooksweb.uk
curl -I http://brooksweb.uk

# Manually reload Caddy
docker exec caddy caddy reload --config /etc/caddy/Caddyfile
```

### Database Connection Issues

```bash
# Check database logs
docker logs brooks-db

# Test database connectivity
docker exec brooks-backend nc -zv brooks-db 5432

# Check environment variables
docker exec brooks-backend env | grep DATABASE
```

### Backend Not Starting

```bash
# Check backend logs
docker logs brooks-backend -f

# Check health endpoint
docker exec brooks-backend curl http://localhost:8080/actuator/health

# Verify Java version
docker exec brooks-backend java -version
```

### Frontend Not Loading

```bash
# Check frontend logs
docker logs brooks-frontend -f

# Check nginx config
docker exec brooks-frontend cat /etc/nginx/conf.d/default.conf

# Test frontend directly
curl http://localhost:3000
```

## Manual Deployment (If Needed)

If GitHub Actions fails and you need to deploy manually:

```bash
# SSH to VM
gcloud compute ssh brooks-20260121-095019 --zone=us-central1-f --project=brooks-485009

# Navigate to app directory
cd /opt/brooks

# Pull latest images
docker compose pull

# Restart services
docker compose up -d --force-recreate

# Reload Caddy
docker exec caddy caddy reload --config /etc/caddy/Caddyfile
```

## Updating the Application

Simply push changes to the main/master branch:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

The GitHub Actions workflow will automatically:
1. Build new images
2. Push to registry
3. Deploy to VM
4. Rollback on failure

## Monitoring & Logs

### View All Logs

```bash
# All services
docker compose logs -f

# Specific service
docker logs -f brooks-backend
docker logs -f brooks-frontend
docker logs -f brooks-db
docker logs -f caddy
```

### Monitor Resource Usage

```bash
# Container stats
docker stats

# Disk usage
docker system df
df -h
```

### Health Checks

```bash
# Backend health
curl http://localhost:8080/actuator/health

# Frontend health
curl http://localhost:3000/health

# External health
curl https://brooksweb.uk/api/actuator/health
```

## Security Best Practices

- [x] Non-root user in Docker containers
- [x] Security headers configured in Caddy
- [x] Secrets stored in GCP Secret Manager
- [x] SSH key authentication only
- [x] Automatic HTTPS with Let's Encrypt
- [x] Docker log rotation configured
- [ ] Configure firewall rules (done by setup script)
- [ ] Enable GCP Cloud Armor (optional)
- [ ] Set up monitoring and alerting (optional)

## Cost Optimization

- Container resource limits configured in docker-compose.yml
- Docker log rotation enabled
- Use preemptible/spot VMs for non-production (optional)

## Next Steps

1. **Monitor Initial Deployment**: Watch the first deployment closely
2. **Test All Features**: Verify authentication, map functionality, etc.
3. **Setup Monitoring**: Consider adding Google Cloud Monitoring
4. **Backup Strategy**: Implement database backups
5. **CI/CD Enhancement**: Add staging environment (optional)

## Support

For issues or questions:
- Check GitHub Actions logs
- Review container logs on VM
- Verify DNS and SSL configuration
- Ensure all secrets are correctly set

## Free Deployment Alternative

Note: GitHub Pages cannot host this application for free because:
- Backend requires a server (Spring Boot/Java)
- Database requires persistent storage (PostgreSQL)
- GitHub Pages only supports static sites

Alternative free/low-cost options:
- **Railway.app**: $5/month for hobby plan, easy deployment
- **Render.com**: Free tier available with limitations
- **Fly.io**: Free tier with resource limits
- **GCP Free Tier**: Your current VM might be within free tier limits

Your current GCP setup is cost-effective for a full-stack app with database.
