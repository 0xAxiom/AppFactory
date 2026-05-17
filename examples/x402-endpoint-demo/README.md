# x402 URL Inspector Demo

Minimal pay-per-call API. Next.js + `x402-next` middleware gating a route at $0.01 USDC on Base. Built as the canonical example for AppFactory's `x402-endpoint` template.

## What it does

- `GET /api/manifest` — free. Describes the endpoint so other agents can discover it.
- `POST /api/inspect` — paywalled. Body `{ "url": "https://..." }`. Fetches the page, extracts title / description / OG tags / link count / word count, returns JSON.

Any caller without an `X-PAYMENT` header gets a `402 Payment Required` response listing the price, network, and pay-to address. x402-aware clients (Bedrock with the x402 connector, Claude with the x402 skill, manual `curl` with a payment handler) auto-pay and retry.

## Run locally

```bash
npm install
cp .env.example .env.local
# set PAY_TO_ADDRESS
npm run dev
```

Then:

```bash
curl http://localhost:3000/api/manifest
curl -X POST -H 'content-type: application/json' \
  -d '{"url":"https://example.com"}' \
  http://localhost:3000/api/inspect
# → 402, with paymentRequirements payload
```

## Deploy

```bash
vercel deploy --prod
```

Set `PAY_TO_ADDRESS` and `NETWORK` (default `base`) in the Vercel project env.

## How payment works

`middleware.ts` registers `/api/inspect` with the `x402-next` `paymentMiddleware`. The first request without payment returns 402 + a JSON `paymentRequirements` object. An x402-aware client constructs a USDC payment for the stated amount + recipient, retries with `X-PAYMENT: <signed payload>`. The middleware verifies via the public Coinbase facilitator, then forwards to the route handler.

## Bazaar listing

The `GET /api/manifest` route returns a machine-readable description that the Coinbase x402 Bazaar (and other registries) can index. After deploying, submit the deployment URL to the Bazaar to make the endpoint discoverable by AWS Bedrock agents and other x402-aware consumers.

## Swapping in AI

This demo uses pure data extraction so it runs anywhere with no API keys. The template (`templates/agent/x402-endpoint/TEMPLATE.md`) documents the AI variant: swap the `/api/inspect` route for a Vercel AI SDK handler (`generateObject` / `streamText`) backed by Claude, OpenAI, or any provider. The x402 middleware is identical either way.
