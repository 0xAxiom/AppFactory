# Runbook: Codebase Explainer Agent

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# 3. Start development server
npm run dev

# 4. Test the agent
curl -X POST http://localhost:8080/explain \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What does this project do?",
    "directory": "/path/to/your/codebase"
  }'
```

---

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with hot reload (tsx watch) |
| `npm run build` | Compile TypeScript |
| `npm start` | Build and run production |
| `npm run typecheck` | Check types without building |

---

## Endpoints

### GET /
Returns agent info and available endpoints.

```bash
curl http://localhost:8080/
```

### GET /health
Returns health status for monitoring.

```bash
curl http://localhost:8080/health
```

### POST /explain
Main endpoint - explain a codebase.

```bash
curl -X POST http://localhost:8080/explain \
  -H "Content-Type: application/json" \
  -d '{
    "question": "How does authentication work?",
    "directory": "/Users/dev/my-project"
  }'
```

---

## Configuration

### Environment Variables

Create a `.env` file from `.env.example`:

```bash
# Required
OPENAI_API_KEY=sk-...

# Optional
PORT=8080
MAX_TOOL_ITERATIONS=10
MAX_FILE_SIZE_KB=500
LOG_LEVEL=info

# Security: Restrict which directories can be explored
ALLOWED_ROOTS=/Users/dev/projects,/home/user/code
```

### Log Levels

- `debug` - All logs including tool execution details
- `info` - Request/response logging (default)
- `warn` - Warnings only
- `error` - Errors only

---

## Common Tasks

### Restrict Directory Access

Set `ALLOWED_ROOTS` to limit which directories can be explored:

```bash
ALLOWED_ROOTS=/home/user/safe-projects
```

### Increase File Size Limit

For codebases with large files:

```bash
MAX_FILE_SIZE_KB=1000
```

### Debug Tool Execution

Set log level to debug:

```bash
LOG_LEVEL=debug npm run dev
```

---

## Troubleshooting

### "OPENAI_API_KEY environment variable is required"
Add your API key to `.env` file.

### "Directory not allowed"
The requested directory isn't in `ALLOWED_ROOTS`. Either:
- Add it to `ALLOWED_ROOTS`
- Remove `ALLOWED_ROOTS` to allow any directory (use with caution)

### "Path traversal attempt blocked"
The path contains `..` which is blocked for security. Use absolute paths.

### "File too large"
File exceeds `MAX_FILE_SIZE_KB`. Increase the limit or use line ranges.

### Timeout / Max Iterations
Complex questions may hit the iteration limit. Try:
- More specific questions
- Increasing `MAX_TOOL_ITERATIONS`

---

## Monitoring

### Health Check

Use `/health` for load balancer/orchestration:

```bash
curl http://localhost:8080/health
# {"status":"ok","name":"codebase-explainer","version":"1.0.0","uptime":123.456}
```

### Logs

All logs are JSON-formatted for easy parsing:

```json
{"timestamp":"2026-01-17T10:00:00.000Z","level":"info","message":"Request received","context":{"method":"POST","path":"/explain"}}
```

Parse with jq:

```bash
npm run dev 2>&1 | jq 'select(.level == "error")'
```

---

## Architecture Notes

### Tool Execution

Tools are executed iteratively by the agent:
1. Agent decides which tool to call
2. Tool executes and returns result
3. Agent decides next action
4. Repeat until answer is ready (or max iterations)

### Safety

- Path validation prevents escaping allowed directories
- File size limits prevent memory issues
- Max iterations prevent runaway loops
- Read-only operations (no writes, no execution)
