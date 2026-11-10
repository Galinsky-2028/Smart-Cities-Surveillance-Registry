import excerpts from "../../content/bill-excerpts.json" with { type: "json" };
import Link from "next/link";
import { BILL_REQUIREMENTS, BILL_TITLE } from "../../lib/bill-model";
import { DraftNotice } from "../../components/draft-notice";

export const metadata = { title: "The proposed Act" };

export default function BillPage() {
  return <main className="page-shell bill-home">
    <DraftNotice />
    <header className="page-heading"><p className="eyebrow">A guide to the uploaded working draft</p><h1>{BILL_TITLE}</h1><p className="lede">The proposal would make surveillance a continuing public accountability process: disclose, deliberate, authorize, report, and review.</p></header>
    <nav className="bill-jump-links" aria-label="Bill sections">{BILL_REQUIREMENTS.map(item => <a href={`#${item.id}`} key={item.id}>{item.section}</a>)}</nav>
    {BILL_REQUIREMENTS.map(item => <section className="bill-section" id={item.id} key={item.id}>
      <p className="eyebrow">{item.section}</p><h2>{item.title}</h2><p>{item.text}</p><p className="context-note">{item.qualifier}</p><details className="evidence-method"><summary>Read the draft wording</summary>{excerpts.quotes[item.id].map(quote => <blockquote key={quote}>{quote}<cite>Uploaded working draft, {item.section}</cite></blockquote>)}</details>
      <Link href={item.id === "lookback" ? "/demo/lookback" : item.id === "reporting" || item.id === "policy" ? "/demo/annual-review" : "/demo/proposal"}>See a fictional example →</Link>
    </section>)}
    <section className="evidence-callout"><h2>Publication is not legislative authorization</h2><p>Our editorial workflow checks what the registry publishes. It cannot substitute for a council resolution, public hearing, court order, or other government authorization described in the bill.</p></section>
    <section className="bill-section"><h2>Draft provenance and limits</h2><p>This guide is based on the uploaded “ALL DOCS - Smart Cities &amp; Surveillance Accountability Act of 2025.docx,” specifically its Bill Text through §204. Section references describe that draft, rather than enacted law.</p><p>The Bill Text ends at §204. Accompanying notes discuss Title III, but do not supply completed legislative text for its enforcement, funding, and effective-date provisions. This platform does not turn those notes into finalized rules or start real compliance clocks.</p><p>Stronger existing state and local protections remain relevant under the draft’s §104(c) and §204(d). A local disclosure such as a NYC POST Act policy is evidence under its own context, not proof of compliance with a proposed federal Act.</p></section>
  </main>;
}
