import { getPublicRegistry, searchPublicRecords } from "./public-registry.ts";
import { publicApiError } from "./public-api.ts";

const escapeXml = (value: string) => value
  .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "")
  .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;").replaceAll("'", "&apos;");

/** Feeds read the same disclosure-projected search surface as the public UI. */
export async function handlePublicFeed(request: Request, registryId: string): Promise<Response> {
  const url = new URL(request.url);
  const format = url.searchParams.get("format") ?? "json";
  if (format !== "json" && format !== "atom") {
    return publicApiError(400, "invalid_format", "Choose json or atom.");
  }
  const registry = await getPublicRegistry(registryId);
  if (!registry) return publicApiError(404, "registry_not_found", "The requested registry does not exist.");
  const origin = new URL(process.env.SMART_CITIES_PUBLIC_ORIGIN || url.origin).origin;
  const home = `${origin}/registries/${encodeURIComponent(registryId)}`;
  const feedUrl = `${origin}/api/v1/registries/${encodeURIComponent(registryId)}/feed`;
  const result = await searchPublicRecords(registry.config, {
    page: 1, pageSize: 50, sort: { by: "updated", direction: "desc" },
  });
  const items = result.hits.map(({ record }) => {
    const definition = registry.config.recordTypesById.get(record.recordTypeId)?.definition;
    const title = definition && record.fields[definition.titleFieldId];
    const summary = definition?.summaryFieldId && record.fields[definition.summaryFieldId];
    const recordUrl = `${home}/records/${encodeURIComponent(record.id)}`;
    return {
      id: recordUrl, url: recordUrl,
      title: typeof title === "string" ? title : "Public record",
      content_text: typeof summary === "string" ? summary : "View the published record and its evidence.",
      date_modified: record.updatedAt,
      ...(record.publishedAt ? { date_published: record.publishedAt } : {}),
    };
  });
  const title = registry.config.definition.name;
  const headers = {
    "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer", "Access-Control-Allow-Origin": "*",
  };
  if (format === "json") {
    return Response.json({
      version: "https://jsonfeed.org/version/1.1", title,
      home_page_url: home, feed_url: feedUrl,
      description: "The latest 50 publicly visible records. Private and unpublished records are excluded.",
      items,
    }, { headers: { ...headers, "Content-Type": "application/feed+json; charset=utf-8" } });
  }
  const updated = items[0]?.date_modified ?? new Date().toISOString();
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom"><id>${escapeXml(feedUrl)}</id>
<title>${escapeXml(title)}</title><updated>${escapeXml(updated)}</updated>
<link href="${escapeXml(feedUrl + "?format=atom")}" rel="self"/>
<link href="${escapeXml(home)}"/>
${items.map(item => `<entry><id>${escapeXml(item.id)}</id><title>${escapeXml(item.title)}</title>
<link href="${escapeXml(item.url)}"/><updated>${escapeXml(item.date_modified)}</updated>
<summary>${escapeXml(item.content_text)}</summary><author><name>${escapeXml(title)}</name></author></entry>`).join("\n")}
</feed>`;
  return new Response(xml, { headers: { ...headers, "Content-Type": "application/atom+xml; charset=utf-8" } });
}
