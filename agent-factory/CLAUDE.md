# Agent Factory

**Version**: 2.0
**Mode**: Full Build Factory with Auto-Polish
**Status**: MANDATORY CONSTITUTION

---

## Purpose

Agent Factory generates **complete, production-ready AI agent scaffolds** from plain-language descriptions. When a user describes an agent idea, Claude builds a full Node.js/TypeScript agent with all code, configuration, research, and documentation. The output is a runnable HTTP agent, not prompts or scaffolds.

---

## The Pipeline

```
PHASE 0: Intent Normalization  → Upgrade "build agent that..." to product spec
PHASE 1: Dream Spec Author     → 10-section comprehensive specification
PHASE 2: Research & Position   → Market research, competitor analysis
PHASE 3: Generate              → Complete agent scaffold
PHASE 4: Ralph Polish Loop     → QA until ≥97% (max 3 iterations)
```

---

## For Users

Type this to start:
```
Build an agent that ____________________
```

Examples:
- "Build an agent that summarizes YouTube videos"
- "Build an agent that converts CSV files to JSON"
- "Build an agent that answers questions about a codebase"

---

## PHASE 0: INTENT NORMALIZATION (MANDATORY)

**Before asking questions or generating**, Claude MUST upgrade the user's raw input into a publishable product intent.

### Rules for Intent Normalization

1. Treat the user's message as RAW INTENT, not a specification
2. Infer missing but required agent qualities
3. Rewrite into clean, professional, **publishable prompt**
4. Do NOT ask user to approve this rewrite
5. Save to: `runs/<date>/<run-id>/inputs/normalized_prompt.md`

### Example

**User says:**
> "build an agent that summarizes youtube videos"

**Claude normalizes to:**
> "A YouTube video summarization agent that accepts video URLs, extracts transcripts, and generates concise summaries using LLM inference. Features structured output with key points, timestamps, and takeaways. Includes health monitoring, graceful error handling, and configurable summary length. Designed for developer integration via REST API."

### What Intent Normalization Adds

| Missing Element | Claude Infers |
|-----------------|---------------|
| No error handling | "Graceful error handling with retry logic" |
| No output format | "Structured JSON output with metadata" |
| No monitoring | "Health endpoint and request logging" |
| No configuration | "Environment-based configuration" |
| No rate limiting | "Request throttling for API protection" |
| No validation | "Input validation with clear error messages" |

### Normalization Saves To

```
runs/YYYY-MM-DD/agent-<timestamp>/
└── inputs/
    ├── raw_input.md           # User's exact words
    └── normalized_prompt.md   # Claude's upgraded version
```

---

## PHASE 1: DREAM SPEC AUTHOR

After normalization, Claude writes a comprehensive specification.

### Required Spec Sections

1. **Agent Vision** - One-paragraph description of what the agent does
2. **Core Capabilities** - Bulleted list of must-have functionality
3. **Input/Output Contract** - What it accepts, what it returns
4. **Tool Definitions** - Functions the agent can call (with Zod schemas)
5. **Error Handling** - How failures are managed
6. **Safety Rules** - What the agent must never do
7. **Environment Variables** - Required API keys and configuration
8. **Token Integration** - Yes/No and what it enables (if yes)
9. **Deployment Strategy** - How the agent will be deployed
10. **Success Criteria** - What "done" looks like

### Spec Saves To

```
runs/YYYY-MM-DD/agent-<timestamp>/
└── inputs/
    └── dream_spec.md
```

---

## PHASE 2: RESEARCH & POSITIONING

Before generating, Claude researches the market.

### Required Research Artifacts

```
outputs/<agent-name>/
└── research/
    ├── market_research.md      # REQUIRED - Market opportunity, trends
    ├── competitor_analysis.md  # REQUIRED - Existing solutions, gaps
    └── positioning.md          # REQUIRED - Unique value proposition
```

### Research Quality Bar

- **Substantive content** - Not placeholder or generic text
- **Specific insights** - Name actual competitors or alternatives
- **Actionable positioning** - Clear differentiation strategy

---

## PHASE 3: GENERATE

After research, ask 4 questions then generate the agent.

### Step 1: Ask 4 Questions

1. **Name**: "What should I call this agent? (lowercase, hyphens only, e.g., `youtube-summarizer`)"
2. **Description**: "In one sentence, what does this agent do?"
3. **Environment Variables**: "What API keys does this agent need? (e.g., OPENAI_API_KEY, or 'none')"
4. **Token Integration**: "Do you want token integration for rewards/payments? (yes/no)"

### Step 2: Generate Files

Create folder: `outputs/<agent-name>/` (no timestamps, just the slug)

#### Always Generate

| File | Purpose |
|------|---------|
| `agent.json` | Agent manifest |
| `package.json` | Node.js config |
| `tsconfig.json` | TypeScript config |
| `src/index.ts` | HTTP server code |
| `src/lib/logger.ts` | Structured logging |
| `src/lib/errors.ts` | Error handling utilities |
| `AGENT_SPEC.md` | Agent specification |
| `RUNBOOK.md` | Run instructions |
| `TESTING.md` | Test instructions |
| `LAUNCH_CHECKLIST.md` | Pre-launch checks |
| `DEPLOYMENT.md` | Deployment guide |
| `.env.example` | Environment template (if env vars needed) |
| `research/market_research.md` | Market research |
| `research/competitor_analysis.md` | Competitor analysis |
| `research/positioning.md` | Positioning strategy |

#### Generate Only If Token Integration = Yes

| File | Purpose |
|------|---------|
| `TOKEN_INTEGRATION.md` | Token setup guide |
| `src/lib/token.ts` | Token utilities |

---

## PHASE 4: RALPH POLISH LOOP (MANDATORY)

After generating, Claude runs adversarial QA as "Ralph Wiggum" - a skeptical reviewer who finds issues.

### How Ralph Works

1. **Ralph Reviews** - Checks all quality criteria
2. **Ralph Scores** - Calculates pass rate (passed/total × 100)
3. **Threshold** - Must reach ≥97% to PASS
4. **Iteration** - Builder fixes issues, Ralph re-reviews
5. **Max 3 Iterations** - 3 FAILs = hard failure

### Ralph's Checklist

#### Build Quality (4 items)
- [ ] `npm install` completes without errors
- [ ] `npm run build` compiles TypeScript
- [ ] `npm run dev` starts server on configured port
- [ ] No TypeScript errors

#### Agent Quality (8 items)
- [ ] `/health` endpoint returns 200 with status
- [ ] `/process` endpoint accepts input and returns response
- [ ] Error handling returns proper error messages
- [ ] Input validation rejects invalid requests
- [ ] Structured logging present
- [ ] CORS headers configured
- [ ] Request timeout handling
- [ ] Graceful shutdown handling

#### Research Quality (3 items)
- [ ] market_research.md is substantive (not placeholder)
- [ ] competitor_analysis.md names real alternatives
- [ ] positioning.md has clear differentiation

#### Documentation Quality (4 items)
- [ ] RUNBOOK.md has correct commands
- [ ] TESTING.md has working curl examples
- [ ] .env.example lists all required variables
- [ ] agent.json matches implementation

#### Token Integration (if enabled) (3 items)
- [ ] Token config loads from environment
- [ ] Dry-run mode works without contract address
- [ ] TOKEN_INTEGRATION.md has clear setup steps

### Ralph Verdict Format

```markdown
# Ralph Polish Report - Iteration X

## Score: XX% (X/X passed)

## Blocking Issues
- [ ] Issue 1
- [ ] Issue 2

## Verdict: PASS | FAIL

## Notes
...
```

### Ralph Saves To

```
runs/YYYY-MM-DD/agent-<timestamp>/
└── polish/
    ├── ralph_report_1.md
    ├── ralph_report_2.md
    ├── ralph_report_3.md
    └── ralph_final_verdict.md   # VERDICT: PASS or VERDICT: FAIL
```

---

## Technology Stack

### Core (REQUIRED)

| Component | Technology | Version |
|-----------|------------|---------|
| Runtime | Node.js | 18+ |
| Language | TypeScript | 5.0+ |
| Interface | HTTP (REST) | - |
| Port | 8080 (default) | Configurable |

### Recommended Patterns

#### Structured Logging
```typescript
// src/lib/logger.ts
export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  context?: Record<string, unknown>;
}

export function log(level: LogEntry['level'], message: string, context?: Record<string, unknown>): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context
  };
  console.log(JSON.stringify(entry));
}

export const logger = {
  info: (msg: string, ctx?: Record<string, unknown>) => log('info', msg, ctx),
  warn: (msg: string, ctx?: Record<string, unknown>) => log('warn', msg, ctx),
  error: (msg: string, ctx?: Record<string, unknown>) => log('error', msg, ctx),
  debug: (msg: string, ctx?: Record<string, unknown>) => log('debug', msg, ctx),
};
```

#### Error Handling
```typescript
// src/lib/errors.ts
export class AgentError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AgentError';
  }
}

export class ValidationError extends AgentError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', 400, context);
    this.name = 'ValidationError';
  }
}

export class ProcessingError extends AgentError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'PROCESSING_ERROR', 500, context);
    this.name = 'ProcessingError';
  }
}

export function handleError(error: unknown): { statusCode: number; body: object } {
  if (error instanceof AgentError) {
    return {
      statusCode: error.statusCode,
      body: { error: error.message, code: error.code }
    };
  }
  return {
    statusCode: 500,
    body: { error: 'Internal server error', code: 'INTERNAL_ERROR' }
  };
}
```

#### Type-Safe Tool Definitions (Zod Pattern)
```typescript
// When using LLM with tools, use Zod for type-safe schemas
import { z } from 'zod';

const SummarizeInputSchema = z.object({
  url: z.string().url('Must be a valid URL'),
  maxLength: z.number().min(100).max(10000).optional().default(500),
  format: z.enum(['bullets', 'paragraph', 'structured']).optional().default('structured')
});

type SummarizeInput = z.infer<typeof SummarizeInputSchema>;

// Validate input
function validateInput(raw: unknown): SummarizeInput {
  return SummarizeInputSchema.parse(raw);
}
```

#### Graceful Shutdown
```typescript
// Add to src/index.ts
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});
```

---

## File Templates

### `agent.json`
```json
{
  "manifestVersion": "1.0",
  "agent": {
    "name": "<agent-name>",
    "displayName": "<Display Name>",
    "description": "<description>",
    "version": "1.0.0",
    "author": "Builder",
    "category": "<pick: assistant|automation|data|developer|writing|research|custom>"
  },
  "runtime": {
    "platform": "node",
    "nodeVersion": ">=18",
    "entrypoint": "src/index.ts"
  },
  "interface": {
    "type": "http",
    "http": {
      "port": 8080,
      "routes": [
        { "method": "GET", "path": "/", "description": "Agent info" },
        { "method": "GET", "path": "/health", "description": "Health check" },
        { "method": "POST", "path": "/process", "description": "Process input" }
      ]
    }
  },
  "environment": {
    "required": []
  },
  "permissions": {
    "network": true,
    "filesystem": { "read": [], "write": [] },
    "shell": false
  },
  "safety": {
    "disallowedActions": ["Never reveal API keys", "Never generate harmful content"],
    "maxTokensPerRequest": 4000
  },
  "tokenIntegration": false
}
```

### `package.json`
```json
{
  "name": "<agent-name>",
  "version": "1.0.0",
  "description": "<description>",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "npm run build && node dist/index.js",
    "dev": "tsx watch src/index.ts",
    "validate": "node ../../scripts/validate.js",
    "typecheck": "tsc --noEmit"
  },
  "engines": { "node": ">=18.0.0" },
  "dependencies": {},
  "devDependencies": {
    "typescript": "^5.0.0",
    "tsx": "^4.0.0",
    "@types/node": "^20.0.0"
  }
}
```

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### `src/index.ts`
```typescript
/**
 * <Display Name>
 * <description>
 * Generated by Agent Factory v2.0
 */

import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { logger } from './lib/logger.js';
import { ValidationError, handleError } from './lib/errors.js';

const CONFIG = {
  name: '<agent-name>',
  version: '1.0.0',
  port: parseInt(process.env.PORT || '8080', 10)
};

interface ProcessRequest {
  input: string;
  context?: Record<string, unknown>;
}

interface ProcessResponse {
  response: string;
  metadata?: Record<string, unknown>;
}

/**
 * Process user input and return a response.
 * TODO: Add your LLM integration here.
 */
async function processInput(input: string, context?: Record<string, unknown>): Promise<ProcessResponse> {
  logger.info('Processing input', { inputLength: input.length, hasContext: !!context });

  // Example with OpenAI:
  // import OpenAI from 'openai';
  // const openai = new OpenAI();
  // const response = await openai.chat.completions.create({
  //   model: 'gpt-4',
  //   messages: [{ role: 'user', content: input }]
  // });
  // return { response: response.choices[0].message.content ?? '' };

  return {
    response: `[${CONFIG.name}] Received: "${input}". Add your LLM integration in src/index.ts`,
    metadata: { processedAt: new Date().toISOString() }
  };
}

function parseBody(req: IncomingMessage): Promise<ProcessRequest> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: Buffer) => body += chunk.toString());
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch { reject(new ValidationError('Invalid JSON body')); }
    });
    req.on('error', reject);
  });
}

function sendJSON(res: ServerResponse, status: number, data: unknown): void {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  const startTime = Date.now();

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://localhost:${CONFIG.port}`);

  logger.info('Request received', { method: req.method, path: url.pathname });

  try {
    // Health check
    if (req.method === 'GET' && url.pathname === '/health') {
      return sendJSON(res, 200, {
        status: 'ok',
        name: CONFIG.name,
        version: CONFIG.version,
        uptime: process.uptime()
      });
    }

    // Info endpoint
    if (req.method === 'GET' && url.pathname === '/') {
      return sendJSON(res, 200, {
        name: CONFIG.name,
        version: CONFIG.version,
        endpoints: {
          'GET /': 'Agent info',
          'GET /health': 'Health check',
          'POST /process': 'Process input'
        }
      });
    }

    // Process endpoint
    if (req.method === 'POST' && url.pathname === '/process') {
      const body = await parseBody(req);

      if (!body.input || typeof body.input !== 'string') {
        throw new ValidationError('Missing or invalid "input" field');
      }

      const result = await processInput(body.input, body.context);

      logger.info('Request completed', {
        duration: Date.now() - startTime,
        responseLength: result.response.length
      });

      return sendJSON(res, 200, result);
    }

    // 404 for unknown routes
    sendJSON(res, 404, { error: 'Not found', code: 'NOT_FOUND' });

  } catch (error) {
    const { statusCode, body } = handleError(error);
    logger.error('Request failed', { error: body, duration: Date.now() - startTime });
    sendJSON(res, statusCode, body);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down');
  server.close(() => process.exit(0));
});

server.listen(CONFIG.port, () => {
  logger.info('Agent started', { name: CONFIG.name, version: CONFIG.version, port: CONFIG.port });
  console.log(`\n${CONFIG.name} v${CONFIG.version} running at http://localhost:${CONFIG.port}\n`);
  console.log('Endpoints:');
  console.log('  GET  /         - Info');
  console.log('  GET  /health   - Health check');
  console.log('  POST /process  - Process input\n');
});
```

### `src/lib/logger.ts`
```typescript
/**
 * Structured logging for production observability.
 */

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  context?: Record<string, unknown>;
}

export function log(level: LogEntry['level'], message: string, context?: Record<string, unknown>): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context
  };

  const output = JSON.stringify(entry);

  if (level === 'error') {
    console.error(output);
  } else {
    console.log(output);
  }
}

export const logger = {
  info: (msg: string, ctx?: Record<string, unknown>) => log('info', msg, ctx),
  warn: (msg: string, ctx?: Record<string, unknown>) => log('warn', msg, ctx),
  error: (msg: string, ctx?: Record<string, unknown>) => log('error', msg, ctx),
  debug: (msg: string, ctx?: Record<string, unknown>) => {
    if (process.env.DEBUG === 'true') {
      log('debug', msg, ctx);
    }
  },
};
```

### `src/lib/errors.ts`
```typescript
/**
 * Error handling utilities for consistent error responses.
 */

export class AgentError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AgentError';
  }
}

export class ValidationError extends AgentError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', 400, context);
    this.name = 'ValidationError';
  }
}

export class ProcessingError extends AgentError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'PROCESSING_ERROR', 500, context);
    this.name = 'ProcessingError';
  }
}

export class ConfigurationError extends AgentError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'CONFIGURATION_ERROR', 500, context);
    this.name = 'ConfigurationError';
  }
}

export function handleError(error: unknown): { statusCode: number; body: object } {
  if (error instanceof AgentError) {
    return {
      statusCode: error.statusCode,
      body: { error: error.message, code: error.code }
    };
  }

  if (error instanceof Error) {
    return {
      statusCode: 500,
      body: { error: error.message, code: 'INTERNAL_ERROR' }
    };
  }

  return {
    statusCode: 500,
    body: { error: 'Internal server error', code: 'INTERNAL_ERROR' }
  };
}
```

### Documentation Templates

*(Keep existing AGENT_SPEC.md, RUNBOOK.md, TESTING.md, LAUNCH_CHECKLIST.md, FACTORY_IMPORT.md templates from v1.1)*

### Token Integration Templates

*(Keep existing TOKEN_INTEGRATION.md and src/lib/token.ts templates from v1.1)*

---

## Guardrails

### DO

- Normalize intent before asking questions
- Write comprehensive spec before generating
- Include research artifacts
- Run Ralph Polish Loop until PASS
- Include structured logging
- Include proper error handling
- Create all required files
- Follow Factory Ready Standard

### DO NOT

- Ask clarifying questions beyond the 4 required
- Skip Intent Normalization
- Skip Research phase
- Skip Ralph Polish Loop
- Include `.env` files (use .env.example)
- Include `node_modules/`
- Include shell scripts
- Commit secrets or API keys
- Claim success without Ralph PASS verdict

---

## Execution Flow Summary

### Step 1: Receive Agent Idea
- Accept "Build an agent that..." description
- Create run directory

### Step 2: Normalize Intent
- Upgrade raw input to publishable spec
- Save to `runs/.../inputs/normalized_prompt.md`

### Step 3: Write Dream Spec
- Comprehensive specification with all 10 sections
- Save to `runs/.../inputs/dream_spec.md`

### Step 4: Research & Position
- Write market_research.md, competitor_analysis.md, positioning.md
- Save to `outputs/<agent-name>/research/`

### Step 5: Ask 4 Questions
- Name, description, env vars, token integration

### Step 6: Generate Complete Agent
- Write ALL files to `outputs/<agent-name>/`
- Follow templates and patterns

### Step 7: Ralph Polish Loop
- Run adversarial QA
- Iterate until ≥97% pass rate
- Max 3 iterations before hard failure

### Step 8: Confirm to User
- Provide next steps based on token selection

---

## Directory Structure

```
agent-factory/
├── CLAUDE.md                 # This constitution
├── README.md                 # User documentation
├── ZIP_CONTRACT.md           # ZIP validation rules
├── schema/
│   └── agent.schema.json     # Manifest schema
├── scripts/
│   ├── validate.js           # Validation script
│   └── zip.js                # ZIP helper
├── templates/
│   └── system/
│       ├── dream_spec_author.md
│       ├── ralph_polish_loop.md
│       └── deployment_guide.md
├── examples/
│   └── hello-agent/          # Reference implementation
├── outputs/                  # Generated agents (output)
├── runs/                     # Execution logs
│   └── YYYY-MM-DD/
│       └── agent-<timestamp>/
│           ├── inputs/
│           │   ├── raw_input.md
│           │   ├── normalized_prompt.md
│           │   └── dream_spec.md
│           └── polish/
│               ├── ralph_report_1.md
│               └── ralph_final_verdict.md
└── .claude/
```

### Directory Boundaries

| Directory | Purpose | Who Writes |
|-----------|---------|------------|
| `outputs/<agent-name>/` | **Final output** - agent scaffold | Claude |
| `runs/` | Execution logs and artifacts | Claude |
| `examples/` | Reference implementations | Maintainers |

### FORBIDDEN Directories (never write to)

- `builds/` - belongs to app-factory
- `web3-builds/` - belongs to web3-factory
- Any path outside `agent-factory/`

---

## Default Assumptions

When the user doesn't specify:

| Aspect | Default |
|--------|---------|
| Runtime | Node.js 18+ |
| Language | TypeScript |
| Interface | HTTP REST |
| Port | 8080 |
| Token Integration | No |
| Logging | Structured JSON |
| Error Handling | Typed errors with codes |

---

## V2 Constraints

- **Runtime**: Node.js + TypeScript only
- **Interface**: HTTP only (POST /process)
- **Port**: 8080 default (configurable via PORT env)
- **No inference**: You bring your own API keys (BYOK)
- **No secrets**: Only env var names in files, never values

---

## Success Definition

A successful execution produces:
- Complete agent scaffold in `outputs/<agent-name>/`
- Ralph PASS verdict in `runs/.../polish/ralph_final_verdict.md`
- All research artifacts with substantive content
- Agent runs with `npm run dev`
- Agent builds with `npm run build`
- Validation passes with `npm run validate`

---

## Reference

- `examples/hello-agent/` - Working example
- `schema/agent.schema.json` - Manifest schema
- `scripts/validate.js` - Validate before deployment
- `ZIP_CONTRACT.md` - ZIP packaging rules

---

## Version History

- **2.0** (2026-01-14): Added Intent Normalization, Dream Spec Author, Ralph Polish Loop, research requirements, structured logging, error handling patterns
- **1.1** (2026-01-12): Token integration support, 4-question flow
- **1.0** (2026-01-11): Initial release

---

**agent-factory**: Describe your agent idea. Get a complete, production-ready scaffold.
