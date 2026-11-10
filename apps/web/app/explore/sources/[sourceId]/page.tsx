import Link from "next/link";
import { notFound } from "next/navigation";
import { officialSourceIndex as index } from "../../../../lib/official-source-index";

export default async function OfficialSourcePage({ params }: {params: Promise<{sourceId: string}>}) {
  const { sourceId } = await params;
  const source = index.documents.find(item => item.id === sourceId);
  if (!source) notFound();
  return <main className="page-shell bill-home">
    <Link href="/explore">← Back to the evidence explorer</Link>
    <header className="page-heading"><p className="eyebrow">Official source located · NYPD policy-link metadata</p><h1>{source.label}</h1><p className="lede">This label is derived from the source filename. It has not been verified as the document’s official title.</p></header>
    <div className="bill-actions"><a className="primary-link" href={source.url} rel="noopener noreferrer">Open the official PDF ↗</a><a className="secondary-link" href={index.catalogUrl} rel="noopener noreferrer">View the NYPD source catalog ↗</a></div>
    <section className="bill-section"><h2>What we can establish</h2><dl className="evidence-facts"><dt>Publisher of the catalog</dt><dd>{index.publisher}</dd><dt>Source filename</dt><dd className="source-filename">{source.filename}</dd><dt>Catalog observed</dt><dd><time dateTime={index.retrievedAt}>{index.retrievedAt}</time></dd><dt>Evidence scope</dt><dd>{index.coverage}</dd></dl></section>
    <section className="bill-section"><h2>What still needs investigation</h2><dl className="evidence-facts">{["Document contents and current validity", "A particular deployment or installation", "Impact report and hearing evidence", "Governing-body authorization", "Annual reporting and audit findings", "Actual retention or deletion practices"].map(label => <div key={label}><dt>{label}</dt><dd>Not yet assessed</dd></div>)}</dl><p>These labels do not mean the evidence is absent. No finding is made that NYPD has violated this proposed bill or existing law.</p></section>
    <aside className="evidence-callout"><h2>How this relates to the proposed Act</h2><p>Policies are one part of the accountability framework in <Link href="/bill#approval">§101</Link> and <Link href="/bill#policy">§104</Link>. The draft would also require approval records, continuing reports, and safeguards. An official policy link alone does not establish those other elements.</p><p>This source entry is not a reviewed registry finding and does not appear in registry feeds, exports, or statistics. No raw surveillance data or personal identifiers are collected here.</p></aside>
  </main>;
}
