"use client";

import Link from "next/link";
import { useState } from "react";
import { addDays, annualTimeline, lookbackTimeline, type DemoScenario } from "../lib/bill-model";
import { DraftNotice } from "./draft-notice";

const scenarios = [
  { id: "proposal", title: "A new camera proposal", section: "§101" },
  { id: "lookback", title: "An existing plate-reader program", section: "§103" },
  { id: "annual-review", title: "The annual accountability review", section: "§§102, 202" },
] as const;
const steps = ["Publish the proposal", "Hear from the community", "Record the council decision", "Publish the adopted policy"];

function FictionalArtifact({ title, children }: {title: string; children: React.ReactNode}) {
  return <details className="demo-artifact"><summary>{title} <span>Fictional evidence</span></summary><div>{children}</div></details>;
}

export function BillDemo({ initialScenario = "proposal" }: {initialScenario?: DemoScenario}) {
  const [scenario, setScenario] = useState<DemoScenario>(initialScenario);
  const [date, setDate] = useState("2030-01-15");
  const [year, setYear] = useState(2030);
  const [step, setStep] = useState(0);
  const [extension, setExtension] = useState(false);
  const [retire, setRetire] = useState(false);
  const [deletionReport, setDeletionReport] = useState(false);
  let lookback: ReturnType<typeof lookbackTimeline> | undefined;
  let annual: ReturnType<typeof annualTimeline> | undefined;
  let error = "";
  try { if (scenario === "annual-review") annual = annualTimeline(year); else lookback = lookbackTimeline(date); }
  catch { error = "Choose a valid hypothetical date and a reporting year from 2000 to 2090."; }

  function reset() {
    setDate("2030-01-15"); setYear(2030); setStep(0); setExtension(false); setRetire(false); setDeletionReport(false);
  }

  return <main className="page-shell bill-home">
    <DraftNotice demo />
    <header className="page-heading"><p className="eyebrow">Meet Harborview · A fictional city</p><h1>Follow the public accountability process.</h1><p className="lede">Explore three stories showing what the proposed Act would make visible. Change a scenario without changing a single real-world record.</p></header>
    <div className="demo-choices" role="group" aria-label="Choose a fictional scenario">{scenarios.map(item => <button type="button" aria-pressed={scenario === item.id} onClick={() => { setScenario(item.id); setStep(0); }} key={item.id}><span>{item.section}</span>{item.title}</button>)}</div>
    <p role="status" className="context-note">Fictional scenario selected: {scenarios.find(item => item.id === scenario)?.title}. No changes are saved to the live registry.</p>
    <section className="demo-controls" aria-label="Simulation controls">
      {scenario === "annual-review" ? <label htmlFor="report-year">Hypothetical calendar reporting year<input id="report-year" type="number" min="2000" max="2090" value={Number.isFinite(year) ? year : ""} onChange={event => setYear(Number(event.target.value))} /></label> : <label htmlFor="simulation-date">{scenario === "lookback" ? "Hypothetical enactment date" : "Hypothetical document publication date"}<input id="simulation-date" type="date" value={date} onChange={event => setDate(event.target.value)} /></label>}
      <button type="button" className="secondary-link" onClick={reset}>Reset demonstration</button>
      <p>Dates are simulated. No enactment date is asserted, and no real agency deadline starts here.</p>
    </section>
    {error ? <p role="alert" className="context-note">{error}</p> : null}

    {scenario === "proposal" && lookback ? <section className="bill-section" aria-labelledby="proposal-heading">
      <p className="eyebrow">New proposal · Fictional Harborview Parks Department</p><h2 id="proposal-heading">Two park cameras. A public decision before operation.</h2>
      <div className="demo-status"><strong>{step < 2 ? "Fictional authorization: not yet obtained" : "Fictional council authorization: recorded"}</strong><span>{step === 3 ? "Adopted policy and public inventory entry available" : "The demonstration is still moving through the proposal process"}</span></div>
      <ol className="demo-timeline">{steps.map((label, index) => <li className={index === step ? "is-current" : ""} aria-current={index === step ? "step" : undefined} key={label}><span className="eyebrow">{index < step ? "Completed in simulation" : index === step ? "Current simulated step" : "Next simulated step"}</span><h3>{label}</h3><p>{[
        `Impact report and proposed policy published ${date}. The earliest decision in this 30-day example is ${addDays(date, 30)}.`,
        "Residents can read the proposal, attend a hearing, and see how concerns changed the proposed safeguards. Hearing notice generally allows at least 10 business days under the draft.",
        "The fictional council approves only two fixed cameras for specified park-safety purposes, with audio and facial recognition disabled. The decision and conditions are recorded.",
        "The adopted policy, authorizing decision, general area of use, responsible oversight office, and quarterly inventory review are made visible to the public.",
      ][index]}</p></li>)}</ol>
      <div className="bill-actions"><button type="button" className="primary-link" disabled={step === 3} onClick={() => setStep(value => Math.min(value + 1, 3))}>{step === 1 ? "Simulate the council decision" : step === 3 ? "Demonstration complete" : "Next simulated step"}</button><Link href="/bill#approval">Read the §101 explanation →</Link></div>
      <div className="demo-artifacts">
        <FictionalArtifact title="Surveillance impact report"><p><strong>Purpose:</strong> investigate reported violent incidents in two public parks. <strong>Alternatives considered:</strong> improved lighting and staffed patrols. <strong>Collection:</strong> fixed video only; no audio or biometric identification.</p><p><strong>Privacy mitigation:</strong> mask private windows; prohibit monitoring lawful protest. <strong>Fictional budget:</strong> $48,000 acquisition and $12,000 annual operation, from the city budget.</p></FictionalArtifact>
        <FictionalArtifact title="Community hearing and response"><p><strong>Fictional resident concern:</strong> could footage be used to identify peaceful demonstrators?</p><p><strong>Recorded response:</strong> the policy expressly prohibits that purpose and requires an annual civil-liberties review. The council retains authority to suspend use.</p><p>A real hearing record would include official notice, the meeting date, submitted comments, responses, and the governing body’s decision.</p></FictionalArtifact>
        <FictionalArtifact title="Proposed use policy and approval conditions"><p>Routine personal footage: delete within 30 days, with specific investigative or legal exceptions documented. No sale of data. Outside sharing requires policy authorization or applicable legal process. Access is role-bound and logged.</p><p><strong>Judicial oversight:</strong> targeted personal-data searches would require the draft’s warrant process or a valid exception. Court authorizations and legislative program approval serve different purposes.</p></FictionalArtifact>
      </div>
      <aside className="context-note"><strong>Editorial approval is not council approval.</strong> Publishing a registry entry does not authorize government surveillance. A real authorization would need a sourced resolution, ordinance, or other applicable government decision.</aside>
    </section> : null}

    {scenario === "lookback" && lookback ? <section className="bill-section" aria-labelledby="lookback-heading">
      <p className="eyebrow">Legacy program · Fictional Harborview Transportation Department</p><h2 id="lookback-heading">Review the program’s history. Decide whether it continues.</h2>
      <p>A fictional plate-reader program was acquired three years before the hypothetical enactment date. It is still operating, so its history and authority would enter the draft’s review process.</p>
      <p className="lookback-window"><strong>Ten-year review window:</strong> <time>{lookback.start}</time> through <time>{lookback.end}</time>.</p>
      <p>This window concerns surveillance technologies, acquisition, use, authorization, and relevant retained-data practices. It is not ten years of people’s movements or an instruction to keep footage for ten years.</p>
      <label className="demo-check"><input type="checkbox" checked={retire} onChange={event => setRetire(event.target.checked)} />Simulate choosing to discontinue the program</label>
      <ol className="demo-timeline">
        <li><h3>Inventory and compliance plan</h3><p>Due by <time>{lookback.inventory}</time> in this simulation: 180 days after hypothetical enactment. Record acquisition, prior use and authority, interim safeguards, intended disposition, and responsible officials.</p></li>
        <li><h3>{retire ? "Plan decommissioning and remaining-data handling" : "Seek approval for continued use"}</h3><p>{retire ? "The fictional plan stops collection, identifies hardware to deactivate, and accounts for remaining data and lawful evidence holds. Retirement does not create a right to keep personal data indefinitely." : `For continued use, the draft requires approval by ${lookback.approval} (day 365). The impact report, hearing, use policy, and governing-body decision still matter.`}</p></li>
        <li><h3>{retire ? "Keep the public history" : "Stop unapproved use at the applicable deadline"}</h3><p>{retire ? "A public record can explain the program’s past use, why it ended, and how decommissioning was reported. It need not contain raw surveillance data." : "In this fictional scenario no approval evidence has been supplied. Under the draft, continued unapproved operation would have to cease at the applicable deadline."}</p></li>
      </ol>
      {!retire ? <><label className="demo-check"><input type="checkbox" checked={extension} onChange={event => setExtension(event.target.checked)} />Simulate a single formally granted extension</label><p role="status">{extension ? `Simulated outer deadline: ${lookback.extension}. This respects both the 90-day extension limit and the 15-month cap; a real extension would require a documented finding and formal action.` : `No extension is assumed. Simulated approval deadline: ${lookback.approval}.`}</p></> : null}
      <FictionalArtifact title="Legacy inventory and compliance plan"><p><strong>Acquisition history:</strong> a fictional city-funded program introduced three years before enactment. <strong>Authorization evidence:</strong> not supplied in this scenario. <strong>Interim measures:</strong> limit access and suspend outside sharing while oversight proceeds.</p><p><strong>Responsible offices:</strong> the fictional transportation director and privacy officer. The public plan must identify the path to approval or retirement; the registry cannot supply a missing legislative decision.</p></FictionalArtifact>
      <Link href="/bill#lookback">Read the §103 explanation →</Link>
    </section> : null}

    {scenario === "annual-review" && annual ? <section className="bill-section" aria-labelledby="annual-heading">
      <p className="eyebrow">Annual review · Fictional Harborview camera program</p><h2 id="annual-heading">Compare reported practice with the public promises.</h2>
      <p>Calendar reporting period ends <time>{annual.end}</time>. This simulated report is due <time>{annual.due}</time>, 90 days later. The draft also permits a specified fiscal reporting year.</p>
      <div className="bill-grid demo-metrics"><article className="bill-card"><span className="eyebrow">Fictional agency report</span><strong>120</strong><p>Investigations reported as assisted; this figure is not an independent effectiveness finding.</p></article><article className="bill-card"><span className="eyebrow">Fictional annual cost</span><strong>$12,000</strong><p>Agency-reported operation and maintenance.</p></article><article className="bill-card"><span className="eyebrow">Fictional audit summary</span><strong>2</strong><p>Accesses flagged for investigation; findings pending.</p></article></div>
      <FictionalArtifact title="Sharing and judicial-authorization summary"><p>The fictional report lists one approved regional task-force agreement, four court-authorized targeted searches, and one emergency use followed by judicial review. These are invented aggregate statistics, not case records.</p><p>A real report would identify recipients, scope, legal basis, request outcomes, warrant statistics, and relevant oversight findings, with privacy protections.</p></FictionalArtifact>
      <section className="evidence-callout"><h3>Retention policy, reported fulfillment, and verification</h3><p><strong>Fictional stated policy:</strong> routine personal data is deleted within 30 days; identified evidence holds are documented and reviewed.</p><label className="demo-check"><input type="checkbox" checked={deletionReport} onChange={event => setDeletionReport(event.target.checked)} />Show a fictional agency deletion report</label><p role="status">{deletionReport ? "Agency reports 10,000 records collected, 9,500 purged, and 500 retained for identified cases. Independent deletion verification: not supplied." : "Actual deletion statistics: not supplied in this fictional scenario. A 30-day written policy alone does not establish whether deletion occurred."}</p><p><strong>Physical deletion verified:</strong> no conclusion. Neither a checkbox nor an agency’s statement can establish what happened to source data, copies, and backups.</p></section>
      <ol className="demo-timeline"><li><h3>Publish and review the annual report</h3><p>Present the report at an open meeting with public questions. Consider changing safeguards, requiring follow-up audits, or discontinuing use.</p></li><li><h3>Keep the public accountability record</h3><p>If published on the simulated due date, keep the report publicly accessible until at least <time>{annual.publicUntil}</time>, five years later. Older reports should remain available on request under the draft.</p></li></ol>
      <p className="context-note">The 30-day personal-surveillance-data rule is separate from the minimum five-year public-report requirement. The registry does not erase policy or oversight history after 30 days.</p>
      <Link href="/bill#reporting">Read §§102 and 202 →</Link>
    </section> : null}
    <section className="bill-section"><h2>Ready to look at real evidence?</h2><p>Leave Harborview to explore official disclosures. Demo figures and simulated decisions never become real-world records or compliance findings.</p><Link href="/explore">Explore documented practices →</Link></section>
  </main>;
}
