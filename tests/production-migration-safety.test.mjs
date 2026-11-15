import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("production bootstrap runs migration and config installation against a direct database URL", async () => {
  const docker = await readFile("Dockerfile", "utf8");
  const cmdLine = docker.split("\n").find((line) => line.startsWith("CMD "));
  assert.ok(cmdLine, "Docker CMD is required");
  const cmd = JSON.parse(cmdLine.slice(4));
  assert.equal(cmd[0], "sh");
  assert.equal(cmd[1], "-c");
  assert.match(cmd[2], /DATABASE_URL_UNPOOLED is required/);
  assert.match(cmd[2], /DATABASE_URL="\$DATABASE_URL_UNPOOLED" pnpm db:migrate/);
  assert.match(cmd[2], /DATABASE_URL="\$DATABASE_URL_UNPOOLED" pnpm db:bootstrap-config/);
  // Next.js must replace the shell directly so platform SIGTERM reaches its
  // graceful shutdown handler instead of a package-manager wrapper.
  assert.match(cmd[2], /cd apps\/web && exec node node_modules\/next\/dist\/bin\/next start /);
  assert.doesNotMatch(cmd[2], /exec pnpm/);
});

test("Render deployment injects only secret-configured database URLs", async () => {
  const blueprint = await readFile("render.yaml", "utf8");
  assert.match(blueprint, /- key: DATABASE_URL\n\s+sync: false/);
  assert.match(blueprint, /- key: DATABASE_URL_UNPOOLED\n\s+sync: false/);
  assert.match(blueprint, /healthCheckPath: \/api\/ready/);
});
