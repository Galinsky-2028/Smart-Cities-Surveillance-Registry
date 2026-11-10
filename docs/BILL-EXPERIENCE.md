# Bill-led demonstration and real-world evidence

The owner approved this presentation after review of the uploaded working draft
of the Smart Cities and Surveillance Accountability Act of 2025.

## Three distinct public surfaces

- `/` introduces the proposed accountability process and offers a fictional
  demonstration or real-world evidence exploration.
- `/demo`, `/demo/proposal`, `/demo/lookback`, and `/demo/annual-review` use
  invented Harborview scenarios. Dates, figures, artifacts, comments, and
  decisions are fictional. Interactive controls are browser state only: they
  perform no record writes, publication, legal authorization, or deletion.
- `/explore` displays a dated official-source bibliography and the existing
  live registry overview. `/explore/sources/ID` explains the evidence scope of
  each official link. Bibliography entries are not canonical registry records
  and do not appear in record statistics, APIs, exports, or feeds.
- `/bill` maps the presentation to the actual draft provisions and offers exact
  selected wording with section references. The uploaded document's supporting
  commentary and speculative Title III notes are not treated as legislative text.

## Legislative fidelity

The guide identifies the draft as proposed and makes no enactment claim. It
links community approval and impact/use policies to section 101, the inventory
and quarterly-update wording to 101(c), annual reports and five-year public
availability to 102, legacy-system review to 103, safeguards to 104/202, and
judicial/aggregate reporting to 201/203. Platform editorial approval never
substitutes for a governing-body decision or court authorization.

The ten-year window concerns technologies and their history before hypothetical
enactment, not retention of ten years of personal movements or footage. Demo
calculations use a separate 180-day inventory milestone and day-365 approval
milestone. A simulated formal extension respects both 90 additional days and
the 15-calendar-month outer limit. No extension or real enactment is assumed.
Annual reports use 90 calendar days from the selected year-end, not a fixed
three-month approximation. The personal-surveillance-data retention rule and
exceptions remain distinct from keeping public reports accessible for five years.
A policy statement, agency report, or interactive checkbox does not establish
physical deletion or legal compliance.

## Real-source pilot

`apps/web/content/nypd-source-index.json` contains the 42 unique policy PDF links
observed on the official NYPD POST Act catalog, with retrieval time and the
catalog HTML SHA-256. Labels come from published filenames; official titles,
contents, adoption/current validity, particular deployments, authorization,
and actual practices are not asserted. NYC's POST Act is a distinct framework.
Each source entry points to the original PDF and the official catalog.

This is a public source bibliography, not automatic publication of ingested
claims. Canonical records continue through the existing editor/reviewer/publisher
workflow. The production ingestion worker remains disabled pending editorial
approval. No PDF bytes are stored or personal surveillance records collected.
The website distinguishes “Official source located,” “Not yet assessed,” and
“Not found in reviewed sources”; the latter requires a recorded review and is
not used as a blanket absence or noncompliance judgment.

Refresh the source snapshot through a reviewed change, recording the official
catalog response, retrieval timestamp, source hash, and deduplicated allowlisted
links. Do not imply live coverage or a current-status assessment from a snapshot.

## Verification

Unit tests cover calendar validation, leap years, the ten-year lookback window,
180/365-day milestones, both extension bounds, the distinct annual-report/archive
rules, and the official-link provenance/allowlist. Browser checks exercise all
three stories, reset/date/extension/report controls, invalid inputs, source
filter/detail pages, bill excerpts, keyboard/mobile navigation, and the
separation from registry search, feeds, exports, and record counts.

The source uploaded by the owner is identified by filename and extracted-text
SHA-256 in `apps/web/content/bill-excerpts.json`. Only selected Bill Text passages
are reproduced; the full all-documents package and its working notes are not
published.
