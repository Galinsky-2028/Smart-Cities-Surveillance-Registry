import data from "../content/nypd-source-index.json" with { type: "json" };

export interface SourceDocument { id: string; label: string; url: string; filename: string; }
export interface OfficialSourceIndex {
  publisher: string; catalogTitle: string; catalogUrl: string; retrievedAt: string;
  sourceSha256: string; coverage: string; documents: SourceDocument[];
}
export function validateSourceIndex(index: OfficialSourceIndex): OfficialSourceIndex {
  const seen = new Set<string>();
  const urls = new Set<string>();
  if (!Number.isFinite(Date.parse(index.retrievedAt)) || !/^[a-f0-9]{64}$/.test(index.sourceSha256) ||
      index.documents.length < 1 || index.documents.length > 200) throw new Error("Invalid source-index provenance.");
  for (const value of [index.catalogUrl, ...index.documents.map(item => item.url)]) {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname !== "www.nyc.gov" || url.port || url.username || url.password || url.hash || value.trim() !== value) {
      throw new Error("Source-index links must be official, credential-free NYC HTTPS URLs.");
    }
  }
  for (const document of index.documents) {
    if (!/^[a-f0-9]{20}$/.test(document.id) || !document.label || !document.filename ||
        seen.has(document.id) || urls.has(document.url) || !new URL(document.url).pathname.toLowerCase().endsWith(".pdf")) {
      throw new Error("Invalid or duplicate source document.");
    }
    seen.add(document.id);
    urls.add(document.url);
  }
  return index;
}
export const officialSourceIndex = validateSourceIndex(data);
