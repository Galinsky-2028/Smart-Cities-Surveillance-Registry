# Smart Cities Surveillance Registry

**Complete development and handoff plan:** [docs/DEVELOPMENT_PLAN.md](docs/DEVELOPMENT_PLAN.md).

A public transparency and accountability application for documenting smart-city surveillance deployments, technologies, agencies, vendors, governing policies, authorizations, procurements, audits, incidents, data-sharing arrangements, and related public records.

This repository is a **downstream application** of the [Civic Registry & Transparency Engine](https://github.com/neophilism/Civic-Registry-Transparency-Engine). The reusable engine remains domain-neutral in its own repository; Smart-Cities-specific schemas, adapters, presentation, and integrations live here.

## Release candidate

The downstream application now includes the source and publication console,
scoped external accountability imports, retention-policy projections, public
JSON/Atom feeds, source freshness monitoring, transparency analytics, and
server-bound editor/reviewer/publisher roles. The generic engine remains a
separate upstream project.

Run `pnpm run ci` for the complete quality gate. See
[release evidence](docs/V1_RELEASE_EVIDENCE.md), the
[deployment guide](docs/PRODUCTION-DEPLOYMENT.md), and the
[operator guide](docs/ADMIN-CONSOLE.md).

Production installation creates the registry configuration only. Fictional
Harborview records are for isolated development, and the verified official-source
pilot remains disabled until editorial review. Empty public results accurately
represent a registry awaiting reviewed publications.

## Upstream provenance

The initial engine snapshot is pinned to:

```text
Civic Registry & Transparency Engine
commit 49bd3248dc976c6a56fbd2db949ad579579787dd
```

See [Upstream Engine](docs/UPSTREAM-ENGINE.md).

## Local development

```bash
cp .env.example .env
pnpm install
docker compose up -d db
pnpm db:migrate
pnpm dev
```

Then visit `http://localhost:3000`.

Run all quality gates with:

```bash
pnpm run ci
```

## Architecture rule

Generic capabilities should remain reusable and, when broadly useful, be generalized upstream in the Civic Registry & Transparency Engine.

Smart-Cities-specific concepts belong here:

- surveillance deployment and technology schemas;
- agency/vendor/procurement terminology;
- official-source adapters;
- public-safety/disclosure policy;
- Smart Cities presentation;
- mapping/jurisdiction behavior; and
- application-specific Compliance Engine projections.

## End-to-End Everywhere progress

The canonical [security/e2eesa-status.json](security/e2eesa-status.json) records standard implementation, complete testing and independent expert review separately. Engine Room reads it automatically from GitHub. All initial stages are pending; existing profile locks and approved decisions remain authoritative. Read [adoption and independent-account instructions](docs/E2EESA_ADOPTION.md), and run `python3 scripts/validate_e2eesa_status.py`. Record validation does not establish product security or certification.
