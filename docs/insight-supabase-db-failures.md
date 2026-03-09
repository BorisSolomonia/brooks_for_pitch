# Session Insight: Four Database Bugs That Brought Down All Five Services

---

## 1. The "What Happened?" (The Problem)

After the Cloudflare TLS fix, the site was reachable again — but every API call was failing. The backend services were crashing on startup with a cascade of errors:

- Connection timeouts (services hanging for 60 seconds, then dying)
- Missing tables (`missing table [pin_acl]`)
- Missing columns (`column "status" does not exist`)
- Duplicate migration files (`Found more than one migration with version 2`)
- Invalid SQL (`functions in index predicate must be marked IMMUTABLE`)

Five services. Four separate bugs. None of them obvious from the outside.

---

## 2. The "Detective Work" (Root Cause)

We did not guess. We connected directly to the Supabase database from a local machine, queried the actual tables, and read each error log carefully. Four distinct problems emerged.

---

### Bug 1 — The Connection Pool Deadlock

#### The Analogy

Imagine a coffee shop (the database) with exactly one table. Two people need to sit down at the same time to complete a business deal — but there is only one seat. Neither can finish without the other. They wait forever. Nothing happens.

#### What Was Happening

The deploy pipeline had `DB_MAX_POOL_SIZE=1`. This set the HikariCP connection pool to a maximum of **one simultaneous database connection** per service.

Flyway — the database migration tool that runs automatically at startup — needs **two** connections at the same time: one to acquire an advisory lock (so two instances never run migrations simultaneously) and one to execute the SQL. With only one slot available, Flyway grabbed the lock connection and then waited 60 seconds for a second connection that could never come. Startup failed every time.

#### The Fix

Changed `DB_MAX_POOL_SIZE` from `1` to `2` in the deploy pipeline defaults.

---

### Bug 2 — The Shared Migration History Table

#### The Analogy

Imagine five students all submitting their homework into one shared box labeled "completed assignments." The teacher marks everything in the box as done. Student 2 comes to submit their homework — teacher says "already done, box is full." But student 2's homework was never actually submitted. Their work never happened.

#### What Was Happening

Flyway tracks which SQL files it has already run by writing to a history table called `flyway_schema_history`. All five services — auth, social, lists, pins, moderation — were writing to the **same table** in the same PostgreSQL schema.

The first service to start (lists-service) ran all its migrations (V1, V2) and recorded them. When the other four services started, Flyway looked at the shared history, saw V1 and V2 already marked as complete, and **skipped all their migrations**. The auth tables never got created. The pin_acl table never got created. The services started, Hibernate checked whether its tables existed, and crashed.

#### The Fix

Added a unique Flyway history table name for each service via `SPRING_FLYWAY_TABLE`:

| Service | Table Name |
|---|---|
| auth-service | `flyway_schema_history_auth` |
| social-service | `flyway_schema_history_social` |
| lists-service | `flyway_schema_history_lists` |
| pins-service | `flyway_schema_history_pins` |
| moderation-service | `flyway_schema_history_moderation` |

Also added `SPRING_FLYWAY_BASELINE_ON_MIGRATE: "true"` for services whose schemas already had tables from the previous broken deploys — without this, Flyway refuses to run against a non-empty schema that has no history record.

---

### Bug 3 — Broken SQL in the Migration Files

After each service now tracked its own history, new errors appeared when the migrations actually tried to run. Three separate SQL mistakes were hiding in the V2 index files.

#### Mistake A — `NOW()` in a Partial Index Predicate

```sql
-- This FAILS:
CREATE INDEX idx_pins_active ON pins (expires_at)
  WHERE expires_at > NOW();
```

PostgreSQL requires that any function used inside a partial index predicate (the `WHERE` clause of an index) be **IMMUTABLE** — meaning it always returns the exact same result for the same input, forever. `NOW()` is STABLE (it returns the current time, which changes), so PostgreSQL refuses it.

**Fix:** Removed all `WHERE expires_at > NOW()` and `WHERE expires_at < NOW()` predicates. Kept simpler predicates like `WHERE status = 'PENDING'` and `WHERE future_self = TRUE`.

#### Mistake B — Index Already Exists

```
ERROR: relation "idx_follows_followee" already exists
```

Some tables had been partially created by previous broken deploys. When the migration ran again, it tried to create indexes that were already there.

**Fix:** Added `IF NOT EXISTS` to every `CREATE INDEX` statement across all V2 migration files. This makes the statements idempotent — safe to run any number of times.

#### Mistake C — Missing Column

```
ERROR: column "status" does not exist
```

The moderation-service V2 migration tried to create a partial index `WHERE status = 'PENDING'` on the `reports` table. But the V1 migration that created the `reports` table had never included a `status` column. The index could not be created because the column it referenced did not exist.

**Fix:** Added `ALTER TABLE reports ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'PENDING';` at the top of V2, before the index creation. Also added the column definition to V1 for any future fresh installs.

---

### Bug 4 — Duplicate Migration Version Number

```
ERROR: Found more than one migration with version 2
```

Inside auth-service there were two files with the same Flyway version number:

- `V2__add_performance_indexes.sql`
- `V2__seed_demo_user.sql`

Flyway uses the version prefix (`V2`) to determine order. Two files claiming to be version 2 is an immediate fatal error — Flyway refuses to start.

A file `V3__seed_demo_user.sql` already existed with the correct content. The `V2__seed_demo_user.sql` was a leftover from an earlier rename that was never cleaned up.

**Fix:** Deleted `V2__seed_demo_user.sql`.

---

## 3. The "Idea Lab" (Potential Solutions)

### For the pool deadlock

| Option | Trade-off |
|---|---|
| Set pool size to 2+ | Simple, correct — Flyway gets what it needs |
| Run Flyway as a separate init job before the service | Cleanly separates concerns, but adds complexity to deploy pipeline |
| Disable Flyway auto-run, apply migrations manually | More control, but risky — easy to forget |

### For the shared history table

| Option | Trade-off |
|---|---|
| Per-service `SPRING_FLYWAY_TABLE` | Clean, zero extra infrastructure |
| Separate database schema per service | Stronger isolation, but requires schema-per-service setup in Supabase |
| One database per service | Maximum isolation, maximum cost on free tier |

---

## 4. The "Path Taken" (The Final Fix)

All four bugs were fixed in a single deploy:

1. `DB_MAX_POOL_SIZE` default changed to `2` in the CI/CD pipeline.
2. `SPRING_FLYWAY_TABLE` added per service with unique names.
3. `SPRING_FLYWAY_BASELINE_ON_MIGRATE: "true"` added for services with pre-existing schema data.
4. All `NOW()` predicates removed from partial index definitions.
5. `IF NOT EXISTS` added to every `CREATE INDEX` statement.
6. `ALTER TABLE reports ADD COLUMN IF NOT EXISTS status` prepended to moderation V2.
7. `V2__seed_demo_user.sql` deleted from auth-service.

After the deploy: pins recorded successfully. All five services started cleanly.

---

## 5. The "Level Up" (Future-Proofing)

### Pro-Tips

**Always isolate Flyway history per service.** In a microservices setup where multiple services share one database (as on a free Supabase plan), never let them share the same `flyway_schema_history` table. Set `SPRING_FLYWAY_TABLE` from day one.

**Partial index predicates must use only IMMUTABLE functions.** If you want to filter by time in an index, filter on a stored column value (like `status = 'COMPLETED'`), not on a live function call like `NOW()`.

**Make migrations idempotent.** Add `IF NOT EXISTS` to every `CREATE INDEX`, `CREATE TABLE`, and `CREATE SEQUENCE` statement. If a deploy fails halfway and you re-run, idempotent SQL is safe. Non-idempotent SQL creates duplicate-object errors.

**Version your files carefully.** If you rename a migration file, check that no file with the old version number still exists in the same directory. Flyway will reject duplicate versions before running a single line.

### What to Check Before Deploying

- Is your connection pool size at least 2 for services that use Flyway?
- Does each service have its own unique `SPRING_FLYWAY_TABLE` value?
- Do any partial index `WHERE` clauses contain `NOW()`, `CURRENT_TIMESTAMP`, or other non-IMMUTABLE functions?
- Are there any duplicate version numbers in your migration directory?

### Research Topics

- **Flyway concepts**: `baseline`, `validate`, `repair` — understand when each is needed.
- **PostgreSQL function volatility**: IMMUTABLE vs STABLE vs VOLATILE — why it matters for indexes, generated columns, and query planning.
- **HikariCP pool tuning**: `maximumPoolSize`, `minimumIdle`, `connectionTimeout`, `keepaliveTime` — what each one controls and how to size a pool for a small deployment.
