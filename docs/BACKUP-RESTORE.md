# Backup schedule and restore runbook

This runbook covers the production PostgreSQL database behind the Render
service `smart-cities-surveillance-registry`. Neon holds registry metadata,
revision history and the audit chain. It does not hold retrieved PDF bytes; see
[Production deployment](PRODUCTION-DEPLOYMENT.md#persistent-evidence-files).

Nothing in this document runs automatically. Every step is an operator action
performed with credentials kept outside Git, browsers and logs.

## Recovery objectives

| Objective | Target | How it is met |
| --- | --- | --- |
| Recovery point (normal operation) | Within the Neon plan's point-in-time restore window | Neon history retention on the production branch. |
| Recovery point (beyond that window) | At most 7 days | Weekly logical dump below. |
| Recovery time | Same business day | Restore into a new branch or database, verify, then repoint Render. |

Check the restore window that the database's Neon plan actually provides
before relying on it. A free or reduced plan may retain only a short history,
so the weekly logical dump is the guaranteed baseline.

## Schedule

| When | Action | Owner |
| --- | --- | --- |
| Before every migration-bearing release | Logical dump (step A) and integrity verification (step B) | Release operator |
| Weekly | Logical dump (step A), integrity verification (step B), retain off-platform | Operator |
| Weekly, after any editorial publication | Signed integrity checkpoint (step C) if signing keys are configured | Publisher |
| Quarterly and after any restore | Restore rehearsal into an isolated database (step D) | Operator |

Retain at least the four most recent weekly dumps and every pre-release dump
for 90 days. Store them encrypted in a location with access limited to
operators. Never commit a dump, attach it to a GitHub issue or pull request,
or upload it as a CI artifact: the repository is public and dumps contain
unpublished drafts and operator records.

## Step A: logical dump

Use the **direct** (unpooled) connection string from Render's Environment page
(`DATABASE_URL_UNPOOLED`) with a PostgreSQL client whose major version is at
least the server's.

```bash
export PGURL='<direct connection string; do not paste into shell history>'
pg_dump --format=custom --no-owner --no-privileges \
  --file "smart-cities-$(date -u +%Y%m%dT%H%M%SZ).dump" "$PGURL"
sha256sum smart-cities-*.dump > SHA256SUMS
```

Record the dump's SHA-256, the deployed Git commit (Render deploy page) and the
latest applied migration:

```sql
SELECT id FROM civic_registry_schema_migrations ORDER BY id DESC LIMIT 1;
```

## Step B: integrity verification

Verify the audit chain on the source database (read-only):

```bash
DATABASE_URL="$PGURL" pnpm db:integrity-verify
```

A non-zero exit status means the chain is not verified. Keep the dump, stop
editorial publication and investigate before deleting any older backup.

## Step C: signed checkpoint (optional)

When Ed25519 integrity keys are configured outside the database, create a
checkpoint as described in [Audit integrity](AUDIT-INTEGRITY.md) and store the
signed manifest with the dump. Checkpoints let a restored copy be checked
against evidence that a database administrator could not rewrite.

## Step D: restore and rehearsal

Never restore over the production database in place.

1. Create an isolated target: a new Neon branch from a point in time (for
   recovery inside the history window) or an empty database (for a logical
   dump). Use a direct connection string for it.
2. For a logical dump, verify the checksum and restore:

   ```bash
   sha256sum -c SHA256SUMS
   pg_restore --no-owner --no-privileges --exit-on-error \
     --dbname "$RESTORE_URL" smart-cities-<timestamp>.dump
   ```

3. Bring the restored schema forward without editing applied migrations:

   ```bash
   DATABASE_URL="$RESTORE_URL" pnpm db:migrate
   DATABASE_URL="$RESTORE_URL" pnpm db:integrity-verify
   ```

   With signing keys, also verify the restored chain against the retained
   checkpoint manifest.
4. Compare record and published-record counts with the values recorded at dump
   time. Investigate any difference before continuing.
5. **Rehearsal:** stop here, record the elapsed time and result, and delete the
   isolated target.
6. **Real recovery:** in Render, set `DATABASE_URL` (pooled) and
   `DATABASE_URL_UNPOOLED` (direct) to the restored database and redeploy.
   Startup re-runs advisory-locked migrations and configuration bootstrap.
   Confirm the deploy is `live`, `/api/ready` returns HTTP 200 and the public
   registry and admin sign-in load. Keep the old database untouched until the
   recovered service has been accepted.

## Rollback of an application release

An application rollback does not undo database migrations. Roll back code by
redeploying a previous commit only when its schema expectations are satisfied
by the current database; otherwise fix forward with a new migration. Take a
step A dump before every migration-bearing release so a schema problem can be
recovered by step D.

## Evidence

Record each backup, verification and rehearsal (date, operator, deployed
commit, latest migration, dump checksum, verification result, elapsed restore
time) in the operator log. Do not record connection strings or credentials.
