# GitHub Repository Setup Guide

## Step 1: Create GitHub Repository

### Option A: Using GitHub Web Interface

1. Go to https://github.com/new
2. Fill in repository details:
   - **Repository name**: `brooks-app` (or your preferred name)
   - **Description**: "Brooks - Location-based social networking app"
   - **Visibility**: Private (recommended) or Public
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
3. Click "Create repository"

### Option B: Using GitHub CLI.

```bash
# Install GitHub CLI if not already installed
# Windows: winget install GitHub.cli
# Mac: brew install gh

# Login to GitHub
gh auth login

# Create repository
gh repo create brooks-app --private --source=. --remote=origin --push
```

## Step 2: Initialize Git in Your Project

If you haven't already initialized git:

```bash
cd C:\Users\Boris\Dell\Projects\APPS\Brooks\Brooks_new_1

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit - Brooks app with deployment configuration"
```

## Step 3: Connect to GitHub Repository

After creating the repository on GitHub, you'll see commands like these:

```bash
# Add remote repository
git remote add origin https://github.com/YOUR-USERNAME/brooks-app.git

# Or using SSH (recommended if you have SSH keys set up)
git remote add origin git@github.com:YOUR-USERNAME/brooks-app.git

# Verify remote
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 4: Configure GitHub Secrets

1. Go to your repository on GitHub
2. Click **Settings** tab
3. In left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret** button

### Add These 4 Secrets:

#### Secret 1: GCP_SA_KEY

**Value**: Service account JSON key

Get it by running:
```bash
gcloud iam service-accounts keys create ~/brooks-sa-key.json \
  --iam-account=brooks-service-account@brooks-485009.iam.gserviceaccount.com \
  --project=brooks-485009

# Display the key
cat ~/brooks-sa-key.json
```

Copy the **entire JSON content** (including the curly braces) and paste as the secret value.

Then delete the local file:
```bash
rm ~/brooks-sa-key.json
```

#### Secret 2: VM_HOST

**Name**: `VM_HOST`
**Value**: `34.59.112.7`

This is your VM's external IP address.

#### Secret 3: VM_SSH_USER

**Name**: `VM_SSH_USER`
**Value**: Your GCP SSH username

To find your username:
```bash
gcloud compute ssh brooks-20260121-095019 --zone=us-central1-f --dry-run
```

Look for the username in the command output (usually the part before the `@` symbol).

Common formats:
- `youremail_gmail_com` (if using Gmail)
- `your_username` (your GCP username)

Or just SSH to the VM and run:
```bash
whoami
```

#### Secret 4: VM_SSH_KEY

**Name**: `VM_SSH_KEY`
**Value**: Private SSH key content

This was generated in the VM setup step:
```bash
# SSH to VM first
gcloud compute ssh brooks-20260121-095019 --zone=us-central1-f --project=brooks-485009

# Display the private key.
cat ~/.ssh/github_actions_brooks
```

Copy the **entire private key** including:
- `-----BEGIN OPENSSH PRIVATE KEY-----`
- All the content in between
- `-----END OPENSSH PRIVATE KEY-----`

### Verification

After adding all secrets, you should see:
- ✅ GCP_SA_KEY
- ✅ VM_HOST
- ✅ VM_SSH_USER
- ✅ VM_SSH_KEY

## Step 5: Verify GitHub Actions

1. Go to your repository
2. Click **Actions** tab
3. You should see the workflow "🚀 Deploy Brooks App"
4. If there's a warning about workflows, click "I understand my workflows, go ahead and enable them"

## Step 6: Test Deployment

Push a test commit:

```bash
# Make a small change
echo "# Brooks App" > TEST.md
git add TEST.md
git commit -m "Test deployment workflow"
git push origin main

# Or trigger manually without changes
git commit --allow-empty -m "Trigger deployment"
git push origin main
```

Watch the deployment:
1. Go to **Actions** tab
2. Click on the latest workflow run
3. Watch the deployment steps in real-time

## Common Issues

### Issue: Permission denied (publickey)

**Solution**: Ensure the SSH public key is in authorized_keys on VM:
```bash
# On VM
cat ~/.ssh/github_actions_brooks.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### Issue: Failed to push Docker image

**Solution**: Verify service account has Artifact Registry Writer role:
```bash
gcloud projects add-iam-policy-binding brooks-485009 \
  --member="serviceAccount:brooks-service-account@brooks-485009.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"
```

### Issue: Cannot access secrets

**Solution**: Grant Secret Manager Accessor role:
```bash
gcloud projects add-iam-policy-binding brooks-485009 \
  --member="serviceAccount:brooks-service-account@brooks-485009.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

## Complete Command Reference

```bash
# Navigate to project
cd C:\Users\Boris\Dell\Projects\APPS\Brooks\Brooks_new_1

# Initialize git (if not done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit with deployment configuration"

# Add GitHub remote (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/brooks-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Next Steps

After GitHub repository is set up:
1. ✅ Repository created and code pushed
2. ✅ GitHub Secrets configured
3. → Configure Auth0 (see AUTH0_SETUP.md)
4. → Create GCP Secrets (see SECRETS_SETUP.md)
5. → Deploy!

## Security Notes

- ✅ Never commit `.env` files
- ✅ Never commit service account keys
- ✅ Never commit SSH private keys
- ✅ Use GitHub Secrets for sensitive data
- ✅ Keep your repository private (recommended)

All sensitive files are already in `.gitignore`.
