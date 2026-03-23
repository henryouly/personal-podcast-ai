import { rssService } from "../../../../services/rss";

export async function GET(
  req: Request,
  { params }: { params: { token: string } }
) {
  try {
    const xml = await rssService.generateFeed(params.token);
    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    console.error("RSS Feed Generation Error:", error);
    return new Response("Unauthorized or Invalid Token", { status: 401 });
  }
}
