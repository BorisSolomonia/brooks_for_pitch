# Brooks App - Complete Setup Checklist

Step-by-step checklist for deploying Brooks app to GCP VM with GitHub Actions.

## 📚 Documentation Quick Links

- **QUICKSTART.md** - 15-minute quick start guide
- **GITHUB_SETUP.md** - Prepare GitHub repository
- **AUTH0_SETUP.md** - Configure Auth0 authentication
- **SECRETS_SETUP.md** - Create GCP secrets
- **DEPLOYMENT.md** - Full deployment guide

## ⏱️ Time Estimate

- **Quick path** (without Auth0): ~20 minutes
- **Complete setup** (with Auth0): ~45 minutes

## 🎯 Prerequisites

Before starting:
- [ ] GCP account with project `brooks-485009` created
- [ ] VM `brooks-20260121-095019` created (IP: 34.59.112.7)
- [ ] Service account `brooks-service-account@brooks-485009.iam.gserviceaccount.com` created
- [ ] Domain `brooksweb.uk` registered
- [ ] gcloud CLI installed on your local machine
- [ ] Git installed on your local machine
- [ ] GitHub account

## 📝 Complete Setup Process

### PHASE 1: DNS Configuration (5 minutes)

- [ ] **1.1** Go to your domain registrar (where you bought brooksweb.uk)
- [ ] **1.2** Add DNS A records:
  ```
  A    brooksweb.uk         → 34.59.112.7
  A    www.brooksweb.uk     → 34.59.112.7
  ```
- [ ] **1.3** Save DNS changes
- [ ] **1.4** Wait 2-10 minutes for propagation
- [ ] **1.5** Verify DNS:
  ```bash
  nslookup brooksweb.uk
  # Should return: 34.59.112.7
  ```

**Status**: ⏱️ DNS is propagating (continue with other steps)

---

### PHASE 2: VM Initial Setup (10 minutes)

See: **infra/scripts/setup-vm.sh**

- [ ] **2.1** SSH to VM:
  ```bash
  gcloud compute ssh brooks-20260121-095019 \
    --zone=us-central1-f \
    --project=brooks-485009
  ```

- [ ] **2.2** Copy setup script to VM:
  ```bash
  # On your VM, create the file:
  nano setup-vm.sh

  # Paste contents from: infra/scripts/setup-vm.sh
  # Save (Ctrl+X, Y, Enter)
  ```

- [ ] **2.3** Make script executable and run:
  ```bash
  chmod +x setup-vm.sh
  ./setup-vm.sh
  ```

- [ ] **2.4** Wait for setup to complete (~5 minutes)

- [ ] **2.5** Verify Docker is running:
  ```bash
  docker --version
  docker compose version
  docker ps | grep caddy
  docker network ls | grep web
  ```

- [ ] **2.6** Generate SSH key for GitHub Actions:
  ```bash
  ssh-keygen -t ed25519 -f ~/.ssh/github_actions_brooks -N ""
  cat ~/.ssh/github_actions_brooks.pub >> ~/.ssh/authorized_keys
  chmod 600 ~/.ssh/authorized_keys
  ```

- [ ] **2.7** Save the private key (you'll need it for GitHub):
  ```bash
  cat ~/.ssh/github_actions_brooks
  # Copy the entire output (including BEGIN/END lines)
  ```

- [ ] **2.8** Get your SSH username:
  ```bash
  whoami
  # Save this username for GitHub secrets
  ```

- [ ] **2.9** Log out and back in (for Docker group):
  ```bash
  exit
  gcloud compute ssh brooks-20260121-095019 --zone=us-central1-f
  ```

**Status**: ✅ VM is ready

---

### PHASE 3: GCP Secrets Setup (10 minutes)

See: **SECRETS_SETUP.md**

- [ ] **3.1** Install gcloud CLI (if not already):
  ```bash
  # Windows: Download from https://cloud.google.com/sdk/docs/install
  # Mac: brew install --cask google-cloud-sdk
  ```

- [ ] **3.2** Authenticate and configure:
  ```bash
  gcloud auth login
  gcloud config set project brooks-485009
  ```

- [ ] **3.3** Enable required APIs:
  ```bash
  gcloud services enable secretmanager.googleapis.com
  gcloud services enable artifactregistry.googleapis.com
  ```

- [ ] **3.4** Grant service account permissions:
  ```bash
  gcloud projects add-iam-policy-binding brooks-485009 \
    --member="serviceAccount:brooks-service-account@brooks-485009.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

  gcloud projects add-iam-policy-binding brooks-485009 \
    --member="serviceAccount:brooks-service-account@brooks-485009.iam.gserviceaccount.com" \
    --role="roles/artifactregistry.writer"
  ```

- [ ] **3.5** Generate secure credentials:
  ```bash
  # Generate JWT secret
  openssl rand -base64 32
  # Save this output

  # Generate database password
  openssl rand -base64 16
  # Save this output
  ```

- [ ] **3.6** Create brooks-env.txt:
  ```bash
  cd C:\Users\Boris\Dell\Projects\APPS\Brooks\Brooks_new_1
  cp .env.example brooks-env.txt
  notepad brooks-env.txt  # Windows
  ```

- [ ] **3.7** Fill in brooks-env.txt with:
  - DATABASE_PASSWORD (from step 3.5)
  - JWT_SECRET (from step 3.5)
  - Auth0 values (see Phase 4) OR placeholders:
    ```
    AUTH0_DOMAIN=placeholder.auth0.com
    AUTH0_AUDIENCE=https://placeholder-api
    VITE_AUTH0_DOMAIN=placeholder.auth0.com
    VITE_AUTH0_CLIENT_ID=placeholder-client-id
    VITE_AUTH0_AUDIENCE=https://placeholder-api
    ```

- [ ] **3.8** Create GCP secret:
  ```bash
  gcloud secrets create brooks-env \
    --project=brooks-485009 \
    --data-file=brooks-env.txt \
    --replication-policy=automatic
  ```

- [ ] **3.9** Verify secret creation:
  ```bash
  gcloud secrets describe brooks-env --project=brooks-485009
  gcloud secrets versions access latest --secret=brooks-env --project=brooks-485009
  ```

- [ ] **3.10** Delete local file:
  ```bash
  del brooks-env.txt  # Windows
  rm brooks-env.txt   # Mac/Linux
  ```

**Status**: ✅ Secrets configured

---

### PHASE 4: Auth0 Setup (15 minutes) - OPTIONAL

See: **AUTH0_SETUP.md**

Skip this if using placeholders. Come back later to configure real Auth0.

- [ ] **4.1** Create Auth0 account at https://auth0.com

- [ ] **4.2** Create Auth0 Application (SPA):
  - Name: "Brooks Web App"
  - Type: Single Page Web Application

- [ ] **4.3** Configure Application URLs:
  - Allowed Callback URLs: `https://brooksweb.uk, http://localhost:5173`
  - Allowed Logout URLs: `https://brooksweb.uk, http://localhost:5173`
  - Allowed Web Origins: `https://brooksweb.uk, http://localhost:5173`
  - Allowed Origins (CORS): `https://brooksweb.uk, http://localhost:5173`

- [ ] **4.4** Note Auth0 Application credentials:
  - Domain: `_______________`
  - Client ID: `_______________`

- [ ] **4.5** Create Auth0 API:
  - Name: "Brooks API"
  - Identifier: `https://api.brooksweb.uk`

- [ ] **4.6** Enable RBAC in API settings

- [ ] **4.7** Update GCP secret with real Auth0 values:
  ```bash
  # Edit brooks-env.txt with real Auth0 values
  gcloud secrets versions add brooks-env \
    --project=brooks-485009 \
    --data-file=brooks-env.txt
  rm brooks-env.txt
  ```

**Status**: ✅ Auth0 configured (or skipped with placeholders)

---

### PHASE 5: GitHub Repository Setup (10 minutes)

See: **GITHUB_SETUP.md**

- [ ] **5.1** Create GitHub repository:
  - Go to https://github.com/new
  - Name: `brooks-app`
  - Visibility: Private
  - Don't initialize with README

- [ ] **5.2** Initialize git locally:
  ```bash
  cd C:\Users\Boris\Dell\Projects\APPS\Brooks\Brooks_new_1
  git init
  git add .
  git commit -m "Initial commit with deployment configuration"
  ```

- [ ] **5.3** Connect to GitHub:
  ```bash
  git remote add origin https://github.com/YOUR-USERNAME/brooks-app.git
  git branch -M main
  git push -u origin main
  ```

- [ ] **5.4** Get service account key:
  ```bash
  gcloud iam service-accounts keys create ~/brooks-sa-key.json \
    --iam-account=brooks-service-account@brooks-485009.iam.gserviceaccount.com \
    --project=brooks-485009

  cat ~/brooks-sa-key.json
  # Copy the entire JSON

  rm ~/brooks-sa-key.json
  ```

- [ ] **5.5** Add GitHub Secrets (Settings → Secrets → Actions):

  **Secret 1: GCP_SA_KEY**
  - [ ] Name: `GCP_SA_KEY`
  - [ ] Value: (JSON from step 5.4)

  **Secret 2: VM_HOST**
  - [ ] Name: `VM_HOST`
  - [ ] Value: `34.59.112.7`

  **Secret 3: VM_SSH_USER**
  - [ ] Name: `VM_SSH_USER`
  - [ ] Value: (username from Phase 2, step 2.8)

  **Secret 4: VM_SSH_KEY**
  - [ ] Name: `VM_SSH_KEY`
  - [ ] Value: (private key from Phase 2, step 2.7)

- [ ] **5.6** Verify all 4 secrets are added

**Status**: ✅ GitHub configured

---

### PHASE 6: First Deployment (5 minutes)

- [ ] **6.1** Verify DNS has propagated:
  ```bash
  nslookup brooksweb.uk
  # Should show: 34.59.112.7
  ```

- [ ] **6.2** Trigger deployment:
  ```bash
  # Either push a commit:
  git commit --allow-empty -m "Initial deployment"
  git push origin main

  # Or use GitHub UI: Actions → Deploy → Run workflow
  ```

- [ ] **6.3** Watch deployment:
  - Go to GitHub → Actions tab
  - Click on running workflow
  - Monitor each step

- [ ] **6.4** Wait for deployment to complete (~10 minutes first time)

**Status**: ⏱️ Deployment in progress

---

### PHASE 7: Verification (5 minutes)

- [ ] **7.1** Check HTTPS homepage:
  ```bash
  curl -I https://brooksweb.uk
  # Should return: HTTP/2 200
  ```

- [ ] **7.2** Check API health:
  ```bash
  curl https://brooksweb.uk/api/actuator/health
  # Should return: {"status":"UP"}
  ```

- [ ] **7.3** Open in browser:
  - [ ] Visit https://brooksweb.uk
  - [ ] Verify SSL certificate is valid (green padlock)
  - [ ] Verify frontend loads

- [ ] **7.4** SSH to VM and check services:
  ```bash
  gcloud compute ssh brooks-20260121-095019 --zone=us-central1-f

  cd /opt/brooks
  docker compose ps
  # Should show: brooks-frontend, brooks-backend, brooks-db all Up

  docker compose logs -f --tail=50
  # Check for errors
  ```

- [ ] **7.5** Test API endpoints:
  ```bash
  curl https://brooksweb.uk/api/actuator/health
  curl https://brooksweb.uk/api/actuator/info
  ```

**Status**: ✅ Deployment successful!

---

## 🎉 Success Criteria

All these should be ✅:

- [ ] DNS resolves brooksweb.uk to 34.59.112.7
- [ ] HTTPS works with valid SSL certificate
- [ ] Frontend loads at https://brooksweb.uk
- [ ] Backend API responds at https://brooksweb.uk/api/actuator/health
- [ ] All Docker containers are running
- [ ] No errors in container logs
- [ ] GitHub Actions workflow completed successfully

---

## 📊 Post-Deployment

### Immediate Tasks
- [ ] Test the application functionality
- [ ] Check all logs for warnings/errors
- [ ] Verify database connectivity
- [ ] Test authentication (if Auth0 configured)

### Within 24 Hours
- [ ] Monitor resource usage
- [ ] Check SSL certificate renewal
- [ ] Review deployment logs
- [ ] Set up monitoring alerts (optional)

### Within 1 Week
- [ ] Configure Auth0 (if using placeholders)
- [ ] Set up database backups
- [ ] Plan for staging environment
- [ ] Document API endpoints

---

## 🆘 Troubleshooting

### Deployment Failed

**Check GitHub Actions logs:**
1. Go to repository → Actions
2. Click failed workflow
3. Expand failed step
4. Read error message

**Common issues:**
- Missing/incorrect GitHub secrets
- Service account permission issues
- DNS not propagated
- VM not accessible

### SSL Certificate Not Working

**Wait longer:**
- Let's Encrypt needs DNS to be fully propagated
- Can take 2-10 minutes

**Check:**
```bash
# Verify DNS
nslookup brooksweb.uk

# Check Caddy logs
docker logs caddy
```

### Backend Not Starting

**Check logs:**
```bash
docker logs brooks-backend
docker logs brooks-db
```

**Common issues:**
- Database connection failed
- Environment variables missing
- Port conflicts

### Frontend Not Loading

**Check logs:**
```bash
docker logs brooks-frontend
```

**Test directly:**
```bash
curl http://localhost:3000
```

---

## 📞 Getting Help

1. **Check logs first:**
   ```bash
   cd /opt/brooks
   docker compose logs -f
   ```

2. **Review documentation:**
   - DEPLOYMENT.md - Full guide
   - QUICKSTART.md - Quick reference
   - Specific setup guides for each component

3. **Common commands:**
   ```bash
   # Restart everything
   docker compose restart

   # Rebuild and restart
   docker compose down
   docker compose pull
   docker compose up -d

   # Check health
   docker compose ps
   docker stats
   ```

---

## 🎯 Quick Command Reference

```bash
# SSH to VM
gcloud compute ssh brooks-20260121-095019 --zone=us-central1-f

# View logs
cd /opt/brooks && docker compose logs -f

# Restart services
docker compose restart

# Pull new images and restart
docker compose pull && docker compose up -d --force-recreate

# Check health
curl https://brooksweb.uk/api/actuator/health

# Redeploy from GitHub
git commit --allow-empty -m "Redeploy" && git push
```

---

## ✅ Final Checklist

Before considering setup complete:

- [ ] All 7 phases completed
- [ ] All success criteria met
- [ ] Application accessible via HTTPS
- [ ] No errors in logs
- [ ] GitHub Actions workflow green
- [ ] Documentation reviewed
- [ ] Backup plan in place (optional)
- [ ] Monitoring configured (optional)

---

## 🚀 You're Done!

Your Brooks app is now deployed and running at:
- **URL**: https://brooksweb.uk
- **API**: https://brooksweb.uk/api
- **Health**: https://brooksweb.uk/api/actuator/health

**Next steps:**
- Start developing features
- Configure Auth0 for real authentication
- Set up monitoring
- Plan for database backups
- Add staging environment

Congratulations! 🎉
