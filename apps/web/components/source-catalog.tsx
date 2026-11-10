"use client";

import Link from "next/link";
import { useState } from "react";
import type { SourceDocument } from "../lib/official-source-index";

export function SourceCatalog({ documents }: {documents: SourceDocument[]}) {
  const [query, setQuery] = useState("");
  const matches = documents.filter(item => `${item.label} ${item.filename}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <div>
    <label className="source-filter" htmlFor="source-query">Filter official policy links
      <input id="source-query" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try license plate, drone, or facial recognition" aria-describedby="source-results-count" />
    </label>
    <p id="source-results-count" role="status">{matches.length} of {documents.length} official-source links</p>
    <div className="source-grid">{matches.map(document => <article className="source-card" key={document.id}>
      <span className="evidence-badge">Official source located · Link metadata</span>
      <h3><Link href={`/explore/sources/${document.id}`}>{document.label}</Link></h3>
      <p>Label derived from the published filename. Contents and current policy status have not been assessed.</p>
      <a href={document.url} rel="noopener noreferrer">Open official PDF ↗</a>
    </article>)}</div>
    {!matches.length ? <p className="context-note">No source links match this filter. This does not establish that the agency has no policy or technology of that kind.</p> : null}
  </div>;
}
