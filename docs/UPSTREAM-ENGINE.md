# Upstream Engine

This repository was bootstrapped from the clean, domain-neutral
[Civic Registry & Transparency Engine](https://github.com/Galinsky-2028/Civic-Registry-Transparency-Engine).

Current reconciled upstream commit:

```text
c4104fa927374a0e09cbba310e0d95ed83aefedf
```

Initial upstream commit: `49bd3248dc976c6a56fbd2db949ad579579787dd`. That commit includes the core-purity
cleanup which removed named downstream applications from the engine repository.

## Reconciliation to 0ee3f29dffb20c649ea02466a7b0f70ed4024f9f (CRT-23)

The engine changes after the initial snapshot were reviewed file by file. The
runtime behavior they introduce was already present downstream, so no engine
source needed to be copied; only the provenance pin advances.

| Upstream change | Downstream status |
| --- | --- |
| `packages/database/src/pool.ts`: three-second `connectionTimeoutMillis` | Already present in `packages/database/src/pool.ts`. |
| `apps/web/next.config.mjs`: `nosniff`, `DENY` framing, permissions policy headers | Already present; downstream keeps the stricter `Referrer-Policy: no-referrer`. |
| `apps/web/package.json`: Next.js and `eslint-config-next` 16.4.6 | Already present. |
| `apps/web/app/api/ready/route.ts`: bounded database readiness | Intentionally divergent: downstream readiness also requires the installed Smart Cities registry configuration and reports its service identity. |
| `packages/database/src/bootstrap.ts` and `scripts/render-start.sh`: generic example seeding at startup | Not adopted: production must never install example data. Downstream uses `packages/database/src/bootstrap-config.ts` (configuration only) from the Docker command. |
| `apps/web/app/layout.tsx`/`globals.css`: `CIVIC_REGISTRY_DEMO` banner | Not adopted: downstream labels fictional records with its own draft and demonstration notices. |
| Registry and E2EESA validator scripts | Already present in `scripts/`. |

## Sync policy

The Smart Cities application does not depend on the upstream repository at
runtime. It carries the engine packages locally so releases remain
self-contained and reproducible.

Future upstream changes should be reviewed deliberately:

1. identify a generic upstream change worth adopting;
2. port or merge it without overwriting Smart Cities application code;
3. run the complete local CI suite;
4. update `UPSTREAM_ENGINE_COMMIT` when the downstream snapshot is advanced;
5. document any intentionally divergent engine behavior.

Application-specific features should not be pushed upstream unless they are
first generalized into reusable civic infrastructure.

## Reconciliation to c4104fa927374a0e09cbba310e0d95ed83aefedf (CRT-24, CRT-25)

Both engine units generalized code that originated in this repository, so the
downstream already contains the behavior and only the pin advances.

| Upstream change | Downstream status |
| --- | --- |
| CRT-24 server-bound administrator principals, role credentials, sign-in limiter, explicit decisions | Originated here (SC-26); identical modules in `apps/web/lib/admin-*.ts` and `scripts/admin-principals.mjs`. |
| CRT-24 DNS-pinned public source fetch | Originated here; identical `packages/source-adapters/src/{fetch,pinned-fetch}.ts`. |
| CRT-25 PostgreSQL document storage, public archived copies | Originated here (SC-17, PR #49). Upstream numbers the migration `0014_document_content.sql`; downstream keeps `0018_document_content.sql` because 0014-0017 are Smart Cities migrations. Same SQL. |
| CRT-25 `ingest-attachments` CLI command | Not adopted: downstream retrieves documents through the approved-source refresh opt-in instead. |

