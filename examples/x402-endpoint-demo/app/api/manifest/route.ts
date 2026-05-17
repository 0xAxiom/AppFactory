export const runtime = "edge";

export async function GET() {
  return Response.json({
    name: "x402 URL Inspector",
    description:
      "Extract metadata (title, description, OG tags, link/word counts) from any URL. Pay $0.01 USDC per call.",
    endpoints: [
      {
        path: "/api/inspect",
        method: "POST",
        price: "$0.01",
        network: process.env.NETWORK || "base",
        input: { url: "string (https URL)" },
        output: {
          url: "string",
          fetchedAt: "string (ISO timestamp)",
          title: "string | null",
          description: "string | null",
          ogImage: "string | null",
          linkCount: "number",
          wordCount: "number",
        },
      },
    ],
    publisher: {
      name: "Axiom",
      url: "https://www.clawbots.org",
    },
  });
}
