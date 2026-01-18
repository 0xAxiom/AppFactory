# Rig Integration Plan

**Date**: 2026-01-17
**Author**: Claude Opus 4.5
**Status**: Implementation Guide

---

## Overview

This document provides a concrete plan for integrating Rig concepts into the agent-factory pipeline. It maps pipeline stages to Rig concepts, defines abstraction changes, and separates educational scaffolding from production implementation.

---

## Part 1: Pipeline Stage → Rig Concept Mapping

### Phase 0: Intent Normalization

**Current**: Upgrades raw input to product spec
**Rig Mapping**: None (Rig has no equivalent)
**Action**: Keep as-is; this is pipeline-specific value-add

### Phase 1: Dream Spec Author

**Current**: 10-section comprehensive specification
**Rig Mapping**: Aligns with agent definition

| Spec Section | Rig Concept | Alignment |
|--------------|-------------|-----------|
| Agent Vision | `description` field | Direct |
| Core Capabilities | Implied by tools | Partial |
| Input/Output Contract | `Tool::Args`, `Tool::Output` | Direct |
| Tool Definitions | `Tool` trait | Direct |
| Error Handling | `Tool::Error`, `AgentError` | Direct |
| Safety Rules | Not in Rig | Keep as extension |
| Environment Variables | External config | Keep as-is |
| Token Integration | Rig-onchain-kit | Indirect |
| Deployment Strategy | External | Keep as-is |
| Success Criteria | Not in Rig | Keep as extension |

**Action**: Update spec template to use Rig terminology

### Phase 2: Research & Position

**Current**: Market research, competitor analysis
**Rig Mapping**: None
**Action**: Keep as-is; this is pipeline-specific value-add

### Phase 3: Generate

**Current**: Complete agent scaffold
**Rig Mapping**: Maps to `Agent<M>` construction

| Generated File | Rig Concept | Action |
|----------------|-------------|--------|
| `agent.json` | `Agent` struct | Align schema |
| `src/index.ts` | HTTP wrapper | Keep (deployment) |
| Tool code | `Tool` trait | Add interface |
| Logging | `tracing` | Keep pattern |
| Errors | `AgentError` | Align types |

**Action**: Generate code that mirrors Rig patterns in TypeScript

### Phase 4: Ralph Polish Loop

**Current**: QA until ≥97% quality
**Rig Mapping**: None (Rig has no QA)
**Action**: Keep as-is; add Rig-specific checks

---

## Part 2: Abstraction Renames and Clarifications

### Terminology Changes

| Old Term | New Term | Reason |
|----------|----------|--------|
| "Agent scaffold" | "Agent" | Rig alignment |
| "Tool definitions" | "Tools" | Rig alignment |
| "HTTP server" | "Agent Runtime" | Clarify separation |
| "Process endpoint" | "Agent Invocation" | Rig alignment |

### New Abstractions to Add

#### 1. Agent Definition

```typescript
// New: src/agent.ts
interface AgentDefinition {
  name: string;
  description: string;
  preamble: string;
  tools: ToolDefinition[];
  staticContext?: Document[];
  temperature?: number;
  maxTokens?: number;
}
```

**Maps to Rig**: `Agent<M>` struct fields

#### 2. Tool Interface

```typescript
// New: src/types/tool.ts
interface Tool<TArgs, TOutput, TError extends Error> {
  readonly name: string;
  definition(): ToolDefinition;
  call(args: TArgs): Promise<Result<TOutput, TError>>;
}
```

**Maps to Rig**: `Tool` trait

#### 3. Execution Loop

```typescript
// New: src/execution/loop.ts
interface ExecutionLoop {
  run(prompt: string): Promise<AgentResponse>;
  runWithTools(prompt: string, maxIterations: number): Promise<AgentResponse>;
}
```

**Maps to Rig**: `PromptRequest` with tool handling

### Schema Alignment

#### Updated `agent.json`

```json
{
  "manifestVersion": "2.0",
  "agent": {
    "name": "<agent-name>",
    "displayName": "<Display Name>",
    "description": "<description>",
    "version": "1.0.0"
  },
  "rigConcepts": {
    "preamble": "<system prompt>",
    "staticContext": [],
    "tools": [
      {
        "name": "<tool-name>",
        "description": "<tool-description>",
        "parameters": { /* JSON Schema */ },
        "returns": { /* JSON Schema */ }
      }
    ],
    "dynamicContext": {
      "enabled": false,
      "vectorStore": null,
      "topK": 5
    }
  },
  "runtime": {
    "platform": "node",
    "interface": "http",
    "port": 8080
  },
  "safety": {
    "maxIterations": 10,
    "disallowedActions": []
  }
}
```

---

## Part 3: Educational Scaffolding vs Production Implementation

### What is Educational Scaffolding?

Code/documentation that exists to **teach concepts** but isn't required in production.

| Item | Type | Purpose |
|------|------|---------|
| Concept comments | Educational | Explain Rig alignment |
| Type definitions | Production | Enable tooling |
| Step-by-step docs | Educational | Guide understanding |
| Reference links | Educational | Point to Rig source |
| Generated code | Production | Runnable agent |
| Tests | Production | Quality assurance |

### Example: Educational Comments

```typescript
/**
 * This agent follows the Rig Agent pattern:
 * @see https://github.com/0xPlaygrounds/rig
 *
 * In Rig (Rust), this would be:
 * ```rust
 * let agent = client.agent("gpt-4")
 *     .preamble("You are...")
 *     .tool(SummarizeTool)
 *     .build();
 * ```
 *
 * This TypeScript implementation mirrors that structure.
 */
export class YouTubeSummarizerAgent implements Agent {
  // ...
}
```

### Production Code Requirements

All generated code must be:
1. **Runnable** without educational comments
2. **Type-safe** using Zod or similar
3. **Testable** with mock LLM responses
4. **Deployable** to standard Node.js hosts

---

## Part 4: Implementation Checklist

### Phase 1: Foundation (Required)

- [ ] Keep Rig cloned at `/references/rig`
- [ ] Add `.gitignore` entry for `references/rig` (do not commit submodule)
- [ ] Update root README to mention Rig
- [ ] Create this integration plan document

### Phase 2: Schema Updates (Required)

- [ ] Update `agent.schema.json` with Rig-aligned fields
- [ ] Add `rigConcepts` section to manifest
- [ ] Update validation script

### Phase 3: Code Generation Updates (Required)

- [ ] Add `src/types/agent.ts` template
- [ ] Add `src/types/tool.ts` template
- [ ] Update `src/index.ts` template with execution loop
- [ ] Add Rig-style comments to generated code

### Phase 4: Documentation Updates (Required)

- [ ] Update `agent-factory/CLAUDE.md` with Rig terminology
- [ ] Update `agent-factory/README.md` with Rig section
- [ ] Add "Rig Concepts" appendix
- [ ] Add "Graduation to Rust" guide

### Phase 5: Educational Content (Recommended)

- [ ] Add `docs/concepts/what-is-an-agent.md`
- [ ] Add `docs/concepts/tools.md`
- [ ] Add `docs/concepts/execution-loops.md`
- [ ] Add `docs/concepts/rag.md`
- [ ] Add `docs/concepts/multi-agent.md`

### Phase 6: Advanced Features (Optional)

- [ ] Streaming response support
- [ ] Multi-tool execution loop
- [ ] Dynamic context (RAG) generation
- [ ] Agent composition patterns

---

## Part 5: Generated Code Structure Changes

### Current Structure

```
outputs/<agent-name>/
├── agent.json
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts          # HTTP server + all logic
│   └── lib/
│       ├── logger.ts
│       └── errors.ts
└── ...
```

### New Structure (Rig-Aligned)

```
outputs/<agent-name>/
├── agent.json            # Updated with rigConcepts
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts          # HTTP server (runtime only)
│   ├── agent.ts          # Agent definition (NEW)
│   ├── tools/            # Tool implementations (NEW)
│   │   ├── index.ts
│   │   └── <tool>.ts
│   ├── execution/        # Execution loop (NEW)
│   │   └── loop.ts
│   ├── types/            # Type definitions (NEW)
│   │   ├── agent.ts
│   │   ├── tool.ts
│   │   └── result.ts
│   └── lib/
│       ├── logger.ts
│       └── errors.ts
└── ...
```

### Key New Files

#### `src/agent.ts`

```typescript
import { AgentDefinition, Tool } from './types';
import { SummarizeTool } from './tools/summarize';

/**
 * Agent definition following Rig patterns.
 * @see references/rig/rig/rig-core/src/agent/mod.rs
 */
export const agentDefinition: AgentDefinition = {
  name: 'youtube-summarizer',
  description: 'Summarizes YouTube videos',
  preamble: `You are a YouTube video summarization agent...`,
  tools: [new SummarizeTool()],
  temperature: 0.7,
  maxTokens: 2000,
};
```

#### `src/tools/summarize.ts`

```typescript
import { Tool, ToolDefinition } from '../types';
import { z } from 'zod';

const ArgsSchema = z.object({
  videoUrl: z.string().url(),
  maxLength: z.number().min(100).max(5000).optional().default(500),
});

type Args = z.infer<typeof ArgsSchema>;

/**
 * Tool implementation following Rig's Tool trait.
 * @see references/rig/rig/rig-core/src/tool/mod.rs
 */
export class SummarizeTool implements Tool<Args, string, Error> {
  readonly name = 'summarize_video';

  definition(): ToolDefinition {
    return {
      name: this.name,
      description: 'Summarize a YouTube video given its URL',
      parameters: {
        type: 'object',
        properties: {
          videoUrl: { type: 'string', format: 'uri' },
          maxLength: { type: 'number', minimum: 100, maximum: 5000 },
        },
        required: ['videoUrl'],
      },
    };
  }

  async call(args: Args): Promise<string> {
    // Tool implementation
    const validated = ArgsSchema.parse(args);
    // ... fetch transcript, generate summary
    return summary;
  }
}
```

#### `src/execution/loop.ts`

```typescript
import { AgentDefinition, AgentResponse, Tool } from '../types';
import { logger } from '../lib/logger';

/**
 * Execution loop following Rig's PromptRequest pattern.
 * @see references/rig/rig/rig-core/src/agent/prompt_request/mod.rs
 */
export class ExecutionLoop {
  constructor(
    private agent: AgentDefinition,
    private llm: LLMClient
  ) {}

  async run(prompt: string): Promise<AgentResponse> {
    return this.runWithTools(prompt, 1);
  }

  async runWithTools(prompt: string, maxIterations: number): Promise<AgentResponse> {
    let iteration = 0;
    let messages = [{ role: 'user', content: prompt }];

    while (iteration < maxIterations) {
      const response = await this.llm.complete({
        messages,
        tools: this.agent.tools.map(t => t.definition()),
        systemPrompt: this.agent.preamble,
      });

      if (!response.toolCalls || response.toolCalls.length === 0) {
        return { content: response.content, iterations: iteration + 1 };
      }

      // Execute tool calls
      for (const toolCall of response.toolCalls) {
        const tool = this.agent.tools.find(t => t.name === toolCall.name);
        if (!tool) throw new Error(`Unknown tool: ${toolCall.name}`);

        logger.info('Executing tool', { tool: toolCall.name });
        const result = await tool.call(toolCall.arguments);
        messages.push({ role: 'tool', content: JSON.stringify(result) });
      }

      iteration++;
    }

    throw new Error(`Max iterations (${maxIterations}) exceeded`);
  }
}
```

---

## Part 6: Success Metrics

### Immediate Success (Week 1)

- [ ] Rig cloned and referenced
- [ ] Architecture Analysis complete
- [ ] Integration Plan complete
- [ ] Educational Flow designed

### Short-Term Success (Month 1)

- [ ] All pipeline READMEs updated
- [ ] Schema aligned with Rig
- [ ] Generated code uses new structure
- [ ] Concept documentation exists

### Long-Term Success (Quarter 1)

- [ ] Users can explain Rig concepts
- [ ] Generated agents use tool loops
- [ ] RAG integration documented
- [ ] Rust graduation path clear

---

## Conclusion

This integration plan provides a concrete path for incorporating Rig concepts into the agent-factory pipeline. By treating Rig as a conceptual foundation rather than a runtime dependency, we preserve user accessibility while establishing rigorous agent architecture.

The key changes are:
1. **Schema alignment** with Rig's `Agent` and `Tool` types
2. **Code structure** that mirrors Rig patterns in TypeScript
3. **Educational content** that explains Rig concepts
4. **Reference maintenance** of the Rig repository

Next step: **Educational Flow Design** document.

---

**End of Integration Plan**
