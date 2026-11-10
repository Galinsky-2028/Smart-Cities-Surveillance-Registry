FROM node:24.21.0-bookworm-slim
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=10000

RUN --mount=type=secret,id=proxy_ca if [ -f /run/secrets/proxy_ca ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/proxy_ca; fi; npm install --global pnpm@12.7.0
COPY . .
RUN --mount=type=secret,id=proxy_ca if [ -f /run/secrets/proxy_ca ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/proxy_ca; fi; pnpm install --frozen-lockfile
RUN pnpm build
ENV NODE_ENV=production
RUN mkdir -p /app/data/documents && chown -R node:node /app
USER node

EXPOSE 10000
CMD ["sh", "-c", "set -eu; CIVIC_REGISTRY_ADMIN_PRINCIPALS=\"$(node scripts/admin-principals.mjs)\"; export CIVIC_REGISTRY_ADMIN_PRINCIPALS; if [ -z \"${DATABASE_URL_UNPOOLED:-}\" ]; then echo >&2 \"DATABASE_URL_UNPOOLED is required for session-safe migrations\"; exit 1; fi; DATABASE_URL=\"$DATABASE_URL_UNPOOLED\" pnpm db:migrate && DATABASE_URL=\"$DATABASE_URL_UNPOOLED\" pnpm db:bootstrap-config && exec pnpm --filter @smart-cities-surveillance-registry/web exec next start --hostname 0.0.0.0 --port ${PORT:-10000}"]
