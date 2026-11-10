import assert from "node:assert/strict";
import test from "node:test";
import { annualTimeline, lookbackTimeline, addDays, addMonths } from "../apps/web/lib/bill-model.ts";
import { officialSourceIndex, validateSourceIndex } from "../apps/web/lib/official-source-index.ts";

test("lookback reviews the ten years before a hypothetical enactment and calculates distinct approval milestones", () => {
  assert.deepEqual(lookbackTimeline("2030-01-15"), {
    start: "2020-01-15", end: "2030-01-14", inventory: "2030-07-14",
    approval: "2031-01-15", extension: "2031-04-15",
  });
});
test("a legacy extension respects both the 90-day allowance and the 15-calendar-month outer cap", () => {
  assert.equal(lookbackTimeline("2030-01-31").extension, "2031-04-30");
  const leap = lookbackTimeline("2023-11-30");
  assert.equal(leap.approval, "2024-11-29");
  assert.equal(leap.extension, "2025-02-27");
});
test("annual reporting uses 90 days rather than three months and separately retains public reports for five years", () => {
  assert.deepEqual(annualTimeline(2031), { end: "2031-12-31", due: "2032-03-30", publicUntil: "2037-03-30" });
  assert.equal(annualTimeline(2030).due, "2031-03-31");
  assert.equal(addDays("2030-01-15", 30), "2030-02-14");
  assert.equal(addMonths("2032-02-29", -120), "2022-02-28");
});
test("invalid dates, impossible calendar dates and unsupported reporting years fail explicitly", () => {
  for (const date of ["", "2030-02-30", "2030-13-01", "2030-1-1", "not-a-date", "0001-01-01"]) {
    assert.throws(() => lookbackTimeline(date));
  }
  for (const year of [0, 2030.5, 2091, NaN]) assert.throws(() => annualTimeline(year));
});
test("real-source bibliography has unique official PDF links and observation provenance", () => {
  assert.ok(officialSourceIndex.documents.length > 0);
  assert.match(officialSourceIndex.coverage, /not been assessed/);
  assert.equal(validateSourceIndex(structuredClone(officialSourceIndex)).documents.length, officialSourceIndex.documents.length);
  for (const url of ["http://www.nyc.gov/a.pdf", "https://unapproved.example/a.pdf", "https://user:secret@www.nyc.gov/a.pdf", "https://www.nyc.gov:8443/a.pdf", "https://www.nyc.gov/a.pdf#page=1"]) {
    const index = structuredClone(officialSourceIndex); index.documents[0].url = url;
    assert.throws(() => validateSourceIndex(index), /official/);
  }
  const index = structuredClone(officialSourceIndex); index.documents.push(index.documents[0]);
  assert.throws(() => validateSourceIndex(index), /duplicate/);
});
