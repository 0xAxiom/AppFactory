import { paymentMiddleware, Network } from "x402-next";

const payTo = (process.env.PAY_TO_ADDRESS || "") as `0x${string}`;
const network = (process.env.NETWORK || "base") as Network;

if (!payTo || payTo === "0x0000000000000000000000000000000000000000") {
  console.warn(
    "[x402] PAY_TO_ADDRESS is unset. The /api/inspect route will reject all callers."
  );
}

export const middleware = paymentMiddleware(payTo, {
  "/api/inspect": {
    price: "$0.01",
    network,
    config: {
      description: "Extract metadata (title, description, OG tags, link/word counts) from any URL.",
      mimeType: "application/json",
      outputSchema: {
        type: "object",
        properties: {
          url: { type: "string" },
          fetchedAt: { type: "string" },
          title: { type: ["string", "null"] },
          description: { type: ["string", "null"] },
          ogImage: { type: ["string", "null"] },
          linkCount: { type: "number" },
          wordCount: { type: "number" },
        },
        required: ["url", "fetchedAt", "linkCount", "wordCount"],
      },
    },
  },
});

export const config = {
  matcher: ["/api/inspect"],
};
