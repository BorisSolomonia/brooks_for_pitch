# GCP Secrets Manager Setup Guide

Complete guide to creating and managing secrets for the Brooks app deployment.

## Overview

GCP Secret Manager stores sensitive environment variables that are automatically fetched during deployment. The VM will access these secrets using the service account.

## Prerequisites

- ✅ GCP account with project: `brooks-485009`
- ✅ Service account: `brooks-service-account@brooks-485009.iam.gserviceaccount.com`
- ✅ gcloud CLI installed and authenticated
- ✅ Auth0 configured (or placeholder values ready)

## Step 1: Install and Configure gcloud CLI

### Install gcloud (if needed)

**Windows:**
```bash
# Download and run installer from:
# https://cloud.google.com/sdk/docs/install

# Or using PowerShell
(New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", "$env:Temp\GoogleCloudSDKInstaller.exe")
& $env:Temp\GoogleCloudSDKInstaller.exe
```

**Mac:**
```bash
brew install --cask google-cloud-sdk
```

**Linux:**
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

### Authenticate and Configure

```bash
# Login to GCP
gcloud auth login

# Set default project
gcloud config set project brooks-485009

# Verify configuration
gcloud config list

# Test access
gcloud projects describe brooks-485009
```

## Step 2: Enable Required APIs

```bash
# Enable Secret Manager API
gcloud services enable secretmanager.googleapis.com --project=brooks-485009

# Enable Artifact Registry API (for Docker images)
gcloud services enable artifactregistry.googleapis.com --project=brooks-485009

# Verify APIs are enabled
gcloud services list --enabled --project=brooks-485009 | grep -E "secretmanager|artifactregistry"
```

## Step 3: Grant Service Account Permissions

The service account needs access to read secrets:

```bash
# Grant Secret Manager Secret Accessor role
gcloud projects add-iam-policy-binding brooks-485009 \
  --member="serviceAccount:brooks-service-account@brooks-485009.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Grant Artifact Registry Writer role (for Docker images)
gcloud projects add-iam-policy-binding brooks-485009 \
  --member="serviceAccount:brooks-service-account@brooks-485009.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

# Verify permissions
gcloud projects get-iam-policy brooks-485009 \
  --flatten="bindings[].members" \
  --format="table(bindings.role)" \
  --filter="bindings.members:brooks-service-account@brooks-485009.iam.gserviceaccount.com"
```

You should see:
```
ROLE
roles/artifactregistry.writer
roles/secretmanager.secretAccessor
```

## Step 4: Prepare Environment Variables File

### 4.1 Use Template

Copy the template:
```bash
cd C:\Users\Boris\Dell\Projects\APPS\Brooks\Brooks_new_1
cp .env.example brooks-env.txt
```

### 4.2 Generate Required Values

**Generate JWT Secret:**
```bash
# Generate a secure 32-character random string
openssl rand -base64 32

# Example output:
# kJ8mN3pQ5rT7wY9zA2cE4gI6kM8oQ0sU2wY4aB6dE8fH
```

**Generate Database Password:**
```bash
# Generate a secure password
openssl rand -base64 16

# Example output:
# 3xY5zA7cE9gK1mP4qR6tW8yB
```

### 4.3 Fill in All Values

Edit `brooks-env.txt` with your actual values:

```bash
# Database Configuration
DATABASE_NAME=brooks
DATABASE_USER=brooks
DATABASE_PASSWORD=3xY5zA7cE9gK1mP4qR6tW8yB

# JWT Configuration
JWT_SECRET=kJ8mN3pQ5rT7wY9zA2cE4gI6kM8oQ0sU2wY4aB6dE8fH

# Auth0 Backend Configuration
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://api.brooksweb.uk

# Frontend Configuration
VITE_AUTH_API_URL=https://brooksweb.uk/api
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=xQvT8kJ9mLp3nR5sW7yZ2aB4cD6eF8gH
VITE_AUTH0_AUDIENCE=https://api.brooksweb.uk
VITE_AUTH0_REDIRECT_URI=https://brooksweb.uk

# Map Configuration
VITE_MAP_PROVIDER=leaflet
VITE_GOOGLE_MAPS_KEY=

# API Endpoints (using domain)
VITE_SOCIAL_API_URL=https://brooksweb.uk/api/social
VITE_LISTS_API_URL=https://brooksweb.uk/api/lists
VITE_PINS_API_URL=https://brooksweb.uk/api/pins
VITE_MEDIA_API_URL=https://brooksweb.uk/api/media
VITE_MODERATION_API_URL=https://brooksweb.uk/api/moderation
VITE_NOTIFICATIONS_API_URL=https://brooksweb.uk/api/notifications
VITE_NOMINATIM_URL=https://nominatim.openstreetmap.org
```

**Important Notes:**
- Replace `your-tenant.auth0.com` with your actual Auth0 domain
- Replace `xQvT8kJ9mLp3nR5sW7yZ2aB4cD6eF8gH` with your actual Auth0 Client ID
- Use the generated values for `DATABASE_PASSWORD` and `JWT_SECRET`
- If not using Auth0 yet, you can use placeholder values

### 4.4 Using Placeholder Values (Testing Without Auth0)

If you want to deploy first and configure Auth0 later:

```bash
# Auth0 Backend Configuration
AUTH0_DOMAIN=placeholder.auth0.com
AUTH0_AUDIENCE=https://placeholder-api

# Frontend Configuration
VITE_AUTH0_DOMAIN=placeholder.auth0.com
VITE_AUTH0_CLIENT_ID=placeholder-client-id
VITE_AUTH0_AUDIENCE=https://placeholder-api
```

## Step 5: Create GCP Secret

### 5.1 Create the Secret

```bash
# Navigate to project directory
cd C:\Users\Boris\Dell\Projects\APPS\Brooks\Brooks_new_1

# Create secret in GCP Secret Manager
gcloud secrets create brooks-env \
  --project=brooks-485009 \
  --data-file=brooks-env.txt \
  --replication-policy=automatic

# Expected output:
# Created version [1] of the secret [brooks-env].
```

### 5.2 Verify Secret Creation

```bash
# List all secrets
gcloud secrets list --project=brooks-485009

# Describe the specific secret
gcloud secrets describe brooks-env --project=brooks-485009

# View secret metadata (not the actual content)
gcloud secrets versions list brooks-env --project=brooks-485009
```

Expected output:
```
NAME: brooks-env
CREATED: 2024-01-21T10:30:00.000000Z
REPLICATION_POLICY: automatic
ETAG: ...
```

### 5.3 Test Secret Access

```bash
# Test reading the secret (verify you can access it)
gcloud secrets versions access latest \
  --secret=brooks-env \
  --project=brooks-485009

# This should display your environment variables
# Verify all variables are present and correct
```

### 5.4 Clean Up Local File

**IMPORTANT**: Delete the local file containing secrets:

```bash
# Windows
del brooks-env.txt

# Mac/Linux
rm brooks-env.txt

# Verify it's deleted
dir | findstr brooks-env.txt    # Windows (should show nothing)
ls -la | grep brooks-env.txt     # Mac/Linux (should show nothing)
```

## Step 6: Update Secret (If Needed)

If you need to update the secret later:

### 6.1 Create Updated File

```bash
# Create new brooks-env.txt with updated values
notepad brooks-env.txt  # Windows
nano brooks-env.txt     # Linux/Mac
```

### 6.2 Add New Version

```bash
# Add a new version to the existing secret
gcloud secrets versions add brooks-env \
  --project=brooks-485009 \
  --data-file=brooks-env.txt

# Verify new version was created
gcloud secrets versions list brooks-env --project=brooks-485009
```

### 6.3 Clean Up and Redeploy

```bash
# Delete local file
rm brooks-env.txt

# Trigger redeployment to pick up new values
git commit --allow-empty -m "Update environment variables"
git push origin main
```

## Step 7: Configure VM to Access Secrets

The VM will automatically access secrets during deployment through the GitHub Actions workflow. But let's verify the VM can access secrets:

### 7.1 SSH to VM

```bash
gcloud compute ssh brooks-20260121-095019 \
  --zone=us-central1-f \
  --project=brooks-485009
```

### 7.2 Test Secret Access from VM

```bash
# Test if gcloud is installed and configured
gcloud --version

# Test secret access
gcloud secrets versions access latest \
  --secret=brooks-env \
  --project=brooks-485009
```

If you see your environment variables, the VM can successfully access secrets!

If you get an error:

```bash
# Authenticate VM with service account (if needed)
# First, ensure VM has service account attached
gcloud compute instances describe brooks-20260121-095019 \
  --zone=us-central1-f \
  --project=brooks-485009 \
  --format="value(serviceAccounts[0].email)"

# Should show: brooks-service-account@brooks-485009.iam.gserviceaccount.com
```

### 7.3 Attach Service Account to VM (If Needed)

If the VM doesn't have the service account attached:

```bash
# Stop the VM
gcloud compute instances stop brooks-20260121-095019 \
  --zone=us-central1-f \
  --project=brooks-485009

# Attach service account
gcloud compute instances set-service-account brooks-20260121-095019 \
  --service-account=brooks-service-account@brooks-485009.iam.gserviceaccount.com \
  --scopes=https://www.googleapis.com/auth/cloud-platform \
  --zone=us-central1-f \
  --project=brooks-485009

# Start the VM
gcloud compute instances start brooks-20260121-095019 \
  --zone=us-central1-f \
  --project=brooks-485009

# Wait a minute for VM to start, then SSH back in
gcloud compute ssh brooks-20260121-095019 --zone=us-central1-f --project=brooks-485009
```

## Step 8: Verify Deployment Integration

The GitHub Actions workflow will automatically:
1. Authenticate with GCP using the service account key
2. Fetch secrets from Secret Manager
3. Use them during Docker build
4. Deploy to VM with environment variables

### Manual Test on VM

If you want to manually test deployment with secrets:

```bash
# SSH to VM
gcloud compute ssh brooks-20260121-095019 --zone=us-central1-f --project=brooks-485009

# Navigate to app directory
cd /opt/brooks

# Fetch secrets and create .env file
gcloud secrets versions access latest \
  --secret=brooks-env \
  --project=brooks-485009 > .env

# Verify .env was created
ls -la .env
head -5 .env

# Pull and restart services
docker compose pull
docker compose up -d

# Check logs
docker compose logs -f
```

## Secret Management Best Practices

### ✅ DO:
- Use Secret Manager for all sensitive data
- Generate strong random passwords
- Rotate secrets regularly
- Use different secrets for dev/staging/production
- Delete local copies of secret files
- Use service accounts for automated access

### ❌ DON'T:
- Commit secrets to Git
- Share secrets via email or chat
- Use weak or default passwords
- Store secrets in plain text files
- Reuse secrets across environments
- Give broad access to secrets

## Troubleshooting

### Issue: "Permission denied" when creating secret

**Solution**: Ensure you're authenticated and have proper permissions:
```bash
gcloud auth login
gcloud config set project brooks-485009

# Verify you have admin permissions
gcloud projects get-iam-policy brooks-485009
```

### Issue: "API not enabled"

**Solution**: Enable Secret Manager API:
```bash
gcloud services enable secretmanager.googleapis.com --project=brooks-485009
```

### Issue: Service account can't access secret

**Solution**: Grant Secret Accessor role:
```bash
gcloud projects add-iam-policy-binding brooks-485009 \
  --member="serviceAccount:brooks-service-account@brooks-485009.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Issue: VM can't access secret

**Solution**: Ensure VM has service account attached with correct scopes:
```bash
gcloud compute instances describe brooks-20260121-095019 \
  --zone=us-central1-f \
  --format="get(serviceAccounts[0].email)"
```

### Issue: Old secret values being used

**Solution**: Redeploy after updating secret:
```bash
# On your local machine
git commit --allow-empty -m "Redeploy with updated secrets"
git push origin main

# Or manually on VM
cd /opt/brooks
docker compose down
docker compose pull
docker compose up -d
```

## Secret Rotation

To rotate secrets periodically:

```bash
# 1. Generate new values
NEW_DB_PASSWORD=$(openssl rand -base64 16)
NEW_JWT_SECRET=$(openssl rand -base64 32)

# 2. Update brooks-env.txt with new values

# 3. Update database password
docker exec -it brooks-db psql -U brooks -d brooks -c "ALTER USER brooks WITH PASSWORD '$NEW_DB_PASSWORD';"

# 4. Add new secret version
gcloud secrets versions add brooks-env \
  --data-file=brooks-env.txt \
  --project=brooks-485009

# 5. Redeploy
git commit --allow-empty -m "Rotate secrets"
git push origin main

# 6. Clean up
rm brooks-env.txt
```

## Complete Setup Checklist

- [ ] gcloud CLI installed and authenticated
- [ ] Project set to brooks-485009
- [ ] Secret Manager API enabled
- [ ] Service account permissions granted
- [ ] JWT secret generated
- [ ] Database password generated
- [ ] Auth0 values obtained (or placeholders used)
- [ ] brooks-env.txt file created with all values
- [ ] Secret created in GCP Secret Manager
- [ ] Secret verified accessible
- [ ] Local brooks-env.txt file deleted
- [ ] VM service account configured
- [ ] VM can access secret (tested)
- [ ] Ready to deploy!

## Command Reference

```bash
# Create secret
gcloud secrets create brooks-env --data-file=brooks-env.txt --project=brooks-485009

# View secret (for verification)
gcloud secrets versions access latest --secret=brooks-env --project=brooks-485009

# Update secret
gcloud secrets versions add brooks-env --data-file=brooks-env.txt --project=brooks-485009

# List all secrets
gcloud secrets list --project=brooks-485009

# List secret versions
gcloud secrets versions list brooks-env --project=brooks-485009

# Delete a secret (careful!)
gcloud secrets delete brooks-env --project=brooks-485009

# Grant access to service account
gcloud secrets add-iam-policy-binding brooks-env \
  --member="serviceAccount:brooks-service-account@brooks-485009.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor" \
  --project=brooks-485009
```

## Next Steps

After secrets are configured:
1. ✅ Secrets created in GCP Secret Manager
2. ✅ VM configured to access secrets
3. → Configure GitHub Secrets (GITHUB_SETUP.md)
4. → Deploy application
5. → Verify deployment

## Additional Resources

- [GCP Secret Manager Documentation](https://cloud.google.com/secret-manager/docs)
- [Best Practices for Secrets](https://cloud.google.com/secret-manager/docs/best-practices)
- [IAM Roles for Secret Manager](https://cloud.google.com/secret-manager/docs/access-control)
