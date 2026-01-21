# API Integration Agent Template

**Pipeline**: agent-factory
**Category**: Integration / Automation
**Complexity**: Medium

---

## Description

An AI agent template for integrating with external APIs. Pre-configured with tool patterns for HTTP requests, data transformation, and response formatting. Perfect for agents that need to fetch, process, and return data from various sources.

---

## Pre-Configured Features

### Core Features

- HTTP client with retry logic
- Request/response validation
- Error handling with typed errors
- Rate limiting awareness
- Response caching (configurable)

### Tool Patterns

- `fetchData` - Generic HTTP GET
- `postData` - Generic HTTP POST
- `transformData` - Data transformation
- `formatResponse` - Output formatting

### Agent Architecture

- Rig-aligned Agent definition
- Typed tool arguments/outputs
- Execution loop with max iterations
- Health and process endpoints

---

## Ideal For

- Content aggregators
- Data pipeline agents
- API proxy agents
- Webhook processors
- Report generators
- Multi-source fetchers

---

## File Structure

```
outputs/<agent-name>/
├── agent.json                # Agent manifest
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts              # HTTP server
│   ├── agent/
│   │   ├── definition.ts     # Agent definition
│   │   ├── tools/
│   │   │   ├── index.ts
│   │   │   ├── fetchData.ts
│   │   │   ├── postData.ts
│   │   │   └── transformData.ts
│   │   ├── execution/
│   │   │   └── loop.ts
│   │   └── types/
│   │       ├── agent.ts
│   │       └── tool.ts
│   └── lib/
│       ├── http.ts           # HTTP client
│       ├── errors.ts         # Error types
│       ├── logger.ts         # Structured logging
│       └── cache.ts          # Response cache
├── .env.example
├── AGENT_SPEC.md
├── RUNBOOK.md
├── TESTING.md
├── DEPLOYMENT.md
└── research/
    ├── market_research.md
    ├── competitor_analysis.md
    └── positioning.md
```

---

## Default Tech Stack

| Component   | Technology     |
| ----------- | -------------- |
| Runtime     | Node.js 18+    |
| Language    | TypeScript     |
| HTTP Server | Express / Hono |
| HTTP Client | fetch / axios  |
| Validation  | Zod            |
| Logging     | pino           |

---

## Usage

When using this template in Phase 0, Claude will:

1. Normalize your idea with API integration patterns
2. Pre-configure HTTP tools
3. Set up error handling
4. Include integration market research

**Example prompt enhancement:**

- User says: "agent that summarizes articles from URLs"
- Template adds: fetchData tool for URL content, parseArticle tool for extraction, summarize tool for LLM call, formatSummary tool for output, caching for repeated URLs, rate limiting for API protection

---

## Tool Definitions (Pre-configured)

```typescript
// tools/fetchData.ts
interface FetchDataArgs {
  url: string;
  headers?: Record<string, string>;
  timeout?: number;
}

interface FetchDataOutput {
  status: number;
  body: unknown;
  headers: Record<string, string>;
}
```

```typescript
// tools/transformData.ts
interface TransformDataArgs {
  data: unknown;
  transformation: 'extract' | 'filter' | 'map' | 'reduce';
  path?: string;
  predicate?: string;
}

interface TransformDataOutput {
  result: unknown;
  itemCount?: number;
}
```

---

## Customization Points

| Element          | How to Customize            |
| ---------------- | --------------------------- |
| API endpoints    | Add tools in `agent/tools/` |
| Authentication   | Modify `lib/http.ts`        |
| Caching strategy | Update `lib/cache.ts`       |
| Rate limits      | Configure in `lib/http.ts`  |
| Response format  | Edit tool output types      |

---

## Quality Expectations

When using this template, Ralph will check for:

- [ ] `/health` returns 200 with status
- [ ] `/process` accepts and validates input
- [ ] HTTP client handles timeouts
- [ ] Errors return proper status codes
- [ ] Logging captures request lifecycle
- [ ] Cache reduces redundant calls
- [ ] Rate limiting prevents abuse
- [ ] TypeScript compiles without errors
- [ ] All environment variables documented

---

## Environment Variables

```bash
# .env.example (pre-configured)
PORT=8080
LOG_LEVEL=info
CACHE_TTL_SECONDS=300
MAX_REQUESTS_PER_MINUTE=60

# Add your API keys:
# API_KEY=your-api-key
# OPENAI_API_KEY=your-openai-key
```
