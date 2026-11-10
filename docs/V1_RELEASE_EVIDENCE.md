# Smart Cities v1 release evidence

Source implementation is verified locally; live Render acceptance is recorded
separately in the release pull request. This document does not claim independent
human security review, certification, real-world surveillance findings, or
editorial approval of imported source material.

## Implemented release scope

- SC-19: existing schema-driven console plus explicit decision validation and
  server-bound actor roles; missing or malformed decisions cannot approve.
- SC-20: versioned authenticated provider push/pull contracts, scoped private
  evidence persistence, transactional retry/conflict handling, and an admin view.
  Provider statements never authorize publication or prove compliance.
- SC-21: scoped, deduplicated retention observations and disclosure-projected
  policy summaries in record pages/API. Reported fulfillment never proves deletion.
- SC-22: versioned OpenAPI and JSON/NDJSON/CSV exports, including full-page
  traversal and protection against spreadsheet formula injection.
- SC-23: public JSON Feed 1.1 and Atom 1.0, reader subscription guidance, and
  operator-managed notification subscriptions. Email/webhooks require providers.
- SC-24/25: persisted source freshness/health views and public disclosure/citation
  coverage analytics, including uncited record counts.
- SC-26: principal-bound/revocable signed sessions, explicit role decisions,
  bounded login/PDF handling, DNS-pinned source fetch, content-addressed storage
  verification, hardened responses, and patched production dependencies.
- SC-27: keyboard skip navigation, accessible search/page feedback, visible mobile
  navigation, contrast/reduced-motion styles, and a bounded local load probe.
- SC-28/29/30: pinned deployable non-root container, direct migration connection,
  idempotent configuration bootstrap, readiness/API probes, restore rehearsal,
  operator/recovery instructions, and canonical roadmap reconciliation.

## Executed evidence

- Node 24, PostgreSQL 18: full lint, typecheck, unit/integration tests and
  optimized Next.js 16.4.6 build. See PR checks for exact final test totals.
- Production dependency audit: zero reported advisories at verification time.
- Exact production Dockerfile builds without database credentials and runs as
  the non-root `node` user. Runtime migrates and installs configuration before
  binding the production port.
- Chromium desktop/mobile: public overview/search, jurisdiction explorer,
  analytics, record detail/evidence/history, feeds, and protected administration.
  Keyboard skip target, accessibility tree landmarks, mobile overflow/navigation,
  and distinct editor/reviewer/publisher publication were exercised. Editor role
  escalation and reviewer self-approval were denied.
- Local synthetic dataset: 266 records. A 20-request search probe at concurrency
  two completed without failures (observed p50 about 42 ms and p95 about 74 ms).
  These are local fixture timings, not production capacity claims.
- A PostgreSQL dump restored into a separate database retained a valid
  cryptographic audit chain. Production backups still need an operating schedule.
- TLS-fetched official NYPD POST Act catalog: 43 links, 42 distinct policy PDFs.
  Dry-run ingestion validated all 42 with zero failures. This uncovered and fixed
  long-filename ID collisions and repeated-link handling. No PDF bytes were
  archived and no real-source records were published.

## Deployment and operating boundaries

Production starts with configuration and zero published records. Never load the
fictional Harborview dataset into the live registry. The official pilot remains
opt-in and disabled until editorial approval. Source policies do not establish
specific surveillance deployments. Configure durable evidence storage before
fetching PDFs, provider credentials before compliance integration, email relay
before mail delivery, and scheduled workers before claiming freshness guarantees.

The existing Neon project is used through an isolated `render-live` branch;
normal account-plan billing applies. A new Render service needs one available
workspace resource slot. Live deployment requires its exact source commit,
Render deploy status `live`, successful readiness and public API/feed responses,
and runtime error-log inspection. Source checks alone cannot establish that.

Independent human review and certification remain deferred under owner policy.
