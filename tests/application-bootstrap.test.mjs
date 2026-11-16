import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const upstreamCommit =
  "c4104fa927374a0e09cbba310e0d95ed83aefedf";

test("Smart Cities application identity is established", () => {
  const root = JSON.parse(
    fs.readFileSync("package.json", "utf8"),
  );
  const web = JSON.parse(
    fs.readFileSync("apps/web/package.json", "utf8"),
  );
  const layout = fs.readFileSync(
    "apps/web/app/layout.tsx",
    "utf8",
  );

  assert.equal(
    root.name,
    "smart-cities-surveillance-registry",
  );
  assert.equal(
    web.name,
    "@smart-cities-surveillance-registry/web",
  );
  assert.match(
    layout,
    /Smart Cities Surveillance Registry/,
  );
});

test("upstream engine provenance is pinned", () => {
  assert.equal(
    fs.readFileSync(
      "UPSTREAM_ENGINE_COMMIT",
      "utf8",
    ).trim(),
    upstreamCommit,
  );
  assert.match(
    fs.readFileSync(
      "docs/UPSTREAM-ENGINE.md",
      "utf8",
    ),
    new RegExp(upstreamCommit),
  );
});

test("core-only purity regression is not copied downstream", () => {
  assert.equal(
    fs.existsSync(
      "tests/core-purity.test.mjs",
    ),
    false,
  );
});
