import Link from "next/link";
import { officialSourceIndex as index } from "../lib/official-source-index";
import { SourceCatalog } from "./source-catalog";

export function EvidencePilot() {
  return <section className="section-block" aria-labelledby="real-evidence-heading">
    <header className="page-heading"><p className="eyebrow">Real-world evidence explorer</p><h1 id="real-evidence-heading">What is publicly documented?</h1><p className="lede">Start with official disclosures. Follow each source, see what was checked, and keep unanswered questions visible.</p></header>
    <aside className="draft-notice" aria-label="Evidence scope"><strong>Sources, not compliance verdicts</strong><span>These are real links from an official NYC catalog. They are not proof of a particular installation, council approval, current policy validity, or compliance with the proposed federal Act. Fictional Harborview records are never included here.</span></aside>
    <div className="source-summary"><div><span className="eyebrow">Initial source pilot</span><h2>NYPD POST Act policy disclosures</h2><p>{index.documents.length} distinct policy-document links observed on the <a href={index.catalogUrl} rel="noopener noreferrer">official NYPD catalog</a>. The catalog is published in the context of NYC’s POST Act, a separate framework from the proposed federal bill.</p><p>Observed: <time dateTime={index.retrievedAt}>{new Date(index.retrievedAt).toLocaleDateString("en-US", { timeZone: "UTC", year: "numeric", month: "long", day: "numeric" })} (UTC)</time>. This is a dated source snapshot, not a live completeness guarantee.</p></div><Link href="/bill">Compare with the proposed framework →</Link></div>
    <details className="evidence-method"><summary>What the evidence labels mean</summary><dl>
      <dt>Official source located</dt><dd>The official catalog links the document. This does not verify every assertion inside it.</dd>
      <dt>Not yet assessed</dt><dd>That question has not been investigated. It is not an absence or noncompliance finding.</dd>
      <dt>Not found in reviewed sources</dt><dd>Use only when a reviewer records which sources were searched and when. It is not a claim that the information does not exist.</dd>
      <dt>Fictional demonstration</dt><dd>Invented examples appear only in <Link href="/demo">Harborview’s demonstration</Link>, outside the source index and live registry.</dd>
    </dl><p>This source index contains official link metadata, not reviewed registry findings. Registry publication and statistics are separate. Document contents, adoption, current validity, and installations remain unassessed.</p></details>
    <SourceCatalog documents={index.documents} />
  </section>;
}
