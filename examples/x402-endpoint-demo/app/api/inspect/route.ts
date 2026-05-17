import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 30;

const RequestSchema = z.object({
  url: z.string().url(),
});

function pick(html: string, re: RegExp): string | null {
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

function extractMeta(html: string) {
  const title =
    pick(html, /<title[^>]*>([^<]+)<\/title>/i) ||
    pick(html, /<meta\s+(?:name|property)=["']og:title["']\s+content=["']([^"']+)["']/i);

  const description =
    pick(html, /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) ||
    pick(html, /<meta\s+(?:name|property)=["']og:description["']\s+content=["']([^"']+)["']/i);

  const ogImage = pick(
    html,
    /<meta\s+(?:name|property)=["']og:image["']\s+content=["']([^"']+)["']/i
  );

  const links = (html.match(/<a\s+[^>]*href=["'][^"']+["']/gi) || []).length;
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = text ? text.split(" ").length : 0;

  return { title, description, ogImage, linkCount: links, wordCount: words };
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Body must be { url: string (valid URL) }" },
      { status: 400 }
    );
  }

  const { url } = parsed.data;
  const res = await fetch(url, {
    redirect: "follow",
    headers: { "user-agent": "x402-endpoint-demo/0.1" },
  });
  if (!res.ok) {
    return Response.json(
      { error: `Upstream returned ${res.status}` },
      { status: 502 }
    );
  }
  const html = await res.text();
  const meta = extractMeta(html.slice(0, 500_000));

  return Response.json({
    url,
    fetchedAt: new Date().toISOString(),
    ...meta,
  });
}
