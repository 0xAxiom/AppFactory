# Codebase Explainer Agent

An AI agent that explores and explains unfamiliar codebases through natural language interaction. Ask questions in plain English, get clear explanations with relevant code snippets.

```
╔══════════════════════════════════════════════════════════════╗
║                    CODEBASE EXPLAINER                        ║
║         "Ask questions. We explore. You understand."         ║
╚══════════════════════════════════════════════════════════════╝
```

---

## What It Does

Instead of manually searching through files, tracing imports, and piecing together how code works, you ask questions like:

- _"How does authentication work in this project?"_
- _"What is the main entry point?"_
- _"How does data flow from the API to the database?"_

The agent **autonomously explores** the codebase using specialized tools, then synthesizes a clear explanation with annotated code snippets.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Add your OpenAI API key to .env

# 3. Start the agent
npm run dev

# 4. Ask a question
curl -X POST http://localhost:8080/explain \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What does this project do?",
    "directory": "/path/to/any/codebase"
  }'
```

---

## Architecture

This agent follows the **Rig framework** patterns - a production-grade architecture for AI agents.

### Rig Alignment

| Concept          | Rig (Rust)        | This Agent (TypeScript)        |
| ---------------- | ----------------- | ------------------------------ |
| Agent Definition | `Agent<M>` struct | `AgentDefinition` interface    |
| Tool System      | `Tool` trait      | `Tool<Args, Output>` interface |
| Execution Loop   | `PromptRequest`   | `AgentExecutionLoop` class     |

### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                      User Question                          │
│            "How does authentication work?"                  │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Agent Loop                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  1. Understand question                              │   │
│  │  2. Decide which tool to use                         │   │
│  │  3. Execute tool                                     │   │
│  │  4. Analyze results                                  │   │
│  │  5. Repeat until enough information gathered         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Structured Response                       │
│  {                                                          │
│    "explanation": "Authentication uses JWT tokens...",      │
│    "codeSnippets": [{ file, lines, content, relevance }],   │
│    "suggestedQuestions": ["How are tokens refreshed?"]      │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Tools

The agent uses four specialized tools to explore codebases:

### 1. `list_directory`

**Purpose**: Discover project structure

```typescript
// Example usage by agent
list_directory({ path: "src", maxDepth: 2 })

// Returns
{
  entries: [
    { path: "src/index.ts", type: "file", size: 8036 },
    { path: "src/lib", type: "directory" },
    ...
  ],
  totalFiles: 15,
  totalDirectories: 4
}
```

### 2. `read_file`

**Purpose**: Read file contents with optional line range

```typescript
// Example usage by agent
read_file({ path: "src/auth/middleware.ts", startLine: 10, endLine: 30 })

// Returns
{
  content: "10: export function authMiddleware...",
  totalLines: 85,
  language: "typescript",
  truncated: true
}
```

### 3. `search_code`

**Purpose**: Find code matching patterns (regex supported)

```typescript
// Example usage by agent
search_code({ pattern: "auth|login|jwt", directory: "src" })

// Returns
{
  matches: [
    { file: "src/auth/middleware.ts", line: 15, content: "...", context: {...} },
    ...
  ],
  totalMatches: 12,
  truncated: false
}
```

### 4. `analyze_imports`

**Purpose**: Trace import/export relationships

```typescript
// Example usage by agent
analyze_imports({ file: "src/index.ts", direction: "both" })

// Returns
{
  imports: [
    { from: "./auth/middleware", items: ["authMiddleware"] },
    ...
  ],
  exports: [
    { name: "app", type: "const" },
    ...
  ]
}
```

---

## API Reference

### `GET /`

Returns agent info and available endpoints.

```bash
curl http://localhost:8080/
```

```json
{
  "name": "codebase-explainer",
  "version": "1.0.0",
  "description": "AI agent that explores and explains codebases",
  "tools": ["list_directory", "read_file", "search_code", "analyze_imports"]
}
```

### `GET /health`

Health check for monitoring and orchestration.

```bash
curl http://localhost:8080/health
```

```json
{
  "status": "ok",
  "name": "codebase-explainer",
  "version": "1.0.0",
  "uptime": 123.456
}
```

### `POST /explain`

**Main endpoint** - Ask questions about a codebase.

```bash
curl -X POST http://localhost:8080/explain \
  -H "Content-Type: application/json" \
  -d '{
    "question": "How does the error handling work?",
    "directory": "/Users/dev/my-project",
    "options": {
      "maxFiles": 20,
      "maxDepth": 5
    }
  }'
```

#### Request Schema

| Field                     | Type     | Required | Description                              |
| ------------------------- | -------- | -------- | ---------------------------------------- |
| `question`                | string   | Yes      | Natural language question (1-2000 chars) |
| `directory`               | string   | Yes      | Absolute path to codebase root           |
| `options.maxFiles`        | number   | No       | Max files to read (default: 20)          |
| `options.maxDepth`        | number   | No       | Max directory depth (default: 5)         |
| `options.includePatterns` | string[] | No       | File patterns to include                 |
| `options.excludePatterns` | string[] | No       | File patterns to exclude                 |

#### Response Schema

```json
{
  "explanation": "Clear, structured explanation of the answer",
  "codeSnippets": [
    {
      "file": "src/lib/errors.ts",
      "startLine": 10,
      "endLine": 25,
      "content": "export class AgentError extends Error {...}",
      "relevance": "Base error class used throughout the codebase"
    }
  ],
  "metadata": {
    "filesExamined": 5,
    "toolCalls": 8,
    "executionTimeMs": 4200,
    "confidence": "high"
  },
  "suggestedQuestions": ["How are validation errors different from processing errors?", "Where are errors logged?"]
}
```

---

## Configuration

### Environment Variables

| Variable              | Required | Default | Description                           |
| --------------------- | -------- | ------- | ------------------------------------- |
| `OPENAI_API_KEY`      | **Yes**  | -       | OpenAI API key for GPT-4              |
| `PORT`                | No       | 8080    | HTTP server port                      |
| `MAX_TOOL_ITERATIONS` | No       | 10      | Max tool calls per request            |
| `MAX_FILE_SIZE_KB`    | No       | 500     | Max file size to read                 |
| `LOG_LEVEL`           | No       | info    | Logging level (debug/info/warn/error) |
| `ALLOWED_ROOTS`       | No       | (any)   | Comma-separated allowed directories   |

### Security Configuration

To restrict which directories the agent can explore:

```bash
# Only allow specific directories
ALLOWED_ROOTS=/Users/dev/safe-projects,/home/user/code
```

---

## Project Structure

```
codebase-explainer/
├── src/
│   ├── index.ts                 # HTTP server entry point
│   ├── agent/
│   │   ├── index.ts             # Agent exports
│   │   ├── definition.ts        # Agent definition (Rig pattern)
│   │   ├── execution-loop.ts    # Iterative tool execution
│   │   ├── types.ts             # Type definitions
│   │   └── tools/
│   │       ├── index.ts         # Tool exports
│   │       ├── list-directory.ts
│   │       ├── read-file.ts
│   │       ├── search-code.ts
│   │       └── analyze-imports.ts
│   └── lib/
│       ├── logger.ts            # Structured JSON logging
│       ├── errors.ts            # Typed error classes
│       └── path-validator.ts    # Path safety utilities
├── research/
│   ├── market_research.md       # Market analysis
│   ├── competitor_analysis.md   # Competitor comparison
│   └── positioning.md           # Value proposition
├── agent.json                   # Agent manifest
├── package.json
├── tsconfig.json
├── .env.example
├── AGENT_SPEC.md               # Technical specification
├── RUNBOOK.md                  # Operations guide
├── TESTING.md                  # Test guide
├── DEPLOYMENT.md               # Deployment guide
└── LAUNCH_CHECKLIST.md         # Pre-launch checklist
```

---

## Example Questions

### General Understanding

```bash
# What does this project do?
curl -X POST http://localhost:8080/explain \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the main purpose of this project?", "directory": "/path/to/project"}'

# Project structure
curl -X POST http://localhost:8080/explain \
  -H "Content-Type: application/json" \
  -d '{"question": "Explain the project structure and architecture", "directory": "/path/to/project"}'
```

### Specific Features

```bash
# Authentication flow
curl -X POST http://localhost:8080/explain \
  -H "Content-Type: application/json" \
  -d '{"question": "How does user authentication work from login to session creation?", "directory": "/path/to/project"}'

# Data flow
curl -X POST http://localhost:8080/explain \
  -H "Content-Type: application/json" \
  -d '{"question": "How does data flow from the API endpoint to the database?", "directory": "/path/to/project"}'
```

### Code Investigation

```bash
# Find entry points
curl -X POST http://localhost:8080/explain \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the main entry point and how does the app initialize?", "directory": "/path/to/project"}'

# Error handling
curl -X POST http://localhost:8080/explain \
  -H "Content-Type: application/json" \
  -d '{"question": "How are errors handled and logged in this codebase?", "directory": "/path/to/project"}'
```

---

## Safety & Security

### Read-Only Operation

The agent **only reads** files. It cannot:

- Execute code found in the codebase
- Modify any files
- Access files outside the specified directory
- Bypass configured limits

### Path Traversal Prevention

All paths are validated:

- Resolved to absolute paths
- Checked against allowed root
- `..` patterns are rejected

### Configurable Boundaries

```bash
# Restrict to specific directories
ALLOWED_ROOTS=/home/user/safe-projects

# Limit file sizes
MAX_FILE_SIZE_KB=200

# Limit exploration depth
MAX_TOOL_ITERATIONS=5
```

---

## Deployment

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 8080
CMD ["node", "dist/index.js"]
```

```bash
docker build -t codebase-explainer .
docker run -p 8080:8080 \
  -e OPENAI_API_KEY=sk-... \
  -e ALLOWED_ROOTS=/data \
  -v /path/to/codebases:/data:ro \
  codebase-explainer
```

### Cloud Platforms

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions for:

- Railway
- Render
- Fly.io
- Docker Compose

---

## Development

```bash
# Install dependencies
npm install

# Start with hot reload
npm run dev

# Type check
npm run typecheck

# Build for production
npm run build

# Run production build
npm start
```

---

## Why Rig-Aligned?

This agent demonstrates **production-grade agent architecture** inspired by the [Rig framework](https://github.com/0xPlaygrounds/rig):

1. **Typed Tools**: Every tool has explicit input/output types, not stringly-typed
2. **Composable**: Tools can be mixed, matched, and extended
3. **Testable**: Each component is isolated and testable
4. **Observable**: Structured logging for debugging and monitoring
5. **Safe**: Error boundaries prevent cascading failures

This isn't tutorial code - it's a pattern you can scale to production.

---

## Learn More

- [AGENT_SPEC.md](./AGENT_SPEC.md) - Full technical specification
- [RUNBOOK.md](./RUNBOOK.md) - Operations and troubleshooting
- [TESTING.md](./TESTING.md) - Test scenarios and curl examples
- [Rig Framework](https://github.com/0xPlaygrounds/rig) - The Rust framework that inspired this architecture

---

## License

MIT

---

**Built with Agent Factory v3.0** - Rig-aligned agent generation
