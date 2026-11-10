# Production deployment — Smart Cities Surveillance Registry

## Status and architecture

The application is a Next.js service backed by PostgreSQL. The repository contains
a Render Blueprint and Dockerfile. These do not themselves deploy an instance.
The expected existing database project is **Smart Cities Surveillance Registry**
in Neon (AWS us-east-2); choose **Ohio** as the Render region to reduce latency.

The production database starts empty. Do **not** load the fictional Harborview
seed into a live public registry. The startup sequence runs schema migrations
and installs only the verified schema configuration on first boot.

## Deploy

1. Create or link a Render web service to this repository's `main` branch.
   `render.yaml` configures an Ohio Docker service and deploys only after
   the main-branch checks pass.
2. Set `DATABASE_URL` to the existing Neon project's **pooled** TLS
   connection string, for normal application requests (use `sslmode=verify-full`). Set
   `DATABASE_URL_UNPOOLED` to the **direct** TLS connection string for
   the **same database and role**. Both values stay solely in Render's secret
   environment configuration. Do not publish, commit, or log them.
   This repository's migration runner obtains a PostgreSQL **session advisory
   lock**; a PgBouncer transaction-pooling connection does not preserve
   backend-session state across its statements. The Docker entrypoint
   deliberately refuses to run without a direct migration connection.
3. Render generates an independent `CIVIC_REGISTRY_ADMIN_SESSION_SECRET` and
   three distinct role credentials: `CIVIC_REGISTRY_EDITOR_TOKEN`,
   `CIVIC_REGISTRY_REVIEWER_TOKEN`, and `CIVIC_REGISTRY_PUBLISHER_TOKEN`.
   Retrieve role credentials privately from Render's Environment page. Startup
   derives server-side principal digests; the sign-in form cannot select roles
   or identity. The reviewer requests approval and a separate publisher approves
   and publishes. Do not share credentials between operators. For a team, replace
   the role accounts with named `CIVIC_REGISTRY_ADMIN_PRINCIPALS` as described in
   the operator guide, and apply organization access controls where required.
4. Start the service. Its Docker startup command uses the direct DB URL for `pnpm db:migrate` followed
   by `pnpm db:bootstrap-config`, then binds Next.js to `0.0.0.0:$PORT`.
5. Confirm `GET /api/health` responds (process liveness), and
   `GET /api/ready` returns HTTP 200 `{"status":"ready"}`. A 503 readiness
   means the database connection or registry configuration has not been
   established; it must not be accepted as a successful deployment.
6. Visit the public homepage and the restricted admin login. Verify the
   registry loads, and that no fictional demonstration records were installed.
7. Configure approved official data sources and reviewers **before** enabling
   production ingestion; imported records remain drafts until independently
   reviewed and published.

## Persistent evidence files

Neon stores registry metadata and audit history, not retrieved PDF bytes.
The document-ingestion component currently supports local content-addressed
storage. Render's free instances have ephemeral filesystems and do not support
persistent disks. Therefore **do not enable PDF retrieval/ingestion on a free
web service**: use an independently persistent file store or a suitable paid
persistent disk before collecting evidence. An ordinary redeploy can otherwise
erase the source bytes while the database retains references.

## Operations / Engine Room

- `/api/ready` is a safe unauthenticated *readiness* indicator, not an
  administrative API. It never emits SQL errors, secret values, record names,
  source endpoints, or private operator data.
- Collect GitHub CI/deploy outcomes and Render instance status in Engine Room.
- Alert on failing readiness, deploy failure, missing published source-refresh
  runs, consecutive ingestion failures, and stale sources.
- The free Render plan suspends after inactivity; use a paid always-on plan
  before claiming continuous availability or timely background refresh.
- Production source refresh should run in a scheduled worker, independent of
  Next.js request traffic, with database leases and explicit source allowlists.

## Recovery and safety

Back up Neon data and retain migration/checkpoint history. Establish an
operational restore test before public launch. Source refresh must preserve
canonical evidence and prior versions, and must never auto-publish imported
records. Configuration changes after initial installation require explicit
review; bootstrapping intentionally refuses to silently overwrite an
installed registry configuration with a different schema version.

## Resource capacity

A separate web service requires one available Render resource slot. Do not
replace another application's service or delete its database to bypass a
workspace limit. The existing Smart Cities Neon project is reused, with an
isolated `render-live` branch capped at 0.25 CU and five-minute idle suspension.
Neon's existing account plan and normal usage billing apply. A free Render web
service does not provide persistent evidence-file storage or always-on workers.

The production `SMART_CITIES_PUBLIC_ORIGIN` must match the actual Render URL;
update it if Render assigns a different hostname. Public feeds are available at
`/api/v1/registries/smart-cities-surveillance-registry/feed` (JSON Feed 1.1), or
append `?format=atom` for Atom 1.0. `/follow` explains subscription and withdrawal
limitations. Feeds expose only the latest 50 currently public records.
