export function DraftNotice({ demo = false }: {demo?: boolean}) {
  return <aside className={demo ? "draft-notice draft-notice--demo" : "draft-notice"} aria-label={demo ? "Fictional demonstration" : "Proposed legislation"}>
    <strong>{demo ? "Fictional demonstration of the proposed Act" : "Based on a proposed bill"}</strong>
    <span>{demo ? "Harborview, its records, figures, and decisions are invented. Controls change only this demonstration; they never write to the live registry." : "This site explains a user-provided working draft. It does not establish enactment, government endorsement, or an agency’s legal compliance."}</span>
  </aside>;
}
