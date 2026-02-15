# Deployment (Deprecated Wrapper)

This file is retained for backward compatibility.

## Authoritative Deployment Document
Use `DEPLOYMENT_GUIDE_DETAILED.md`.

It contains:
- current deployment architecture
- VM + Artifact Registry + Secret Manager flow
- phased startup to prevent DB pool storms
- known incidents and recovery procedures

## Why This File Was Simplified
Older content in this file mixed:
- legacy monolith instructions
- outdated VM/zone/IP examples
- stale container names (`brooks-backend`, `brooks-db`)

To avoid operational mistakes, those details were consolidated into the canonical guide.
