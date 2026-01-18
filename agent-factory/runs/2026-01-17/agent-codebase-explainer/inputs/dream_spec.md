# Dream Spec: Codebase Explainer Agent

**Version**: 1.0
**Date**: 2026-01-17

---

## 1. Agent Vision

The Codebase Explainer Agent transforms the frustrating experience of diving into unfamiliar code into an interactive conversation. Instead of spending hours reading files and tracing imports, developers ask questions in plain English and receive clear, contextual explanations backed by relevant code snippets.

This agent demonstrates Rig-aligned architecture: a typed tool system, iterative execution loops, and composable agent patterns that can scale from simple questions ("What does this project do?") to complex investigations ("How does authentication flow from login to API authorization?").

---

## 2. Core Capabilities

### Must-Have (P0)
- **Directory Analysis**: Scan project structure, identify key files (README, package.json, entry points)
- **Intelligent File Reading**: Read files with context windowing for large files
- **Pattern Search**: Find code matching patterns (function definitions, imports, usage)
- **Explanation Synthesis**: Combine findings into coherent, structured explanations
- **Code Snippet Extraction**: Pull relevant code with line numbers and context

### Should-Have (P1)
- **Dependency Tracing**: Follow import chains to understand data flow
- **Multi-File Correlation**: Connect related code across files
- **Caching**: Avoid re-reading unchanged files within a session

### Nice-to-Have (P2)
- **Language Detection**: Adapt analysis based on detected language
- **Documentation Integration**: Cross-reference with inline comments/docs

---

## 3. Input/Output Contract

### Input Schema (Zod)

```typescript
const ExplainRequestSchema = z.object({
  // Required: What to explain
  question: z.string().min(1).max(2000).describe('Natural language question about the codebase'),

  // Required: Where to look
  directory: z.string().min(1).describe('Absolute path to codebase root'),

  // Optional: Scope limits
  options: z.object({
    maxFiles: z.number().min(1).max(100).default(20).describe('Max files to read'),
    maxDepth: z.number().min(1).max(10).default(5).describe('Max directory depth'),
    includePatterns: z.array(z.string()).default(['**/*.ts', '**/*.js', '**/*.py', '**/*.go', '**/*.rs']),
    excludePatterns: z.array(z.string()).default(['**/node_modules/**', '**/.git/**', '**/dist/**']),
  }).optional(),
});
```

### Output Schema

```typescript
const ExplainResponseSchema = z.object({
  // Main explanation
  explanation: z.string().describe('Clear, structured explanation'),

  // Supporting evidence
  codeSnippets: z.array(z.object({
    file: z.string(),
    startLine: z.number(),
    endLine: z.number(),
    content: z.string(),
    relevance: z.string().describe('Why this snippet matters'),
  })),

  // Execution metadata
  metadata: z.object({
    filesExamined: z.number(),
    toolCalls: z.number(),
    executionTimeMs: z.number(),
    confidence: z.enum(['high', 'medium', 'low']),
  }),

  // Follow-up suggestions
  suggestedQuestions: z.array(z.string()).max(3),
});
```

---

## 4. Tool Definitions (Rig-Aligned)

Following the Rig `Tool` trait pattern, each tool has typed args, output, and error types.

### Tool 1: `list_directory`

**Purpose**: Discover project structure

```typescript
interface ListDirectoryArgs {
  path: string;
  maxDepth?: number;
  includeHidden?: boolean;
}

interface ListDirectoryOutput {
  entries: Array<{
    path: string;
    type: 'file' | 'directory';
    size?: number;
  }>;
  totalFiles: number;
  totalDirectories: number;
}
```

### Tool 2: `read_file`

**Purpose**: Read file contents with optional line range

```typescript
interface ReadFileArgs {
  path: string;
  startLine?: number;
  endLine?: number;
}

interface ReadFileOutput {
  content: string;
  totalLines: number;
  language: string;
  truncated: boolean;
}
```

### Tool 3: `search_code`

**Purpose**: Find code matching a pattern

```typescript
interface SearchCodeArgs {
  pattern: string;       // Regex or literal
  directory: string;
  fileGlob?: string;     // e.g., "*.ts"
  maxResults?: number;
}

interface SearchCodeOutput {
  matches: Array<{
    file: string;
    line: number;
    content: string;
    context: { before: string; after: string };
  }>;
  totalMatches: number;
  truncated: boolean;
}
```

### Tool 4: `analyze_imports`

**Purpose**: Trace import/export relationships

```typescript
interface AnalyzeImportsArgs {
  file: string;
  direction: 'imports' | 'exports' | 'both';
}

interface AnalyzeImportsOutput {
  imports: Array<{ from: string; items: string[] }>;
  exports: Array<{ name: string; type: 'function' | 'class' | 'const' | 'default' }>;
}
```

---

## 5. Error Handling

### Error Types

| Error | Code | HTTP | Recovery |
|-------|------|------|----------|
| Directory not found | `DIR_NOT_FOUND` | 400 | Return helpful message |
| File not readable | `FILE_UNREADABLE` | 400 | Skip file, continue |
| Path traversal attempt | `PATH_TRAVERSAL` | 403 | Block, log attempt |
| Max iterations exceeded | `MAX_ITERATIONS` | 200 | Return partial results |
| LLM rate limit | `RATE_LIMIT` | 429 | Retry with backoff |
| LLM timeout | `LLM_TIMEOUT` | 504 | Retry once |

### Graceful Degradation

When tools fail:
1. Log the failure with context
2. Continue with remaining tools
3. Note limitations in response
4. Never crash the agent

---

## 6. Safety Rules

### MUST DO
- Validate all paths stay within configured root directory
- Reject paths containing `..` traversal
- Respect file read limits
- Log all file access attempts
- Timeout long-running operations

### MUST NOT
- Execute any code found in the codebase
- Read files outside the specified directory
- Store or transmit file contents beyond the response
- Access system files or sensitive paths
- Bypass configured limits

### Path Validation

```typescript
function isPathSafe(requestedPath: string, allowedRoot: string): boolean {
  const resolved = path.resolve(requestedPath);
  const root = path.resolve(allowedRoot);
  return resolved.startsWith(root + path.sep) || resolved === root;
}
```

---

## 7. Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | Yes | - | OpenAI API key for GPT-4 |
| `PORT` | No | 8080 | HTTP server port |
| `MAX_TOOL_ITERATIONS` | No | 10 | Max tool calls per request |
| `MAX_FILE_SIZE_KB` | No | 500 | Max file size to read |
| `LOG_LEVEL` | No | info | Logging verbosity |
| `ALLOWED_ROOTS` | No | - | Comma-separated allowed directories |

---

## 8. Token Integration

**Token Integration**: No

This agent does not require token integration. It is designed as a developer tool with no monetization or access control requirements.

---

## 9. Deployment Strategy

### Local Development
```bash
npm run dev  # tsx watch mode
```

### Production
```bash
npm run build
npm start
```

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

### Health Check
- `GET /health` returns `{ status: "ok", version: "1.0.0" }`
- Use for container orchestration liveness probes

---

## 10. Success Criteria

### Functional Requirements
- [ ] Accepts POST /explain with valid input
- [ ] Returns structured explanation within 30 seconds
- [ ] Handles codebases up to 1000 files
- [ ] All 4 tools work correctly
- [ ] Error responses are helpful, not cryptic

### Quality Requirements
- [ ] TypeScript compiles without errors
- [ ] All tool args/outputs match Zod schemas
- [ ] Execution loop respects max iterations
- [ ] Path validation prevents traversal
- [ ] Logs include request correlation IDs

### Rig Alignment Requirements
- [ ] Agent definition matches Rig `Agent<M>` pattern
- [ ] Tools implement typed interface with definition() and call()
- [ ] Execution loop follows PromptRequest pattern
- [ ] Errors are typed, not generic strings

---

## Appendix: Example Interaction

**Request**:
```json
{
  "question": "How does authentication work in this project?",
  "directory": "/Users/dev/my-api"
}
```

**Agent Execution**:
1. `list_directory({ path: "/Users/dev/my-api", maxDepth: 2 })` → Find structure
2. `search_code({ pattern: "auth|login|jwt", directory: "/Users/dev/my-api" })` → Find auth code
3. `read_file({ path: "/Users/dev/my-api/src/auth/middleware.ts" })` → Read key file
4. `analyze_imports({ file: "/Users/dev/my-api/src/auth/middleware.ts" })` → Trace dependencies
5. Synthesize explanation from findings

**Response**:
```json
{
  "explanation": "Authentication in this project uses JWT tokens with a middleware pattern...",
  "codeSnippets": [
    {
      "file": "src/auth/middleware.ts",
      "startLine": 15,
      "endLine": 32,
      "content": "export async function authMiddleware(req, res, next) {...}",
      "relevance": "Main authentication middleware that validates JWT tokens"
    }
  ],
  "metadata": {
    "filesExamined": 8,
    "toolCalls": 5,
    "executionTimeMs": 4200,
    "confidence": "high"
  },
  "suggestedQuestions": [
    "How are JWT tokens generated?",
    "What happens when a token expires?",
    "How are user roles handled?"
  ]
}
```

---

**End of Dream Spec**
