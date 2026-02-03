# Redis (Optional) - VM Docker Deployment

Redis is added to the production compose file for caching. It is not yet
used in code, but it is ready to be wired in later for:
- relationship graph caching
- list membership caching
- rate limit counters

## Enable Redis in production
1) Set `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_CACHE_TTL_SECONDS` in your VM `.env`.
2) Redeploy with `infra/docker-compose.prod.yml`.

## Access URL (internal network)
Use this connection string in services when you add caching:

  redis://:REDIS_PASSWORD@brooks-redis:6379

No application code is reading Redis yet — this is infrastructure only.
