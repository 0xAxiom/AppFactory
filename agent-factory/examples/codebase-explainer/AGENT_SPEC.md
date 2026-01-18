# Agent Spec: Codebase Explainer

**Version**: 1.0.0
**Generated**: 2026-01-17
**Architecture**: Rig-aligned

---

## Overview

The Codebase Explainer Agent transforms the frustrating experience of diving into unfamiliar code into an interactive conversation. Developers ask questions in plain English and receive clear, contextual explanations backed by relevant code snippets.

---

## Core Capabilities

### Must-Have (P0)
- **Directory Analysis**: Scan project structure, identify key files
- **Intelligent File Reading**: Read files with context windowing for large files
- **Pattern Search**: Find code matching patterns (function definitions, imports, usage)
- **Explanation Synthesis**: Combine findings into coherent, structured explanations
- **Code Snippet Extraction**: Pull relevant code with line numbers and context

### Should-Have (P1)
- **Dependency Tracing**: Follow import chains to understand data flow
- **Multi-File Correlation**: Connect related code across files
- **Language Detection**: Adapt analysis based on detected language

---

## Architecture

### Rig Alignment

This agent follows patterns from the [Rig framework](https://github.com/0xPlaygrounds/rig):

| Concept | Rig (Rust) | Implementation (TypeScript) |
|---------|------------|---------------------------|
| Agent Definition | `Agent<M>` struct | `AgentDefinition` interface |
| Tool System | `Tool` trait | `Tool<Args, Output>` interface |
| Execution Loop | `PromptRequest` | `AgentExecutionLoop` class |
| Tool Definitions | `ToolDefinition` | JSON Schema + Zod |

### Tools

| Tool | Purpose | Args | Output |
|------|---------|------|--------|
| `list_directory` | Discover structure | path, maxDepth | entries[], counts |
| `read_file` | Read file content | path, startLine, endLine | content, language |
| `search_code` | Find patterns | pattern, directory, fileGlob | matches[] |
| `analyze_imports` | Trace dependencies | file, direction | imports[], exports[] |

### Execution Flow

```
User Question
     │
     ▼
┌─────────────┐
│ Agent Loop  │ ◄─────────────────┐
└──────┬──────┘                   │
       │                          │
       ▼                          │
┌─────────────┐    ┌──────────┐   │
│   OpenAI    │───►│ Tool Call?│───┤ Yes
│   GPT-4     │    └──────────┘   │
└─────────────┘           │       │
                          │ No    │
                          ▼       │
                   ┌──────────┐   │
                   │ Execute  │───┘
                   │  Tools   │
                   └──────────┘

Final Response (JSON)
```

---

## Input/Output Contract

### Input (POST /explain)

```typescript
{
  question: string;       // Natural language question (1-2000 chars)
  directory: string;      // Absolute path to codebase root
  options?: {
    maxFiles?: number;    // Max files to read (default: 20)
    maxDepth?: number;    // Max directory depth (default: 5)
    includePatterns?: string[];
    excludePatterns?: string[];
  }
}
```

### Output

```typescript
{
  explanation: string;    // Clear, structured explanation
  codeSnippets: [{
    file: string;
    startLine: number;
    endLine: number;
    content: string;
    relevance: string;
  }];
  metadata: {
    filesExamined: number;
    toolCalls: number;
    executionTimeMs: number;
    confidence: 'high' | 'medium' | 'low';
  };
  suggestedQuestions: string[];
}
```

---

## Safety Rules

### MUST DO
- Validate all paths stay within configured root directory
- Reject paths containing `..` traversal
- Respect file read limits (500KB default)
- Log all file access attempts
- Timeout long-running operations

### MUST NOT
- Execute any code found in the codebase
- Read files outside the specified directory
- Store or transmit file contents beyond the response
- Access system files or sensitive paths
- Bypass configured limits

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | Yes | - | OpenAI API key |
| `PORT` | No | 8080 | HTTP server port |
| `MAX_TOOL_ITERATIONS` | No | 10 | Max tool calls per request |
| `MAX_FILE_SIZE_KB` | No | 500 | Max file size to read |
| `LOG_LEVEL` | No | info | Logging verbosity |
| `ALLOWED_ROOTS` | No | - | Comma-separated allowed directories |

---

## Success Criteria

### Functional
- [x] Accepts POST /explain with valid input
- [x] Returns structured explanation with code snippets
- [x] All 4 tools work correctly
- [x] Error responses are helpful, not cryptic

### Quality
- [x] TypeScript compiles without errors
- [x] All tool args/outputs match Zod schemas
- [x] Execution loop respects max iterations
- [x] Path validation prevents traversal
- [x] Structured logging with context

### Rig Alignment
- [x] Agent definition matches Rig `Agent<M>` pattern
- [x] Tools implement typed interface with definition() and call()
- [x] Execution loop follows PromptRequest pattern
- [x] Errors are typed, not generic strings
