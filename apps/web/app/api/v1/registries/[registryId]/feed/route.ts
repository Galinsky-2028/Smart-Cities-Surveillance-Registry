import { handlePublicFeed } from "../../../../../../lib/public-feed";

export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{registryId: string}> }) {
  return handlePublicFeed(request, (await context.params).registryId);
}
