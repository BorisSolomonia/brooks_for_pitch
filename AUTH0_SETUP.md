# Auth0 Configuration Guide

Complete guide to setting up Auth0 for the Brooks app.

## Overview

Auth0 provides authentication and authorization for the Brooks app. You'll need:
- **Auth0 Application** (Single Page Application) - For frontend authentication
- **Auth0 API** - For backend authorization

## Step 1: Create Auth0 Account

1. Go to https://auth0.com
2. Click **Sign Up** (it's free to start)
3. Choose your sign-up method (GitHub, Google, or email)
4. Select your region (choose closest to your users)
5. Complete the account setup

## Step 2: Create Auth0 Application (Frontend)

### 2.1 Create Application

1. Log in to [Auth0 Dashboard](https://manage.auth0.com/)
2. In left sidebar, click **Applications** → **Applications**
3. Click **Create Application** button
4. Configure:
   - **Name**: `Brooks Web App`
   - **Application Type**: **Single Page Web Applications**
   - Click **Create**

### 2.2 Configure Application Settings

After creation, go to the **Settings** tab:

#### Application URIs

Configure these URLs (replace with your domain):

**Allowed Callback URLs**:
```
https://brooksweb.uk,
http://localhost:5173,
http://localhost:3000
```

**Allowed Logout URLs**:
```
https://brooksweb.uk,
http://localhost:5173,
http://localhost:3000
```

**Allowed Web Origins**:
```
https://brooksweb.uk,
http://localhost:5173,
http://localhost:3000
```

**Allowed Origins (CORS)**:
```
https://brooksweb.uk,
http://localhost:5173,
http://localhost:3000
```

#### Advanced Settings

Scroll down to **Advanced Settings**:

1. Click **Advanced Settings**
2. Go to **Grant Types** tab
3. Ensure these are checked:
   - ✅ Authorization Code
   - ✅ Refresh Token
   - ✅ Implicit (for development only)

4. Click **Save Changes** at the bottom

### 2.3 Note Your Application Credentials

From the **Settings** tab, copy these values (you'll need them later):

- **Domain**: `your-tenant.auth0.com` or `your-tenant.us.auth0.com`
- **Client ID**: `abc123xyz...` (long string)

Example:
```
Domain: brooks-app.us.auth0.com
Client ID: xQvT8kJ9mLp3nR5sW7yZ2aB4cD6eF8gH
```

## Step 3: Create Auth0 API (Backend)

### 3.1 Create API

1. In Auth0 Dashboard, go to **Applications** → **APIs**
2. Click **Create API** button
3. Configure:
   - **Name**: `Brooks API`
   - **Identifier**: `https://api.brooksweb.uk` (this is your "audience")
   - **Signing Algorithm**: `RS256`
4. Click **Create**

### 3.2 Configure API Settings

After creation, go to **Settings** tab:

#### RBAC Settings

Scroll down to **RBAC Settings**:
- ✅ Enable RBAC
- ✅ Add Permissions in the Access Token

#### Access Token Settings

- **Token Expiration (Seconds)**: `3600` (1 hour)
- **Allow Offline Access**: ✅ (enables refresh tokens)

Click **Save** at the bottom.

### 3.3 Define Permissions (Optional)

Go to **Permissions** tab and add these permissions:

```
read:pins       - Read pins
write:pins      - Create and update pins
delete:pins     - Delete pins
read:social     - View social connections
write:social    - Create friendships/follows
read:lists      - View lists
write:lists     - Create and manage lists
```

Click **Save** after adding each permission.

### 3.4 Note Your API Identifier

From the **Settings** tab, copy:
- **Identifier** (Audience): `https://api.brooksweb.uk`

## Step 4: Configure Social Connections (Optional)

To enable social login (Google, Facebook, etc.):

1. Go to **Authentication** → **Social**
2. Click on the provider you want (e.g., **Google**)
3. Toggle **Enable** switch
4. Configure with your OAuth credentials
5. Save changes

## Step 5: Update GCP Secret with Auth0 Values

Now that you have your Auth0 credentials, update your GCP secret:

### 5.1 Create/Update brooks-env.txt

Create a file named `brooks-env.txt` with these values (replace with your actual values):

```bash
# Database
DATABASE_NAME=brooks
DATABASE_USER=brooks
DATABASE_PASSWORD=YourStrongPassword123!

# JWT
JWT_SECRET=your-generated-jwt-secret-at-least-32-characters

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

# API Endpoints
VITE_SOCIAL_API_URL=https://brooksweb.uk/api/social
VITE_LISTS_API_URL=https://brooksweb.uk/api/lists
VITE_PINS_API_URL=https://brooksweb.uk/api/pins
VITE_MEDIA_API_URL=https://brooksweb.uk/api/media
VITE_MODERATION_API_URL=https://brooksweb.uk/api/moderation
VITE_NOTIFICATIONS_API_URL=https://brooksweb.uk/api/notifications
VITE_NOMINATIM_URL=https://nominatim.openstreetmap.org
```

### 5.2 Generate JWT Secret

```bash
# Generate a secure JWT secret
openssl rand -base64 32

# Example output:
# kJ8mN3pQ5rT7wY9zA2cE4gI6kM8oQ0sU2wY4aB6dE8fH
```

Copy the output and use it as your `JWT_SECRET` value.

### 5.3 Update/Create GCP Secret

```bash
# If creating for the first time
gcloud secrets create brooks-env \
  --project=brooks-485009 \
  --data-file=brooks-env.txt \
  --replication-policy=automatic

# If updating existing secret
gcloud secrets versions add brooks-env \
  --project=brooks-485009 \
  --data-file=brooks-env.txt

# Verify the secret was created/updated
gcloud secrets describe brooks-env --project=brooks-485009

# View the secret (for verification only)
gcloud secrets versions access latest \
  --secret=brooks-env \
  --project=brooks-485009

# Clean up local file
rm brooks-env.txt
```

## Step 6: Configure Auth0 for Local Development

For local development, create a `.env.local` file in the `web/` directory:

```bash
# web/.env.local
VITE_AUTH_API_URL=http://localhost:8080
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=xQvT8kJ9mLp3nR5sW7yZ2aB4cD6eF8gH
VITE_AUTH0_AUDIENCE=https://api.brooksweb.uk
VITE_AUTH0_REDIRECT_URI=http://localhost:5173
VITE_MAP_PROVIDER=leaflet
```

**Important**: This file is already in `.gitignore` and will not be committed.

## Step 7: Test Auth0 Configuration

### Test in Auth0 Dashboard

1. Go to your Application in Auth0 Dashboard
2. Click **Quick Start** tab
3. Select **React**
4. Follow the test instructions to verify setup

### Test Authentication Flow

1. Deploy your app (or run locally)
2. Try to log in
3. You should be redirected to Auth0 login page
4. After login, you should be redirected back to your app

### Verify JWT Token

After successful login, check the browser console:
- You should see an access token
- Verify it's a valid JWT at https://jwt.io

## Step 8: Redeploy Application

After updating the GCP secret with Auth0 credentials:

```bash
# Trigger a redeployment
git commit --allow-empty -m "Update Auth0 configuration"
git push origin main
```

Or manually redeploy on VM:

```bash
# SSH to VM
gcloud compute ssh brooks-20260121-095019 --zone=us-central1-f --project=brooks-485009

cd /opt/brooks

# Restart services to pick up new environment variables
docker compose down
docker compose pull
docker compose up -d

# Verify
docker compose logs -f
```

## Auth0 Configuration Summary

After completing all steps, you should have:

✅ **Auth0 Application** (Single Page App)
- Configured callback URLs
- Configured logout URLs
- Configured CORS origins
- Grant types enabled

✅ **Auth0 API**
- Created with identifier (audience)
- RBAC enabled
- Permissions defined (optional)

✅ **GCP Secret Updated**
- AUTH0_DOMAIN
- AUTH0_AUDIENCE
- VITE_AUTH0_DOMAIN
- VITE_AUTH0_CLIENT_ID
- VITE_AUTH0_AUDIENCE
- VITE_AUTH0_REDIRECT_URI

✅ **Application Redeployed**
- New environment variables loaded
- Authentication working

## Troubleshooting

### Issue: "The redirect_uri is not allowed"

**Solution**: Add the callback URL to **Allowed Callback URLs** in Auth0 Application settings.

### Issue: "Invalid audience"

**Solution**: Ensure:
1. API identifier (audience) matches in both Auth0 and your environment variables
2. Format is a URL: `https://api.brooksweb.uk`

### Issue: CORS errors

**Solution**: Add your domain to **Allowed Origins (CORS)** in Auth0 Application settings.

### Issue: Token validation fails

**Solution**: Verify:
1. `AUTH0_DOMAIN` matches in backend and frontend
2. `AUTH0_AUDIENCE` is exactly the same in all places
3. No trailing slashes in URLs

### Issue: Login page doesn't load

**Solution**: Check:
1. Auth0 domain is correct
2. Client ID is correct
3. Network tab in browser for errors

## Testing Checklist

- [ ] Created Auth0 account
- [ ] Created Auth0 Application (SPA)
- [ ] Configured callback URLs
- [ ] Created Auth0 API
- [ ] Noted Domain, Client ID, and Audience
- [ ] Generated JWT secret
- [ ] Updated GCP secret with Auth0 values
- [ ] Redeployed application
- [ ] Tested login flow
- [ ] Verified JWT token

## Security Best Practices

✅ Use HTTPS in production (Caddy handles this)
✅ Enable RBAC for fine-grained permissions
✅ Set appropriate token expiration times
✅ Use refresh tokens for long sessions
✅ Never expose Client Secret in frontend (not used in SPA)
✅ Validate tokens on backend

## Auth0 Free Tier Limits

Auth0 Free tier includes:
- ✅ 7,000 monthly active users
- ✅ Unlimited logins
- ✅ Social connections (Google, GitHub, etc.)
- ✅ Email/password authentication
- ✅ JWT tokens

This should be sufficient for initial deployment.

## Next Steps

After Auth0 is configured:
1. ✅ Auth0 configured
2. ✅ GCP secret updated
3. → Deploy application
4. → Test authentication
5. → Add user management features

## Additional Resources

## Add user_id Claim via Auth0 Action (Required for Backend UUIDs)

The backend expects a UUID for the current user. Add an Auth0 Action to attach a stable
UUID-like user id claim to access tokens.

### Create Action

1. Auth0 Dashboard -> Actions -> Flows -> Login
2. Create a new Action (Custom)
3. Add the following code:

```js
/**
 * Add a stable user_id claim for Brooks services.
 * Uses the Auth0 user_id string (sub) as input to a deterministic UUID.
 */
exports.onExecutePostLogin = async (event, api) => {
  const crypto = require('crypto');
  const namespace = 'brooks';
  const raw = `${namespace}:${event.user.user_id}`;
  const hash = crypto.createHash('sha256').update(raw).digest();

  // Format as UUID v4-ish (deterministic)
  hash[6] = (hash[6] & 0x0f) | 0x40;
  hash[8] = (hash[8] & 0x3f) | 0x80;
  const hex = hash.toString('hex');
  const uuid = [
    hex.substring(0, 8),
    hex.substring(8, 12),
    hex.substring(12, 16),
    hex.substring(16, 20),
    hex.substring(20, 32)
  ].join('-');

  api.accessToken.setCustomClaim('https://brooksweb.uk/user_id', uuid);
};
```

4. Add the Action to the Login flow and deploy.

### Result

Access tokens will include:

```
https://brooksweb.uk/user_id: "<uuid>"
```

This is used by the backend to set `userId` consistently across services.

- [Auth0 Documentation](https://auth0.com/docs)
- [Auth0 React SDK](https://auth0.com/docs/quickstart/spa/react)
- [JWT.io - Token Debugger](https://jwt.io)
- [Auth0 Community](https://community.auth0.com)
