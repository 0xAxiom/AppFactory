# AI Agent Example

A minimal AI agent demonstrating the Agent Factory output structure.

## Quick Start

```bash
# Install dependencies
npm install

# Start the agent server
npm run dev
```

The agent will start on [http://localhost:8080](http://localhost:8080).

## Test the Agent

```bash
# Health check
curl http://localhost:8080/health

# Process a request
curl -X POST http://localhost:8080/process \
  -H "Content-Type: application/json" \
  -d '{"input": "Hello, what can you do?"}'
```

## Structure

```
agent/
├── src/
│   ├── index.ts            # HTTP server entry point
│   ├── agent/
│   │   ├── definition.ts   # Agent configuration
│   │   └── tools/          # Agent tools
│   │       └── echo.ts
│   └── lib/
│       ├── logger.ts       # Structured logging
│       └── errors.ts       # Error handling
├── package.json
└── tsconfig.json
```

## Key Features

This example demonstrates:

1. **HTTP API** - Express server with health and process endpoints
2. **Agent Definition** - Rig-aligned agent architecture
3. **Tools** - Typed tool definitions with Zod schemas
4. **Structured Logging** - JSON logs for production use
5. **Error Handling** - Typed errors with proper HTTP responses

## API Endpoints

| Endpoint   | Method | Description                              |
| ---------- | ------ | ---------------------------------------- |
| `/health`  | GET    | Health check, returns `{ status: "ok" }` |
| `/process` | POST   | Process input, returns agent response    |

## Environment Variables

Create a `.env` file:

```bash
# Server configuration
PORT=8080

# LLM API key (required for real AI responses)
OPENAI_API_KEY=your_key_here
# or
ANTHROPIC_API_KEY=your_key_here
```

## Next Steps

This is a minimal example. Full Agent Factory builds include:

- Complete tool implementations
- Market research and positioning
- Comprehensive documentation
- Ralph QA verification
- Deployment guides

Run the full pipeline:

```bash
cd ../../agent-factory
claude
# Describe your agent idea
```
