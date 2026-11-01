# Search accessibility and performance evidence

SC-27 retains the existing keyboard skip link, visible form focus and reduced
motion styles. Search now has a named landmark and a validation alert associated
with its controls. Structural search validation runs before candidate-resolution
queries. Invalid filters preserve their selected values and expose a correction
link; they do not display a false zero-result count. Infrastructure errors still
propagate rather than being mislabeled as invalid input.

Results include a polite, atomic range summary and a focusable heading. Pagination
links have explicit destination-page names, previous/next relationships, current
page semantics, and an optional result-heading fragment. The fragment is opt-in
so shared pagination consumers do not receive a nonexistent target. Pagination
prefetch is disabled to avoid speculative database-backed page loads. There is no
cross-request result cache, so a visibility or redaction change is not retained by
a newly introduced application cache.

`tests/search-pagination-feedback.test.mjs` exercises multi-value filter retention,
replacement of stale page parameters, optional anchors, invalid target pages, and
first/final/empty/out-of-range summaries. These are behavior tests, not a browser
or assistive-technology audit. Current-head CI must verify TSX types and build.

Calculated sRGB contrast for the existing base palette: muted text #65706a against
white is5.15:1, paper #f4f6f3 is4.74:1, and soft surface #edf1ed is4.51:1;
focus #1b5f43 against white is7.60:1. These calculations cover these exact pairs,
not every composited state or rendered pixel.

Remaining acceptance: run the real rendered UI through keyboard-only navigation,
screen-reader announcements, zoom/mobile and focus-after-pagination checks;
measure representative long-list search latency and browser performance under
load. No live browser, screen-reader, production load or certification result is
claimed by this change. Keep this PR draft until those acceptance checks and
remaining actionable fixes are completed.
