#!/usr/bin/env bash
set -euo pipefail

env_file="${1:-.env.production}"

[ -f "$env_file" ] || {
  echo "Env file not found: $env_file"
  exit 1
}

get_env() {
  local key="$1"
  grep -E "^${key}=" "$env_file" | cut -d'=' -f2- || true
}

# Keep DB URLs runtime-compatible in containers.
sed -E -i '/^[A-Z_]+_DB_URL=/{
  s#sslmode=verify-full#sslmode=require#g;
  s#([?&])sslrootcert=[^&]*##g;
  s#\?&+#?#g;
  s#&&+#\&#g;
  s#[?&]$##g;
}' "$env_file"

for svc in AUTH SOCIAL LISTS PINS MODERATION; do
  url="$(get_env "${svc}_DB_URL")"
  user="$(get_env "${svc}_DB_USER")"
  pass="$(get_env "${svc}_DB_PASSWORD")"

  [ -n "$url" ] || { echo "Missing ${svc}_DB_URL"; exit 1; }
  [ -n "$user" ] || { echo "Missing ${svc}_DB_USER"; exit 1; }
  [ -n "$pass" ] || { echo "Missing ${svc}_DB_PASSWORD"; exit 1; }

  echo "$url" | grep -Eq '^jdbc:postgresql://' || {
    echo "${svc}_DB_URL must start with jdbc:postgresql://"
    exit 1
  }

  echo "$url" | grep -Eq 'jdbc:postgresql://(localhost|127\.0\.0\.1|\[::1\]|::1)(:|/|$)' && {
    echo "${svc}_DB_URL points to localhost; invalid inside containers"
    exit 1
  }

  echo "$url" | grep -Eq 'jdbc:postgresql://postgres(:|/|$)' && {
    echo "${svc}_DB_URL points to host postgres; invalid unless local DB service exists"
    exit 1
  }

  if echo "$url" | grep -q 'pooler.supabase.com:6543'; then
    echo "${svc}_DB_URL uses Supabase transaction pooler (6543) which is incompatible with HikariCP+Flyway. Use session pooler: pooler.supabase.com:5432"
    exit 1
  fi
done

required_keys=(
  BROOKS_DOMAIN
  BROOKS_AUTH_CLAIM_NAMESPACE
  AUTH0_ISSUER_URI
  AUTH0_AUDIENCE
  BROOKS_WEB_ORIGINS
  AUTH_SERVICE_HOST
  AUTH_SERVICE_PORT
  SOCIAL_SERVICE_HOST
  SOCIAL_SERVICE_PORT
  LISTS_SERVICE_HOST
  LISTS_SERVICE_PORT
  PINS_SERVICE_HOST
  PINS_SERVICE_PORT
  MEDIA_SERVICE_HOST
  MEDIA_SERVICE_PORT
  MODERATION_SERVICE_HOST
  MODERATION_SERVICE_PORT
  NOTIFICATIONS_SERVICE_HOST
  NOTIFICATIONS_SERVICE_PORT
  FRONTEND_HOST
  FRONTEND_PORT
  REDIS_HOST
  REDIS_PORT
  REDIS_PASSWORD
  REDIS_CACHE_TTL_SECONDS
  INTERNAL_SERVICE_NAME
  INTERNAL_SERVICE_KEY
  BROOKS_BUCKET_SIZE_DEG
  BROOKS_CLEANUP_ENABLED
  BROOKS_CLEANUP_BATCH_SIZE
  BROOKS_CLEANUP_RETENTION_DAYS
  BROOKS_CLEANUP_CRON
  MEDIA_UPLOAD_BASE_URL
  BROOKS_JWT_ISSUER
  BROOKS_JWT_SECRET
  BROOKS_JWT_ACCESS_TTL
  BROOKS_JWT_REFRESH_TTL
  DB_KEEPALIVE_TIME_MS
  VITE_AUTH0_DOMAIN
  VITE_AUTH0_CLIENT_ID
  VITE_AUTH0_AUDIENCE
  VITE_AUTH0_REDIRECT_URI
  VITE_PINS_API_URL
  VITE_MAP_PROVIDER
  VITE_REVERSE_GEOCODE_URL
  VITE_LEAFLET_TILE_URL
  VITE_LEAFLET_ATTRIBUTION
  VITE_DEFAULT_CENTER_LAT
  VITE_DEFAULT_CENTER_LNG
)

for key in "${required_keys[@]}"; do
  val="$(get_env "$key")"
  [ -n "$val" ] || { echo "Missing ${key}"; exit 1; }
done

db_max_pool_size="$(get_env DB_MAX_POOL_SIZE)"
db_min_idle="$(get_env DB_MIN_IDLE)"
db_connection_timeout_ms="$(get_env DB_CONNECTION_TIMEOUT_MS)"
flyway_connect_retries="$(get_env FLYWAY_CONNECT_RETRIES)"

echo "$db_max_pool_size" | grep -Eq '^[0-9]+$' || {
  echo "DB_MAX_POOL_SIZE must be an integer"
  exit 1
}
echo "$db_min_idle" | grep -Eq '^[0-9]+$' || {
  echo "DB_MIN_IDLE must be an integer"
  exit 1
}
echo "$db_connection_timeout_ms" | grep -Eq '^[0-9]+$' || {
  echo "DB_CONNECTION_TIMEOUT_MS must be an integer"
  exit 1
}
echo "$flyway_connect_retries" | grep -Eq '^[0-9]+$' || {
  echo "FLYWAY_CONNECT_RETRIES must be an integer"
  exit 1
}

if [ "$db_max_pool_size" -lt 2 ]; then
  echo "DB_MAX_POOL_SIZE must be at least 2 for reliable Spring Boot + Flyway startup"
  exit 1
fi

if [ "$db_min_idle" -gt "$db_max_pool_size" ]; then
  echo "DB_MIN_IDLE cannot be greater than DB_MAX_POOL_SIZE"
  exit 1
fi

if [ "$db_connection_timeout_ms" -lt 10000 ]; then
  echo "DB_CONNECTION_TIMEOUT_MS is too low"
  exit 1
fi

if [ "$flyway_connect_retries" -lt 30 ]; then
  echo "FLYWAY_CONNECT_RETRIES must be at least 30"
  exit 1
fi

auth0_issuer="$(get_env AUTH0_ISSUER_URI)"
vite_auth0_domain="$(get_env VITE_AUTH0_DOMAIN)"
auth0_audience="$(get_env AUTH0_AUDIENCE)"
vite_auth0_audience="$(get_env VITE_AUTH0_AUDIENCE)"

echo "$auth0_issuer" | grep -Eq '^https://[^/]+/+$' || {
  echo "AUTH0_ISSUER_URI must be a valid issuer URL ending with /"
  exit 1
}

echo "$auth0_issuer" | grep -Eq 'your-tenant|example\.com|replace-me' && {
  echo "AUTH0_ISSUER_URI still contains a placeholder value"
  exit 1
}
echo "$vite_auth0_domain" | grep -Eq 'your-tenant|example\.com|replace-me' && {
  echo "VITE_AUTH0_DOMAIN still contains a placeholder value"
  exit 1
}
echo "$auth0_audience" | grep -Eq 'example\.com|replace-me|your-tenant' && {
  echo "AUTH0_AUDIENCE still contains a placeholder value"
  exit 1
}
echo "$vite_auth0_audience" | grep -Eq 'example\.com|replace-me|your-tenant' && {
  echo "VITE_AUTH0_AUDIENCE still contains a placeholder value"
  exit 1
}

issuer_host="$(printf '%s' "$auth0_issuer" | sed -E 's#^https://([^/]+)/$#\1#')"
[ "$vite_auth0_domain" = "$issuer_host" ] || {
  echo "VITE_AUTH0_DOMAIN does not match AUTH0_ISSUER_URI host"
  exit 1
}

[ "$vite_auth0_audience" = "$auth0_audience" ] || {
  echo "VITE_AUTH0_AUDIENCE must match AUTH0_AUDIENCE"
  exit 1
}

tmp_openid="$(mktemp)"
curl -fsS --max-time 20 "${auth0_issuer}.well-known/openid-configuration" > "$tmp_openid" || {
  rm -f "$tmp_openid"
  echo "Failed to fetch Auth0 OpenID configuration from AUTH0_ISSUER_URI"
  exit 1
}

python3 - "$auth0_issuer" "$tmp_openid" <<'PY'
import json
import sys

issuer = sys.argv[1]
path = sys.argv[2]
with open(path, "r", encoding="utf-8") as fh:
    data = json.load(fh)
if data.get("issuer") != issuer:
    raise SystemExit("OpenID issuer mismatch for AUTH0_ISSUER_URI")
PY
rm -f "$tmp_openid"

echo "Env validation passed for $env_file"
