import Link from "next/link";
import { BILL_TITLE, BILL_REQUIREMENTS } from "../lib/bill-model";
import { DraftNotice } from "../components/draft-notice";

export default function HomePage() {
  return <main className="page-shell bill-home">
    <DraftNotice />
    <section className="bill-hero">
      <p className="eyebrow">Public oversight, from proposal to annual review</p>
      <h1>See what surveillance accountability would look like.</h1>
      <p className="lede">Explore how the {BILL_TITLE} would bring technology inventories, community approval, privacy safeguards, and continuing oversight into public view.</p>
      <div className="bill-actions">
        <Link className="primary-link" href="/demo">See how the Act would work →</Link>
        <Link className="secondary-link" href="/explore">Explore documented practices →</Link>
      </div>
      <p className="context-note">The demonstration is fictional. The evidence explorer links real official disclosures. Their records and statistics stay separate.</p>
    </section>
    <section className="section-block" aria-labelledby="journeys-heading">
      <p className="eyebrow">Three ways to follow the accountability process</p>
      <h2 id="journeys-heading">Meet Harborview. Follow the decisions.</h2>
      <div className="bill-grid">
        <Link className="bill-card" href="/demo/proposal"><span className="evidence-badge">Fictional scenario · §101</span><h3>Before a camera program starts</h3><p>Read the impact report, consider residents’ concerns, and follow a simulated council decision.</p><span>Explore a new proposal →</span></Link>
        <Link className="bill-card" href="/demo/lookback"><span className="evidence-badge">Fictional scenario · §103</span><h3>Bring an existing system into view</h3><p>See how the ten-year lookback reviews programs and authorization, with a plan to approve or retire a legacy system.</p><span>Explore the lookback →</span></Link>
        <Link className="bill-card" href="/demo/annual-review"><span className="evidence-badge">Fictional scenario · §§102, 202</span><h3>Check the promises a year later</h3><p>Compare reported use, spending, data sharing, retention, and audit findings with the approved policy.</p><span>Explore an annual review →</span></Link>
      </div>
    </section>
    <section className="section-block" aria-labelledby="framework-heading">
      <div className="section-heading"><h2 id="framework-heading">The proposed accountability framework</h2><Link href="/bill">Read the section-by-section guide →</Link></div>
      <div className="bill-grid">{BILL_REQUIREMENTS.map(item => <article className="bill-card" key={item.id}><span className="eyebrow">{item.section}</span><h3><Link href={`/bill#${item.id}`}>{item.title}</Link></h3><p>{item.text}</p></article>)}</div>
    </section>
    <section className="evidence-callout"><p className="eyebrow">Real-world evidence</p><h2>Start with what agencies actually publish.</h2><p>The first source index covers NYPD surveillance impact-and-use policy links on the official NYC POST Act page. A policy document does not by itself prove a particular installation, legislative approval, or compliance with this proposed federal bill.</p><Link href="/explore">Open the official-source pilot →</Link></section>
  </main>;
}
