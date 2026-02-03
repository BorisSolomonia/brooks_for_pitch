#!/usr/bin/env bash
set -euo pipefail

require_var() {
  local name="$1"
  if [[ -z "${!name:-}" ]]; then
    echo "Missing required env var: ${name}" >&2
    exit 1
  fi
}

require_var PROJECT_ID
require_var CLOUDSQL_INSTANCE
require_var CLOUDSQL_REGION
require_var CLOUDSQL_DB_VERSION
require_var CLOUDSQL_TIER
require_var CLOUDSQL_STORAGE_GB

require_var AUTH_DB_NAME
require_var SOCIAL_DB_NAME
require_var LISTS_DB_NAME
require_var PINS_DB_NAME
require_var MODERATION_DB_NAME

require_var AUTH_DB_USER
require_var AUTH_DB_PASSWORD
require_var SOCIAL_DB_USER
require_var SOCIAL_DB_PASSWORD
require_var LISTS_DB_USER
require_var LISTS_DB_PASSWORD
require_var PINS_DB_USER
require_var PINS_DB_PASSWORD
require_var MODERATION_DB_USER
require_var MODERATION_DB_PASSWORD

IP_TYPE="${CLOUDSQL_IP_TYPE:-PRIVATE}"

if ! gcloud sql instances describe "$CLOUDSQL_INSTANCE" --project "$PROJECT_ID" >/dev/null 2>&1; then
  echo "Creating Cloud SQL instance ${CLOUDSQL_INSTANCE}..."
  CREATE_ARGS=(
    --project "$PROJECT_ID"
    --region "$CLOUDSQL_REGION"
    --database-version "$CLOUDSQL_DB_VERSION"
    --tier "$CLOUDSQL_TIER"
    --storage-size "$CLOUDSQL_STORAGE_GB"
    --storage-auto-increase
    --availability-type=REGIONAL
    --enable-bin-log
  )

  if [[ "$IP_TYPE" == "PRIVATE" ]]; then
    require_var CLOUDSQL_PRIVATE_NETWORK
    CREATE_ARGS+=(--network "$CLOUDSQL_PRIVATE_NETWORK" --no-assign-ip)
  else
    CREATE_ARGS+=(--assign-ip)
  fi

  gcloud sql instances create "$CLOUDSQL_INSTANCE" "${CREATE_ARGS[@]}"
else
  echo "Cloud SQL instance ${CLOUDSQL_INSTANCE} already exists."
fi

ensure_database() {
  local db="$1"
  if ! gcloud sql databases list --instance "$CLOUDSQL_INSTANCE" --project "$PROJECT_ID" \
    --format="value(name)" | grep -Fxq "$db"; then
    echo "Creating database $db..."
    gcloud sql databases create "$db" --instance "$CLOUDSQL_INSTANCE" --project "$PROJECT_ID"
  else
    echo "Database $db already exists."
  fi
}

ensure_user() {
  local user="$1"
  local password="$2"
  if gcloud sql users list --instance "$CLOUDSQL_INSTANCE" --project "$PROJECT_ID" \
    --format="value(name)" | grep -Fxq "$user"; then
    echo "Updating password for user $user..."
    gcloud sql users set-password "$user" \
      --instance "$CLOUDSQL_INSTANCE" \
      --project "$PROJECT_ID" \
      --password "$password"
  else
    echo "Creating user $user..."
    gcloud sql users create "$user" \
      --instance "$CLOUDSQL_INSTANCE" \
      --project "$PROJECT_ID" \
      --password "$password"
  fi
}

ensure_database "$AUTH_DB_NAME"
ensure_database "$SOCIAL_DB_NAME"
ensure_database "$LISTS_DB_NAME"
ensure_database "$PINS_DB_NAME"
ensure_database "$MODERATION_DB_NAME"

ensure_user "$AUTH_DB_USER" "$AUTH_DB_PASSWORD"
ensure_user "$SOCIAL_DB_USER" "$SOCIAL_DB_PASSWORD"
ensure_user "$LISTS_DB_USER" "$LISTS_DB_PASSWORD"
ensure_user "$PINS_DB_USER" "$PINS_DB_PASSWORD"
ensure_user "$MODERATION_DB_USER" "$MODERATION_DB_PASSWORD"

echo "Cloud SQL provisioning complete."
