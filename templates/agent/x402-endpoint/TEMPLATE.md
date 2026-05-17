# x402 Endpoint Template

**Pipeline**: agent-factory
**Category**: Monetized API / Agent Service
**Complexity**: Low

---

## Description

A pay-per-call API endpoint built with Next.js + the `x402-next` payment middleware. One prompt produces a deployed HTTPS endpoint that:

1. Returns a free `GET /api/manifest` describing the service so other agents can discover it.
2. Returns `402 Payment Required` on the paid route until the caller attaches an `X-PAYMENT` header.
3. Verifies payment via the public Coinbase x402 facilitator, then runs the user's business logic.
4. Settles USDC on Base (or Base Sepolia for testing) to the developer's wallet.

The endpoint is callable by any x402-aware client: AWS Bedrock agents via the x402 connector, Claude with the x402 skill, OpenAI agents using the x402 SDK, or any HTTP client with a payment handler. It is listable on the Coinbase x402 Bazaar for automatic discovery.

---

## Pre-Configured Features

### Core Features

- `x402-next` payment middleware mounted via `middleware.ts`
- Discovery endpoint at `GET /api/manifest`
- One paid endpoint at `POST /api/<tool>` per template instance
- Zod request/response validation
- Configurable price, network, and pay-to address via env
- Production-ready Next.js 15 app router scaffold

### Two Modes

| Mode             | Tool implementation                                       | When to use                                                              |
| ---------------- | --------------------------------------------------------- | ------------------------------------------------------------------------ |
| **Data**         | Pure TS/JS handler (fetch, parse, transform)              | Deterministic work, no LLM needed (extractors, validators, aggregators)  |
| **AI**           | Vercel AI SDK (`generateObject`, `streamText`, `tool`)    | LLM-backed reasoning (summarizers, classifiers, agents-as-a-service)     |

The middleware, manifest, deploy story, and Bazaar listing are identical across modes. The route handler is the only thing that changes.

### Onchain Plumbing

- Pay-to address is a single env var (`PAY_TO_ADDRESS`)
- Network selectable between `base` and `base-sepolia` via `NETWORK`
- Default facilitator is `x402.org/facilitator` (public Coinbase facilitator); overridable for self-hosted
- USDC settlement; no token wrapping or custom contracts

---

## Ideal For

- Per-call data APIs (URL inspectors, price lookups, KYC checks)
- Per-call AI tools (summarizers, classifiers, code review)
- Per-call utility endpoints (geocoding, image transforms, format converters)
- Agent-callable services that need micropayments instead of API keys
- Builders who want to be on the Bazaar without building auth/billing/quota infrastructure

---

## File Structure

```
outputs/<endpoint-name>/
├── package.json
├── tsconfig.json
├── next.config.mjs
├── .env.example
├── .gitignore
├── README.md
├── middleware.ts                  # x402 payment middleware (THE wiring)
└── app/
    ├── layout.tsx
    ├── page.tsx                   # Human-readable landing page
    └── api/
        ├── manifest/route.ts      # Free discovery endpoint
        └── <tool>/route.ts        # Paid endpoint (Data or AI mode)
```

---

## Canonical Example

A working deployed instance lives at `examples/x402-endpoint-demo/` and is deployed at:

**https://x402-endpoint-demo.vercel.app**

- `GET /api/manifest` — free JSON describing the endpoint
- `POST /api/inspect` — $0.01 USDC on Base. Body `{ "url": "https://..." }`. Returns extracted page metadata (title, description, OG image, link/word counts).

Run `curl -X POST https://x402-endpoint-demo.vercel.app/api/inspect -H 'content-type: application/json' -d '{"url":"https://example.com"}'` to see the 402 response with spec-compliant `accepts` payload.

---

## Required Inputs (Phase 0)

| Input                | Description                                              | Example                                  |
| -------------------- | -------------------------------------------------------- | ---------------------------------------- |
| Endpoint name        | kebab-case slug                                          | `geocode-pro`                            |
| Tool description     | One sentence on what the paid route does                 | `Geocode any address to lat/lon`         |
| Mode                 | `data` or `ai`                                           | `data`                                   |
| Price (USDC)         | Per-call price as a dollar string                        | `$0.005`                                 |
| Network              | `base` or `base-sepolia`                                 | `base`                                   |
| Pay-to address       | EVM wallet to receive payments                           | `0x523Eff3dB03938eaa31a5a6FBd41E3B9d23edde5` |
| Tool input schema    | Zod-compatible shape for request body                    | `{ address: z.string() }`                |
| Tool output schema   | Zod-compatible shape for response                        | `{ lat: z.number(), lon: z.number() }`   |

---

## Deploy Story

```bash
# In the generated project
npm install
cp .env.example .env.local
# fill in PAY_TO_ADDRESS

npm run build           # type-check + bundle
vercel deploy --prod    # → live HTTPS URL

# Optional: list on the Bazaar
# https://docs.cdp.coinbase.com/x402/bazaar
```

Total time from generation to live, paid endpoint: ~5 minutes.

---

## Monetization

Revenue is generated from the first paid call. There is no free tier, no API key issuance, no Stripe integration. Each call's USDC settles directly on Base to the pay-to address with no platform middleman beyond the optional facilitator (which can be self-hosted to remove it entirely).

Suggested per-call prices by category:

| Category                          | Suggested price |
| --------------------------------- | --------------- |
| Pure data extract (small payload) | $0.001 – $0.005 |
| Pure data extract (large payload) | $0.005 – $0.02  |
| Small LLM call (Haiku, ≤2k tokens)| $0.005 – $0.02  |
| Medium LLM call (Sonnet, ≤8k)     | $0.02 – $0.10   |
| Heavy compute / external API fee  | Cost + 30% margin |

---

## Why This Template

- **Revenue from minute one.** No "growth → monetize later" trap.
- **Discoverable by default.** The manifest route + Bazaar listing means agents find you without marketing spend.
- **Composable.** Other x402 endpoints can call yours; you can call theirs. Settlement is automatic.
- **Single env var per knob.** Price, network, recipient — all swappable without code changes.
- **Two-mode design.** Same paywall infra whether the work is deterministic or LLM-backed.

---

## Quality Expectations

Generated endpoints must:

1. Return a valid 402 response with the spec-compliant `accepts` array when no payment header is present
2. Verify the `X-PAYMENT` header via a facilitator before executing the handler
3. Expose a free `GET /api/manifest` describing all paid routes
4. Validate request bodies with Zod and return 400 on bad input
5. Type-check cleanly under `tsc --noEmit`
6. Build cleanly under `next build`
7. Include a README with the curl invocation and Bazaar listing instructions

---

## References

- x402 spec: https://github.com/coinbase/x402
- `x402-next` package: https://www.npmjs.com/package/x402-next
- Vercel AI SDK: https://sdk.vercel.ai
- Coinbase x402 Bazaar: https://docs.cdp.coinbase.com/x402/bazaar
