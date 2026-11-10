import assert from "node:assert/strict";
import test from "node:test";
import { createHtmlDocumentCatalogAdapter } from "../packages/smart-cities-source-adapters/src/html-catalog.ts";

test("long official document names have distinct stable IDs and repeated links are deduplicated", async () => {
  const root = "https://city.example.gov/";
  const prefix = "surveillance-policy-".repeat(10);
  const links = [root + prefix + "covert.pdf", root + prefix + "overt.pdf"];
  const adapter = createHtmlDocumentCatalogAdapter({ id: "city-policies", label: "Policy catalog",
    allowedHosts: ["city.example.gov"], startUrls: [root] });
  const collect = urls => adapter.collect({ fetchText: async () => ({ finalUrl: root,
    body: urls.map(url => `<a href="${url}">PDF</a>`).join("") }) });
  const result = await collect([...links, links[0] + "#page=2", links[0], "http://city.example.gov/unsafe.pdf"]);
  assert.equal(result.rows.length, 2);
  assert.notEqual(result.rows[0].id, result.rows[1].id);
  assert.ok(result.rows.every(row => row.id.length <= 120));
  const reordered = await collect([...links].reverse());
  assert.equal(result.rows[0].id, reordered.rows[1].id);
  assert.equal(result.rows[0].external_id, links[0]);
});
